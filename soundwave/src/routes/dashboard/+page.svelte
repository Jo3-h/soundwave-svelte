<script>
	let { data } = $props();
	import UserCard from '$lib/components/UserCard.svelte';
</script>

<div>
	<UserCard user={data.user ?? undefined} />
	<p>I am the dashboard</p>
</div>
