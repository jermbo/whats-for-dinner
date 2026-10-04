/**
 * Saves a form a moment after its last change, so that the form needs no Save button.
 * It also saves at once when the page goes out of view and when the component closes: a
 * phone can stop a page that is not in view.
 * Call it during component setup.
 * @template T
 * @param {() => T} read Reads the form. It must give a plain copy.
 * @param {(value: T) => Promise<unknown>} save
 * @param {number} [delay] The time after the last change, in milliseconds.
 * @returns {{ readonly pending: boolean, flush: () => Promise<void>, stop: () => void }}
 *   pending: a change waits. flush: save now. stop: save no more, for a record that is deleted.
 */
export function autosave(read, save, delay = 600) {
	/** The form as it was at the last save. A form that is the same is not saved again. */
	let last = JSON.stringify(read());
	let pending = $state(false);
	let stopped = false;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;
	/** Each save waits for the save before it, so that an old copy cannot win. */
	let queue = Promise.resolve();

	function flush() {
		clearTimeout(timer);
		if (!pending || stopped) return queue;

		const value = read();
		last = JSON.stringify(value);
		pending = false;
		queue = queue
			.then(() => save(value))
			.then(
				() => {},
				(error) => console.error(error)
			);
		return queue;
	}

	$effect(() => {
		const changed = JSON.stringify(read()) !== last;
		clearTimeout(timer);
		pending = changed;
		if (changed) timer = setTimeout(flush, delay);
	});

	$effect(() => {
		const hidden = () => {
			if (document.visibilityState === 'hidden') flush();
		};
		document.addEventListener('visibilitychange', hidden);
		return () => {
			document.removeEventListener('visibilitychange', hidden);
			flush();
		};
	});

	return {
		get pending() {
			return pending;
		},
		flush,
		stop() {
			stopped = true;
			clearTimeout(timer);
		}
	};
}
