/**
 * Asks the browser to keep the data when disk space is low.
 * The device has the only copy of the data.
 * @returns {Promise<boolean>}
 */
export async function requestPersistence() {
	if (!navigator.storage?.persist) return false;
	if (await navigator.storage.persisted()) return true;
	return navigator.storage.persist();
}
