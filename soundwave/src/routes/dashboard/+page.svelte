<script lang="ts">
	let { data } = $props();
	import UserCard from '$lib/components/UserCard.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import PostDraftBoard from '$lib/components/PostDraftBoard.svelte';
	import { user } from '$lib/stores/user';
	import { slide } from 'svelte/transition';
	import type { PostDetail } from '$lib/types/userTypes.js';
	user.set(data.user);
	let posts: PostDetail[] | null = data.posts;
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<p class="mb-3">I am the dashboard</p>
	<PostDraftBoard />
	{#if posts}
		{#each posts as post (post.id)}
			<div transition:slide class="flex w-full items-center justify-center">
				<PostCard {post} />
			</div>
		{/each}
	{/if}
	<!-- <UserCard user={data.user ?? undefined} /> -->
</div>
