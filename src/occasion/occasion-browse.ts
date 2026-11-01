// The rows of the Occasions part: "Next up" first, then the other occasions with a filter and a
// sequence, as the chips set them.

import { isPast, type Occasion } from './occasions';

export type Only = 'upcoming' | 'past' | 'all';
export type Sort = 'near' | 'new' | 'name';

const far = (occasion: Occasion) => occasion.date ?? '9999-12-31';

// The nearest occasion that is not past. A note with no date comes after each note with a date.
export function nextUp(occasions: Occasion[], today: string): Occasion | null {
	const upcoming = occasions.filter((occasion) => !isPast(occasion, today));
	return (
		[...upcoming].sort((a, b) => far(a).localeCompare(far(b)) || a.name.localeCompare(b.name))[0] ??
		null
	);
}

// Nearest first: the upcoming ones by date, then the past ones, the newest first.
function compare(sort: Sort, today: string) {
	return (a: Occasion, b: Occasion) => {
		if (sort === 'name') return a.name.localeCompare(b.name);
		if (sort === 'new') return far(b).localeCompare(far(a));
		const pastA = isPast(a, today);
		if (pastA !== isPast(b, today)) return pastA ? 1 : -1;
		return pastA ? far(b).localeCompare(far(a)) : far(a).localeCompare(far(b));
	};
}

export function occasionRows(
	occasions: Occasion[],
	today: string,
	only: Only,
	sort: Sort,
	skip: string | null
): Occasion[] {
	return occasions
		.filter((occasion) => occasion.path !== skip)
		.filter((occasion) => only === 'all' || isPast(occasion, today) === (only === 'past'))
		.sort(compare(sort, today));
}
