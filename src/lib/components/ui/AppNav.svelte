<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Icon from './Icon.svelte';

	const links = /** @type {const} */ ([
		{ path: '/', label: 'Today', icon: 'today' },
		{ path: '/menu', label: 'Menu', icon: 'menu' },
		{ path: '/shop', label: 'Shop', icon: 'shop' },
		{ path: '/pantry', label: 'Pantry', icon: 'pantry' },
		{ path: '/recipes', label: 'Recipes', icon: 'recipes' },
		{ path: '/more', label: 'More', icon: 'more' }
	]);

	/** @param {(typeof links)[number]['path']} path */
	function isCurrent(path) {
		const current = page.url.pathname;
		const href = resolve(path);
		return path === '/' ? current === href : current.startsWith(href);
	}
</script>

<nav class="app-nav" aria-label="Main">
	<p class="app-nav__brand">Meal Planner</p>
	<ul class="app-nav__list">
		{#each links as link (link.path)}
			<li class="app-nav__item">
				<a
					class="app-nav__link"
					href={resolve(link.path)}
					aria-current={isCurrent(link.path) ? 'page' : undefined}
				>
					<Icon name={link.icon} />
					<span class="app-nav__label">{link.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	/* Phone: a floating pill above the bottom edge of the screen, as in the design. */
	.app-nav {
		position: fixed;
		/* The navigation is always above the content of the screen. */
		z-index: 10;
		inset-inline: 0;
		inset-block-end: calc(var(--space-4) + env(safe-area-inset-bottom));
		inline-size: fit-content;
		max-inline-size: calc(100% - var(--space-4));
		margin-inline: auto;
		padding: var(--space-2);
		background: var(--color-surface);
		border: 1.5px solid var(--color-accent);
		border-radius: var(--radius-pill);
		box-shadow: var(--shadow);
		view-transition-name: app-nav;
	}

	.app-nav__brand {
		display: none;
	}

	.app-nav__list {
		display: flex;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.app-nav__link {
		display: grid;
		place-items: center;
		inline-size: var(--nav-height);
		block-size: var(--nav-height);
		text-decoration: none;
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 50%;
		transition:
			background-color 0.2s,
			scale 0.25s var(--ease-spring);

		&:active {
			scale: 0.9;
		}

		&[aria-current='page'] {
			color: var(--color-on-accent);
			background: var(--color-accent);
			border-color: var(--color-accent);
			/* The page transition moves this marker from the old item to the new item. */
			view-transition-name: nav-active;
		}
	}

	/* Phone: the label is only for screen readers. */
	.app-nav__label {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	@media (max-width: 24rem) {
		.app-nav__list {
			gap: var(--space-1);
		}

		.app-nav__link {
			inline-size: 2.875rem;
			block-size: 2.875rem;
		}
	}

	/* Desktop: a column on the left with an icon and a label for each item. */
	@media (min-width: 60rem) {
		.app-nav {
			position: sticky;
			inset: var(--space-8) auto auto;
			grid-column: 1;
			grid-row: 1;
			inline-size: 15rem;
			max-inline-size: none;
			margin: var(--space-8) 0 var(--space-8) var(--space-8);
			padding: var(--space-5);
			border: 0;
			border-radius: var(--radius);
		}

		.app-nav__brand {
			display: block;
			margin-block-end: var(--space-5);
			padding-inline: var(--space-3);
			font-family: var(--font-heading);
			font-size: 1.35rem;
			font-weight: 600;
		}

		.app-nav__list {
			flex-direction: column;
			gap: var(--space-1);
		}

		.app-nav__link {
			display: flex;
			justify-content: flex-start;
			gap: var(--space-3);
			inline-size: auto;
			block-size: var(--tap);
			padding-inline: var(--space-4);
			font-weight: 500;
			border-color: transparent;
			border-radius: var(--radius-pill);

			&:hover:not([aria-current='page']) {
				background: var(--color-surface-soft);
			}
		}

		.app-nav__label {
			position: static;
			inline-size: auto;
			block-size: auto;
			overflow: visible;
			clip-path: none;
		}
	}
</style>
