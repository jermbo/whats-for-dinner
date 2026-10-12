---
title: Roadmap
summary: "What is left between the plugin of today and the features page, in the sequence of the work."
parent: ../README.md
---

[Wiki](../README.md) / Roadmap

# Roadmap

The [features](README.md) page tells what the plugin does when it is complete. This page tells what is left until then, and in which sequence. It is the only page of the wiki with status. When an item is done, it goes off this page.

## The new functions need a test on the phone

The phone is where you use the plugin, and a function with no test there is not done. So these tests come first.

| Test                          | It is done when                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------- |
| The bar of each part          | One tap opens the sequence and the filters. "Low" and "Freezer" work together.                  |
| Find a recipe                 | "curry" shows the chicken curry, and "spinach" shows each recipe that has spinach.              |
| Groups in "Get out"           | The pancakes show "Dry" and "Wet", each with its count of food on the counter.                  |
| Low food on the shopping list | One tap on "Low food" puts the low food on the list. Put away makes each of them full again.    |
| No food is always there       | A recipe finds water because the pantry has a row for water. With no row, water is on the list. |
| Plan by type                  | The plan has "Dinner 2/7" and "Breakfast 1/7". "+ Lunch" shows only the recipes for lunch.      |
| The meal of today             | "Today" moves the tacos to the top. "Not today" moves them back.                                |
| Preparation                   | The tacos show their preparation. After "Prep is done", the box is olive.                       |
| Preparation in the note       | The note of the tacos shows the callout with a clock and a colour.                              |

## The pantry bar has two limits

- **The full amount.** The bar stops at the full amount, and a larger amount needs the form. A shopping trip can bring more than before, so the bar must let you add more.
- **A change of place.** When you select a different place, its piece jumps to the end of the bar. It must slide, so that you see which piece moved.

## More settings come after the first use

The plugin has a fixed value for each of these. A value becomes a setting when it is wrong for your kitchen.

| Setting                              | The fixed value                                                  |
| ------------------------------------ | ---------------------------------------------------------------- |
| How long the alarm rings             | One minute                                                       |
| The sequence that a part starts with | "By place" for the pantry, "Best for the pantry" for the recipes |
| The sequence of the places           | A to Z                                                           |
| The heading of the cook record       | "Cooked"                                                         |
| The units that the plugin shows      | g, kg, ml, and l                                                 |

## Three ideas have no decision

- **Your own item on the shopping list.** The list comes from the plan and from the low food. You cannot add an item of your own, such as soap.
- **A drag on a closed row.** The first design sets an amount with no tap to open the row.
- **Preparation from the pantry.** Food in a place with the name "Freezer" needs time before you can cook it. The plugin does not tell you this: only the callout of a recipe is a preparation.

The first version also has choices that you did not confirm, such as how the name in a recipe finds a food item. They are in the table "Choices that are not decided" of the [build plan](../../PLAN.md).

## Further reading

- [What's for Dinner](../README.md): the loop that each item on this page serves.
