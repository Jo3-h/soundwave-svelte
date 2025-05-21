<script lang="ts">
	import '../app.css';
	import Navbar from "$lib/components/Navbar.svelte";
	const { data, children } = $props();
</script>
<div>
	<Navbar user={data?.user ?? null} />
	<div class="p-24">
		{@render children()}
	</div>
</div>
