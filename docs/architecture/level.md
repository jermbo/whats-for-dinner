---
title: Level
summary: "What is left in a package as you see it, full to 1/4, and the two simple rules for low and out."
parent: pantry.md
---

[Wiki](../README.md) / [Pantry](pantry.md) / Level

# Level

You do not know that a jug has 0.95 l in it. You see that it is a quarter full. So the pantry keeps a level for each package, as you see it, and it tells from the levels when a food item is low.

## A level is what you see

A measured package, such as a jug of milk or a bag of rice, has one of four levels: `full`, `3/4`, `1/2`, or `1/4`. A package with nothing left is not a package: it goes out of the [note](food-item-note.md).

A counted package, such as a carton of eggs, has a count in place of a level: 4 of 12. You think of eggs as a count, so the pantry does too.

A small error in a level is not a problem. You check the pantry each week, and you correct it then.

## The amount behind a level

The recipes and the shopping list need an amount, not a level. The amount of a package is its level times its size: `1/4` of `1 gal` is 1/4 gal. The amount of a counted package is its count. All packages of a food item, in all places, add up to what you have.

When food goes out, the plugin calculates the new amount and writes the nearest level. The [end of a meal](end-of-a-meal.md) tells how.

## Low: one package is left, and it is nearly empty

A food item is low when it has one package, and that package is at `1/4`. For a counted package, it is a count of 1/4 of its size or less: 3 eggs of 12.

| Packages of milk          | Low? |
| ------------------------- | ---- |
| A jug at 1/4              | Yes  |
| A jug at 1/4, a full jug  | No   |
| A jug at 1/2              | No   |

The rule needs no setting and no property. A second package is your reserve, so food with a reserve is not low. A low food item has an amber bar, and a [staple](staples.md) that is low gets on the shopping list.

## Out: no package

A food item with no package is out. The note stays, so that the Shop part shows the food and you buy it again.

A row with a text such as `tap` is a package that the plugin cannot count. Water with that row is never out, and never low.

## Further reading

- [Staples](staples.md): how a food item that is low gets on the list.
- [Amounts](amounts.md): the units of a package size.
