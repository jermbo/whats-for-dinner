---
title: Open or delete an occasion
summary: "From \"⋯\" on the ink card, the planner opens the note of an occasion, or deletes it to the trash."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: [occasion-see-an-occasion]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / Open or delete an occasion

# Open or delete an occasion

As the [planner](../../personas.md), I want to open the note of an occasion or delete it from the screen, so that I do not look for the note in the vault.

## Requirements

1. "⋯" on the ink card opens a small menu with "Open the note" and "Delete occasion"
   - a. A second tap on "⋯", or a tap outside the menu, closes it
2. "Open the note" opens the occasion note in a new tab of Obsidian
3. "Delete occasion" asks: "Delete <name>? The note goes to the trash."
   - a. "Delete" moves the note to the trash, as Obsidian does when you delete a note
   - b. "Keep it" closes the question, and nothing changes
4. After "Delete", the list of the occasions shows, with no row of that occasion

## Acceptance criteria

Each criterion starts with the occasion notes of the test vault, with the screen of "Thanksgiving 2026" open.

1. GIVEN the screen WHEN the planner taps "⋯" THEN the menu shows "Open the note" and "Delete occasion"
2. GIVEN the menu WHEN the planner taps "Open the note" THEN `Thanksgiving 2026.md` opens in a new tab
3. GIVEN the menu WHEN the planner taps "Delete occasion" THEN the menu asks "Delete Thanksgiving 2026? The note goes to the trash."
4. GIVEN the question WHEN the planner taps "Keep it" THEN the vault still has the note, and the screen of "Thanksgiving 2026" shows
5. GIVEN the question WHEN the planner taps "Delete" THEN the vault has no note `Larder/Occasions/Thanksgiving 2026.md`
   - a. AND the note is in the trash
   - b. AND the list of the occasions shows, with no "Thanksgiving 2026"

## Depends on

- [See an occasion](occasion-see-an-occasion.md): the ink card with "⋯".

## Architecture

- [Occasion](../../architecture/occasion.md): the screen of an occasion.
