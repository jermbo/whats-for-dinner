<script>
	/**
	 * How much of a character limit a text uses: the count, as "23/50", and a thin meter under the
	 * field. At the limit, both turn tomato, and screen readers hear that the limit is reached.
	 * Put it in a box with "position: relative", under or beside the field. Give the field the
	 * same "maxlength", and "aria-describedby" with the "id" of this count.
	 * @type {{ id: string, count: number, max: number }}
	 */
	let { id, count, max } = $props();

	const full = $derived(count >= max);
	const share = $derived(Math.min(1, count / max));
</script>

<span class={['char-count', full && 'char-count--full']} style:--share={share}>
	<span class="char-count__number" {id}>
		<span class="visually-hidden">{count} of {max} characters.</span>
		<span aria-hidden="true">{count}<span class="char-count__max">/{max}</span></span>
	</span>
	<span class="char-count__meter" aria-hidden="true"></span>
	<span class="visually-hidden" role="status">{full ? 'The limit is reached.' : ''}</span>
</span>

<style>
	/* The count lies at the right end of the field. The meter is the lower edge of the field. */
	.char-count {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.char-count__number {
		position: absolute;
		inset-block: 0;
		inset-inline-end: var(--space-4);
		display: flex;
		align-items: center;
		font-family: var(--font-display);
		font-size: 1.125rem;
		line-height: 1;
		font-variant-numeric: tabular-nums;
		transition: color 0.2s;
	}

	.char-count__max {
		opacity: 0.55;
	}

	/* The meter is a line of 4 px at the lower edge: it grows with the text. */
	.char-count__meter {
		position: absolute;
		inset-inline: 0;
		inset-block-end: 0;
		block-size: 4px;
		background: linear-gradient(
			to right,
			var(--ink) calc(var(--share) * 100%),
			transparent calc(var(--share) * 100%)
		);
		border-radius: 0 0 var(--radius-control) var(--radius-control);
		transition: background 0.2s;
	}

	.char-count--full {
		& .char-count__number {
			color: var(--tomato-text);
		}

		& .char-count__meter {
			background: var(--tomato);
		}
	}
</style>
