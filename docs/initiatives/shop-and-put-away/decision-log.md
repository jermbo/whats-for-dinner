---
title: "Decision log: Shop and Put away"
summary: "The decisions that give the stages Shop and Put away the look and the motion of the other parts: surfaces, the ink tick, the open line, and the end of a trip."
parent: ../../README.md
updated: 2026-10-21
---

[Wiki](../../README.md) / Decision log: Shop and Put away

# Decision log: Shop and Put away

The [one system](../one-system/decision-log.md) work gave the Pantry, the Recipes, and the Plan one look and one language of motion. The stages Shop and Put away kept their older patterns (decision 13 of one system), so they look like a different app. This page records each decision that brings them into the system, and the reason. The new words are in the [glossary](glossary.md).

## The words of the owner

> "The last page that looks out of place is the shop screen and the put away screen. These feel out of place and not loved like the other pages. Sure there are some nicities there... but not as well finalized as the other."

> "I like the bins flow. That matches with what we have on the pantry. The undo button is butt ugly and I think we can make the interaction a bit smoother and nice to use."

> "The wave feels forced on all of these. I like C so far with the undo, but just because it moved to the immediate action, doesnt mean the undo goes away all together. keep trying focus on the UX and make this feel really good to use"

> "This is nice. I like d2 so far. What if we did somthing where it zooms to its location. Or better idea. There is a cart icon some where on the top that when you click to add. It animates to that cart. When clicking on the cart the cart view expands and takes over then you will see a shelf icon. When you undo the item animates back to the shelf. The cart is on the right and shelf on the left maybe. Not sure, just trying to think out side of the box a bit. We can have fun with this. Make it our own. Lets go wild."

> "I like e1. The tweak I would make would be to not wait when click. I know d2 was wait and animate as one when done... but that feels wrong now. Click and animate right wawy."

> "Put away C wins: the form in the list, no summary card."

> "This is ok. But I feel like we can do way better. I love the animation, I love the feel of it. But the looks is sub par. What can we do to elevate the look?"

> "A: Labels."

> "Where the did the cart animation go? I still wanted that, just wanted to update the look of the items. They look better, but I still want a cart and shelf section."

## The patterns today

| Pattern            | Pantry, Recipes, Plan                          | Shop                                    | Put away                                         |
| ------------------ | ---------------------------------------------- | --------------------------------------- | ------------------------------------------------ |
| A group            | A surface card, in columns                     | Flat lines on the page                  | Lines on a receipt with sharp corners            |
| A change of state  | A circle from the point of the tap             | A box that grows to 110 %, then a slide | A line that slides open                          |
| Open and close     | One ink card                                   | A chevron on "In the cart"              | A chevron on "Known", a turning "›" on each line |
| Second actions     | Plain buttons with a small mark                | Underlined links: "Remove", "Undo"      | A quiet button and an underlined link            |
| A count that changes | Runs up                                      | Fades in                                | Jumps up 5 px                                    |
| The end of a task  | Cook Mode closes with a circle                 | -                                       | The next stage opens, with no moment             |

## The prototype of 21 October

The question: how do the stages Shop and Put away get the look of the Pantry, and what ends a trip? The variants run in the plugin, with the notes of the test vault, and write to no note.

| Variant | Shop                         | An open line of Put away | The end of a trip |
| ------- | ---------------------------- | ------------------------ | ----------------- |
| Today   | Flat lines                   | A form in the list       | None              |
| A       | Bins                         | An ink card              | A summary card    |
| B       | Flat lines, with the ink tick | An ink card             | A summary card    |
| C       | Bins                         | A form in the list       | None              |

A is the set of the recommendations. B differs from A in the Shop only, and C differs from A in Put away only.

| Round | Options | Result |
| ----- | ------- | ------ |
| 1 | Today, A, B, C | The bins of A won (decision 7). The button "Undo" of the cart did not convince. |
| 2 | How an item leaves the cart. A1: a tap on its row in the cart. A2: the cart is chips, and a tap on a chip. A3: a short bar "In the cart · Undo" after each tick. In each, the row goes back into its bin, and its ink goes back. | The ink across a row felt forced (decision 5). The tap on the row of A1 and the bar of A3 both stay (decision 8). |
| 3 | What a tick does to the row. D1: the check fills and the name is struck, then the row goes to the cart. D2: the row stays struck in its bin until you stop for a moment, then each struck row goes together. D3: a struck row sinks to the end of its bin and stays there: the bins are the cart. | D2 won, until round 4 changed it (decision 9). |
| 4 | Where the cart is. The name of a ticked item flies to a cart button. A tap on the cart button grows a dark circle into the cart, which fills the stage. A tap on a row of the cart flies its name back to a shelf button. E1: the shelf and the cart are at the top, under the stages. E2: they are at the bottom, under the thumb. | E1 won (decision 10). With the name that flies, the wait of D2 felt wrong (decision 9). |
| 5 | E1 with a tick that acts at once, and Put away in two forms. C: a form in the list, and no end. A: an ink card, and the summary card at the end. | C won (decisions 11 and 13). |
| 6 | The look of the Shop, on a page with the rows of the test vault. A: labels, as the Larder images. B: shelf tags, with the amount at the left and the check at the right. C: the list as the receipt of the trip. | The labels of A won (decision 14). The cart column and the large count of A did not: the owner wanted the shelf, the cart, and the circle into the cart view at each width (decision 10). |

