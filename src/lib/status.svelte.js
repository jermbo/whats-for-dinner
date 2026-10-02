// One short message for the last action. A live region reads it to screen readers.

let message = $state('');
/** @type {ReturnType<typeof setTimeout> | undefined} */
let timer;

export const status = {
	get message() {
		return message;
	},

	/** @param {string} text */
	say(text) {
		clearTimeout(timer);
		message = text;
		timer = setTimeout(() => (message = ''), 5000);
	}
};
