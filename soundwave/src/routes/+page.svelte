<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	console.log(data);
</script>

<div>
	{#if data.user}
		<img
			class="rounded-full"
			src={`https://images.weserv.nl/?url=${encodeURIComponent(data.user.profilePicture ?? '')}`}
			alt="img"
		/>
	{/if}
	<h1>Welcome {data.user?.username ?? ''} to SvelteKit</h1>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p>

	<a class="button" href="/dashboard">Dashboard</a>

	<!-- Signout / Login buttons to conditionally render on state of user -->
	{#if data.user}
		<a href="/signout" class="button">Sign out</a>
	{:else}
		<a href="/login" class="button">Login</a>
	{/if}
</div>
