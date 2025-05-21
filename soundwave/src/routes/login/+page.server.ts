import { redirect } from '@sveltejs/kit';

import type { RequestEvent } from './$types';

/** Server Side function to run on each visit to login endpoint.
 *  Check for current user session, if there is a current session then redirect back to home
 *
 * @param event
 * @return void
 */
export async function load(event: RequestEvent) {
	if (event.locals.user !== null && event.locals.session !== null) {
		console.log('event ', event);
		return {};
	}
	return {};
}
