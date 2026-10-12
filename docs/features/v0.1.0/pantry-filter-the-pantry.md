---
title: Filter the pantry
summary: "The shopper shows only the food that is low, the food to use soon, the food that is out, or the food of one place."
parent: pantry-stories.md
persona: Shopper
depends-on:
  [
    pantry-see-the-level.md,
    pantry-see-the-food-to-use-soon.md,
    pantry-see-the-food-that-is-out.md,
  ]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / Filter the pantry

# Filter the pantry

As the [shopper](../../personas.md), I want to show only one kind of food with one tap, so that I do not scroll through the full pantry in the store.

## Requirements

1. Tap a chip to show only one kind of food
   - a. "Low": the lines of the food items that are low
   - b. "Use soon": the lines that are soon
   - c. "Out": the food items with no row
   - d. One chip for each place of the pantry: the lines of that place
2. One filter is on at a time
   - a. A tap on a second chip puts the first chip off
   - b. A tap on the chip that is on puts it off
   - c. The chip that is on shows a check mark
3. The chips are in one row
   - a. The row scrolls to the side when it is longer than the screen
4. The group "Out" shows only with the filter "Out", or with no filter
5. The filter works together with the text of the field "Find food"
   - a. A line shows only when it passes the two
6. When no line passes the filter, the pantry tells that
   - a. With no text in the field "Find food", the text is "No food passes this filter."
7. A place with no food left has no chip
   - a. If the filter of that place was on, it goes off

## Acceptance criteria

Each criterion starts with the test vault in the state in which it starts, with the setting "Low line" at 25%, and with the date 2026-10-11.

1. GIVEN no chip is on WHEN the shopper taps "Low" THEN the pantry shows only the lines of flour and of ginger
   - a. AND the chip "Low" shows a check mark
2. GIVEN no chip is on WHEN the shopper taps "Use soon" THEN the pantry shows 5 lines
3. GIVEN no chip is on WHEN the shopper taps "Out" THEN the pantry shows only the lines "Milk" and "Taco seasoning"
4. GIVEN no chip is on WHEN the shopper taps "Outside fridge" THEN the pantry shows 3 lines
   - a. AND the group "Out" does not show
5. GIVEN the test vault WHEN the shopper opens the part "Pantry" THEN the row of chips has one chip for each of the 6 places
6. GIVEN the chip "Low" is on WHEN the shopper taps "Outside fridge" THEN the chip "Low" is off
   - a. AND the chip "Outside fridge" is on
7. GIVEN the chip "Out" is on WHEN the shopper taps "Out" THEN the pantry shows all lines
8. GIVEN the chip "Kitchen fridge" is on WHEN the shopper types "egg" in the field "Find food" THEN the pantry shows 1 line: eggs with "4"
9. GIVEN no food item is out and the field "Find food" is empty WHEN the shopper taps "Out" THEN the pantry shows "No food passes this filter."
10. GIVEN the chip "Freezer" is on WHEN the keeper uses up the one row of the freezer THEN the pantry has no chip "Freezer"
    - a. AND no chip is on

## Depends on

- [See the level of a food item](pantry-see-the-level.md): the rule for "Low".
- [See the food to use soon](pantry-see-the-food-to-use-soon.md): the rule for "Use soon".
- [See the food that is out](pantry-see-the-food-that-is-out.md): the group "Out".

## Architecture

- [Pantry](../../architecture/pantry.md): what the pantry shows, and why.
