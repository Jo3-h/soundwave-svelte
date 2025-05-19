import { redirect, type RequestEvent } from '@sveltejs/kit';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';

export async function GET(event: RequestEvent) {
	const sessionToken = event.cookies.get('session');
	if (sessionToken) {
		await invalidateSession(sessionToken);
	}
	deleteSessionTokenCookie(event);
	throw redirect(302, '/');
}
