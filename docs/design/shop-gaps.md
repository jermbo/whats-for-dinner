---
title: Shop and put away gaps
summary: 'Where the chain from the menu to the pantry is not clear on the screens, and the four steps that make it one line.'
parent: gap-plan.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Design](README.md) / [Gap plan](gap-plan.md) / Shop and put away gaps

# Shop and put away gaps

An item goes from the menu to the list, to the cart, to the receipt, and into the pantry. The app has each part of [this journey](../shopping/item-journey.md). But a screen does not tell you where the item came from, or where it goes next. In the design, each screen ends with one clear next step.

The images are `shop-01`, `shop-02`, `putaway-01`, `putaway-02`, and `cook-shop-putaway-02` to `04` in `docs/inspiration/`.

## The design and the app

| Part            | The design                                                          | The app on 4 October 2026                            |
| --------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| A row           | The reason below the name: "Creamy leek pasta", "Low in the pantry" | The name and the amount. A filter by meal at the top |
| Progress        | One segment for each item. "3/9 in the cart"                        | A line of text                                       |
| All in the cart | The screen changes: "All in the cart." and "Put away at home"       | A line of text. "Put away" is a small button         |
| Put away card   | Quantity, price, "Use within", "Not bought", "Put away"             | Quantity and price. No "Use within", no "Not bought" |
| Side column     | "Pantry fills": each gauge grows when you put an item away          | The card of the item                                 |
| The end         | A stamp, "+9 in the pantry", "Done", "See the pantry"               | "The pantry has all the food for 4 of 5 meals"       |

## The steps

1. **The reason on a row.** Each row tells which meal needs it. An item from the Pantry tells "Low in the pantry". The app knows the meals of a row already, so this step changes only the screen.
2. **The progress and "All in the cart".** The segments fill with each tap. With the last tap, the list becomes one large line and one button.
3. **"Use within" and "Not bought".** The card proposes the usual days of the food: "3 d", "1 wk", or "Freezer". Your answer is the use-by date in the pantry. "Not bought" is for a wrong tap, or for a store that had none: the line leaves the receipt and its total, and the item goes back on the shopping list.
4. **"Pantry fills" and the end.** You see each gauge grow. The end counts the items and has a link to the pantry.

Step 3 needs the use-by date from the [Pantry stage](pantry-gaps.md).

## What stays

- The line about the meals that the pantry can make in full. It is a better answer than a count of items, so it goes below "+9 in the pantry".
- The trips, the scan in the store, and the photos of the products.

## Further reading

- [In the store](../shopping/in-the-store.md): the rules of the list screen.
- [Put away](../shopping/put-away.md): the rules of the receipt and its card.
