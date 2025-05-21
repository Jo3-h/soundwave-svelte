import { db } from './db';
import { eq } from 'drizzle-orm';
import { assert } from '../utils/assert';
import { type Post, postTable } from './db/schema';

// create post functionality
export async function createPost(
	userId: number,
	title: string,
	content: string
): Promise<Post | null> {
	try {
		const [post] = await db
			.insert(postTable)
			.values({
				userId: userId,
				title: title,
				content: content
			})
			.returning();

		return post as Post;
	} catch (error) {
		console.error('Error creating post: ', error);
		return null;
	} finally {
		return null;
	}
}

// get Post functionality
export async function getPostById(postId: number): Promise<Post | null> {
	try {
		const result = await db.select().from(postTable).where(eq(postTable.id, postId)).limit(2); // just in case there's a second result for assertion

		assert(result.length <= 1, `Multiple posts found with id = ${postId}`);

		return result[0] ?? null;
	} catch (error) {
		console.error(`Failed to fetch post with id ${postId}:`, error);
		return null;
	}
}

// Delete Post functionality
export async function deletePost(postId: number, userId: number): Promise<Post | null> {
	// check whether the user passed to the function is the author
	const post = await getPostById(postId);

	if (!post) {
		return null;
	}

	if (post.userId !== userId) {
		throw new Error(`User has insufficient auth to delete this post`);
	}

	try {
		await db.delete(postTable).where(eq(postTable.id, post.id));
	} catch (error) {
		console.error('Error Deleting post:', error);
	}

	return null;
}
