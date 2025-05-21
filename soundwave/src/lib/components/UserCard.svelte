<script lang="ts">
	import { type User } from '$lib/server/db/schema';
	export let user: User | undefined;
</script>

{#if !user}
	<div>user undefined</div>
{:else}
	<div class="w-90 flex h-auto flex-row rounded-xl border bg-blue-300 p-3 text-white shadow-md">
		<!-- Profile picture section of the card -->
		<div class="w-30 h-30 aspect-1/1 flex flex-col">
			<img
				src={`https://images.weserv.nl/?url=${encodeURIComponent(user.profilePicture ?? '')}`}
				alt="profilepic"
				class="h-full w-full rounded-full border shadow-lg"
			/>
			<div class="flex items-center justify-center text-center text-lg font-bold">
				{user.username}
			</div>
		</div>
		<!-- Profile details section -->
		<div class="ml-3 flex h-full w-full flex-col truncate text-xs">
			{#each Object.entries(user) as [key, value] (key)}
				{#if value !== undefined && key !== 'username'}
					<div class="text-2xs flex w-full flex-row">
						<div class="w-25 mr-2 text-right">{key}:</div>
						<div class="max-w-20 truncate">{value}</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}
