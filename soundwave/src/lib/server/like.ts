import { db } from './db';
import { eq, and, like } from 'drizzle-orm';
import { assert } from '$lib/utils/assert';
import { type Like, likeTable } from './db/schema';

export async function createLike(
	userId: number,
	postId: number,
	commentId: number
): Promise<Like | null> {
	// check whether this post/comment is already liked
	const result = await getLike(userId, postId, commentId);

	if (result) {
		return null;
	}

	if (postId !== null) {
		try {
			const [like] = await db
				.insert(likeTable)
				.values({
					userId,
					postId
				})
				.returning();
			return like as Like;
		} catch (error) {
			console.error('Error creating post like: ', error);
		}
	}

	if (commentId !== null) {
		try {
			const [like] = await db
				.insert(likeTable)
				.values({
					userId,
					commentId
				})
				.returning();
			return like as Like;
		} catch (error) {
			console.error('Error creating comment like: ', error);
		}
	}

	return null;
}

export async function getLike(
	userId: number,
	postId: number | null,
	commentId: number | null
): Promise<Like | null> {
	if (postId !== null) {
		try {
			const result = await db
				.select()
				.from(likeTable)
				.where(and(eq(likeTable.userId, userId), eq(likeTable.postId, postId)));

			assert(
				result.length <= 1,
				`Found multiple likes with...\nuserId: ${userId}\npostId: ${postId}`
			);
			assert(
				result.length !== 0,
				`Failed to find like with...\nuserId: ${userId}\npostId: ${postId}`
			);

			if (result.length == 0) return null;

			return result[0] as Like;
		} catch (error) {
			console.error('Error fetching post like');
			return null;
		}
	}

	if (commentId !== null) {
		try {
			const result = await db
				.select()
				.from(likeTable)
				.where(and(eq(likeTable.userId, userId), eq(likeTable.commentId, commentId)));

			assert(
				result.length <= 1,
				`Found multiple likes with...\nuserId: ${userId}\ncommentId: ${commentId}`
			);
			assert(
				result.length !== 0,
				`Failed to find like with...\nuserId: ${userId}\ncommentId: ${commentId}`
			);

			if (result.length == 0) return null;

			return result[0] as Like;
		} catch (error) {
			console.error('Error fetching comment like');
			return null;
		}
	}

	return null;
}

export async function deleteLike(
	userId: number,
	postId: number | null,
	commentId: number | null
): Promise<boolean> {
	if (postId !== null && commentId !== null) {
		assert(false, 'Only delete one object at a time');
		return false;
	}

	if (commentId !== null) {
		try {
			await db
				.delete(likeTable)
				.where(and(eq(likeTable.commentId, commentId), eq(likeTable.userId, userId)));
		} catch (error) {
			console.error('Failed to delete comment like.');
			return false;
		}
	} else if (postId !== null) {
		try {
			await db
				.delete(likeTable)
				.where(and(eq(likeTable.postId, postId), eq(likeTable.userId, userId)));
		} catch (error) {
			console.error('Failed to delete post like.');
			return false;
		}
	}

	return true;
}

export async function getCommentLikes(commentId: number): Promise<Object[] | null> {
	return null;
}

export async function getPostLikes(postId: number): Promise<Object[] | null> {
	return null;
}
