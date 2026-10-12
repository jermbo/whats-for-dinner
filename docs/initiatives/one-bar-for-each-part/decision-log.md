---
title: "Decision log: one bar for each part"
summary: "The options and the decisions for one bar to find, to set the sequence, and to filter, in each of the four parts."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: one bar for each part

# Decision log: one bar for each part

Each part of the kitchen shows a list. You find, sort, and filter that list with different controls in each part, or with no controls. This page records each decision that gives the four parts one [bar](glossary.md), and the reason for it.

## The four parts are different today

| Part    | Find field                | Sequence | Filters                                                             |
| ------- | ------------------------- | -------- | ------------------------------------------------------------------- |
| Pantry  | Name, other names, brands | 4        | Low, Use soon, Out, and one for each place. One is on at a time.    |
| Recipes | Title, ingredients        | 4        | Ready to cook, Uses food soon, and one for each type. They combine. |
| Plan    | None                      | None     | None                                                                |
| Shop    | None                      | None     | None. The chip "Low food" adds rows to the list.                    |

On a phone, the bar of the Pantry and of the Recipes is 100 px high: 50 px for the field, 44 px for the row of chips, and 6 px between them.

## Decisions

1. **Each of the four parts has the same bar.** The bar has a find field, a sequence, and filters. The reason: you learn the bar one time, and it is in the same place in each part. An option that was rejected: a bar only in the Pantry and in the Recipes, because the lists of the Plan and of the Shop are short.
2. **The bar opens and closes with a tap.** A closed bar gives its height to the list. The reason: on a phone, a bar that is always open pushes the list down in the parts where you seldom need it.
3. **The find field stays in view when the bar is closed.** A closed bar is one row of 50 px: the find field, and a button that opens the sequence and the filters. An open bar adds the row with the sequence and the chips, and is 100 px. The reason: in the store you type a name to see if you have the food, and that stays one tap. An option that was rejected: a closed bar of 0 px, with one button in the title row. It makes you tap before you type, and the title row of the Pantry has no room for it on a phone.
4. **The button "Add food" of the Pantry is at the end of the closed row.** It is in view when the bar is open and when it is closed. The reason: the control that adds to a list must always be in view, in one position.
5. **The button of a closed bar shows the number of filters that are on.** With the filters "Low" and "Freezer" on, the button shows "2". The reason: a filter that is on hides lines, and a closed bar hides its chip. The number tells you how many filters to look for, and the bar keeps its height. Ink on the button means that the bar is open, because ink on a chip means that the chip is on. Two options were rejected: a button that only changes to ink, and a row with the chips that are on, which adds 50 px.
   - a. The sequence does not count. It hides no line, and the titles of the groups show which sequence is on.
   - b. When no line passes the filters, the text of the empty list has a button that puts the filters off.
6. **The bar of each part remembers its states while the kitchen is open.** The states are: open or closed, the text, the filters, and the sequence. They stay when you go to a different part or to Cook Mode, and each part has its own. A restart of Obsidian gives a clean start. The reason: in the store you go from the Shop to the Pantry and back, and you must not set the filters again each time. Two options were rejected: a bar that remembers nothing, and a bar that keeps its states in the data file. With the data file, a filter from last week hides lines today.
   - a. Each part starts closed, with no text, no filter, and the sequence that it starts with today.
   - b. The button "+ Dinner" of the Plan opens the bar of the Recipes, with only the filter "Dinner" on. The open bar shows why the list is short.
7. **On a wide tab, the bar is always open, in one row.** The row has the field, the sequence, the chips, and "Add food" in the Pantry. The button that opens the bar does not show. The reason: the full bar in one row is 50 px high, the same as a closed bar, so a closed bar gives nothing back. The bar asks its own width, not the width of the screen, so a narrow tab on a computer gets the two rows of a phone. An option that was rejected: a bar that opens and closes at each width.
   - a. The state "open or closed" stays in memory on a wide tab. When the tab becomes narrow, the bar is as you left it.
8. **The filters are on together.** A line shows only when it passes each filter that is on. "Low" and "Kitchen fridge" show the low food of that fridge. The reason: each chip that you add makes the list shorter, and the Recipes keep "dinner that I can cook now". Two options were rejected: one filter at a time, and chips of one kind that add their lines. This decision changes requirement 2 of the story [Filter the pantry](../../features/v0.1.0/pantry-filter-the-pantry.md).
   - a. Two chips that cannot be true for one line put each other off: two places, two types, and "Out" with each other filter of the Pantry.
9. **The bar of the Plan acts on the week.** The week is the meals that you did not cook. The reason: the Plan and the Recipes show the same thing, a recipe with its pantry count. So the same text rule and the same chips mean that you learn them one time.
   - a. The find field is "Find a meal or ingredient". The text finds a meal by its title or by the name of one of its ingredients.
   - b. The sequences are "By type", "Best for the pantry", and "A to Z". The Plan starts with "By type". In "By type", each type is a group with its room. In the other two, the meals are one list. The meals of today are at the top in each sequence.
   - c. The filters are "Ready to cook", "Uses food soon", "Prep to do", and one chip for each type that has a meal. "Prep to do" shows the meals with a preparation that you did not confirm.
   - d. While a text or a filter is on, the Plan shows only the week. The ideas, the cooked meals, and the "+" buttons of the types with no meal do not show. A group that passes the filter keeps its own "+" button.

## Choices that are not confirmed

The build started before the grill was complete. These choices are in the code, and you can change each of them after the first test.

1. **The bar of the Shop acts on the rows that are not in the cart.**
   - a. The find field is "Find an item or a meal". The text finds a row by its name, by a different name or a brand of its food item, or by a meal that needs it.
   - b. The sequences are "A to Z" and "By meal". The Shop starts with "A to Z". In "By meal", each meal is a group, and a row that two meals need is in the two groups. The low food that no meal needs is in the group "Low food".
   - c. The filters are "For a meal" and "Low food". They show only when the list has rows of the two kinds, because with one kind a filter hides nothing.
2. **The switch "Low food" of the Shop is a check box, not a chip.** It is below the bar, with the text "Low food on the list". The reason: a chip is a filter, and a filter does not change the data. This switch puts rows on the list.
3. **The second row of the bar opens in 0.2 seconds.** The button changes to ink in 0.15 seconds, and its number comes in with a small pop. With the setting for less motion, there is no motion.
4. **The text of an empty list tells the number of filters.** With one filter it is "this filter", and with more it is "these filters". The button below it is "Remove the filters".
5. **The placeholder of the find field can use the room of the cross.** The cross shows only when the field has text. On a narrow phone, a placeholder that is too long ends with three dots.

## Further reading

- [Workflow](../../standards/workflow.md): the step of the work that this page is in.
