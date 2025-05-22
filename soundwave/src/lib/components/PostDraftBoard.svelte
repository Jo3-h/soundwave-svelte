<script lang="ts">
	import { user } from '$lib/stores/user';
	import { enhance } from '$app/forms';

	function handleResult({ result }: { result: any }) {
		if (result?.success) {
			location.reload();
		}
	}
</script>

{#if $user}
	<div class="flex w-full justify-center">
		<div class="flex w-full justify-center">
			<div class="card mb-3 bg-amber-50">
				<div class="relative flex h-auto w-full flex-row justify-center p-3">
					<img
						class="profile-picture h-12 w-12"
						src={`https://images.weserv.nl/?url=${encodeURIComponent($user.profilePicture ?? false)}`}
						alt="img"
					/>
					<form
						method="POST"
						action="?/createPost"
						class="mr-3 h-auto min-h-12 flex-1"
						use:enhance={() =>
							({ result }) =>
								handleResult({ result })}
					>
						<label class="flex flex-row">
							<input
								class="input-field ml-3 mr-5 h-12 w-full"
								name="post-content"
								placeholder="What's on your mind?"
								autocomplete="off"
							/>
							<button type="submit" class="button h-full bg-white">Post</button>
						</label>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}
