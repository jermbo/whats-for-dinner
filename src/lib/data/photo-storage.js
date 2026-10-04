import { db } from '$lib/db/db';
import { newId, now } from '$lib/util/ids';

/**
 * @typedef {import('$lib/types').Photo} Photo
 * @typedef {{ id: string, type: string, takenAt?: string, data: string }} PhotoText
 *   A photo as a backup file has it.
 */

/**
 * Stores a photo in the database on the phone.
 * @param {Blob} blob
 * @returns {Promise<string>} The ID of the photo.
 */
export async function savePhoto(blob) {
	const id = newId();
	await db.photos.add({ id, blob, takenAt: now() });
	return id;
}

/** @param {string} id */
export function getPhoto(id) {
	return db.photos.get(id);
}

/**
 * A photo as text, for a backup file. JSON can contain only text, so the bytes become base64.
 * @param {Photo} photo
 * @returns {Promise<PhotoText>}
 */
export function photoToText(photo) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(reader.error);
		reader.onload = () => {
			// The result is "data:image/jpeg;base64,…". The file keeps only the part after the comma.
			const data = String(reader.result).split(',')[1] ?? '';
			resolve({ id: photo.id, type: photo.blob.type, takenAt: photo.takenAt, data });
		};
		reader.readAsDataURL(photo.blob);
	});
}

/**
 * The reverse of "photoToText": the text of a backup file becomes a blob again.
 * @param {PhotoText} text
 * @returns {Photo}
 */
export function photoFromText(text) {
	const bytes = Uint8Array.from(atob(text.data), (letter) => letter.charCodeAt(0));
	/** @type {Photo} */
	const photo = { id: text.id, blob: new Blob([bytes], { type: text.type }) };
	if (text.takenAt) photo.takenAt = text.takenAt;
	return photo;
}
