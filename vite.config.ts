import { copyFileSync } from 'node:fs';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, type Plugin } from 'vite';

// Obsidian loads the plugin from this folder of the test vault.
const pluginDir = 'test-vault/.obsidian/plugins/whats-for-dinner';

// Obsidian reads the manifest from the same folder as main.js.
const copyManifest = (): Plugin => ({
	name: 'copy-manifest',
	closeBundle() {
		copyFileSync('manifest.json', `${pluginDir}/manifest.json`);
	}
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [svelte(), copyManifest()],
	publicDir: false,
	build: {
		outDir: pluginDir,
		// Obsidian keeps the data of the plugin in this folder.
		emptyOutDir: false,
		sourcemap: mode === 'development' ? 'inline' : false,
		minify: mode !== 'development',
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
}));
