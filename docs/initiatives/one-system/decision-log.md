---
title: "Decision log: one system"
summary: "The decisions that give the four parts one design system: the look of the Pantry, with one language of motion that starts at the point of your tap."
parent: ../../README.md
updated: 2026-10-21
---

[Wiki](../../README.md) / Decision log: one system

# Decision log: one system

The four parts share their tokens, but each part has its own patterns: how a card opens, how the main action looks, where you edit, and how a thing moves. So the plugin feels like four design systems. This page records each decision that makes it one system, and the reason. The new words are in the [glossary](glossary.md).

## The words of the owner

> "I want to look at the design of the recipes page and make sure we are doing everything we can to make this the best experience we can. I noticed some weirdness when a recipe is open, we are not utilizing the white space properly and it doesnt jump out as important or focus. What we did for the plan screen is a good place for inspiration. Not as much movement around but better design."

> "Nawh... not terrible, but nothing wow'd me. Remeber this needs to look good for the mobile and desktop. We can toss the idea of moving it to the top. That I think will be too jaring for people"

> "D is sexy!! Can we take that one a bit further. I want to add more animations. Have fun with it. That one made me go... oh yeah! Lets take it to the next level"

> "The last thing I would do is scroll that selected item towards the top. Like the whole screen. I can see opening something that expands past the fold and forcing to scroll. lets make this amazing at every interaction. THe animations are nice, but: 1. Look pretty generic. I like the circle grow and shrink effect. Its the shine across the ingredients list, the default looking wobble, the lack of a stagger (everything happens at once) 2. Not everything is animated. I noticed the cook open edit buttons dont match the vibe. 3. The edit note screen should happen in place as well, going to another screen distrupts the flow."

> "That... loooks amazing. When we imeplement this, we should use the accent color for cook. Also, we need to consider the app as a whole. I feel like we are building 4 different design systems. I like pantry's look and want to add some flare that we are talking about now. But I dont want to lose the vibe of the colors and stuff. Does that make sense? I want to make sure this looks unified and a singular system."

> "I dont think the wave is doing anything to sell the effects. When testing on desktop it is choppy. I think the phone is going to be way worse. Lets remove it and focus on performance."

## The patterns today

| Pattern          | Pantry                         | Plan                                   | Recipes                                 | Shop                     |
| ---------------- | ------------------------------ | -------------------------------------- | --------------------------------------- | ------------------------ |
| A card that opens | An ink card, in its place     | Only the meal of tonight is ink        | A white card that grows in a grid cell  | Stages, no card opens    |
| The main action  | "Done", olive                  | "Cook", `main`: ink on the ink card    | "Cook", `main`, on a white card         | `main` and `olive`       |
| Edit             | A form in the part             | No edit                                | A page of its own                       | A form in the part       |
| Motion           | The card settles, the bar slides | A crossfade to "Tonight"             | A slide                                 | Slides and fades         |

## The prototype of 21 October

The question: where does an open recipe go, so that it is the focus and uses the space well, on a phone and on a computer? Each round ran in the plugin, with the recipes of the test vault.

| Round | Options                                                                                                             | Result                                         |
| ----- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 1     | Lift out: the open recipe goes to the top. Full row: it takes the full row of the grid. Side column: it fills a column next to the list. | No option convinced. "Lift out" is too jarring. |
| 2     | Sheet: from the bottom on a phone, a drawer on a computer. Page: the card grows into a page. Flow: the cards flow in columns. | Flow won.                                      |
| 3     | Flow, with motion: the ink spreads from the tap, the count runs up, the inside comes in piece by piece.              | The circle won. The rest looked generic.       |
| 4     | Flow, with one language of motion: each change is a circle from the point of the tap.                                | Won.                                           |

## Decisions

