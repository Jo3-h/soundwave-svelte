<script lang="ts">
	const { user } = $props();
</script>

<div class="flex h-10 w-full items-center bg-blue-300">
	<div class="flex-1"></div>
	<a href="/" class="hidden w-0 text-center text-xl font-bold text-white md:block md:w-40"
		>SoundWave</a
	>
	<div class="flex flex-1 justify-end pr-2">
		<div class="hidden font-bold text-white md:block">
			{#if user === null}
				<a href="/login">Login</a>
				<a href="/signup">Signup</a>
			{:else}
				<a href={`/profile/${user.id}`}>Profile</a>
				<a href="/signout">Signout</a>
			{/if}
		</div>
		<div class="h-8 w-8 bg-white md:hidden"></div>
	</div>
</div>
