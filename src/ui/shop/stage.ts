import type { Kitchen } from '../../kitchen-state.svelte';

// The three moments of a trip, in their sequence: you decide the extras, you shop, and you put the
// food away.
export const STAGES = ['extras', 'shop', 'away'] as const;
export type Stage = (typeof STAGES)[number];

// With no suggestion, the first stage has nothing for you to do. With items in the cart, you are in
// the store, or you are back from it.
export const stageWithWork = (kitchen: Kitchen): Stage =>
	kitchen.suggestions.length && !kitchen.cart.length ? 'extras' : 'shop';
