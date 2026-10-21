---
title: "Spec: one system"
summary: "The scope of one system: the open card, the circle, the pill, and the press, shared by the parts on the look of the Pantry."
parent: decision-log.md
updated: 2026-10-21
status: agreed
---

[Wiki](../../README.md) / [Decision log: one system](decision-log.md) / Spec: one system

# Spec: one system

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there. The words are in the [glossary](glossary.md).

## The problem

The planner opens a recipe on the computer. The card grows in its cell of the grid, the cells next to it stay empty, and the open recipe does not look important. The Pantry, the Plan, and the Recipes each open a card in a different way, with a different main button, so the plugin feels like four design systems.

## The solution

Each part has the look of the Pantry, with one language of motion: each change is a circle from the point of your tap. An example: the planner taps "Chicken noodle soup". Ink spreads from the finger, the card moves to the top of the screen, and the other cards step back. The count runs up to 6 of 9 with the meter, the rows "None" and "Low" have their stickers pressed on, and the olive pill "Cook" is at the end.

## In scope

1. One design system on the look of the Pantry, with shared pieces for the new patterns (decision 1)
2. The recipe cards flow down in columns, one column on a phone (decision 2)
   - a. A card opens in its place, and only its column gets longer (decision 2)
3. An open card is an ink card with a larger name (decision 3)
   - a. The Pantry, the Recipes, and the Plan have it (decision 13)
   - b. On the Plan, the flag "Tonight" spreads the ink from the star (decision 13)
4. An open recipe shows what you must get first (decision 4)
   - a. A meter with one piece for each ingredient: have, check, low, none (decision 4)
   - b. The rows "To get or check", with a sticker each (decision 4)
   - c. "In the pantry" as small chips (decision 4)
   - d. The description, the preparation, and the actions, next to the food when there is room (decision 4)
   - e. The count of the card runs up with the meter (decision 7)
5. Each change is a circle from the point of the tap (decision 5)
   - a. Ink opens and closes a card (decision 5)
   - b. Paper opens and closes the edit form of a recipe in its card (decisions 5 and 11)
   - c. "Add recipe", "Convert", the gallery, and Cook Mode open with a circle from the button that you tapped (decision 17)
   - d. A change from one part to a different part stays a fade (decision 17)
6. The inside of an open card shows at once at its full height, and fades in (decision 6)
   - a. The meter fills piece by piece, and the stickers press on one after the other (decision 6)
   - b. The bar of the card of a food item is ready at once (decision 14)
   - c. A motion moves only the position, the scale, or the opacity of a thing (decision 19)
   - d. The things that a card pushes glide to their new place when it opens and closes (decision 19)
   - e. A card closes in two steps: its ink goes back and it fades in its place, then the things around it glide back (decision 19)
7. An open card moves to the top of the screen, under the head of the part, while it opens (decision 9)
   - a. The other cards step back (decision 9)
8. One soft easing with no bounce, and no shine (decisions 8 and 16)
   - a. The token `--wfd-ease-bounce` goes away (decision 16)
9. Each action that completes a task or goes forward is the pill, in the accent colour (decisions 10 and 15)
   - a. The arrow in a circle only for an action that opens a different screen (decision 15)
   - b. The pill is the `olive` kind of the button (decision 15)
   - c. Second actions on an open card have no edge, and have a small mark (decision 10)
10. Each button has the press: a small circle at the finger, in place of the move down (decision 18)
11. With less motion, no circle or scroll moves, and the content shows at once (decision 12)
12. A change of stage in the Shop is a circle of paper that covers the stage (decision 20)
13. "Update the pantry" and "Exit" close Cook Mode with a circle of paper (decision 21)
    - a. The piece of the bar of a new step fills from the left (decision 21)
14. Each motion of a script takes its time and its easing from the tokens (decision 22)
    - a. A screen opens when its circle covers the window (decision 22)
    - b. On a touch screen, a scroll that starts on a button shows no press (decision 22)

## Out of scope

1. A new look, or a look for each part (decision 1)
2. The open recipe at the top, a full row, a side column, a sheet, a drawer, or a page of its own (decision 2)
3. The open card for the stages of the Shop (decision 13)
4. "Add recipe" and "Convert" in a card (decision 17)
5. The bounce for small marks (decision 16)
6. A wave of the pieces of an open card (decision 6)
7. A circle for each step of Cook Mode (decision 21)

## What changes in the system

- [Motion](../../architecture/motion.md): the circle, the move to the top, the step back, the press, and one easing.
- [Pieces](../../architecture/pieces.md): the open card, the pill, and the press of the button.
- [Recipes](../../architecture/recipes.md), [Plan](../../architecture/plan.md), and [Card](../../architecture/card.md): the open card of each part.
- [Edit](../../architecture/edit.md): the edit of a recipe in its card.
- The wiki [glossary](../../glossary.md) gets the words of this work.
- No note changes its form.

## How you test it

On the phone and on a computer, each with less motion on and off:

1. A tap opens a recipe, and the ink starts at the finger.
2. A card low on the screen moves to the top as it opens.
3. The count and the meter move together.
4. "Edit" opens the form in the card, and "Save" writes the note.
5. "Cook" fills the screen and opens Cook Mode.
6. The card of a food item opens with its bar ready to drag.

An automatic test is worth it for one rule: the sequence of the rows "To get or check" (none, then low, then check).