## Decisions

These decisions need no prototype: each one applies a rule of the one system.

1. **One mark for open and closed.** The chevron that "In the cart" has today, for "In the cart", "Known", and each line. The reason: three marks for one job.
2. **Second actions are plain buttons with a small mark.** "Remove", "Undo", "Not bought", and "+ package". The reason: decision 10 of one system.
3. **A count that changes runs up, with no jump.** The reason: decision 16 of one system.
4. **A row or a group that comes or goes moves only its position, scale, or opacity.** The reason: decision 19 of one system.
5. **A tick has no ink across the row.** The owner found that the circle across a row, and the ink that goes back, felt forced. A row is small, and you tick many rows fast. So the circle stays for cards and screens, and a tick is a small motion of the check and the name. Options that were rejected: the ink across the row, and the box of today that grows to 110 %.
6. **The chip "Sale" stays on the closed line of Put away.** The reason: a correction is one tap on a chip.
7. **The Shop list is in bins.** Each group is a bin, in columns, as the places of the Pantry: one bin for "A to Z", and one bin for each meal. A bin has its title in the display font over a rule of 4 px, as the groups of the Larder images, and no card (decision 14). One bin takes the full width, and its rows flow in columns. The reason: the owner found that the bins match the Pantry, and then selected the labels of the Larder images. Options that were rejected: flat lines with no group, and a white card for each bin.
8. **Each tick can be undone in two places.** A bar shows "✓ Eggs is in the cart · Undo" for a few seconds after the tick, under your thumb. After that, a tap on the row of the item in the cart puts it back on the list. The reason: the owner wants the undo at the moment of the tick, and also later. Options that were rejected: a button "Undo" on each row of the cart, and chips in the cart.
9. **A tick acts at once.** The check fills, the name is struck, the name of the item flies to the cart, and the row fades and leaves. The rows below glide up. A second tap on the row while it fades takes the tick off. The reason: the name that flies tells you where the item went, so a wait felt wrong to the owner. Options that were rejected: rows that stay struck until you stop, and then leave together (D2), and a row that sinks to the end of its bin (D3).
10. **The shelf and the cart are two buttons at the top, under the stages.** The shelf is on the left, with the count of the items to get. The cart is on the right, with its count. The button of the view that is open is ink. On a wide tab, the two are together at the right. Below them, a bar has one piece for each item of the trip, and the pieces of the cart are ink. A tick flies the name of the item to the cart. A tap on the cart grows a dark circle from it into the cart view, which fills the stage, at each width. A tap on a row of the cart flies its name back to the shelf, and the item is on the list again. A tap on the shelf grows paper back into the list. The reason: the owner wanted the cart at the top, and the circle into the cart is the part of the motion that the owner likes. Options that were rejected: the two buttons at the bottom, under the thumb (E2); one button that changes from the cart to the shelf, with a large count of the trip; and a cart column beside the list on a computer.
11. **A line of Put away opens as a form in the list.** It keeps the form of today, with the rules of decisions 1 to 4: the chevron, plain second actions with a mark, and the pill "Put away". The reason: the owner selected it after the ink card was on the phone. An option that was rejected: the line as an ink card, as the card of a food item.
12. **The receipt keeps its look.** The paper with sharp corners and the dashed rule stay, as the one touch of the Put away of its own. The reason: each variant of the prototype had it, and the owner did not ask for a change, so it stays as it is built. An option that was not tried: a card for each place.
13. **A trip ends with no summary card.** When the last line goes into the pantry, the next stage opens, as today. The reason: the owner selected the variant with no end. An option that was rejected: a circle from the last "Put away" into a summary card.
14. **The Shop has the look of labels, as the Larder images.**
    - a. Each row starts with the photo of its package: the brand that you took or the first brand, or a hatched tile with a camera when the item has no photo. A tap on it shows the brands below the row, with the camera.
    - b. The amount is in one column at the right edge, in the display font, with the price below it.
    - c. "Extra" is a quiet word under the name. The sticker "Extra" shows only when the list has rows for a meal and extras.
    - d. "Remove" is a quiet ✕ with no label.
    - e. The store, the find field, and the sequence are in one row.

    The reason: the stickers, the bold "Remove" labels, and an empty camera line on each row were the loudest parts of the screen, and they told nothing. Options that were rejected: shelf tags with the amount at the left (B), the list as a receipt (C), and the large count of the trip and the cart column of A (decision 10).

## Questions that are open

No question is open. The [spec](spec.md) has the scope.

## Further reading

- [Decision log: one system](../one-system/decision-log.md): the rules that this work applies.
- [Shopping](../../architecture/shopping.md): the stages of a trip.
- [Shop stories](../../features/v0.9.0/shop-stories.md): the user stories of this work.
