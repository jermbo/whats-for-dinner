---
title: Open card
summary: "How a card opens in each part: ink that spreads from your tap, the move to the top, the other cards that step back, paper for a form, and a circle to a screen of its own."
parent: motion.md
updated: 2026-10-21
---

[Wiki](../README.md) / [Look](look.md) / [Motion](motion.md) / Open card

# Open card

A recipe, a food item, and the meal of tonight each open as one card. If each part opened a card in its own way, the plugin would feel like four apps. So each change of a card is the same idea: a circle that starts at the point of your tap.

## Ink spreads from your finger

You tap the name of Chicken noodle soup. A circle of ink grows from that point until it covers the card, in 0.6 s. When it covers about half, the text changes to the colour on the ink. A tap that closes the card takes the ink back to that tap, such as "Close" or "Done", in half the time. While the ink goes back, the card stays in its place and its content fades. Then the closed card or the line takes its place, in one change, so the two are never on the screen together. A card that opens from a key starts at the middle of its head. The star of "Tonight" is the start of the ink of its meal, so the ink starts there also when the card moves into the section.

## Only the position, the scale, and the opacity move

A phone has little time for each frame. So the circle is a round layer that grows, and the browser moves its scale on the graphics chip, with no new layout and no new paint. The card gets its full height at once, and its inside fades in. When the circle covers the card, it becomes a plain layer, so a card that grows later stays covered. The things that a card pushes glide: the plugin measures each bin, line, and card before and after the change, and slides each one from its old place to its new one, also into a different column. A bin that gets shorter leaves a copy of its surface under it, which gets short with it. The meter of a recipe fills piece by piece, and its stickers press on one after the other.

## The card moves to the top

An open card moves up until it is 12 px under the head of the part, in one smooth scroll. The other cards step back: they get lighter. A hover brings one forward.

## Paper for a form, and a circle to a screen

"Edit" on a recipe spreads paper from the button over the ink, and the form of the recipe comes in on it. "Save" and "Close" take the paper back. A screen of its own, such as Cook Mode, the gallery, or intake, opens with a circle that grows from the button until it covers the window, in the colour of that screen. "Cook" grows the circle of its arrow.

With less motion, no circle grows, and the card shows at once.

## Further reading

- [Pieces](pieces.md): the ink card and the pill.
- [Recipes](recipes.md): what an open recipe shows.
