<script lang="ts">
	import type { PostDetail } from '$lib/types/userTypes';
	import { slide } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { user } from '$lib/stores/user';
	export let post: PostDetail | null;

	$: commentsVisible = true;
	function toggleComments() {
		commentsVisible = !commentsVisible;
	}
	function handleResult({ result }: { result: any }) {
		if (result?.success) {
			location.reload();
		}
	}
</script>

{#if post}
	<div class="card max-w-3/5 flex flex-col p-3">
		<div class="mb-3 flex flex-row items-center">
			<img
				class="profile-picture h-10 w-10"
				src={`https://images.weserv.nl/?url=${encodeURIComponent(post.user.profilePicture ?? false)}`}
				alt="post-author"
			/>
			<p class="text-md ml-5 flex-1 text-left font-bold text-white">{post.user.username}</p>
			<p class="mr-3 text-right text-2xl font-bold text-white">{post.title}</p>
		</div>
		<div class="h-auto w-full truncate rounded-t-xl bg-white p-5">{post.content}</div>

		<!-- Comments section to expand on toggle of commentsVisible -->

		{#if commentsVisible}
			<div transition:slide class="flex flex-col items-center justify-center">
				<div class="h-5 w-full rounded-b-[20px] bg-white"></div>
				<div class="relative flex h-5 w-full flex-row bg-white">
					<div class="absolute left-0 h-5 w-[40px] rounded-tr-[20px] bg-blue-300"></div>
					<div class="absolute right-0 h-5 w-[40px] rounded-tl-[20px] bg-blue-300"></div>
				</div>

				<!-- main comments section -->
				<div class="flex h-20 w-[calc(100%-80px)] bg-white">
					{#each post.comments as comment (comment.id)}
						<div class="flex w-full flex-col" transition:slide>
							<img
								class="profile-picture ml-3 h-8 w-8"
								src={`https://images.weserv.nl/?url=${encodeURIComponent(comment.user.profilePicture ?? false)}`}
								alt="comment-author"
							/>
							<div class="border-1 h-8 flex-1 rounded-lg border-blue-100">{comment.content}</div>
						</div>
					{/each}
				</div>

				<div class="relative flex h-5 w-full flex-row bg-white">
					<div class="absolute left-0 h-5 w-[40px] rounded-br-[20px] bg-blue-300"></div>
					<div class="absolute right-0 h-5 w-[40px] rounded-bl-[20px] bg-blue-300"></div>
				</div>
				<div class="h-5 w-full rounded-t-[20px] bg-white"></div>
				<div class="flex h-10 w-full flex-row bg-white">
					<img
						class="profile-picture ml-3 h-8 w-8"
						src={`https://images.weserv.nl/?url=${encodeURIComponent($user?.profilePicture ?? false)}`}
						alt="user"
					/>
					<form
						method="POST"
						action="?/comment"
						class="w-full pr-5"
						use:enhance={() =>
							({ result }) =>
								handleResult({ result })}
					>
						<label class="flex flex-row">
							<input
								class="input-field ml-2 h-8 w-full"
								name="commentContent"
								placeholder="A quick rebuttal..."
							/>
							<input type="hidden" name="postId" value={post.id} />
							<input type="hidden" name="userId" value={$user?.id} />
							<button
								type="submit"
								class="mx-2 w-10 rounded-xl border bg-blue-100 text-blue-300 active:bg-blue-50 active:shadow-inner"
								aria-label="Submit comment"
								><svg
									xmlns="http://www.w3.org/2000/svg"
									class="mx-auto h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg></button
							>
						</label>
					</form>
				</div>
			</div>
		{/if}

		<div class="border-t-1 flex h-10 w-full flex-row rounded-b-lg border-blue-200 bg-white">
			<!-- LIKE button as a form submit -->
			<form method="POST" action="?/like" class="flex w-1/3">
				<input type="hidden" name="postId" value={post.id} />
				<input type="hidden" name="userId" value={$user?.id} />
				<button
					class="border-r-1 button-font flex w-full items-center justify-center border-blue-200"
					type="submit"
					aria-label="Like"
				>
					LIKE
				</button>
			</form>
			<button
				class="border-r-1 button-font flex w-1/3 items-center justify-center border-blue-200"
				on:click={toggleComments}
				aria-label="Comment"
			>
				COMMENTS
			</button>
			<button class="button-font flex w-1/3 items-center justify-center" aria-label="Share">
				SHARE
			</button>
		</div>
	</div>
{/if}
