import { db } from './db';
import { eq, and, isNull, like, inArray, desc } from 'drizzle-orm';
import { assert } from '../utils/assert';
import { commentTable, likeTable, type Post, postTable, userTable } from './db/schema';
import type { PostDetail, UserPreview, CommentDetail, LikeDetail } from '$lib/types/userTypes';

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

export async function getRecentPosts(
	limit: number,
	offset: number = 0
): Promise<PostDetail[] | null> {
	const posts = await db
		.select({ id: postTable.id })
		.from(postTable)
		.orderBy(desc(postTable.createdAt))
		.limit(limit)
		.offset(offset);

	const postIds = posts.map((p) => p.id);

	const postDetails = await Promise.all(postIds.map((id) => getPostWithRelations(id)));

	return postDetails.filter((p): p is PostDetail => p !== null);
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

// Get post details including the post object, the comment objects, and the like objects associated with each of them
export async function getPostWithRelations(postId: number): Promise<PostDetail | null> {
	// query for the post with user details on join
	const [postWithUser] = await db
		.select({
			post: postTable,
			user: {
				id: userTable.id,
				username: userTable.username,
				profilePicture: userTable.profilePicture
			}
		})
		.from(postTable)
		.where(eq(postTable.id, postId))
		.innerJoin(userTable, eq(postTable.userId, userTable.id));

	if (!postWithUser) return null;

	const postLikes = await db
		.select({
			like: likeTable,
			user: {
				id: userTable.id,
				username: userTable.username,
				profilePicture: userTable.profilePicture
			}
		})
		.from(likeTable)
		.where(and(eq(likeTable.postId, postId)))
		.innerJoin(userTable, eq(likeTable.userId, userTable.id));

	const formattedPostLikes: LikeDetail[] = postLikes.map((entry) => ({
		...entry.like,
		user: entry.user as UserPreview
	}));

	const comments = await db
		.select({
			comment: commentTable,
			user: {
				id: userTable.id,
				username: userTable.username,
				profilePicture: userTable.profilePicture
			}
		})
		.from(commentTable)
		.where(eq(commentTable.postId, postId))
		.innerJoin(userTable, eq(commentTable.userId, userTable.id));

	const commentIds = comments.map((c) => c.comment.id);
	let commentLikesMap: Record<number, LikeDetail[]> = {};

	if (commentIds.length > 0) {
		const commentLikes = await db
			.select({
				like: likeTable,
				user: {
					id: userTable.id,
					username: userTable.username,
					profilePicture: userTable.profilePicture
				}
			})
			.from(likeTable)
			.where(inArray(likeTable.commentId, commentIds))
			.innerJoin(userTable, eq(likeTable.userId, userTable.id));

		commentLikesMap = commentLikes.reduce(
			(acc, entry) => {
				const commentId = entry.like.commentId!;
				if (!acc[commentId]) acc[commentId] = [];
				acc[commentId].push({
					...entry.like,
					user: entry.user as UserPreview
				});
				return acc;
			},
			{} as Record<number, LikeDetail[]>
		);
	}

	const formattedComments: CommentDetail[] = comments.map((entry) => ({
		...entry.comment,
		user: entry.user as UserPreview,
		likes: commentLikesMap[entry.comment.id] || []
	}));

	// 5. Assemble final object
	const postDetail: PostDetail = {
		...postWithUser.post,
		user: postWithUser.user as UserPreview,
		likes: formattedPostLikes,
		comments: formattedComments
	};

	return postDetail;
}
