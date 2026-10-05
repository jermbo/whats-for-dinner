---
title: The use-by date
summary: 'Each food in stock that can spoil has a date. The date comes from "Use within", and it tells the pantry and the menu what goes first.'
parent: put-away.md
updated: 2026-10-05
---

[Wiki](../README.md) / [Shopping](README.md) / [The journey of an item](item-journey.md) / [Put away at home](put-away.md) / The use-by date

# The use-by date

The main goal of the app is to use the food that you have. So the app must know which food spoils first.

## The problem

The app cannot see the spinach. It knew only when the spinach came in, and the age of a food is a bad guess: eggs of ten days are good, and fish of three days is not.

## The mechanism

A food in stock has a use-by date. Food that keeps, such as rice, has none.

1. Each ingredient has its usual days. Meat has 2, bread has 5, and produce has 7. You can give an ingredient its own number.
2. When you [put an item away](put-away.md), the card shows "Use within" with the usual days as the answer: "3 d", "1 wk", or "Freezer". One tap changes it.
3. The answer becomes the date of the item in the pantry. "Freezer" puts the item in the freezer: food there keeps, and it has no date.
4. When you add to food that is there, the earlier date stays. The old food spoils first.
5. Food that comes out of the freezer gets its usual days from that moment.

You can correct the date of an item in its detail on the Pantry screen.

## What the date does

| Place                | What you see                                                      |
| -------------------- | ----------------------------------------------------------------- |
| A row of the pantry  | A badge in the last three days: "2 days", and "Use today" in red. |
| The "Use soon" view  | Three groups: Today, This week, and Keeps.                        |
| The dealer of Menu   | The recipes that use the food with the fewest days come first.    |
| The week             | The meal that uses that food gets the first night.                |
| A meal card of Today | "Spinach: use today".                                             |

## An example

On Sunday you put spinach away, and you keep the answer "5 d". On Thursday the row shows "1 day". On Friday it shows "Use today", the "Use soon" view has it at the top, and the dealer shows the spinach pie first.

## Further reading

- [Data model](data-model.md): where the date and the usual days are stored.
- [Meal plan gaps](../design/meal-plan-gaps.md): how the week uses the sequence of the food.
