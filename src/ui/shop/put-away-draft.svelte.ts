import { SvelteMap } from 'svelte/reactivity';
import { priceOfBrand, type CartItem, type Facts } from '../../shop/facts';
import { partsOfLineKey } from '../../shop/package-lines';

// What you gave in the stage Put away, before the button writes it. The kitchen keeps it while its
// tab is open, so that a different stage or part does not lose a price that you typed.
export class PutAwayDraft {
	// The facts that you changed, by the key of the line: one package of an item.
	private changes = new SvelteMap<string, Partial<Facts>>();

	// A fact that you changed is yours. Each other fact is as the plugin proposes it now. A different
	// brand has its own price, unless you typed a price.
	factsOf(key: string, item: CartItem, start: Facts): Facts {
		const change = this.changes.get(key);
		const facts = { ...start, ...change };
		if (change?.brand !== undefined && change.price === undefined) {
			facts.price = priceOfBrand(item, facts.brand);
		}
		return facts;
	}

	// The fact is the proposal of the plugin again.
	forget(key: string, fact: keyof Facts) {
		const change = { ...this.changes.get(key) };
		delete change[fact];
		this.changes.set(key, change);
	}

	// A line that goes out moves the numbers of the lines after it. The receipt has their facts, so
	// the lines of the item start again from it.
	forgetItem(item: string) {
		for (const key of [...this.changes.keys()]) {
			if (partsOfLineKey(key).item === item) this.changes.delete(key);
		}
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
