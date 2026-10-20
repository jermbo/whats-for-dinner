<script lang="ts" module>
	import Field from '../parts/Field.svelte';
	export type Line = { id: number; text: string };

	export const linesOf = (texts: string[]): Line[] =>
		(texts.length ? texts : ['']).map((text, at) => ({ id: at + 1, text }));
</script>

<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';

	type Props = {
		label: string;
		// What an empty line shows, such as "200 g flour".
		hint: string;
		lines: Line[];
		// What the plugin read in a line. It shows below the line.
		result?: Snippet<[Line]>;
	};
	let { label, hint, lines = $bindable(), result }: Props = $props();

	const uid = $props.id();
	const duration = $derived(prefersReducedMotion.current ? 0 : 160);
	const fields = new Map<number, HTMLInputElement>();
	let next = Math.max(0, ...lines.map((line) => line.id)) + 1;

	function keep(field: HTMLInputElement, id: number) {
		fields.set(id, field);
		return { destroy: () => fields.delete(id) };
	}

	async function focus(id: number) {
		await tick();
		fields.get(id)?.focus();
	}

	// Enter gives the next empty line, as on paper. Backspace in an empty line takes it away.
	function onkeydown(event: KeyboardEvent, at: number) {
		if (event.key === 'Enter' && !event.isComposing) {
			event.preventDefault();
			const line = { id: next++, text: '' };
			lines.splice(at + 1, 0, line);
			void focus(line.id);
		} else if (event.key === 'Backspace' && !lines[at].text && lines.length > 1) {
			event.preventDefault();
			const before = lines[Math.max(0, at - 1)].id;
			lines.splice(at, 1);
			void focus(before);
		}
	}
</script>

<fieldset class="wfd-lines">
	<legend class="wfd-lines__label wfd-label">{label}</legend>
	<ol class="wfd-lines__list">
		{#each lines as line, at (line.id)}
			<li class="wfd-lines__line" transition:slide={{ duration }}>
				<Field>
					<input
						type="text"
						aria-label="{label}, line {at + 1}"
						placeholder={at === 0 ? hint : ''}
						enterkeyhint="next"
						autocomplete="off"
						id="{uid}-{line.id}"
						use:keep={line.id}
						bind:value={line.text}
						onkeydown={(event) => onkeydown(event, at)}
					/>
				</Field>
				{#if result && line.text.trim()}
					{@render result(line)}
				{/if}
			</li>
		{/each}
	</ol>
</fieldset>

<style>
	.wfd-lines {
		display: grid;
		gap: var(--wfd-space-group);
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.wfd-lines__label {
		margin-block-end: var(--wfd-space-group);
		padding: 0;
		color: var(--wfd-color-text-muted);
	}

	.wfd-lines__list {
		display: grid;
		gap: var(--wfd-space-group);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.wfd-lines__line {
		display: grid;
		gap: var(--wfd-space-tight);
	}
</style>
