<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
    console.log(data)
</script>

<div>
    {#if data.user}
    <img class="rounded-full" src={`https://images.weserv.nl/?url=${encodeURIComponent(data.user.profilePicture ?? '')}`} alt="img"/>
    {/if}
    <h1>Welcome {data.user?.username ?? ""} to SvelteKit</h1>
    <p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
    {#if data.user}

    <a href='/signout' class="h-10 w-40 flex bg-blue-300 rounded-xl shadow-md justify-center items-center font-bold text-white">Sign out</a>
    {:else}
    <a href="/login" class="h-10 w-40 flex bg-blue-300 rounded-xl shadow-md justify-center items-center font-bold text-white">Login</a>
    {/if}
</div>