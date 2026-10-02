import { onNavigate } from '$app/navigation';

/**
 * Makes each change of page a view transition: the old page goes out, the new page comes in,
 * and elements with the same view-transition-name move from the old place to the new place.
 * A browser without view transitions, or a person who asks for reduced motion, gets a plain change.
 * Call it during the setup of the root layout.
 */
export function usePageTransitions() {
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
}
