import { resolve } from 'path';
import { defu } from 'defu';
import type { Plugin as VitePlugin } from 'vite';
import { watch } from 'chokidar';
import fs from 'fs/promises';
import { compile } from 'mdsvex';
import { existsSync } from 'fs';
import { type Plugin as UnifiedPlugin } from 'unified';
import type { Literal, Parent } from 'unist';

export interface DownKitConfig {
	title?: string;
	title_template?: string;
	description?: string;
	head?: [string, Record<string, string>] | [string, Record<string, string>, string];
	lang?: string;
	base?: string;
	rewrites?: Record<string, string>;
	docs_dirname?: string;
	sidebar?: Record<string, Record<string, string | Record<string, string>>>;
	plugins?: VitePlugin[];
}

export async function downkit(cfg: DownKitConfig = {}): Promise<VitePlugin[]> {
	const config = defu(cfg, <DownKitConfig>{
		docs_dirname: 'docs',
		title_template: ':title',
		plugins: []
	});
	const DOCS_DIR = resolve('./src', config.docs_dirname!);
	const ROUTES_DIR = resolve('./src/routes');

	if (existsSync(ROUTES_DIR)) await fs.rm(ROUTES_DIR, { recursive: true });

	// const routes_types = resolve(process.cwd(), '.svelte-kit/types/src/routes');
	// const downkit_routes = resolve(routes_types, DOCS_DIR, '.dolte/routes');
	// if (existsSync(routes_types)) symlinkSync(routes_types, dolte_routes);

	const watcher = watch('.', { cwd: DOCS_DIR }).on('all', async (event, path) => {
		if (event.includes('Dir')) return;

		const md = resolve(DOCS_DIR, path);
		const page = path.replace(/(\.md|\/index\.md|index\.md)$/, '/+page.svelte');
		const page_dir = resolve(ROUTES_DIR, page.split('/').slice(0, -1).join('/'));
		const page_fullpath = resolve(`${ROUTES_DIR}/${page}`);

		if (event === 'unlink') {
			if (!path.endsWith('.md')) return fs.rm(page_fullpath);

			const files = await fs.readdir(page_dir);

			if (files.length === 1 && files[0] === '+page.svelte') {
				fs.rm(page_dir, { recursive: true, force: true });
			} else if (existsSync(page_fullpath)) {
				fs.rm(page_fullpath);
			}

			return;
		}

		if (!path.endsWith('.md')) {
			fs.mkdir(page_dir, { recursive: true });
			fs.writeFile(page_fullpath, String(await fs.readFile(md)));

			return;
		}

		fs.mkdir(page_dir, { recursive: true });

		const result = await compile(String(await fs.readFile(md)), {
			extensions: ['.md'],
			remarkPlugins: [
				function (): ReturnType<UnifiedPlugin> {
					// @ts-expect-error will have stuff
					return (node: Literal & Parent) => {
						console.log(JSON.stringify(node, null, 2));
					};
				}
			]
		});
		if (!result) return;

		// REMOVE MODULE SCRIPT
		if (result.code.indexOf('<script context="module">') > -1) {
			const index = result.code.indexOf('</script>\n');
			result.code = result.code.slice(index + 10);
		}

		// HEAD STUFF
		const head: string[] = [];
		const frontmatter: Record<string, string> = (result.data?.fm as Record<string, string>) || {};
		const title = frontmatter.title || config.title;
		const title_template = frontmatter.title_template || config.title_template || ':title';
		head.push(`<title>${title_template.replace(':title', title || '')}</title>`);

		const description = frontmatter.description || config.description;
		if (description) head.push(`<meta name="description" content="${description}">`);

		const head_index = result.code.indexOf('<svelte:head>');
		if (head_index < 0) {
			result.code += `\n<svelte:head>\n${head.join('\n')}\n</svelte:head>`;
		} else {
			result.code = `${result.code.slice(0, head_index + 13)}\n${head.join('\n')}\n${result.code.slice(0, head_index + 13)}`;
		}

		// SCRIPT STUFF
		const script_lines: string[] = ['import { downkit_page } from "downkit/context";'];

		script_lines.push(
			`downkit_page.current = ${JSON.stringify({ title, description, frontmatter })}`
		);

		const closing_script_index = result.code.lastIndexOf('</script>');
		if (closing_script_index > -1) {
			result.code = `${result.code.slice(0, closing_script_index)}${script_lines.join('\n')}${result.code.slice(closing_script_index)}`;
		} else if (script_lines) {
			result.code = `<script lang="ts">\n${script_lines.join('\n')}\n</script>${result.code}`;
		}

		// WRITE ROUTE `+page.svelte` FILE
		fs.writeFile(page_fullpath, result.code);
	});

	// stop when it's sveltekit sync
	if (process.argv[1].endsWith('.bin/svelte-kit') && process.argv[2] === 'sync') watcher.close();

	return [
		...config.plugins!,
		{
			name: 'vite-plugin-downkit',
			buildStart() {
				watcher.close();
			}
		}
	];
}
