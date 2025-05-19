<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>
<div class="p-24">
	{@render children()}

</div>
