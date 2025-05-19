import pg from 'pg';
import { pgTable, text, serial, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';

import type { InferSelectModel } from 'drizzle-orm';

const pool = new pg.Pool();
const db = drizzle(pool);

export const userTable = pgTable('user', {
	id: serial('id').primaryKey(),

	// Profile Details
	username: text('username').notNull().unique(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	email: text('email').notNull().unique(),
	isEmailVerified: boolean('is_email_verified').default(false),
	age: integer('age'),
	profilePicture: text('profile_picture'),

	// Meta Data
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const keyTable = pgTable('key', {
	id: text('id').primaryKey(), // Format: `${provider}:${userEmail}` or UUID

	userId: serial('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	primary: boolean('primary').notNull().default(false),
	provider: text('provider').notNull(), // e.g. 'email', 'google', 'github', 'spotify'
	providerUserId: text('provider_user_id'),
	hashedPassword: text('hashed_password'),

	// OAuth-specific
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	tokenExpiresAt: timestamp('token_expires_at', { withTimezone: true, mode: 'date' }).defaultNow(),

	// Meta-Data
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export const sessionTable = pgTable('session', {
	id: text('id').primaryKey(), // Usually a secure random token

	userId: serial('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),

	userAgent: text('user_agent'),
	ipAddress: text('ip_address'),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),

	// Meta-Data
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

export type User = InferSelectModel<typeof userTable>;
export type Key = InferSelectModel<typeof keyTable>;
export type Session = InferSelectModel<typeof sessionTable>;
