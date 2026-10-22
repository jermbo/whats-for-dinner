import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import type { ShoppingRow } from '../../shop/shopping-list';

// The rows of the list and of the cart, as the screen shows them while a tick or an undo moves
// them. The vault gets the change some time after the write, but a row must leave and come back
// in one frame, so that the rows around it glide. So the screen keeps each move until the kitchen
// shows it.
export class ShopMoves {
	// Ticked rows that fade in their place. They are not in the cart yet.
	readonly ticking = new SvelteSet<string>();
	// Items whose name is in the air. The cart counts an item when its name lands.
	readonly flying = new SvelteSet<string>();
	// Rows that come back to the list, and show their tick for one moment.
	readonly back = new SvelteSet<string>();
	private readonly moves = new SvelteMap<string, { row: ShoppingRow; to: 'cart' | 'list' }>();

	constructor(private readonly source: () => { list: ShoppingRow[]; cart: ShoppingRow[] }) {}

	readonly list = $derived.by(() => {
		const { list } = this.source();
		const rows = list.filter((row) => this.moves.get(row.key)?.to !== 'cart');
		// A row that comes back takes its place by name, as the list of the kitchen has it.
		for (const [key, { row, to }] of this.moves) {
			if (to !== 'list' || rows.some((one) => one.key === key)) continue;
			const at = rows.findIndex((one) => one.name.localeCompare(row.name) > 0);
			rows.splice(at === -1 ? rows.length : at, 0, row);
		}
		return rows;
	});

	// A row that goes into the cart is at its end, as its task in the note.
	readonly cart = $derived.by(() => {
		const { cart } = this.source();
		const rows = cart.filter((row) => this.moves.get(row.key)?.to !== 'list');
		for (const [key, { row, to }] of this.moves) {
			if (to === 'cart' && !rows.some((one) => one.key === key)) rows.push(row);
		}
		return rows;
	});

	readonly toGet = $derived(this.list.length - this.ticking.size);
	readonly inCart = $derived(this.cart.filter((row) => !this.flying.has(row.key)).length);

	move(row: ShoppingRow, to: 'cart' | 'list') {
		this.moves.set(row.key, { row, to });
	}

	// The write failed, so the row goes back to where the kitchen has it.
	forget(key: string) {
		this.moves.delete(key);
	}

	// A move that the kitchen shows is not needed any more.
	settle() {
		const { list, cart } = this.source();
		for (const [key, { to }] of this.moves) {
			const there = to === 'cart' ? cart : list;
			if (there.some((row) => row.key === key)) this.moves.delete(key);
		}
	}
}
