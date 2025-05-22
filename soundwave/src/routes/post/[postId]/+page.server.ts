import { getPostWithRelations } from '$lib/server/post.js';

// -- Function to get post by ID
export async function load({ params, locals }) {
	const postId = Number(params.postId);

	const post = await getPostWithRelations(postId);

	return {
		post,
		user: locals.user,
		session: locals.session
	};
}
