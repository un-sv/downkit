import { runMain } from 'citty';
import { isAbsolute, resolve } from 'path';
import { watch } from 'chokidar';
import { loadConfig } from 'c12';
import type { DolteConfig } from './index.ts';

runMain({
	meta: {
		name: 'dotle',
		description: 'static site generator for the rest of us',
		version: '0.0.1'
	},
	args: {
		cwd: {
			type: 'positional',
			description: 'directory where all the md files located',
			required: false,
			default: './src/docs'
		}
	},
	async run(context) {
		if (!isAbsolute(context.args.cwd)) context.args.cwd = resolve(context.args.cwd);

		const { config } = await loadConfig<DolteConfig>({
			configFile: '.dolte/config',
			cwd: context.args.cwd,
			defaultConfig: {}
		});

		watch('.', { cwd: context.args.cwd }).on('all', (event, path) => {
			if (path.startsWith(`${context.args.cwd}/.dolte`)) return;
			if (!path.endsWith(`.md`)) return;

			// const urlpath = '/' + path.replace(/(\.md|\/index\.md|index\.md)$/, '');

			// routes[path] = filepath;

			console.log(event, path);
		});
	}
});
