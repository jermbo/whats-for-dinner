---
title: See the level of a food item
summary: 'The keeper sees on each line how much is left of the full amount, and which food is low.'
parent: pantry-stories.md
persona: Keeper
depends-on: [pantry-see-the-food-of-each-place.md]
status: built
updated: 2026-10-11
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry stories](pantry-stories.md) / See the level of a food item

# See the level of a food item

As the [keeper](../../personas.md), I want each line to show how much is left of the full amount, so that I see what gets low before it is out.

## Requirements

1. Each line with an amount that the plugin can count shows a bar
   - a. The length of the bar is the full amount of the food item
   - b. The dark part is the amount of this place
   - c. The light part is the amount of the other places
   - d. A tick marks the low line
   - e. A line with an amount that has no number shows no bar
   - f. A food item whose full amount is in a unit that no row has shows no bar
2. The full amount comes from the food item note
   - a. It is the property `full`
   - b. With no `full`, it is the amount that the pantry has
   - c. If the pantry has more than `full`, the full amount is what the pantry has
   - d. At a change of the rows, the plugin writes `full` when the note has none, or when the pantry has more
3. The low line comes from the note or from the settings
   - a. It is the property `low`
   - b. With no `low`, it is the percentage of the settings, of the full amount
   - c. A `low` that is more than the full amount counts as the full amount
   - d. A `low` in a unit that does not compare with the full amount is not used
4. A food item is low when all its places together have less than the low line
   - a. Each bar of the food item is amber
   - b. A screen reader reads "low" after the amount of the line
   - c. The head of the pantry shows the number of food items that are low
   - d. The head of a group shows the number of its lines that are low

## Acceptance criteria

Each criterion starts with the test vault in the state in which it starts, and with the setting "Low line" at 25%. Rice has a full amount of 5 kg, a low line of 1 kg, 500 g in "Kitchen pantry", and 2 kg in "Downstairs pantry".

1. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the bar of rice in "Kitchen pantry" has a dark part of 10% of its length
   - a. AND a light part of 40%
   - b. AND a tick at 20%
2. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the line of water shows no bar
3. GIVEN a food item with `full: 2 kg` and one row of "3 bags" WHEN the keeper opens the part "Pantry" THEN its line shows no bar
4. GIVEN a food item with no `full` and one row of 300 g WHEN the keeper opens the part "Pantry" THEN the dark part of its bar is 100% of the length
5. GIVEN flour has `full: 1 kg` and 200 g WHEN the keeper adds 1 kg of flour to the same place THEN the note of flour has `full: 1.2 kg`
6. GIVEN a food item with no `full` and one row of 300 g WHEN the keeper changes the row to 200 g THEN the note has `full: 300 g`
7. GIVEN flour has `full: 1 kg` and 200 g WHEN the keeper changes the row to 100 g THEN the note still has `full: 1 kg`
8. GIVEN elbow pasta has `full: 2 kg` and no `low` WHEN the keeper opens the part "Pantry" THEN the tick of its bars is at 25%
9. GIVEN rice has `low: 6 kg` WHEN the keeper opens the part "Pantry" THEN the tick of its bars is at 100%
10. GIVEN rice has `low: 2 bags` WHEN the keeper opens the part "Pantry" THEN the tick of its bars is at 25%
11. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the bar of flour is amber
12. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the bars of rice are not amber
13. GIVEN rice has `low: 3 kg` WHEN the keeper opens the part "Pantry" THEN the two bars of rice are amber
14. GIVEN the test vault WHEN a screen reader reads the line of flour THEN it reads "200 g, low"
15. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the head of the pantry shows "2 low"
16. GIVEN the test vault WHEN the keeper opens the part "Pantry" THEN the head of the group "Kitchen pantry" shows "15 · 1 low"

## Depends on

- [See the food of each place](pantry-see-the-food-of-each-place.md): the lines that get a bar.

## Architecture

- [Level](../../architecture/level.md): how the plugin calculates the three amounts of the bar.
- [Settings](../../architecture/settings.md): the percentage of the low line.
