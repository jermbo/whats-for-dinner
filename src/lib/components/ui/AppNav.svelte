<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { useShopping } from '$lib/state/shopping.svelte';

	const links = /** @type {const} */ ([
		{ path: '/', label: 'Today' },
		{ path: '/menu', label: 'Menu' },
		{ path: '/shop', label: 'Shop' },
		{ path: '/pantry', label: 'Pantry' },
		{ path: '/recipes', label: 'Recipes' },
		{ path: '/more', label: 'More' }
	]);

	const shopping = useShopping();
	/** The number of items that the owner must still buy. */
	const toBuy = $derived(shopping.needed.length);

	/** @param {(typeof links)[number]['path']} path */
	function isCurrent(path) {
		const current = page.url.pathname;
		const href = resolve(path);
		return path === '/' ? current === href : current.startsWith(href);
	}
</script>

<nav class="app-nav" aria-label="Main">
	<p class="app-nav__brand">Larder</p>
	<ul class="app-nav__list">
		{#each links as link (link.path)}
			<li class="app-nav__item">
				<a
					class="app-nav__link"
					href={resolve(link.path)}
					aria-current={isCurrent(link.path) ? 'page' : undefined}
				>
					<span class="app-nav__label">{link.label}</span>
					{#if link.path === '/shop' && toBuy > 0}
						<span class="app-nav__count">
							{toBuy}
							<span class="visually-hidden">items to buy</span>
						</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	/* Phone: a flat bar at the bottom edge of the screen, with a heavy rule on top. */
	.app-nav {
		position: fixed;
		/* The navigation is always above the content of the screen. */
		z-index: 10;
		inset-inline: 0;
		inset-block-end: 0;
		padding-block-end: env(safe-area-inset-bottom);
		background: var(--paper);
		border-block-start: var(--rule-4) solid var(--ink);
		view-transition-name: app-nav;
	}

	.app-nav__brand {
		display: none;
	}

	.app-nav__list {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.app-nav__link {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-block-size: var(--nav-height);
		padding-inline: var(--space-1);
		font-size: 0.6875rem;
		font-weight: 800;
		letter-spacing: 0.04em;
		line-height: 1.15;
		text-transform: uppercase;
		text-decoration: none;
		transition: background-color 0.2s;

		&[aria-current='page'] {
			color: var(--paper);
			background: var(--ink);
			/* The page transition moves this marker from the old item to the new item. */
			view-transition-name: nav-active;
		}

		&:focus-visible {
			outline-offset: -5px;
			box-shadow: none;
		}
	}

	.app-nav__count {
		font-size: 0.8125rem;
	}

	/* Desktop: a column on the left. The name of the app is at the top. */
	@media (min-width: 60rem) {
		.app-nav {
			position: sticky;
			inset: 0 auto auto;
			grid-column: 1;
			grid-row: 1;
			align-self: start;
			display: flex;
			flex-direction: column;
			inline-size: 10.5rem;
			min-block-size: 100dvh;
			padding: var(--space-6) 0;
			border-block-start: 0;
			border-inline-end: var(--rule-4) solid var(--ink);
		}

		.app-nav__brand {
			display: block;
			margin-block-end: var(--space-5);
			padding-inline: var(--space-4);
			font-family: var(--font-display);
			font-size: 1.75rem;
			line-height: 0.9;
			text-transform: uppercase;
		}

		.app-nav__list {
			display: flex;
			flex-direction: column;
		}

		.app-nav__link {
			flex-direction: row;
			justify-content: space-between;
			gap: var(--space-3);
			min-block-size: var(--tap);
			padding-inline: var(--space-4);
			font-size: 0.875rem;
			letter-spacing: 0;
			text-transform: none;

			&:hover:not([aria-current='page']) {
				background: var(--paper-deep);
			}
		}

		.app-nav__count {
			font-size: 0.875rem;
		}
	}
</style>
