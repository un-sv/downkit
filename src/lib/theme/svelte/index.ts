import type { Plugin } from 'vite';
import {
	presetWebFonts,
	presetWind4,
	transformerCompileClass,
	transformerDirectives,
	transformerVariantGroup
} from 'unocss';
import unocss from 'unocss/vite';

export const plugins: Plugin[] = [
	...unocss({
		theme: {
			colors: {
				svelte: '#ff3e00'
			}
		},
		shortcuts: {
			h1: 'font-500 text-lg'
		},
		presets: [
			presetWind4({
				preflights: {
					reset: true
				}
			}),
			presetWebFonts({
				fonts: {
					sans: { name: 'Fira Sans', weights: [400] },
					dm: { name: 'DM Serif Display', weights: [400, 500], italic: true }
				}
			})
		],
		transformers: [transformerVariantGroup(), transformerDirectives(), transformerCompileClass()]
	})
];
