// The barcode reader of the browser. The WebView of Android has it, and Obsidian on a Mac has it
// too. The WebView of iOS does not. A package could read barcodes there, but the plugin adds no
// package for it now. So each device with the reader gets the scan, and other devices type as
// before.

type Found = { rawValue: string };
type Reader = { detect(source: ImageBitmapSource): Promise<Found[]> };
type ReaderClass = {
	new (options: { formats: string[] }): Reader;
	getSupportedFormats(): Promise<string[]>;
};

// The codes on food: EAN in most of the world, UPC in the United States.
const FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];

// Reads the first barcode in a frame of the camera or in a photo. Null: no barcode in it.
export type ReadBarcode = (source: ImageBitmapSource) => Promise<string | null>;

// The reader, or null when the device cannot read the codes on food. Chromium has the reader on
// each system, but on Windows and Linux it reads no format, so the formats tell, not the reader.
export async function barcodeReader(): Promise<ReadBarcode | null> {
	const Reader = (globalThis as unknown as { BarcodeDetector?: ReaderClass }).BarcodeDetector;
	if (!Reader) return null;
	const known = await Reader.getSupportedFormats().catch((): string[] => []);
	const formats = FORMATS.filter((format) => known.includes(format));
	if (!formats.length) return null;
	const reader = new Reader({ formats });
	return async (source) => {
		try {
			const [first] = await reader.detect(source);
			return first?.rawValue ?? null;
		} catch {
			return null;
		}
	};
}
