// Divides the lines of a note into blocks. This is the part of CommonMark that a recipe needs.

// `start` and `end` are line numbers. `end` is the first line after the block.
export type Block =
	| { type: 'heading'; level: number; text: string; start: number; end: number }
	| { type: 'rule'; start: number; end: number }
	// `starts` has the first line of each item.
	| { type: 'list'; items: string[]; starts: number[]; start: number; end: number }
	| { type: 'paragraph'; text: string; start: number; end: number }
	| { type: 'other'; start: number; end: number };

const HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/;
const RULE = /^ {0,3}(?:(?:-[ \t]*){3,}|(?:\*[ \t]*){3,}|(?:_[ \t]*){3,})$/;
// A line of "=" or "-" below a paragraph makes that paragraph a heading.
const UNDERLINE = /^ {0,3}(=+|-+)[ \t]*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const QUOTE = /^ {0,3}>/;
const ITEM = /^( {0,3})([-+*]|\d{1,9}[.)])(?:[ \t]+(.*))?$/;

const isBlank = (line: string) => line.trim() === '';
const indentOf = (line: string) => line.replace(/\t/g, '    ').search(/\S|$/);
const isItem = (line: string) => ITEM.test(line) && !RULE.test(line);
const startsBlock = (line: string) =>
	HEADING.test(line) || RULE.test(line) || FENCE.test(line) || QUOTE.test(line);

// The first line with text at or after `from`.
function nextText(lines: string[], from: number) {
	let i = from;
	while (i < lines.length && isBlank(lines[i])) i++;
	return i;
}

export function readBlocks(lines: string[]): Block[] {
	const blocks: Block[] = [];
	let i = nextText(lines, 0);

	while (i < lines.length) {
		const block = readBlock(lines, i);
		blocks.push(block);
		i = nextText(lines, block.end);
	}
	return blocks;
}

function readBlock(lines: string[], start: number): Block {
	const line = lines[start];

	const heading = HEADING.exec(line);
	if (heading) {
		const text = (heading[2] ?? '').trim();
		return { type: 'heading', level: heading[1].length, text, start, end: start + 1 };
	}
	if (RULE.test(line)) return { type: 'rule', start, end: start + 1 };

	const fence = FENCE.exec(line);
	if (fence) return { type: 'other', start, end: endOfFence(lines, start, fence[1]) };
	if (QUOTE.test(line)) return { type: 'other', start, end: endOfText(lines, start) };
	if (indentOf(line) >= 4) return { type: 'other', start, end: endOfText(lines, start) };

	if (isItem(line)) return readList(lines, start);
	return readParagraph(lines, start);
}

function endOfText(lines: string[], start: number) {
	let i = start;
	while (i < lines.length && !isBlank(lines[i])) i++;
	return i;
}

function endOfFence(lines: string[], start: number, open: string) {
	const close = new RegExp(`^ {0,3}${open[0]}{${open.length},}[ \\t]*$`);
	let i = start + 1;
	while (i < lines.length && !close.test(lines[i])) i++;
	return Math.min(i + 1, lines.length);
}

// A list item stops a paragraph only if it has text and is a bullet or the number 1.
function stopsParagraph(line: string) {
	const item = ITEM.exec(line);
	return Boolean(item?.[3]?.trim()) && /^([-+*]|1[.)])$/.test(item![2]);
}

function readParagraph(lines: string[], start: number): Block {
	const text = [lines[start].trim()];
	let i = start + 1;

	for (; i < lines.length && !isBlank(lines[i]); i++) {
		const underline = UNDERLINE.exec(lines[i]);
		if (underline) {
			const level = underline[1][0] === '=' ? 1 : 2;
			return { type: 'heading', level, text: text.join(' '), start, end: i + 1 };
		}
		if (startsBlock(lines[i]) || stopsParagraph(lines[i])) break;
		text.push(lines[i].trim());
	}
	return { type: 'paragraph', text: text.join('\n'), start, end: i };
}

function readList(lines: string[], start: number): Block {
	const items: string[] = [];
	const starts: number[] = [];
	let i = start;

	while (i < lines.length && isItem(lines[i])) {
		starts.push(i);
		const [, indent, marker, first = ''] = ITEM.exec(lines[i])!;
		// The text of an item continues on lines with an indent to this column or more.
		const column = indent.length + marker.length + 1;
		const text = [first];
		i++;

		while (i < lines.length) {
			if (isBlank(lines[i])) {
				const next = nextText(lines, i);
				if (next === lines.length || indentOf(lines[next]) < column) break;
				i = next;
			} else if (indentOf(lines[i]) < column && (isItem(lines[i]) || startsBlock(lines[i]))) {
				break;
			}
			text.push(lines[i].trim());
			i++;
		}
		items.push(text.join(' ').trim());

		// A blank line between two items does not end the list.
		const next = nextText(lines, i);
		if (next < lines.length && isItem(lines[next])) i = next;
	}
	return { type: 'list', items, starts, start, end: i };
}
