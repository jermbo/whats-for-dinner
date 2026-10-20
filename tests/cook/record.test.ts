import { describe, expect, it } from 'vitest';
import { addRecord } from '../../src/cook/record';

const OMELETTE = `# Spinach omelette

*breakfast, vegetarian, fast*

**1 serving**

---

- *3* eggs
- *50 g* spinach

---

1. Beat the eggs with salt and pepper.
2. Put the cheese on one half. Fold the omelette and serve.
`;

const RECORD = { date: '2026-10-20', rating: 4, note: '', photo: null };

describe('the record of a meal', () => {
	it('the spinach omelette with no heading "Cooked" ends with that heading and one line of 2026-10-20 with 4 stars', () => {
		expect(addRecord(OMELETTE, true, RECORD).endsWith('\n\n## Cooked\n\n- 2026-10-20 · ★★★★☆\n')).toBe(
			true
		);
	});

	it('the text of the spinach omelette above the record stays the same text', () => {
		expect(addRecord(OMELETTE, true, RECORD).startsWith(OMELETTE.trimEnd())).toBe(true);
	});

	it('a second record of the spinach omelette gives the heading "Cooked" 2 lines', () => {
		const once = addRecord(OMELETTE, true, RECORD);
		const twice = addRecord(once, true, { ...RECORD, date: '2026-10-27', rating: 5 });
		expect(twice.split('## Cooked\n\n')[1]).toBe('- 2026-10-20 · ★★★★☆\n- 2026-10-27 · ★★★★★\n');
	});
});
