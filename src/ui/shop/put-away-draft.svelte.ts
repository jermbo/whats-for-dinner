import { SvelteMap } from 'svelte/reactivity';
import type { CartItem, Facts } from '../../shop/facts';

// What you gave in the stage Put away, before the button writes it. The kitchen keeps it while its
// tab is open, so that a different stage or part does not lose a price that you typed.
export class PutAwayDraft {
	// The facts that you changed, by the key of the item.
	private changes = new SvelteMap<string, Partial<Facts>>();

	// A fact that you changed is yours. Each other fact is as the plugin proposes it now.
	factsOf({ key, start }: CartItem): Facts {
		return { ...start, ...this.changes.get(key) };
	}

	// A fact that you gave yourself is not a guess of the plugin any more, also with the same value.
	changed(key: string, fact: keyof Facts): boolean {
		return this.changes.get(key)?.[fact] !== undefined;
	}

	change(key: string, change: Partial<Facts>) {
		this.changes.set(key, { ...this.changes.get(key), ...change });
	}

	// The trip is at its end, so the next trip starts with no change.
	clear() {
		this.changes.clear();
	}
}
