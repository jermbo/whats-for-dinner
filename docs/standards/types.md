---
title: Types
summary: "Why the code has no `!` and few `as`, and how a value from outside gets a true type."
parent: code-standards.md
updated: 2026-11-01
---

[Wiki](../README.md) / [Code standards](code-standards.md) / Types

# Types

TypeScript checks the code against its types before it runs. This page tells how to keep each type true, so that the check finds a bug before the phone does.

## The problem: a type that you promise

`!` says "this value is not null". `as` says "this value has this type". The compiler trusts both, and checks nothing. When the promise is wrong, no error shows. The bug shows later, on the phone, far from the line that caused it.

## The rules

1. **No `any`.** A value with no type turns off each check that it touches.
2. **No `!`.** Check the value, and leave early when it is missing. Or give a default: `PHOTO_LINE.exec(line)?.[1] ?? ''`.
3. **`as` only for an element of the page.** An event handler knows its element from the markup: `event.currentTarget as HTMLInputElement`. Each other value gets a check.
4. **A type guard makes text a value.** A dropdown gives text. `isOption(FONTS, value)` tells the compiler that the text is a font, because it checked it.
5. **Check at the border.** A note, the data file, and a field of the settings give values from outside. The code checks them where they come in. After that the type is true. The [errors](errors.md) page tells what a bad value gives.
6. **A function asks only for what it reads.** `isAllPutAway` reads the key and the lines of an item of the cart, so it asks for `Pick<CartItem, 'key'>` with the lines. Then a test gives a small, complete value, and needs no cast.

`as const` is not a promise. It makes a type more exact, so it is correct.

## An example: the font of the settings

The settings tab has a dropdown with three fonts. Obsidian gives the selected option as text. The options are one object, `FONTS`, whose keys are the values of the setting. `isOption(FONTS, value)` checks that the text is one of those keys. Only then does the tab write the setting. A new font is one new line in `FONTS`, and the compiler checks the rest.

## Further reading

- [Errors](errors.md): what a reader gives when a value from a note is bad.
- [Unit tests](unit-tests.md): the tests that call a function with complete values.
