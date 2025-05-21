<script>
	import UserCard from '$lib/components/UserCard.svelte';
	let { data } = $props();
</script>

<div class="flex h-auto w-full flex-col items-center gap-y-10">
	<h1>Edit profile page</h1>
	<UserCard user={data.user} />

	<form method="POST" action="?/create">
		<label class="flex flex-col gap-y-2">
			<h1>Edit your profile settings</h1>
			<input
				class="input-field"
				name="firstName"
				placeholder={data.user.firstName ?? 'first name'}
				autocomplete="off"
			/>
			<input
				class="input-field"
				name="lastName"
				placeholder={data.user.lastName ?? 'last name'}
				autocomplete="off"
			/>
			<input
				class="input-field"
				name="age"
				placeholder={data.user.age?.toString() ?? 'age'}
				autocomplete="off"
			/>
		</label>
		<button type="submit" class="button">Save Changes</button>
	</form>
</div>
