import App from './app.svelte';
import { mount, type Component } from 'svelte';
import { routes } from '$dolte';

async function startApp() {
	const filepath = (routes as Record<string, string>)[location.pathname];
	let content: Component | null = null;

	if (filepath) {
		content = (await import(/*@vite-ignore*/ filepath)).default;
	}

	if (!content) return;

	mount(App, {
		target: document.querySelector('#__dolte')!,
		props: {
			routes,
			content
		}
	});
}
startApp();
