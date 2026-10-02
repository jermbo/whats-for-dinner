<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const links = /** @type {const} */ ([
		{ path: '/', label: 'Today' },
		{ path: '/menu', label: 'Menu' },
		{ path: '/shop', label: 'Shop' },
		{ path: '/pantry', label: 'Pantry' },
		{ path: '/recipes', label: 'Recipes' },
		{ path: '/more', label: 'More' }
	]);

	/** @param {(typeof links)[number]['path']} path */
	function isCurrent(path) {
		const current = page.url.pathname;
		const href = resolve(path);
		return path === '/' ? current === href : current.startsWith(href);
	}
</script>

<nav class="app-nav" aria-label="Main">
	<ul class="app-nav__list">
		{#each links as link (link.path)}
			<li class="app-nav__item">
				<a
					class="app-nav__link"
					href={resolve(link.path)}
					aria-current={isCurrent(link.path) ? 'page' : undefined}
				>
					{link.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.app-nav {
		position: fixed;
		inset-inline: 0;
		inset-block-end: 0;
		padding-block-end: env(safe-area-inset-bottom);
		background: var(--color-surface);
		border-block-start: 1px solid var(--color-border);
	}

	.app-nav__list {
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		max-inline-size: 40rem;
		margin: 0 auto;
		padding: 0;
		list-style: none;
	}

	.app-nav__link {
		display: grid;
		place-items: center;
		block-size: var(--nav-height);
		font-size: 0.85rem;
		font-weight: 600;
		text-decoration: none;
		color: var(--color-muted);
		border-block-start: 3px solid transparent;

		&[aria-current='page'] {
			color: var(--color-accent);
			border-block-start-color: var(--color-accent);
		}

		&:focus-visible {
			outline-offset: -3px;
		}
	}
</style>
