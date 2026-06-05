import { resolve } from 'path';
import { defu } from 'defu';
import type { Plugin } from 'vite';
import { watch } from 'chokidar';
import { writeFile, mkdir, readFile, readdir, rm } from 'fs/promises';
import { compile } from 'mdsvex';
import { existsSync, rmdirSync, symlinkSync } from 'fs';
import { createContext } from 'svelte';

export interface DolteConfig {
	title?: string;
	title_template?: string;
	description?: string;
	head?: [string, Record<string, string>] | [string, Record<string, string>, string];
	lang?: string;
	base?: string;
	rewrites?: Record<string, string>;
	docs_dirname?: string;
}

export function dolte(cfg: DolteConfig = {}): Plugin[] {
	const config = defu(cfg, <DolteConfig>{
		docs_dirname: 'docs',
		title_template: ':title'
	});
	const DOCS_DIR = resolve('./src', config.docs_dirname!);
	const ROUTES_DIR = resolve('./src/routes');

	if (existsSync(ROUTES_DIR)) rmdirSync(ROUTES_DIR, { recursive: true });

	// const routes_types = resolve(process.cwd(), '.svelte-kit/types/src/routes');
	// const dolte_routes = resolve(routes_types, DOCS_DIR, '.dolte/routes');
	// if (existsSync(routes_types)) symlinkSync(routes_types, dolte_routes);

	watch('.', { cwd: DOCS_DIR }).on('all', async (event, path) => {
		const md = resolve(DOCS_DIR, path);
		const page = path.replace(/(\.md|\/index\.md|index\.md)$/, '/+page.svelte');
		const page_dir = resolve(ROUTES_DIR, page.split('/').slice(0, -1).join('/'));
		const page_fullpath = resolve(`${ROUTES_DIR}/${page}`);

		if (event === 'unlink') {
			const files = await readdir(page_dir);
			if (files.length === 1 && files[0] === '+page.svelte')
				await rm(page_dir, { recursive: true, force: true });
			else if (existsSync(page_fullpath)) await rm(page_fullpath);
			return;
		}

		if (!path.endsWith(`.md`)) return;
		mkdir(page_dir, { recursive: true });

		const result = await compile(String(await readFile(md)));
		if (!result) return;

		if (result.code.startsWith('<script context="module">')) {
			const index = result.code.indexOf('</script>\n');
			result.code = result.code.slice(index + 10);
		}

		const head_index = result.code.indexOf('<svelte:head>');
		const head: string[] = [];
		const frontmatter: Record<string, string> = (result.data?.fm as Record<string, string>) || {};
		const title = frontmatter.title || config.title || '';
		const title_template = frontmatter.title_template || config.title_template || ':title';
		head.push(`<title>${title_template.replace(':title', title)}</title>`);

		console.log(head_index);
		if (head_index < 0) {
			result.code += `
         <svelte:head>
         ${head.join('\n')}
         </svelte:head`;
		} else {
			result.code = `${result.code.slice(0, head_index + 13)}
        ${head.join('\n')}
			${result.code.slice(0, head_index + 13)}`;
		}

		console.log(result.code);

		writeFile(page_fullpath, result.code);
	});

	return [];
}

export interface DoltePage {
	head: DolteConfig['head'];
}

export const [getDoltePage, setDoltePage] = createContext<DoltePage>();
