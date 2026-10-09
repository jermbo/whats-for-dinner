import { sideColumn } from './side-column';

// A card that opens from a row is a dialog. On a page with one column, it is a modal sheet above
// the page. On a page with a side column, it is a panel in that column, and the page stays in
// use next to it. Put the dialog in the "split__side" element.

/**
 * True when the card is open as a panel in the side column.
 * @param {HTMLDialogElement} dialog
 */
export function isPanel(dialog) {
	return dialog.open && !dialog.matches(':modal');
}

/**
 * Opens a card that is closed: as a panel when the page has a side column, and as a sheet when
 * it has none.
 * @param {HTMLDialogElement} dialog
 */
export function openSheetOrPanel(dialog) {
	if (sideColumn(dialog)) dialog.show();
	else dialog.showModal();
}

/**
 * In a narrow window, the page has no side column: a panel has no place, and it closes.
 * Call it when the size of the window changes.
 * @param {HTMLDialogElement} dialog
 */
export function closeLostPanel(dialog) {
	if (isPanel(dialog) && !sideColumn(dialog)) dialog.close();
}
