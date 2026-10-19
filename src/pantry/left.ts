// What is left in a package, as you see it. A measured package has a level: full, 3/4, 1/2, or 1/4.
// You do not know that a jug has 0.95 l in it, but you see a quarter. The weekly audit corrects a
// small error, so a level is exact enough.

const WORDS = new Map([
	[1, 'full'],
	[0.75, '3/4'],
	[0.5, '1/2'],
	[0.25, '1/4']
]);

// A level from the column `Left`, or null when the text is not a level.
export function readLevel(text: string): number | null {
	const word = text.trim().toLowerCase();
	for (const [level, name] of WORDS) if (name === word) return level;
	return null;
}

// The level that is nearest to a part of the package, and the middle of two levels goes up. A
// package with food in it is 1/4 or more, so that food that is there never shows as gone.
export function nearestLevel(part: number): number {
	if (part <= 0) return 0;
	return Math.min(1, Math.max(0.25, Math.floor(part * 4 + 0.5) / 4));
}

export const levelText = (level: number) => WORDS.get(level) ?? '0';
