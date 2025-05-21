<script>
	import UserCard from '$lib/components/UserCard.svelte';
	import { UnexpectedResponseError } from 'arctic';
	let { data } = $props();
</script>

<div class="flex h-auto w-full flex-col items-center">
	<UserCard user={data.user ?? undefined} />
	{#if data.user?.id === Number(data.userId)}
		<a href={`/profile/${data.userId}/edit`} class="button">edit profile</a>
		<a href={`/profile/${data.userId}/settings`} class="button">settings</a>
	{/if}
</div>
