import { db } from './db';
import { eq } from 'drizzle-orm';
import { assert } from '../utils/assert';
import { type Comment, commentTable } from './db/schema';

export async function createComment(
	postId: number,
	userId: number,
	content: string,
	parentId: number
): Promise<Comment | null> {
	try {
		const [comment] = await db
			.insert(commentTable)
			.values({
				postId,
				userId,
				content,
				parentId
			})
			.returning();

		return comment as Comment;
	} catch (error) {
		console.error('Failed to add comment: ', error);
		return null;
	}
}

export async function getComment(commentId: number): Promise<Comment | null> {
	try {
		const result = await db.select().from(commentTable).where(eq(commentTable.id, commentId));

		assert(result.length <= 1, `Multiple comments found with id = ${commentId}`);

		if (result.length === 0) {
			return null;
		}

		return result[0] as Comment;
	} catch (error) {
		console.error(`Failed to fetch comment with id = ${commentId}`);
		return null;
	}
}

export async function deleteComment(commentId: number, userId: number): Promise<boolean> {
	const comment = await getComment(commentId);

	assert(comment !== null, `Cannot find comment to delete with id = ${commentId}`);
	if (!comment) return false;

	assert(comment.userId === userId, `Cannot delete another user's post`);
	if (comment.userId !== userId) return false;

	try {
		await db.delete(commentTable).where(eq(commentTable.id, commentId));
	} catch (error) {
		console.error('Error deleting comment: ', error);
		return false;
	}

	return true;
}
