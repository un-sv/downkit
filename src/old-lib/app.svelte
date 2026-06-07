<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import type { Component } from 'svelte';

	type Props = {
		routes: Record<string, string>;
		content: Component;
	};

	let { routes, content: Content }: Props = $props();
</script>

<Content />
