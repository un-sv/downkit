<script module lang="ts">
	import Layout, { type LayoutProps } from '$lib/theme/svelte/layout.svelte';

	export const navbar: LayoutProps['navbar'] = {
		external_links: [
			{
				icon: 'i-simple-icons:github',
				href: 'https://github.com/un-sv/downkit'
			}
		],
		links: { Guides: '/guides/introduction', Themes: '/themes', Reference: '/reference' },
		toggles: [
			{ dark_icon: 'i-lucide:moon', light_icon: 'i-lucide:sun', system_icon: 'i-lucide:computer' }
		]
	};
</script>

<script lang="ts">
	let { children } = $props();
</script>

<Layout {navbar}>
	{@render children()}
</Layout>
