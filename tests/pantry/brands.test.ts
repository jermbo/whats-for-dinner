import { describe, expect, it } from 'vitest';
import { readBrands } from '../../src/pantry/brands';
import { changeBrands } from '../../src/pantry/write-brands';

const note = (lines: string) => `| Place | Left | Size | Use by |\n\n## Brands\n\n${lines}\n`;

describe('the barcode on the line of a brand', () => {
	it("`- Bush's · buy again · 039400016045` has the name, the verdict, and the barcode", () => {
		const [brand] = readBrands(note("- Bush's · buy again · 039400016045"));
		expect(brand).toMatchObject({ name: "Bush's", verdict: 'buy again', barcode: '039400016045' });
	});

	it('a brand with only a barcode is a brand with no name', () => {
		const [brand] = readBrands(note('- · 039400016045'));
		expect(brand).toMatchObject({ name: '', verdict: null, barcode: '039400016045' });
	});

	it('a number in the name is not a barcode: `- Brand 7`', () => {
		const [brand] = readBrands(note('- Brand 7'));
		expect(brand).toMatchObject({ name: 'Brand 7', barcode: null });
	});

	it('a new verdict from the form keeps the barcode of the line', () => {
		const text = changeBrands(note("- Bush's · 039400016045"), [
			{ is: 'change', at: 0, name: "Bush's", verdict: 'avoid', photo: null }
		]);
		expect(text).toContain("- Bush's · avoid · 039400016045");
	});

	it('a new brand from a scan with no photo is one line', () => {
		const text = changeBrands(note('- Store brand'), [
			{ is: 'add', name: "Bush's", verdict: null, photo: null, barcode: '039400016045' }
		]);
		expect(text).toContain("- Store brand\n- Bush's · 039400016045\n");
	});
});
