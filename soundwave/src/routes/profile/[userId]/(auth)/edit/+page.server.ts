import { validateSessionToken } from '$lib/server/auth';
import { updateUser } from '$lib/server/user.js';
import { redirect, fail } from '@sveltejs/kit';

export const actions = {
	// action to update the users details
	create: async ({ cookies, request, locals, params }) => {
		const sessionToken = cookies.get('session');
		// if session expired then redirect to login
		if (!sessionToken) {
			throw redirect(303, '/login');
		}

		const { user, session } = await validateSessionToken(sessionToken);

		if (!user || !session) {
			throw redirect(303, '/login');
		}

		// if logged in user is not the same as the profile user then cannot update details
		if (params.userId !== String(user.id)) {
			throw redirect(401, '/');
		}

		const data = await request.formData();
		const username = data.get('username')?.toString() ?? null;
		const firstName = data.get('firstName')?.toString() ?? null;
		const lastName = data.get('lastName')?.toString() ?? null;
		const ageRaw = data.get('age');
		const age =
			ageRaw !== null && ageRaw !== undefined && ageRaw.toString() !== '' ? Number(ageRaw) : null;
		const profilePicture = data.get('profilePicture')?.toString() ?? null;

		const updated = await updateUser(user.id, username, firstName, lastName, age, profilePicture);

		if (!updated) {
			return fail(500, { message: 'Failed to update user.' });
		}

		locals.user = updated;

		throw redirect(303, `/profile/${user.id}`);
	}
};
