# UI prototype

Some variants of one part of the kitchen, in the plugin, with a small bar to change between them. The owner sees them on the phone, with the notes of the test vault.

If the question is about a rule or a state, use [LOGIC.md](LOGIC.md).

## Why the variants are in the plugin

A variant alone on an empty page looks good each time. Next to the real head, the real rows, and the real number of foods, you see its problems. So a variant is in the part that it is for.

## Steps

1. **Write the question and the number of variants.** Three is the usual number. More than five is noise.
2. **Make the variants.** Each one is its own component, in a folder `prototype/` next to the component that it replaces.
3. **Add the switch.** One small component shows the screen of today or one of the variants. The selected variant is in memory.
4. **Add the bar**, at the bottom of the part.
5. **Tell the owner** which part to open, and the name of each variant.
6. **Write the verdict**, and remove the variants, the switch, and the bar.

## Rules for a variant

- Variants differ in their structure: the layout, what comes first, the main control. Three grids of cards with different colours are one variant.
- Each variant uses the `--wfd-*` tokens and the pieces of `src/ui/parts/`. Then the difference is the structure, not the paint.
- Share little. A shared button is good. A shared layout decides the structure for all variants.
- A variant reads the real state, and writes to no note.
- If the question is about how a change feels, the motion is part of the variant.

## The bar

- It has three controls: previous, the name of the variant, and next. The name is a letter and some words: "B: one row".
- The first option is "Today": the screen as it is, so that the owner can compare.
- It looks different from the design, so that nobody takes it for a piece of a variant.
- Each control is large enough for a thumb.
- It shows only when `import.meta.env.MODE` is `development`. That is the mode of `npm run dev`, so a build for use never has the bar.

## What to listen for

The owner says "the head of B with the rows of C". That is the design that the owner wants, and it is a better answer than "B".

## Do not

- Do not make variants that differ only in a colour or a text.
- Do not move the file of the variant that won into the plugin. Write it new, in its story.
