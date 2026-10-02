import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// All data is in the browser, so the output is a single-page app made of static files.
			// The fallback page serves every route. See https://svelte.dev/docs/kit/single-page-apps
			adapter: adapter({ fallback: 'index.html' }),

			// The service worker serves one cached page for every route, so asset URLs must be absolute.
			paths: { relative: false }
		})
	]
});
