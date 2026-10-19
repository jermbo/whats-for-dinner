---
title: Give a brand a verdict
summary: "A brand gets 'Buy again' or 'Avoid', and the photo in the store shows it."
parent: pantry-stories.md
updated: 2026-10-19
persona: Shopper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Give a brand a verdict

# Give a brand a verdict

As the [shopper](../../personas.md), I want each brand photo to show "Buy again" or "Avoid", so that I take the right package from the shelf in one look.

## Requirements

1. A brand has a verdict: "Buy again", "Avoid", or none (decision 16)
2. The note keeps the verdict after a middle dot in the list item of the brand (decision 34)
   - a. `- Brand A · buy again` and `- Brand B · avoid`
   - b. The plugin reads the words with capital or small letters
   - c. A brand with no name and a verdict is `- · avoid`, with its photo on the line below
3. The large view of a brand has two chips: "Buy again" and "Avoid" (decision 16)
   - a. A tap on a chip that is on puts it off
   - b. "Save" of the form writes the verdict, as it writes a name today
4. A photo in the Shop part and at put away shows the verdict (decision 16)
   - a. "Buy again" is an olive mark with a check. "Avoid" is a tomato mark with a cross
   - b. A brand with no verdict shows no mark
   - c. The mark has a text for a screen reader, not an `aria-label`

## Acceptance criteria

Each criterion starts with the vault of the [list page](pantry-stories.md#what-the-vault-needs).

1. GIVEN the large view of Brand A of taco seasoning WHEN the keeper taps "Buy again" and "Save" THEN `Taco seasoning.md` has the line `- Brand A · buy again`
   - a. AND the line of its photo is as before
2. GIVEN `- Brand B · avoid` in `Taco seasoning.md` WHEN taco seasoning is on the list in the Shop part THEN the photo of Brand B shows the tomato mark
   - a. AND the photo of Brand C shows no mark
3. GIVEN the large view of Brand B with "Avoid" on WHEN the keeper taps "Avoid" and "Save" THEN the line is `- Brand B`
4. GIVEN a line `- Brand A · BUY AGAIN` WHEN the plugin reads it THEN Brand A has the name "Brand A" and the verdict "Buy again"

## Depends on

Nothing. The brands of version 0.5.0 are there.

## Architecture

- [Brands](../../architecture/brands.md): the verdict, and its form in the note.
- [Food item note](../../architecture/food-item-note.md): the section "Brands".
- [Decision log: a simple pantry](../../initiatives/simple-pantry/decision-log.md): decisions 16 and 34.
