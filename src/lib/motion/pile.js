/**
 * How the cards lie in the hand. The top card is straight. Each card below it is a little lower,
 * smaller, and turned, so that its edge shows. The cards below the third card are hidden.
 */
const POSES = [
	{ x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 },
	{ x: -8, y: 16, rotation: -3.5, scale: 0.95, opacity: 1 },
	{ x: 10, y: 30, rotation: 3, scale: 0.9, opacity: 1 }
];
const HIDDEN = { x: 0, y: 40, rotation: 0, scale: 0.86, opacity: 0 };

/**
 * The pose of the card at a place in the pile. Place 0 is the top.
 * @param {number} place
 */
export function pose(place) {
	return POSES[place] ?? HIDDEN;
}
