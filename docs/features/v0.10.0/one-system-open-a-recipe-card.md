---
title: Open a recipe card
summary: "A tap opens a recipe card as an ink card: the ink spreads from the finger, the card moves to the top of the screen, and the other cards step back."
parent: one-system-stories.md
updated: 2026-10-21
persona: Planner
depends-on: [one-system-one-easing-and-the-press.md, one-system-recipe-cards-in-columns.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [One system stories](one-system-stories.md) / Open a recipe card

# Open a recipe card

As the [planner](../../personas.md), I want an open recipe to be the focus of the screen, so that I read it with no scroll and nothing pulls my eye away.

## Requirements

1. A tap on the head of a recipe card opens it, and a second tap closes it
   - a. Only one card is open at a time. A tap on a different card closes the open one
   - b. The Escape key closes the open card
2. The ink spreads from the finger
   - a. A circle of `selected` grows from the point of the tap until it covers the card, in 0.6 s
   - b. When the circle covers about half the card, after 140 ms, the text of the card changes to `on-selected`
   - c. A key press starts the circle at the middle of the head
   - d. To close, the circle goes back to the point of the tap that closes it, and the text changes back after 160 ms
3. The name changes from the size `name` to the size `title` at once
4. The inside shows at its full height at once, and fades in, in 0.2 s
   - a. To close, the ink goes back and the inside fades, in 0.3 s, with the card at its height. Then the inside goes
   - c. When a card opens or closes, each card that it pushes glides to its new place in 0.32 s, also into a different column. A card that gets shorter has a copy of its surface under it, which gets short with it. A card that gets longer shows its new part from the top down
   - b. Each motion moves only the scale or the opacity of a thing: the ink is a round layer that grows
5. The open card moves to the top of the screen, under the head of the part, with 12 px between them
   - a. It moves in one smooth scroll. The plugin measures the card in the change that opens it, before the cards around it glide
   - b. A card that cannot go higher, at the end of the list, moves as high as it can
6. The other cards step back while a card is open
   - a. Their opacity is 0.45
   - b. On a computer, a hover brings a card back to full
7. The open card is a shared piece, so that the Pantry and the Plan use it too
8. With less motion, the card opens and moves at once, with no circle

## Acceptance criteria

1. GIVEN the Recipes WHEN the planner taps the name of Chicken noodle soup near the left edge THEN the ink spreads from that point, and the card is an ink card
   - a. AND the name "Chicken noodle soup" is at the size `title`
   - b. AND Beef tacos and Thai green curry step back
2. GIVEN Garlic butter spaghetti is the last card on the screen of a phone WHEN the planner opens it THEN the card moves up until its top is 12 px under the head of the part
3. GIVEN Chicken noodle soup is open WHEN the planner opens Thai green curry, below it THEN Chicken noodle soup closes
   - a. AND Thai green curry moves to the top of the screen
4. GIVEN Chicken noodle soup is open WHEN the planner taps its name THEN the ink goes back to that point, and the other cards come back to full
5. GIVEN Chicken noodle soup is open WHEN the planner presses Escape THEN it closes
6. GIVEN the device has less motion on WHEN the planner opens Beef tacos THEN the card is ink and at the top at once

## Depends on

- [One easing and the press](one-system-one-easing-and-the-press.md): the easing of each motion here.
- [Recipe cards in columns](one-system-recipe-cards-in-columns.md): the list in which the card opens.

## Architecture

- [Recipes](../../architecture/recipes.md): the recipe card.
- [Motion](../../architecture/motion.md): the circle, the move to the top, and the step back.
- [Decision log: one system](../../initiatives/one-system/decision-log.md): decisions 3, 5, and 9.
