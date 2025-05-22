import { createPost, getRecentPosts } from '$lib/server/post';
import { createLike } from '$lib/server/like';
import { createComment } from '$lib/server/comment';
import { validateSessionToken } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const posts = await getRecentPosts(10, 0);

	return {
		posts
	};
}

export const actions = {
	createPost: async ({ request, cookies, locals }) => {
		const formData = await request.formData();
		const content = formData.get('post-content');
		const sessionToken = cookies.get('session');

		// validate user session
		if (!sessionToken) throw redirect(303, '/login');
		const { user, session } = await validateSessionToken(sessionToken);
		if (!user || !session) throw redirect(303, '/login');

		if (!user || typeof content !== 'string' || !content.trim()) {
			return { success: false, error: 'Invalid input or not logged in.' };
		}

		const post = await createPost(user.id, 'test-post', content);
		if (post) {
			return { success: true };
		} else {
			return { success: false, error: 'Unknown error occurred' };
		}
	},

	like: async ({ request, locals, cookies }) => {
		const formData = await request.formData();
		const userId = formData.get('userId');
		const postId = formData.get('postId');

		// validate user session
		const sessionToken = cookies.get('session');
		if (!sessionToken) throw redirect(303, '/login');
		const { user, session } = await validateSessionToken(sessionToken);
		if (!user || !session) throw redirect(303, '/login');

		if (!userId || !postId) {
			return { success: false, error: 'Invalid post or user id' };
		}
		locals.user = user;
		locals.session = session;
		const like = await createLike(Number(userId), Number(postId), null);

		if (like) {
			return { success: true };
		} else {
			return { success: false, error: 'Error creating like.' };
		}
	},

	comment: async ({ request, cookies, locals }) => {
		// validate user session
		const sessionToken = cookies.get('session');
		if (!sessionToken) throw redirect(303, '/login');
		const { user, session } = await validateSessionToken(sessionToken);
		if (!user || !session) throw redirect(303, '/login');

		const formData = await request.formData();
		const userId = formData.get('userId');
		const postId = formData.get('postId');
		const commentContent = formData.get('commentContent');
		if (!userId || !postId) {
			return { success: false, error: 'Invalid post or user id' };
		}
		locals.user = user;
		locals.session = session;

		const comment = await createComment(
			Number(postId),
			Number(userId),
			String(commentContent),
			0 // or use -1 if that's your convention for "no parent"
		);

		if (comment) {
			return { success: true };
		} else {
			return { success: false, error: 'Error creating comment.' };
		}
	}
};
