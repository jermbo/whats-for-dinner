import { defineConfig } from 'vitest/config';

// The tests check only the domain, so they need no browser page and no Svelte.
export default defineConfig({
	test: {
		environment: 'node',
		include: ['tests/**/*.test.ts']
	}
});