1. **The plugin has one design system, and the Pantry is its base.** The colours, the type, and the tokens of the [look](../../architecture/look.md) stay. The new motion and patterns are shared pieces, so each part gets them from one place. The reason: the owner likes the look of the Pantry and wants the new flare in each part, with no new look. An option that was rejected: a look for each part.
2. **The recipe cards flow down in columns, and an open card opens in its place.** Only the column of the open card gets longer, so no space is empty next to it. The sequence goes down each column, as the [bins](../pantry-bins/decision-log.md) of the Pantry. On a phone it is one column. The reason: in a grid, a row is as high as its highest cell. Options that were rejected: the open recipe at the top, which is too jarring; a full row; a side column; a sheet or a drawer over the list; and a page in the place of the list.
3. **The open card is an ink card.** Its name is larger. The reason: the open recipe must be the focus, as the meal of tonight on the Plan and the card of a food item in the Pantry.
4. **What you must get comes first in an open recipe.** First a meter, with one piece for each ingredient: dark when you have it, grey to check, amber when low, dashed when you have none. Then the rows "To get or check", large, with a sticker. Then "In the pantry", as small chips. Then the description, the preparation, and the actions. With room, the method is in a column next to the food. The reason: a row with a check for each ingredient filled the card, and the food that you lack was hard to see.
5. **Each change is a circle from the point of your tap.** Ink spreads to open a card and goes back to close it. Paper spreads to edit. The dark frame of Cook Mode spreads to cook. The reason: the owner liked the circle that grows and shrinks, and one idea for each change makes the parts one system.
6. **The inside of an open card shows at once, with no wave.** It fades in at its full height. Only the meter fills piece by piece, and the stickers press on one after the other. The reason: on a computer, the owner found that the wave did not sell the circle and made the motion choppy, and a phone is slower. Options that were rejected: a wave that brings each piece in when the edge of the circle gets to it, and a stagger in the sequence of the list, which looked as if all came at once.
7. **The count and the meter move together.** The count of the card runs up from 0, and one piece of the meter lands for each step.
8. **The motion lands with no bounce and no shine.** One easing ends long and soft. The reason: the owner found the shine, the wobble, and the bounce generic.
9. **The open card moves to the top of the screen, under the head of the part.** It moves while it opens, and it follows the card when a different card closes above it. The other cards step back: they get lighter. The reason: an open card must not open below the bottom of the screen.
10. **The main action is a pill in the accent colour, with its arrow in a circle.** A tap on "Cook" grows that circle into the dark frame of Cook Mode. The second actions have no edge, and each has a small mark: "Edit", "Note", "Close". Each press drops a small circle at the finger. The reason: the owner wants the accent colour for "Cook", and the buttons of round 3 did not match the motion. On an ink card, the `main` button has the colour of the card.
11. **You edit a recipe in its card.** Paper spreads from "Edit", and the edit form comes in on it. "Save" and "Close" take the paper back. The reason: a page of its own breaks the flow.
12. **With less motion, nothing moves.** Each circle and scroll is off, and the content shows at once. The reason: the rule for less motion of the [motion](../../architecture/motion.md) page.

13. **The Pantry, the Recipes, and the Plan get the open card of decisions 3 to 9.** On the Plan, the flag "Tonight" spreads the ink from the star. The Shop keeps its stages, and gets the pill, the press, and the easing. The reason: these three parts have a card that you open or select, and the stages of the Shop are steps of a trip, not cards. Options that were rejected: only the Recipes first, and all four parts with the stages as cards.
14. **The card of a food item gets the circle, the move to the top, and the step back.** Its bar shows at once. The reason: you open the card to drag the bar, so the bar must be ready under your thumb. An option that was rejected: a bar that comes in after the card.
15. **Each action that completes a task or goes forward is the pill, in the accent colour.** "Cook", "Done", "Update the pantry", "Put away", and the buttons of Cook Mode that go to the next step. The arrow in a circle is there only when the action opens a different screen. The pill is the `olive` kind of the `Button`, so it stays one piece. The reason: one look for "forward" in each part. An option that was rejected: the pill for "Cook" only.
16. **The bounce goes out of the plugin.** One soft easing for each motion, and the token `--wfd-ease-bounce` goes away. The check of the week button lands with no overshoot. The reason: the owner found the wobble generic. An option that was rejected: the bounce for small marks only.
17. **You edit a recipe in its card. Each other screen keeps its page, and opens with a circle from the button that you tapped.** These are "Add recipe", "Convert", the gallery, and Cook Mode. A change from one part to a different part stays a fade. The reason: an edit is part of the card, but a new recipe or Cook Mode is a task of its own. An option that was rejected: each edit and each new item in place, with "Add recipe".
18. **Each button gets the press of decision 10: a small circle at the finger.** It replaces the move down of 2 px. The reason: each button feels the same in each part. An option that was rejected: the press only on the buttons of an open card.

19. **A motion moves only the scale or the opacity of a thing.** The circles of the ink, the paper, the press, and the cover are round layers that grow, not a clip that changes each frame. A card gets its full height at once, and the name changes its size at once. A card that steps back changes only its opacity. The reason: the browser moves the scale and the opacity on the graphics chip with no new layout and no new paint, so the motion stays smooth on a phone. Options that were rejected: a clip that grows, a height that grows, a font size that grows, and a blur or a grey filter on the cards that step back.

## Questions that are open

No question is open. The [spec](spec.md) has the scope.

## Further reading

- [Decision log: style guide](../style-guide/decision-log.md): the tokens and pieces that this work keeps.
- [Card](../../architecture/card.md): the open card of a food item, which is the model.
