import prettier from 'eslint-config-prettier';
import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig([
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } }
	},

	{
		files: ['**/*.svelte', '**/*.svelte.js'],
		languageOptions: { parserOptions: {} }
	},

	// Rules that the code follows today. They are on, so that a new file follows them too.
	{
		rules: {
			eqeqeq: 'error',
			'no-var': 'error',
			// Only an error that the owner cannot see on the screen goes to the console.
			'no-console': ['error', { allow: ['error'] }]
		}
	},
	{
		// A button with no type sends the form that it is in.
		files: ['**/*.svelte'],
		rules: { 'svelte/button-has-type': 'error' }
	},

	// The layers: a file imports only from its own layer or from a layer below it.
	// See docs/code/layers.md.
	layer('src/lib/domain/**', ['db', 'data', 'state', 'components'], ['$app/*', 'dexie', 'svelte']),
	layer('src/lib/db/**', ['data', 'state', 'components'], ['$app/*']),
	layer('src/lib/data/**', ['state', 'components'], ['$app/*']),
	layer('src/lib/state/**', ['components'], []),
	// A screen and a component do not touch the database. A component does not start a query.
	layer('src/routes/**', ['db'], ['dexie']),
	layer('src/lib/components/**', ['db'], ['dexie', '$lib/state/live.svelte'])
]);

/**
 * The rule that keeps the files of one layer out of the layers above it.
 * @param {string} files The files of the layer.
 * @param {string[]} above The folders of `src/lib` that the layer must not import.
 * @param {string[]} other Other modules that the layer must not import.
 */
function layer(files, above, other) {
	return {
		files: [files],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: [...above.map((folder) => `$lib/${folder}/**`), ...other],
							message: 'This import breaks the rule of the layers. See docs/code/layers.md.'
						}
					]
				}
			]
		}
	};
}
