import { fail, redirect } from '@sveltejs/kit';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth';

import type { Actions, RequestEvent } from './$types';

export async function load({ locals }) {
	return { user: locals.user ?? null };
}
