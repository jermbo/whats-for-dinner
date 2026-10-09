// Each record has a unique ID and a "last changed" time, so that sync is possible later.

/**
 * A new unique ID: a version 4 UUID.
 * A browser gives `crypto.randomUUID` only to a page with a secure address: HTTPS or localhost.
 * A phone that opens the dev server by its network address, with HTTP, does not have it. Then
 * the ID is made from random bytes, in the same form.
 */
export function newId() {
	if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();

	const bytes = crypto.getRandomValues(new Uint8Array(16));
	// The two fixed fields of a version 4 UUID: the version, and the variant.
	bytes[6] = (bytes[6] & 0x0f) | 0x40;
	bytes[8] = (bytes[8] & 0x3f) | 0x80;
	const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
	return [
		hex.slice(0, 8),
		hex.slice(8, 12),
		hex.slice(12, 16),
		hex.slice(16, 20),
		hex.slice(20)
	].join('-');
}

export const now = () => new Date().toISOString();
