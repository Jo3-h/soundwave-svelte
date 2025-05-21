import pg from 'pg';
import {
	pgTable,
	text,
	serial,
	integer,
	timestamp,
	boolean,
	foreignKey
} from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';

import type { InferSelectModel } from 'drizzle-orm';
import { int } from 'drizzle-orm/mysql-core';
import { onDestroy } from 'svelte';
import { parentPort } from 'worker_threads';

const pool = new pg.Pool();
const db = drizzle(pool);

// -- User Table
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

// -- Key table
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

// Session Table
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

// -- Post table
export const postTable = pgTable('posts', {
	id: serial('id').primaryKey(),

	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	content: text('content').notNull(),

	// Meta-data
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

// -- Likes table
export const likeTable = pgTable('likes', {
	id: serial('id').primaryKey(),

	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	postId: integer('post_id').references(() => postTable.id, { onDelete: 'cascade' }),
	commentId: integer('comment_id').references(() => commentTable.id, { onDelete: 'cascade' }),

	// Meta-data
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
});

// -- Comments table
export const commentTable = pgTable(
	'comments',
	{
		id: serial('id').primaryKey(),

		postId: integer('post_id')
			.notNull()
			.references(() => postTable.id, { onDelete: 'cascade' }),

		userId: integer('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),

		content: text('content').notNull(),

		parentId: integer('parent_id'),

		createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow()
	},
	(table) => {
		return {
			parentReference: foreignKey({
				columns: [table.parentId],
				foreignColumns: [table.id],
				name: 'comments_parent_id_fkey'
			})
		};
	}
);

export type User = InferSelectModel<typeof userTable>;
export type Key = InferSelectModel<typeof keyTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Comment = InferSelectModel<typeof commentTable>;
export type Like = InferSelectModel<typeof likeTable>;
export type Post = InferSelectModel<typeof postTable>;
