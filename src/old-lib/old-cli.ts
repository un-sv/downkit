import { defineCommand, runMain } from 'citty';
import { isAbsolute, resolve } from 'path';
import { createServer, searchForWorkspaceRoot } from 'vite';
import { svelte, type SvelteConfig } from '@sveltejs/vite-plugin-svelte';
import { glob } from 'tinyglobby';
import { mdsvex } from 'mdsvex';
import { loadConfig } from 'c12';
import { defu } from 'defu';

const SOURCE_DIR = import.meta.dirname;

const dev = defineCommand({
	meta: { name: 'dev', description: 'start dolte development server' },
	args: {
		dir: {
			type: 'positional',
			description: 'The directory of your project',
			required: false,
			default: '.'
		}
	},
	async run(context) {
		let dolte_dir = context.args.dir;
		if (!isAbsolute(dolte_dir)) dolte_dir = resolve(dolte_dir);

		const { config: svelte_config } = await loadConfig<SvelteConfig>({
			name: 'svelte',
			cwd: process.cwd()
		});

		const routes: Record<string, string> = {};

		const globs = await glob('**/*.md', { cwd: dolte_dir, ignore: ['.dolte'] });

		for (const filename of globs) {
			const filepath = resolve(dolte_dir, filename);
			const path = '/' + filename.replace(/(\.md|\/index\.md|index\.md)$/, '');

			routes[path] = filepath;
		}

		if ('kit' in svelte_config) delete svelte_config.kit;

		const vite = await createServer({
			configFile: false,
			server: {
				fs: {
					allow: [SOURCE_DIR, dolte_dir, searchForWorkspaceRoot(dolte_dir)]
				}
			},
			plugins: [
				svelte(
					defu(svelte_config, <SvelteConfig>{
						configFile: false,
						preprocess: [mdsvex({ extension: '.md' })],
						extensions: ['.svelte', '.md']
					})
				),
				{
					name: 'vite-plugin-dolte',
					resolveId(source) {
						if (source === '$dolte') return '$dolte';
					},
					load(id) {
						if (id === '$dolte') return `export const routes = ${JSON.stringify(routes)}`;
					},
					configureServer(server) {
						return () => {
							server.middlewares.use(async (req, res, next) => {
								const url = req.url;
								if (url?.endsWith('.html')) {
									res.statusCode = 200;
									res.setHeader('Content-Type', 'text/html');
									let html = `<!DOCTYPE html>
                 <html>
                   <head>
                     <title></title>
                     <meta charset="utf-8">
                     <meta name="viewport" content="width=device-width,initial-scale=1">
                     <meta name="description" content="">
                   </head>
                   <body>
                     <div id="__dolte"></div>
                     <script type="module" src="/@fs/${SOURCE_DIR}/client.js"></script>
                   </body>
                 </html>`;
									html = await server.transformIndexHtml(url, html, req.originalUrl);
									res.end(html);
									return;
								}
								next();
							});
						};
					}
				}
			]
		});

		await vite.listen();
		vite.printUrls();
	}
});

runMain({
	meta: {
		name: 'dolte',
		description: 'static site generator for the rest of us',
		version: '0.0.1'
	},
	subCommands: {
		dev
	}
});
