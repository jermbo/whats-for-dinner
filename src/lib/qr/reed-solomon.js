// Reed-Solomon error correction: the bytes that let a camera repair a code that it did not
// read completely. The numbers are in the field GF(256) of the QR standard, where "add" is
// XOR and "multiply" is the function below.

/**
 * @param {number} a
 * @param {number} b
 * @returns {number} The product of two bytes in GF(256), with the polynomial 0x11D.
 */
function multiply(a, b) {
	let product = 0;
	for (let i = 7; i >= 0; i--) {
		product = (product << 1) ^ ((product >>> 7) * 0x11d);
		product ^= ((b >>> i) & 1) * a;
	}
	return product;
}

/**
 * The polynomial that the data is divided by: (x - 1)(x - 2)(x - 4)… with one factor for each
 * error correction byte. The first coefficient is 1 always, so the list does not have it.
 * @param {number} degree The count of error correction bytes.
 * @returns {number[]}
 */
export function divisor(degree) {
	const result = new Array(degree).fill(0);
	result[degree - 1] = 1;

	let root = 1;
	for (let i = 0; i < degree; i++) {
		for (let j = 0; j < degree; j++) {
			result[j] = multiply(result[j], root);
			if (j + 1 < degree) result[j] ^= result[j + 1];
		}
		root = multiply(root, 2);
	}
	return result;
}

/**
 * @param {number[]} data The data bytes of one block.
 * @param {number[]} by The result of "divisor".
 * @returns {number[]} The error correction bytes of the block: the remainder of the division.
 */
export function correction(data, by) {
	const result = new Array(by.length).fill(0);
	for (const byte of data) {
		const factor = byte ^ result.shift();
		result.push(0);
		by.forEach((coefficient, i) => (result[i] ^= multiply(coefficient, factor)));
	}
	return result;
}
