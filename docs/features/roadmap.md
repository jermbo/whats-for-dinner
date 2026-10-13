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
| No food is always there       | A recipe finds water because the pantry has a row for water. With no row, water is on the list. |
| Plan by type                  | The plan has "Dinner 2/7" and "Breakfast 1/7". "+ Lunch" shows only the recipes for lunch.      |
| The meal of today             | "Today" moves the tacos to the top. "Not today" moves them back.                                |
| Preparation                   | The tacos show their preparation. After "Prep is done", the box is olive.                       |
| Preparation in the note       | The note of the tacos shows the callout with a clock and a colour.                              |
| The cart in the shopping note | A tap on a row puts a task into the note "Next trip". After Obsidian Sync, the computer has it. |
| A staple                      | The form of eggs shows the kind. "Often" and "Save" write `staple: often` into the note.        |
| Suggestions                   | The Shop part shows each staple that needs a look, with its reason. "Add" puts it on the list.  |
| An item of your own           | "Add as new" puts "Batteries" on the list, and the vault gets no note. A click makes the note.  |
| The receipt of a trip         | Put away gives the note "Next trip" the name of the day, with one row for each item.            |
| Food past its date            | Chicken thighs with a date before today are a suggestion. "Add" puts 500 g on the list.         |
| The facts at put away         | The screen has 20 items, and one hand is sufficient. A price that you type is in the receipt.   |
| The last receipt              | The eggs start with the amount, the place, the price, and the days of their last receipt.       |
| The store of a trip           | One tap on a store, and the receipt has the property `store`.                                   |
| A new item into the pantry    | "Into the pantry" on a new item makes its food item note, and the receipt links to it.          |

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

## Four ideas have no decision

- **A drag on a closed row.** The first design sets an amount with no tap to open the row.
- **Preparation from the pantry.** Food in a place with the name "Freezer" needs time before you can cook it. The plugin does not tell you this: only the callout of a recipe is a preparation.
- **Groups by store.** You go to more than one store, and one store can be cheaper for some items. The list does not tell you which item to buy in which store, and it has no group for each store.
- **Brands and photos.** The plugin does not record which brand you bought, and an item has no photo. The questions for the discussion are in the initiative [brands and photos](../initiatives/brands-and-photos/decision-log.md).

The first version also has choices that you did not confirm, such as how the name in a recipe finds a food item. They are in the table "Choices that are not decided" of the [build plan](../../PLAN.md).

## Further reading

- [What's for Dinner](../README.md): the loop that each item on this page serves.
