---
title: Find a food item
summary: "The shopper types a name, a brand, or a different name of a food, and sees at once if the pantry has it."
parent: pantry-stories.md
updated: 2026-10-18
persona: Shopper
depends-on:
  [
    pantry-see-the-food-of-each-place.md,
    pantry-add-food.md,
    pantry-see-the-food-that-is-out.md,
  ]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Find a food item

# Find a food item

As the [shopper](../../personas.md), I want to type a name, a brand, or a different name of a food, so that I know in the store if I have it.

## Requirements

1. Type in the field "Find food" to show only the lines that agree with the text
   - a. The pantry changes while you type
   - b. Capital letters and small letters are equal
   - c. A part of a word is sufficient
2. The text finds a food item by its name, its other names, and its brands
   - a. The name of the note
   - b. Each text of the property `aliases`
   - c. Each name of the section "Brands", with the rules of [See the brands of a food item as photos](../v0.5.0/brands-see-the-brands-as-photos.md) (changed in version 0.5.0)
3. The text finds a food item that is out
   - a. Its line shows in the group "Out"
4. Tap the cross in the field to remove the text
   - a. The cross shows only when the field has text
   - b. The field keeps the focus
5. When no food agrees, the pantry offers to add the food
   - a. The text is `No food has the name "…".`, with the text of the field
   - b. The button "Add it to the pantry" opens the form "Add to pantry", with the text of the field as the name

## Acceptance criteria

Each criterion starts with the test vault in the state in which it starts, and with no filter on.

1. GIVEN the part "Pantry" is open WHEN the shopper types "pasta" in the field "Find food" THEN the pantry shows 3 lines
   - a. AND 2 of them are elbow pasta
   - b. AND 1 of them is shell pasta
2. GIVEN the part "Pantry" is open WHEN the shopper types "PASTA" THEN the pantry shows 3 lines
3. GIVEN the part "Pantry" is open WHEN the shopper types "gin" THEN the pantry shows 1 line: ginger
4. GIVEN the part "Pantry" is open WHEN the shopper types "macaroni" THEN the pantry shows the 2 lines of elbow pasta
5. GIVEN the part "Pantry" is open WHEN the shopper types "brand c" THEN the group "Out" shows the line "Taco seasoning"
   - a. AND the pantry shows no other line
6. GIVEN the field "Find food" is empty WHEN the shopper types "p" THEN the field shows a cross
7. GIVEN the field has the text "pasta" WHEN the shopper taps the cross THEN the field is empty
   - a. AND the pantry shows all lines
   - b. AND the field has the focus
8. GIVEN the part "Pantry" is open WHEN the shopper types "quinoa" THEN the pantry shows `No food has the name "quinoa".`
   - a. AND the button "Add it to the pantry"
9. GIVEN the pantry shows `No food has the name "quinoa".` WHEN the shopper taps "Add it to the pantry" THEN the form "Add to pantry" shows with "quinoa" in the name field

## Depends on

- [See the food of each place](pantry-see-the-food-of-each-place.md): the lines that the text selects.
- [See the food that is out](pantry-see-the-food-that-is-out.md): the group that the text also searches.
- [Add food](pantry-add-food.md): the form that the button opens.

## Architecture

- [Food item note](../../architecture/food-item-note.md): the property with the other names, and the section "Brands".
