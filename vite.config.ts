import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { downkit } from './src/lib/index.ts';
import { plugins } from './src/lib/theme/svelte/index.ts';

export default defineConfig({
	plugins: [sveltekit(), downkit({ plugins: [...plugins()] })]
});
