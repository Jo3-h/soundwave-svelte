import { redirect } from '@sveltejs/kit';
import { validateSessionToken } from '$lib/server/auth.js';

export async function load({ cookies, url, locals, params }) {
	const sessionToken = cookies.get('session');

	// if no session token then redirect to login
	if (!sessionToken) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}

	// validate the sessionToken and return the user
	const { user, session } = await validateSessionToken(sessionToken);

	if (!user || !session) {
		throw redirect(303, `/login?redirectTo=${url.pathname}`);
	}

	// if the userId of the page is different from the logged in user then redirect back to home
	if (String(user?.id) !== params.userId) {
		throw redirect(303, '/');
	}

	locals.session = session;
	locals.user = user;

	return { user };
}
