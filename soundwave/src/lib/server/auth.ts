import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';

import { db } from './db';
import { userTable, sessionTable, keyTable, type User, type Session, type Key } from './db/schema';
import type { RequestEvent } from '@sveltejs/kit';

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId: userId,
		userAgent: null,
		ipAddress: null,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		createdAt: new Date(Date.now()),
		updatedAt: new Date(Date.now())
	};
	await db.insert(sessionTable).values(session);
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.id, sessionId));

	if (result.length < 1) {
		// No active session found with this token
		return { session: null, user: null };
	}

	const { user, session } = result[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		// if session has expired
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		return { user: null, session: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		// if expiresAt needs to be updated
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessionTable)
			.set({ expiresAt: session.expiresAt })
			.where(eq(sessionTable.id, session.id));
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllSessions(userId: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		secure: import.meta.env.PROD,
		maxAge: 0,
		path: '/'
	});
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
