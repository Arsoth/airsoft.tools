import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import preprocessor from '@modular-css/svelte';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mcssVite from '@modular-css/vite';

const { preprocess, processor } = preprocessor({
	include: /.mcss$/i
});
export default defineConfig({
	plugins: [
		sveltekit(),
		mcssVite({
			processor
		})
	]
});
