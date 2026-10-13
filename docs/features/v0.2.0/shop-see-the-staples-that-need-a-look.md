---
title: See the staples that need a look
summary: "The planner sees each staple that needs a look, with its reason, and accepts it or skips it."
parent: shop-stories.md
persona: Planner
depends-on: [shop-keep-the-cart-in-the-shopping-note.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Shop stories](shop-stories.md) / See the staples that need a look

# See the staples that need a look

As the [planner](../../personas.md), I want the Shop part to suggest each staple that needs a look, with its reason, so that I accept it or skip it with one tap, and I forget no staple.

## Requirements

1. The Shop part shows the group "Suggestions", with one line for each staple that needs a look
   - a. A staple is a food item with the property `staple`: `often`, `sometimes`, or `seldom`
   - b. A staple that is a task of the open note is not a suggestion
   - c. With no suggestion, the group does not show
2. A staple needs a look when one of these is true
   - a. It is out
   - b. It is low
   - c. One of its rows has a use-by date that is past, or that is in the days of the setting "Use soon", or less
   - d. Its kind is "Sometimes", and its purchase date is 21 days ago, or more
   - e. Its kind is "Seldom", and its purchase date is 60 days ago, or more
   - f. Its kind is "Often"
   - g. It has no purchase date
3. The purchase date is the property `bought` of the food item note
4. A suggestion shows the name of the food item, one reason, and three facts
   - a. The reason is the first of these that is true: "Out", "Low", "Past its date", "Use by" with the date, "No purchase date", "Bought" with the time, and "Often"
   - b. The time is in days below 14 days, in full weeks below 60 days, and in full months of 30 days from 60 days
   - c. The facts are the amount that the pantry has, the purchase date, and the first use-by date
   - d. A fact that the food item does not have does not show
5. Tap "Add" to accept a suggestion
   - a. The open note gets a task with no mark, with the link of the food item
   - b. With no open note, the plugin makes it
   - c. The list has a row for the food item
   - d. The amount of the row is what makes the food item full
   - e. If the meals need more than that, the row has the amount that the meals need
   - f. A food item with no level has a row with no amount
6. Tap "Skip" to take a suggestion out of the group
   - a. It stays out until put away ends the trip
   - b. It stays out after a restart of Obsidian
7. Tap "Remove" on the row of a staple that you accepted to take it off the list
   - a. Its task goes out of the open note
   - b. The staple is a suggestion again
8. The check box "Low food on the list" is gone
   - a. Food that is low or out, and that is not a staple, is on the list only when a meal needs it
   - b. The filter "Low food", and the group "Low food" of the sequence "By meal", have the name "Your choices"
   - c. They have each row of a choice

## Acceptance criteria

Each criterion starts with the test vault on 2026-10-13, with no open note. The test vault needs these properties:

| Note              | `staple`    | `bought`     | What the vault has                        |
| ----------------- | ----------- | ------------ | ----------------------------------------- |
| `Avocados`        | `sometimes` | `2026-10-01` | No row. The full amount is 4.             |
| `Eggs`            | `often`     | `2026-10-04` | 6 of 12, with the use-by date 2026-10-25. |
| `Flour`           | `seldom`    | `2026-09-30` | 200 g of 1 kg. The low line is 300 g.     |
| `Fresh coriander` | `sometimes` | `2026-10-10` | 1 bunch, with the use-by date 2026-10-15. |
| `Oats`            | `sometimes` | None         | 50 g of 50 g.                             |
| `Rice`            | `sometimes` | `2026-09-20` | 2.3 kg of 5 kg. The low line is 1 kg.     |
| `Salt`            | `seldom`    | `2026-08-10` | 1 box. The plugin cannot count it.        |
| `Sugar`           | `seldom`    | `2026-09-30` | 400 g of 1 kg.                            |

Ginger is low, with 20 g of 100 g, and it is not a staple.

1. GIVEN today is 2026-10-13 WHEN the planner opens the Shop part THEN the group "Suggestions" has 7 lines
   - a. AND it has no line for sugar
   - b. AND it has no line for ginger
