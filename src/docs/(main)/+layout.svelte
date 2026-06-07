<script module lang="ts">
	import Layout, { type LayoutProps } from '$lib/theme/svelte/layout.svelte';

	export const navbar: LayoutProps['navbar'] = {
		external_links: [
			{
				icon: 'i-lucide:github',
				href: 'https://github.com/un-sv/dolte'
			}
		],
		links: { Guides: '/guides/introduction', Themes: '/themes', Reference: '/reference' }
	};
</script>

<script lang="ts">
	let { children } = $props();
</script>

<Layout {navbar}>
	{@render children()}
</Layout>
