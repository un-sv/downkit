<script module lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { ClassValue, SvelteHTMLElements } from 'svelte/elements';
	// import { dolte_page } from '$lib/context.svelte.js';
	import { downkit_page } from 'downkit/context';
	import { Icon, App, type ButtonProps } from 'uisv';
	import { page } from '$app/state';
	import { cn } from 'tailwind-variants';
	import { setMode, mode } from 'uisv/mode';

	export type LayoutProps = {
		sidebar?: Record<string, Record<string, string>>;
		navbar?: {
			links?: Record<string, string | Record<string, string>>;
			logo?: Component | Snippet;
			toggles?: Array<
				| ButtonProps
				| {
						dark_icon: string;
						light_icon: string;
						system_icon: string;
				  }
			>;
			external_links?: Array<ButtonProps>;
		};
		children?: Snippet;
		toc?: boolean;
		ui?: {
			navbar?: ClassValue;
			article?: ClassValue;
			sidebar?: ClassValue;
			main?: ClassValue;
			toc?: ClassValue;
			footer?: ClassValue;
			external_link?: ClassValue;
			link?: ClassValue;
		};
	};
</script>

<script lang="ts">
	import { Button } from 'uisv';

	let { sidebar, navbar, children, toc, ui = {} }: LayoutProps = $props();
</script>

<App>
	{#if navbar}
		<nav
			class={cn(
				'bg-surface-base dark:bg-surface-muted shadow-md px-10 flex gap-4 items-center',
				ui.navbar
			)}
		>
			{#each Object.entries(navbar?.links || []) as [label, item], idx (idx)}
				{#if typeof item === 'string'}
					<a
						href={item}
						class={cn(
							'h-15 inline-flex items-center justify-center px-2 border-b transition duration-500',
							page.url.pathname === item
								? 'border-primary'
								: 'border-transparent hover:border-surface/25',
							ui.link
						)}
					>
						{label}
					</a>
				{:else}
					<!-- TODO: Dropdown links -->
				{/if}
			{/each}

			<span class="grow"></span>

			{#each navbar.external_links as link, idx (idx)}
				<Button
					variant="link"
					icon={link.icon}
					href={link.href || undefined}
					target="_blank"
					class={cn('text-xl', ui.external_link)}
				/>
			{/each}

			{#each navbar.toggles as btn, idx (idx)}
				{#if 'icon' in btn}
					<Button
						{...btn}
						variant="outline"
						icon={btn.icon}
						href={btn.href || undefined}
						target="_blank"
						ui={{ base: cn('text-xl', ui.external_link) }}
					/>
				{:else if 'dark_icon' in btn}
					<Button
						{...btn}
						variant="outline"
						color="surface"
						icon={{
							dark: btn.dark_icon,
							light: btn.light_icon,
							system: btn.system_icon
						}[mode.current || 'system']}
					/>
				{/if}
			{/each}
		</nav>
	{/if}

	<article class="">
		{#if sidebar}
			<aside></aside>
		{/if}

		<main>
			{@render children?.()}
		</main>

		{#if toc}
			<aside></aside>
		{/if}
	</article>

	<footer></footer>
</App>

<style>
	:global {
		h1 {
			text-wrap: balance;
			color: var(--sk-fg-1);
			position: relative;
		}
	}
</style>
