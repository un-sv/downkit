<script lang="ts">
	import Layout from '$lib/theme/svelte/layout.svelte';
	import { navbar } from '../(main)/+layout.svelte';

	let { children } = $props();
</script>

<Layout {navbar}>
	{@render children()}
</Layout>
