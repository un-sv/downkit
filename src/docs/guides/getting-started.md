---
title: Getting Started
---

DownKit is a pre-preproccessor that turns markdown content into SvelteKit routes.

## Installation

```sh
npm i -D downkit
# pnpm i -D downkit
# bun i -D downkit
```

## Vite setup

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { downkit } from 'downkit';
import { plugins } from 'downkit/theme/svelte';

export default defineConfig({
	plugins: [sveltekit(), downkit()]
});

```
