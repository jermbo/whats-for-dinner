// A staple is a food item that you always want, plan or no plan. Its kind tells how often you buy
// it, and thus when the plugin asks about it again.

export const KINDS = ['often', 'sometimes', 'seldom'] as const;
export type Kind = (typeof KINDS)[number];

// The days after a purchase at which the plugin asks about a staple again. "Often" has no time:
// the plugin asks at each trip.
export const ASK_AFTER: Record<Kind, number> = { often: 0, sometimes: 21, seldom: 60 };

// You can type the kind into the note, so capital and small letters are the same. A different
// value counts as no staple.
export function readKind(value: unknown): Kind | null {
	const text = typeof value === 'string' ? value.trim().toLowerCase() : '';
	return KINDS.find((kind) => kind === text) ?? null;
}

export const showKind = (kind: Kind) => kind.charAt(0).toUpperCase() + kind.slice(1);
