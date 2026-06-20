<script lang="ts">
	import Layout, { type LayoutProps } from '$lib/theme/svelte/layout.svelte';
	import 'virtual:uno.css';
	import { downkit_page } from 'downkit/context';

	const navbar: LayoutProps['navbar'] = {
		logo,
		external_links: [
			{
				icon: 'i-simple-icons:github',
				href: 'https://github.com/un-sv/downkit'
			}
		],
		links: { Guides: '/guides/introduction', Themes: '/themes', Reference: '/reference' },
		toggles: [
			{
				dark_icon: 'i-lucide:moon',
				light_icon: 'i-lucide:sun',
				system_icon: 'i-lucide:computer'
			}
		]
	};

	let { children } = $props();

	$inspect(downkit_page.current);
</script>

<Layout
	{navbar}
	sidebar={{
		'/guide': [{ label: '' }]
	}}
>
	{@render children()}
</Layout>

{#snippet logo()}
	<a href="/">DownKit</a>
{/snippet}
