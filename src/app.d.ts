// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// The Barcode Detection API is not in the TypeScript library yet.
	// https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API
	class BarcodeDetector {
		constructor(options?: { formats?: string[] });
		detect(source: ImageBitmapSource): Promise<{ rawValue: string }[]>;
	}
}

export {};
