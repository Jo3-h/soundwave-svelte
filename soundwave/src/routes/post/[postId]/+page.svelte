<script>
	import UserCard from '$lib/components/UserCard.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import { user } from '$lib/stores/user';
	let { data } = $props();
	user.set(data.user);
	console.log('user', user);
</script>

<div class="flex flex-col items-center gap-y-3">
	<PostCard post={data.post} />
	<UserCard user={data.user ?? undefined} />
</div>
