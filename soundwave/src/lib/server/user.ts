import { db } from './db';
import { eq } from 'drizzle-orm';
import { assert } from '../utils/assert';
import { type User, type Key, keyTable, userTable } from './db/schema';
import { createKey } from './key';

export async function createUser(
	email: string,
	username: string,
	firstName: string | null = null,
	lastName: string | null = null,
	age: number | null = null,
	picture: string | null = null
): Promise<User | null> {
	try {
		const [user] = await db
			.insert(userTable)
			.values({
				username: username,
				firstName: firstName,
				lastName: lastName,
				age: age,
				email: email,
				profilePicture: picture
			})
			.returning();

		return user as User;
	} catch (error) {
		console.error('Error creating user: ', error);
		return null;
	}
}

export async function updateUser(
	userId: number,
	username: string | null,
	firstName: string | null,
	lastName: string | null,
	age: number | null,
	profilePicture: string | null
): Promise<User | null> {
	try {
		const [user] = await db
			.update(userTable)
			.set({
				...(username !== null && { username }),
				...(firstName !== null && { firstName }),
				...(lastName !== null && { lastName }),
				...(age !== null && { age }),
				...(profilePicture !== null && { profilePicture }),
				updatedAt: new Date()
			})
			.where(eq(userTable.id, userId))
			.returning();

		return user as User;
	} catch (error) {
		console.error('Error updating user: ', error);
		return null;
	}
}

export async function getUserFromId(userId: number): Promise<User | null> {
	const result = await db.select().from(userTable).where(eq(userTable.id, userId));

	assert(result.length <= 1, `Multiple user found with id = ${userId}`);

	if (result.length === 0) {
		return null;
	}

	return result[0] as User;
}

export async function getUserFromServiceId(
	userEmail: string,
	serviceName: string
): Promise<User | null> {
	const services = ['google', 'github', 'spotify', 'email'];
	assert(
		services.includes(serviceName.toLowerCase()),
		'Attempting to find user through non-configured service.'
	);

	const result = await db
		.select()
		.from(keyTable)
		.where(eq(keyTable.id, `${serviceName.toLowerCase()}:${userEmail.toLowerCase()}`)); // id constructed by `${serviceName}:${userEmail}

	// check whether there are multiple lines in the result
	assert(
		result.length <= 1,
		`Multiple keys found for keyId = ${serviceName.toLowerCase()}:${userEmail.toLowerCase()}`
	);

	// if no result found then return null
	if (result.length == 0) {
		return null;
	}

	// single result found, find user details given this result
	const userId = result[0].userId;
	return getUserFromId(userId);
}

export async function createUserFromGoogle(
	googleId: string,
	email: string,
	name: string,
	picture: string
): Promise<User | null> {
	const user = await createUser(email, name, null, null, null, picture);

	if (user === null) return null;

	const key = await createKey(user?.id, true, 'google', email, googleId);

	return user as User;
}
