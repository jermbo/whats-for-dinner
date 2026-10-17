// Working copy of what the vault says. Maps and sets hold the latest read of each note; `snapshot`
// turns them into the arrays and objects that Kitchen exposes as reactive state. Only this module
// writes the maps — see docs/architecture/kitchen-state.md.

import type { FoodNote, Note } from '../note';
import { readFoodItem } from '../pantry/food-item';
import { readPlan, type PlannedMeal } from '../plan/plan-note';
import { readProperties } from '../read-properties';
import { readRecipe } from '../recipemd/parse';
import { readReceipt, type Receipt } from '../shop/read-receipt';
import { lineOf, type ReceiptLine } from '../shop/receipt';
import { readTrip, type TripTask } from '../shop/shopping-note';
import { itemsOf } from '../shop/trip';
import { noteKind, type KitchenWhere, type NoteKind } from './note-kind';

export type ActiveReceipt = { path: string; lines: ReceiptLine[] };

export type VaultSnapshot = {
	notes: Note[];
	foods: FoodNote[];
	plan: PlannedMeal[];
	trip: ReturnType<typeof itemsOf>;
	itemNotes: string[];
	receipts: Receipt[];
	active: ActiveReceipt | null;
	tripStore: string;
};

export class VaultBuffer {
	notesByPath = new Map<string, Note>();
	foodsByPath = new Map<string, FoodNote>();
	planNow: PlannedMeal[] = [];
	tripNow: TripTask[] = [];
	tripStoreNow = '';
	itemPaths = new Set<string>();
	receiptsByPath = new Map<string, Receipt>();
	activePath: string | null = null;

	clear() {
		this.notesByPath.clear();
		this.foodsByPath.clear();
		this.planNow = [];
		this.tripNow = [];
		this.tripStoreNow = '';
		this.activePath = null;
		this.itemPaths.clear();
		this.receiptsByPath.clear();
	}

	forget(path: string, openNote: string, planPath: string) {
		if (path === planPath) this.planNow = [];
		if (path === openNote) {
			this.tripNow = [];
			this.tripStoreNow = '';
		}
		if (this.activePath === path) this.activePath = null;
		this.itemPaths.delete(path);
		this.receiptsByPath.delete(path);
		this.notesByPath.delete(path);
		this.foodsByPath.delete(path);
	}

	// Applies one note that was just read. `kind` is from `noteKind` at the time of the read.
	applyRead(path: string, kind: NoteKind, text: string, basename: string) {
		const { properties, body } = readProperties(text);

		if (kind === 'plan') {
			this.planNow = readPlan(text);
		} else if (kind === 'trip') {
			this.tripNow = readTrip(text);
			this.tripStoreNow = typeof properties.store === 'string' ? properties.store.trim() : '';
		} else if (kind === 'item') {
			this.itemPaths.add(path);
		} else if (kind === 'receipt') {
			const receipt = readReceipt(basename, properties, body);
			if (receipt) this.receiptsByPath.set(path, receipt);
			else this.receiptsByPath.delete(path);
			// The newest active receipt counts. A receipt that is complete is not active any more.
			if (receipt?.active) {
				if (!this.activePath || path > this.activePath) this.activePath = path;
			} else if (this.activePath === path) {
				this.activePath = null;
			}
		} else if (kind === 'food') {
			const item = readFoodItem(basename, properties, body);
			this.foodsByPath.set(path, { path, item });
		} else if (kind === 'recipe') {
			this.notesByPath.set(path, { path, result: readRecipe(text) });
		}
	}

	snapshot(_where: KitchenWhere, _openNote: string, pathOf: (link: string) => string): VaultSnapshot {
		const all = [...this.receiptsByPath.entries()];
		const receipts = all.flatMap(([, receipt]) => (receipt.active ? [] : [receipt]));
		const activeReceipt = this.activePath ? this.receiptsByPath.get(this.activePath) : undefined;
		const active =
			activeReceipt && this.activePath
				? { path: this.activePath, lines: activeReceipt.rows.map(lineOf) }
				: null;

		return {
			notes: [...this.notesByPath.values()],
			foods: [...this.foodsByPath.values()],
			plan: this.planNow,
			// A link can go to a different note after a change of the vault, so the paths are new each time.
			trip: itemsOf(this.tripNow, pathOf),
			tripStore: this.tripStoreNow,
			itemNotes: [...this.itemPaths],
			receipts,
			active
		};
	}
}

export { noteKind };
