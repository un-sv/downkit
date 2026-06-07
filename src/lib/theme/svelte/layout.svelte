<script module lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	// import { dolte_page } from '$lib/context.svelte.js';
	import { dolte_page } from 'dolte/context';
	import { Icon } from 'uisv';
	import { page } from '$app/state';

	export type LayoutProps = {
		sidebar?: Record<string, Record<string, string>>;
		navbar?: {
			links?: Record<string, string | Record<string, string>>;
			logo?: Component | Snippet;
			toggles?: Record<string, SvelteHTMLElements['button'] & { icon?: string | Component }>;
			external_links?: Array<SvelteHTMLElements['a'] & { icon?: string | Component }>;
		};
		children?: Snippet;
	};
</script>

<script lang="ts">
	let { sidebar, navbar, children }: LayoutProps = $props();
</script>

<nav class="bg-white shadow-md px-10">
	<span class="">
		{#each Object.entries(navbar?.links || []) as [label, item], idx (idx)}
			{#if typeof item === 'string'}
				<a
					href={item}
					class={[
						'h-15 inline-flex items-center justify-center px-2 border-b transition',
						page.url.pathname === item
							? 'border-svelte'
							: 'border-transparent hover:border-neutral/25'
					]}
				>
					{label}
				</a>
			{:else}
				<!-- TODO: Dropdown links -->
			{/if}
		{/each}
	</span>
</nav>

{@render children?.()}

<style>
	:global {
		h1 {
			text-wrap: balance;
			color: var(--sk-fg-1);
			position: relative;
		}
	}
</style>
