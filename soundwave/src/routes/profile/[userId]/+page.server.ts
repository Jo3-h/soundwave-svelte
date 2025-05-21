import { getUserFromId } from '$lib/server/user.js';
import { error } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/auth.js';

export async function load({ params, cookies }) {
	const user_id = params.userId;

	const user = await getUserFromId(Number(user_id));

	const sessionToken = await cookies.get('session');
	if (!sessionToken) {
		return {
			userId: null,
			user: user
		};
	} else {
		const currentSession = await validateSessionToken(sessionToken);
		return {
			userId: currentSession.user?.id,
			user: user
		};
	}

	// should never reach
	throw error(500, 'Unexpected server error.');
}
