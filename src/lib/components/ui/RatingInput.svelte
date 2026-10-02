<script>
	/**
	 * A rating from 1 to 5 as stars. It is a group of radio buttons, so the keyboard and
	 * screen readers use it as one. A selected star has a fill. An empty star has only a line.
	 * @type {{ legend: string, value: number | null, onchange: (value: number) => void }}
	 */
	let { legend, value, onchange } = $props();

	const name = $props.id();
	const STARS = [1, 2, 3, 4, 5];
</script>

<fieldset class="rating">
	<legend class="rating__legend">{legend}</legend>

	<div class="rating__stars">
		{#each STARS as star (star)}
			<label class="rating__star">
				<input
					class="visually-hidden"
					type="radio"
					{name}
					value={star}
					checked={value === star}
					onchange={() => onchange(star)}
				/>
				<svg class="rating__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
					<path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9z" />
				</svg>
				<span class="visually-hidden">{star} of 5</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.rating {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.rating__legend {
		padding: 0;
		margin-block-end: var(--space-2);
		font-weight: 500;
	}

	.rating__stars {
		display: flex;
		gap: var(--space-1);
	}

	.rating__star {
		display: grid;
		place-items: center;
		inline-size: var(--tap);
		block-size: var(--tap);
		border-radius: 50%;
		cursor: pointer;
		transition: scale 0.3s var(--ease-spring);

		&:hover {
			scale: 1.15;
		}

		&:active {
			scale: 0.85;
		}

		&:has(:focus-visible) {
			outline: 3px solid var(--color-accent-strong);
			outline-offset: 2px;
		}
	}

	.rating__icon {
		inline-size: 2.25rem;
		fill: transparent;
		stroke: var(--color-text);
		stroke-width: 1.25;
		stroke-linejoin: round;
		transition: fill 0.2s;
	}

	/* A star has a fill when it is the selected star, or when a star after it is selected. */
	.rating__star:has(:checked) .rating__icon,
	.rating__star:has(~ .rating__star :checked) .rating__icon {
		fill: #ffb300;
	}

	.rating__star:has(:checked) .rating__icon {
		animation: pop 0.45s var(--ease-spring);
	}
</style>
