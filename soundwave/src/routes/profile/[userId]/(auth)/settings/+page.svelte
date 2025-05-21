<script>
	let { data } = $props();
	import UserCard from '$lib/components/UserCard.svelte';
</script>

<div class="flex flex-col items-center justify-center gap-y-10">
	<h1>Profile Settings page</h1>

	<UserCard user={data.user} />
</div>
