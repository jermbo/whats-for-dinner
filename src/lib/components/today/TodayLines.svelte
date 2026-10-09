<script>
	import { collapse } from '$lib/motion/transitions';

	/** @typedef {import('$lib/domain/today-lines').TodayLine} TodayLine */

	/**
	 * The lines of tonight, at the top of the Today screen: a preparation that starts tonight,
	 * or a meal of tonight that is not prepared. Each line has its answers. A line is the
	 * reminder: the phone sends no message.
	 * @type {{
	 *   lines: TodayLine[],
	 *   ondone: (line: TodayLine) => void,
	 *   ontomorrow: (line: TodayLine) => void,
	 *   onorder: (line: TodayLine) => void
	 * }}
	 *   ondone: the owner started the preparation. ontomorrow: the owner starts the preparation
	 *   now, and cooks the meal tomorrow. onorder: the owner does not cook tonight.
	 */
	let { lines, ondone, ontomorrow, onorder } = $props();
</script>

{#if lines.length > 0}
	<ul class="today-lines" aria-label="For tonight">
		{#each lines as line (line.kind + line.entry.item.id)}
			<li class="today-line" transition:collapse>
				<p class="today-line__text">
					<span class="today-line__dot" aria-hidden="true"></span>
					<strong>{line.text}</strong>
					<span class="today-line__sub">{line.sub}</span>
				</p>
				<div class="today-line__answers">
					{#if line.kind === 'prep'}
						<button class="button button--strong" type="button" onclick={() => ondone(line)}>
							Done
						</button>
					{:else}
						<button class="button" type="button" onclick={() => onorder(line)}>Order in</button>
						<button class="button button--strong" type="button" onclick={() => ontomorrow(line)}>
							{line.frozen.length > 0 ? 'Thaw for tomorrow' : 'Prepare for tomorrow'}
						</button>
					{/if}
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.today-lines {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* A line on the paper, with a rule under it: the words at the left, the answers at the right. */
	.today-line {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2) var(--space-4);
		padding-block: var(--space-3);
		border-block-end: var(--rule-1) solid var(--ink);
	}

	.today-line__text {
		display: grid;
		flex: 1 1 12rem;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: baseline;
		gap: 0 var(--space-2);
		font-size: 1.0625rem;
		line-height: 1.25;
	}

	/* The amber of a thing that needs time. */
	.today-line__dot {
		inline-size: 0.625rem;
		block-size: 0.625rem;
		background: var(--amber);
		border-radius: 50%;
	}

	.today-line__sub {
		grid-column: 2;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--ink-soft);
	}

	.today-line__answers {
		display: flex;
		gap: var(--space-2);

		& .button {
			min-block-size: var(--tap);
			padding-inline: var(--space-4);
		}
	}
</style>
