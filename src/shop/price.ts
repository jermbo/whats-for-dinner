// A price is what you paid for the full amount of an item. It is a number with no currency. You
// type it, so a comma is a decimal mark too, as in an amount.

const NUMBER = /^(\d+([.,]\d*)?|[.,]\d+)$/;

// Null: the text is not a price. An item with such a text has a missing price.
export function readPrice(text: string): number | null {
	const clean = text.trim();
	return NUMBER.test(clean) ? Number(clean.replace(',', '.')) : null;
}

// The price as a receipt has it, with 2 decimals: "0.5" is "0.50". A missing price is no text.
export function showPrice(text: string): string {
	return readPrice(text)?.toFixed(2) ?? '';
}
