import type { Amount } from './types';

// The four forms of a number, in the sequence of the specification. The remainder is the unit.
const FRACTION = /^(-?)\s*(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)(.*)$/s;
const FRACTION_CHARACTER = /^(-?)\s*(\d+)?\s*([¼-¾⅐-⅞])(.*)$/s;
const DECIMAL = /^(-?)\s*(\d*)[.,](\d+)(.*)$/s;
const INTEGER = /^(-?)\s*(\d+)(.*)$/s;

// Unicode divides "½" into "1", a fraction slash, and "2".
const FRACTION_SLASH = '⁄';

export function parseAmount(text: string): Amount | null {
	const source = text.trim();
	let match: RegExpExecArray | null;
	let factor: number;

	if ((match = FRACTION.exec(source))) {
		factor = Number(match[2] ?? 0) + Number(match[3]) / Number(match[4]);
	} else if ((match = FRACTION_CHARACTER.exec(source))) {
		const [top, bottom] = match[3].normalize('NFKD').split(FRACTION_SLASH).map(Number);
		factor = Number(match[2] ?? 0) + top / bottom;
	} else if ((match = DECIMAL.exec(source))) {
		factor = Number(`${match[2] || 0}.${match[3]}`);
	} else if ((match = INTEGER.exec(source))) {
		factor = Number(match[2]);
	} else {
		return null;
	}

	if (!Number.isFinite(factor)) return null;
	if (match[1]) factor = -factor;
	const unit = match[match.length - 1].trim() || null;
	return { factor, unit, text: source };
}

const isDigit = (character: string | undefined) =>
	character !== undefined && character >= '0' && character <= '9';

// Divides a list of tags or yields. A comma between two digits is a decimal mark, not a separator.
export function splitList(text: string): string[] {
	const parts: string[] = [];
	let part = '';

	for (let i = 0; i < text.length; i++) {
		const isSeparator = text[i] === ',' && !(isDigit(text[i - 1]) && isDigit(text[i + 1]));
		if (isSeparator) {
			parts.push(part);
			part = '';
		} else {
			part += text[i];
		}
	}
	parts.push(part);

	return parts.map((item) => item.trim()).filter(Boolean);
}
