// Which photos the sample recipes and the sample cook sessions have. The photos themselves
// are drawn in "photos.js".
import { daysAgo, id } from './keys';

/**
 * The step photos: recipe key, step number, the days since each photo (oldest first), and the
 * place of the selected photo in that list.
 * The steps are different on purpose: one photo, two photos, and three photos. The step with
 * three photos is full, and its selected photo is not the first one: the next photo of that
 * step removes the oldest photo.
 * @type {[string, number, number[], number][]}
 */
const STEP_PHOTOS = [
	['chicken-bowl', 2, [13, 2], 0],
	['chicken-bowl', 4, [13], 0],
	['spaghetti', 2, [24, 17, 10], 1],
	['pancakes', 4, [8], 0],
	['fried-rice', 3, [6], 0],
	['lentil-soup', 4, [1], 0]
];

/**
 * The cook sessions that have a photo of the finished meal: recipe key and days ago.
 * Two recipes have more than one photo, so their pages have a carousel.
 * @type {[string, number][]}
 */
const FINISHED_PHOTOS = [
	['spaghetti', 24],
	['spaghetti', 17],
	['chicken-bowl', 13],
	['spaghetti', 10],
	['pancakes', 8],
	['fried-rice', 6],
	['chicken-bowl', 2],
	['lentil-soup', 1]
];

/**
 * The cover of each recipe that has a finished photo: recipe key, and the days of the cook
 * session of the photo. The cover is the first photo. For the spaghetti, the owner selected
 * the second photo.
 * @type {Record<string, number>}
 */
const COVERS = {
	'chicken-bowl': 13,
	spaghetti: 17,
	pancakes: 8,
	'fried-rice': 6,
	'lentil-soup': 1
};

/**
 * @param {string} key The key of the recipe.
 * @param {number} number The number of the step.
 * @param {number} days
 */
const stepPhotoId = (key, number, days) => id(`photo-step-${key}-${number}-${days}`);

/**
 * @param {string} key The key of the recipe.
 * @param {number} days
 */
const finishedPhotoId = (key, days) => id(`photo-finished-${key}-${days}`);

/**
 * The photos of one step of a sample recipe.
 * @param {string} key The key of the recipe.
 * @param {number} number The number of the step: 1 for the first step.
 * @returns {{ photoIds: string[], selectedPhotoId: string | null }}
 */
export function stepPhotos(key, number) {
	const row = STEP_PHOTOS.find(([recipe, step]) => recipe === key && step === number);
	if (!row) return { photoIds: [], selectedPhotoId: null };

	const photoIds = row[2].map((days) => stepPhotoId(key, number, days));
	return { photoIds, selectedPhotoId: photoIds[row[3]] };
}

/**
 * The ID of the cover of a sample recipe. Null: the recipe shows a placeholder.
 * @param {string} key The key of the recipe.
 */
export function coverPhoto(key) {
	return key in COVERS ? finishedPhotoId(key, COVERS[key]) : null;
}

/**
 * The ID of the finished photo of a sample cook session. Null: the session has no photo.
 * @param {string} key The key of the recipe.
 * @param {number} days
 */
export function finishedPhoto(key, days) {
	return FINISHED_PHOTOS.some(([recipe, at]) => recipe === key && at === days)
		? finishedPhotoId(key, days)
		: null;
}

/**
 * Each photo that "photos.js" must draw: its ID, its time, what it shows, and the words on it.
 * @param {Map<string, string>} names The name of each recipe, by its key.
 * @returns {{ id: string, takenAt: string, scene: 'step' | 'finished', lines: string[] }[]}
 */
export function cookPhotoList(names) {
	const steps = STEP_PHOTOS.flatMap(([key, number, list]) =>
		list.map((days, index) => ({
			id: stepPhotoId(key, number, days),
			takenAt: daysAgo(days),
			scene: /** @type {const} */ ('step'),
			lines: [names.get(key) ?? key, `Step ${number} · photo ${index + 1} of ${list.length}`]
		}))
	);

	const finished = FINISHED_PHOTOS.map(([key, days]) => ({
		id: finishedPhotoId(key, days),
		takenAt: daysAgo(days),
		scene: /** @type {const} */ ('finished'),
		lines: [names.get(key) ?? key, `${days} ${days === 1 ? 'day' : 'days'} ago`]
	}));

	return [...steps, ...finished];
}
