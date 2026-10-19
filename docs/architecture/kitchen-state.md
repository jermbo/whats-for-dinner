# Kitchen state

The `Kitchen` class is what every screen reads and writes. The vault is the only source of truth: each action changes a note, Obsidian fires an event, and the kitchen reads the note again.

## Two layers

1. **`VaultBuffer`** (`src/kitchen/vault-buffer.ts`) — working copy of the vault. Maps and sets hold the latest read of each note (recipes, pantry, plan, trip, receipts). Only this module updates those maps.
2. **`Kitchen`** (`src/kitchen-state.svelte.ts`) — reactive fields the UI binds to (`notes`, `foods`, `trip`, `cart`, …), plus commands that write notes (plan, shop, pantry, cook).

After any read, forget, or full reload, `Kitchen.show()` calls `vault.snapshot()` and copies the result into the `$state` fields. UI code should use those fields, not the buffer maps.

## Derived data

Lists such as `recipes`, `cart`, and `suggestions` are `$derived` from the snapshot fields and settings. Pure helpers live in `src/kitchen/shop-read-model.ts`, `src/kitchen/meals-view.ts`, and `src/shop/` so new features can extend logic without growing the class.

## The part on the screen

`Kitchen.part` is the part that the kitchen shows: Pantry, Recipes, Plan, or Shop. It is on the class and not in the screen, so it stays when the tab closes. The class also writes it to the local storage of the vault (`app.saveLocalStorage`), so it stays after a restart. That storage is per device, so the phone and the desktop each open where they were. The rest of the state of a screen, such as the bars and Cook Mode, stays in the screen and starts again when the tab opens.

## Writes

Vault changes go through `src/kitchen/pantry-actions.ts`, `plan-actions.ts`, `shop-actions.ts`, and `cook-actions.ts`. `Kitchen` exposes the same public methods as before; each one forwards to the right module with a small host object (paths, trip, vault buffer, and so on).

## Adding a new note kind

1. Extend `noteKind()` in `src/kitchen/note-kind.ts`.
2. Handle the kind in `VaultBuffer.applyRead()`.
3. If the UI needs it, extend `VaultSnapshot` and `show()`.
4. Add write methods on `Kitchen` that modify the vault and rely on events to refresh the buffer.
