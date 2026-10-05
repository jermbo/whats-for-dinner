---
title: Cook mode gaps
summary: 'What Cook mode of the design has that the app does not, and the four steps that add it.'
parent: gap-plan.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Design](README.md) / [Gap plan](gap-plan.md) / Cook mode gaps

# Cook mode gaps

[Cook mode](../recipes/cook-mode.md) works: one card at a time, a tap on a half of the card, timers, notes, and photos. The gap is in what a card shows, and in the moment before "Cooked".

The images are `cook-01` to `03` and `cook-shop-putaway-01` and `02` in `docs/inspiration/`.

## The design and the app

| Part             | The design                                                              | The app on 4 October 2026                        |
| ---------------- | ----------------------------------------------------------------------- | ------------------------------------------------ |
| Last card        | An olive card, "Done?". It lists what leaves the pantry: "Rice -300 g"  | One sentence: "Cooked" subtracts the ingredients |
| Change amounts   | A link on the last card, before "Cooked"                                | After "Cooked", on the cook session screen       |
| Timer            | One large clock, "25:00", with "Start"                                  | A small button in the text of the step           |
| Step number      | Large: "3/5"                                                            | Small, in the top bar                            |
| Note             | One olive band at the bottom edge: "Your note"                          | A list of notes with dates, in the card          |
| Photo of a step  | Always a place for it, at the top of the card                           | Only when the step has a photo                   |
| Ingredients card | "Get out", and "4 of 7 on the counter"                                  | "Get the ingredients", and "3 to get"            |
| Move             | A tap on a half of the card. A hint: "Step 1 →"                         | The tap, and two large buttons at the bottom     |
| Surround         | Dark. The card is white, as a card in a holder                          | White, the full screen                           |
| Desktop          | A card has two halves: the title or the photo, and the list or the text | One narrow column                                |

## The steps

1. **The "Done?" card.** You see what "Cooked" takes from the pantry before you tap it. "Change amounts" lets you correct a row there. This closes the largest gap: today you learn the result after the fact.
2. **The step card.** The step number and the timer are large, so that you read them from the other side of the kitchen. The note of the last cook is a band at the bottom.
3. **The surround and the ingredients card.** The screen around the card is ink. The ingredients card gets its title and its count. The "Back" and "Next" buttons go, and the card gets their room. A small hint, "Step 1 →", shows where to tap.
4. **The desktop card.** On a wide screen, the card has two halves.

No step changes the database.

## What stays

- "Cooked" as a large button on the last card.
- The swipe and the arrow keys, which do the same as a tap on a half of the card.
- "Not in pantry" on a row of the ingredients card.
- The ingredients that a step uses, below its text.
- The photo of the finished meal. It moves to the "Done?" card or to the screen after it: a decision of step 1.

## Further reading

- [Timers](../recipes/timers.md): how the app finds a time in the text of a step.
- [Cook session](../recipes/cook-session.md): the record that "Cooked" makes.
