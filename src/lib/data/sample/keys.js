// The IDs and the times of the sample records.
import { HOUR } from '$lib/util/time';

/** Each sample ID starts with this text, so that the app can remove the sample records again. */
export const SAMPLE_PREFIX = 'sample-';

/** @param {string} name */
export const id = (name) => `${SAMPLE_PREFIX}${name}`;

/** @param {number} hours */
export const hoursAgo = (hours) => new Date(Date.now() - hours * HOUR).toISOString();

/** @param {number} days */
export const daysAgo = (days) => hoursAgo(days * 24);
