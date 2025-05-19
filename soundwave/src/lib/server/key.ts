// src/lib/server/key.ts

import { db } from './db';
import { eq } from 'drizzle-orm';
import { keyTable, userTable, type User, type Key } from './db/schema';
import { assert } from '../utils/assert';

export async function getKeyFromUser(userEmail: string, service: string): Promise<Key | null> {
	const result = await db
		.select()
		.from(keyTable)
		.where(eq(keyTable.id, `${service.toLowerCase()}:${userEmail.toLowerCase()}`));

	assert(
		result.length <= 1,
		`Multiple Keys found for userEmail = ${userEmail.toLowerCase()} for ${service} service.`
	);

	if (result.length === 0) {
		return null;
	}

	return result[0] as Key;
}

export async function createKey(
	userId: number,
	primary: boolean,
	service: string,
	userEmail: string,
	serviceId: string,
	accessToken: string | null = null,
	refresh_token: string | null = null,
	expires_at: Date | null = null
): Promise<Key | null> {
	const result = await getKeyFromUser(userEmail, service);

	assert(result === null, `Key already exists for user ${userId} through ${service} service.`);

	// checks passed, create the key
	const [inserted] = await db
		.insert(keyTable)
		.values({
			id: `${service.toLowerCase()}:${userEmail.toLowerCase()}`,
			userId: userId,
			primary: primary,
			provider: service.toLowerCase(),
			providerUserId: serviceId,
			accessToken: accessToken,
			refreshToken: refresh_token,
			tokenExpiresAt: expires_at
		})
		.returning();

	return inserted as Key;
}
