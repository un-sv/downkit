import defu from 'defu';
import uisv, { type PluginOptions } from 'uisv/vite';

export function plugins(options: { uisv?: PluginOptions } = {}) {
	return uisv(
		defu(options.uisv, <PluginOptions>{
			fonts: {
				fonts: {
					sans: { name: 'Fira Sans', weights: [400] },
					dm: { name: 'DM Serif Display', weights: [400, 500], italic: true }
				}
			},
			colors: {
				surface: {
					50: '#F0F1F3',
					100: '#E4E5E9',
					200: '#C6C9D1',
					300: '#ACB1BC',
					400: '#9299A7',
					500: '#787F8C',
					600: '#636873',
					700: '#4E535B',
					800: '#383B42',
					900: '#25282D',
					950: '#1C1E22'
				}
			}
		})
	).flat();
}
