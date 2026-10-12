import { SvelteSet } from 'svelte/reactivity';

// What the bar of one part remembers: open or closed, the text, the sequence, and the filters. The
// kitchen keeps one for each part while its tab is open, so that a part is as you left it.
export class BarState<Sort extends string, Only extends string> {
	open = $state(false);
	// The text that finds a line.
	find = $state('');
	sort = $state<Sort>() as Sort;
	// The filters that are on. A line shows only if it passes each of them.
	only = new SvelteSet<Only>();
	// The one place or type that is on. A line has one of them, so two cannot be on together.
	one = $state<string | null>(null);

	// The sequence is the one that the part starts with.
	constructor(sort: Sort) {
		this.sort = sort;
	}

	// Puts a filter on, or puts it off when it is on.
	flip(only: Only) {
		if (!this.only.delete(only)) this.only.add(only);
	}

	pick(one: string) {
		this.one = this.one === one ? null : one;
	}

	// Puts each filter off. The text and the sequence stay.
	clear() {
		this.only.clear();
		this.one = null;
	}
}
