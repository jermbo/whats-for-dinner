---
title: Roadmap
summary: 'What is left between the plugin of today and the features page, in the sequence of the work.'
parent: README.md
updated: 2026-10-11
---

[Wiki](README.md) / Roadmap

# Roadmap

The [features](features.md) page tells what the plugin does when it is complete. This page tells what is left until then, and in which sequence. It is the only page of the wiki with status. When an item is done, it goes off this page.

## The loop works; now it must work on the phone

You can plan, shop, cook, and update the pantry in the test vault. The phone is where you use the plugin, and a function with no test there is not done. So these tests come first.

| Test             | It is done when                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Timer sound      | You hear the alarm on the phone, also in silent mode.                                     |
| Cook screen      | The two buttons stay in place, and a long list scrolls inside the card.                   |
| Pantry bar       | A drag to the side sets the amount, and it does not open the side panel of Obsidian.      |
| Find and filters | "Find food", "Low first", and each filter show the correct rows.                          |
| Settings         | A new recipes folder changes the recipe list. The font, the colour, and the sounds apply. |

## Three features are not complete

Each of these is on the features page, and the plugin does only a part of it.

| Feature                       | What is there now                           | What is left                                                    |
| ----------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| Low food on the shopping list | The list has the missing items of the plan. | One action puts the food below its low line on the list.        |
| Find a recipe                 | The recipes have filters and sequences.     | A field that finds a recipe by its name or by an ingredient.    |
| Groups in "Get out"           | Cook Mode shows one list of ingredients.    | The list has the groups of the recipe, such as "Dry" and "Wet". |

## The pantry bar has two limits

- **The full amount.** The bar stops at the full amount, and a larger amount needs the form. A shopping trip can bring more than before, so the bar must let you add more.
- **A change of place.** When you select a different place, its piece jumps to the end of the bar. It must slide, so that you see which piece moved.

## More settings come after the first use

The plugin has a fixed value for each of these. A value becomes a setting when it is wrong for your kitchen.

| Setting                              | The fixed value                                                   |
| ------------------------------------ | ----------------------------------------------------------------- |
| Food that is always there            | Water                                                             |
| How long the alarm rings             | One minute                                                        |
| The sequence that a part starts with | "By place" for the pantry, "Best for the pantry" for the recipes  |
| The sequence of the places           | A to Z                                                            |
| The heading of the cook record       | "Cooked"                                                          |
| The units that the plugin shows      | g, kg, ml, and l                                                  |

## Three ideas have no decision

- **Food that needs time.** The [vision](vision.md) names the chicken that is still in the freezer at 18:00. No feature answers that problem.
- **Your own item on the shopping list.** The list comes only from the plan. You cannot add an item that no recipe needs.
- **A drag on a closed row.** The first design sets an amount with no tap to open the row.

The first version also has choices that you did not confirm, such as how the name in a recipe finds a food item. They are in the table "Choices that are not decided" of the [build plan](../PLAN.md).

## Further reading

- [Obsidian pivot](README.md): the loop that each item on this page serves.
