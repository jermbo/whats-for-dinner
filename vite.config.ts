import { copyFileSync } from 'node:fs';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, type Plugin } from 'vite';

// Obsidian loads the development build from this folder of the test vault.
const pluginDir = 'test-vault/.obsidian/plugins/whats-for-dinner';

// The release build has its own folder, so a GitHub release gets only the three files of the
// plugin, never the data of the test vault or a stale development build.
const releaseDir = 'dist';

// Obsidian reads the manifest from the same folder as main.js.
const copyManifest = (outDir: string): Plugin => ({
	name: 'copy-manifest',
	closeBundle() {
		copyFileSync('manifest.json', `${outDir}/manifest.json`);
	}
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const development = mode === 'development';
	const outDir = development ? pluginDir : releaseDir;

	return {
		plugins: [svelte(), copyManifest(outDir)],
		publicDir: false,
		build: {
			outDir,
			// Obsidian keeps the data of the plugin in the folder of the test vault.
			emptyOutDir: !development,
			sourcemap: development ? 'inline' : false,
			minify: !development,
			lib: {
				entry: 'src/main.ts',
				formats: ['cjs'],
				fileName: () => 'main.js',
				cssFileName: 'styles'
			},
			rolldownOptions: {
				// Obsidian supplies this module when it loads the plugin.
				external: ['obsidian'],
				output: { exports: 'named' }
			}
		}
	};
});
