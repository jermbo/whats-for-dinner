/** The button for the packages goes back to one after this number. */
const MAX_PACKAGES = 6;

/**
 * The number of packages that the button for the packages sets next: 2, 3, and so on, then 1.
 * @param {number} packages
 */
export function nextPackages(packages) {
	return packages >= MAX_PACKAGES ? 1 : packages + 1;
}