2. GIVEN today is 2026-10-13 WHEN the planner opens the Shop part THEN the reason of avocados is "Out"
3. GIVEN today is 2026-10-13 WHEN the planner opens the Shop part THEN the reason of flour is "Low"
4. GIVEN today is 2026-10-13 WHEN the planner opens the Shop part THEN the reason of fresh coriander is "Use by 15 Oct"
5. GIVEN today is 2026-10-16 WHEN the planner opens the Shop part THEN the reason of fresh coriander is "Past its date"
6. GIVEN today is 2026-10-13 WHEN the planner opens the Shop part THEN the reason of oats is "No purchase date"
7. GIVEN today is 2026-10-13 WHEN the planner opens the Shop part THEN the reason of rice is "Bought 3 weeks ago"
8. GIVEN today is 2026-10-13 WHEN the planner opens the Shop part THEN the reason of salt is "Bought 2 months ago"
9. GIVEN today is 2026-10-13 WHEN the planner opens the Shop part THEN the reason of eggs is "Often"
10. GIVEN rice has `bought: 2026-09-23` WHEN the planner opens the Shop part on 2026-10-13 THEN the group has no line for rice
11. GIVEN rice has `bought: 2026-09-22` WHEN the planner opens the Shop part on 2026-10-13 THEN the reason of rice is "Bought 3 weeks ago"
12. GIVEN salt has `bought: 2026-08-15` WHEN the planner opens the Shop part on 2026-10-13 THEN the group has no line for salt
13. GIVEN salt has `bought: 2026-08-14` WHEN the planner opens the Shop part on 2026-10-13 THEN the reason of salt is "Bought 2 months ago"
14. GIVEN eggs have `bought: 2026-10-04` WHEN the planner opens the Shop part on 2026-10-13 THEN the suggestion of eggs shows the amount "6"
    - a. AND the purchase date 4 October
    - b. AND the use-by date 25 October
15. GIVEN the suggestion of salt shows WHEN the planner looks at its facts THEN it shows no use-by date
16. GIVEN the vault has no open note WHEN the planner taps "Add" on flour THEN the note `Shopping/Next trip` has the line `- [ ] [[Pantry/Flour|Flour]]`
    - a. AND the list has the row "Flour" with "800 g"
    - b. AND the group has no line for flour
17. GIVEN the suggestion of eggs shows WHEN the planner taps "Add" on eggs THEN the list has the row "Eggs" with "6"
18. GIVEN the suggestion of salt shows WHEN the planner taps "Add" on salt THEN the list has the row "Salt" with no amount
19. GIVEN flour has 200 g, and the meals of the plan need 1.2 kg of flour WHEN the planner taps "Add" on flour THEN the list has one row "Flour" with "1 kg"
20. GIVEN the suggestion of salt shows WHEN the planner taps "Skip" on salt THEN the group has no line for salt
    - a. AND the open note has no task for salt
21. GIVEN the planner skipped salt WHEN you restart Obsidian THEN the group has no line for salt
22. GIVEN the planner skipped salt WHEN the keeper puts the cart away THEN the group has the line of salt again
23. GIVEN the planner accepted flour WHEN the planner taps "Remove" on the row "Flour" THEN the open note has no task for flour
    - a. AND the group has the line of flour again
24. GIVEN ginger is low and is not a staple WHEN the planner opens the Shop part THEN the Shop part has no check box "Low food on the list"
    - a. AND the list has no row "Ginger"
25. GIVEN the planner accepted flour, and the list has the row "Lime" of a meal WHEN the planner opens the bar THEN the bar shows the filters "For a meal" and "Your choices"
26. GIVEN the filters show WHEN the planner taps "Your choices" THEN the list shows the row "Flour"
    - a. AND the list does not show the row "Lime"

## Depends on

- [Keep the cart in the shopping note](shop-keep-the-cart-in-the-shopping-note.md): the open note, and the task with no mark that is a row of the list.

[Label a staple](shop-label-a-staple.md) does not stop this story. You can type the property `staple` into a note.

## Architecture

- [Low food](../../architecture/low-food.md): the check box that this story replaces, and the amount that makes a food item full.
- [Level](../../architecture/level.md): how the plugin decides that a food item is low.
- [Use soon](../../architecture/use-soon.md): the days of the setting "Use soon".
- [Food item note](../../architecture/food-item-note.md): the properties of the note.
- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): decisions 3 to 7, with the reason for each rule. It is a page of the initiative.
