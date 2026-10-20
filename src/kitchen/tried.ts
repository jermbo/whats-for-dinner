import { Notice } from 'obsidian';

// A write of the vault can fail, for example when the disk is full. The screen stays as it was,
// so that you can try again, and the notice tells you why.
export async function triedFor<T>(what: string, action: () => Promise<T>, failed: T): Promise<T> {
	try {
		return await action();
	} catch (error) {
		new Notice(`${what}. ${error instanceof Error ? error.message : String(error)}`);
		return failed;
	}
}

// True when the action did its write.
export function tried(what: string, action: () => Promise<unknown>): Promise<boolean> {
	return triedFor(
		what,
		async () => {
			await action();
			return true;
		},
		false
	);
}
