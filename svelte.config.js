import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		})
	},
	onwarn: (warning, handler) => {
		const { code, frame } = warning;
		// console.log(code); // <= uncomment to check other warnings
		if (code === 'css_unused_selector') return;
		if (code === 'a11y_invalid_attribute') return;
		handler(warning);
	},
	preprocess: vitePreprocess()
};

export default config;
