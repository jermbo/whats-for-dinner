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
| One item at a time            | "Put away" on milk puts only milk into the pantry. The receipt keeps the order of the store.    |
| The known items               | "Put away 9 known" puts the known items away. Quinoa, with no receipt, stays as a line.         |
| The receipt keeps the work    | Type a price, restart Obsidian, and the price is still there. The phone shows it too.           |
| The photos of the brands      | The row of taco seasoning shows the photos of Brand A and Brand B, and the chip "Brand C".      |
| A brand with the camera       | "Add brand" in the Pantry form takes a photo, and the section "Brands" gets it.                 |
| A brand in the cart           | "In cart" on the photo of Brand A writes the brand after the link of the task.                  |
| A photo in the store          | The camera tile of a row makes a new brand, which shows large with "In cart".                   |
| The brand at put away         | The line of taco seasoning starts with Brand A, and the receipt gets it in the column `Brand`.  |
| A price for each brand        | A tap on Brand B changes the price to 1.99.                                                     |
| A photo at put away           | The camera tile of the open line makes a new brand, and selects it.                             |
| A spoon against grams         | The pancakes find 1 tablespoon of sugar in a bag of 1 kg at 1/4, and count it.                   |
| Food to check                 | The onion of the pasta shows "Check" against a bag of 1 kg, and the meal card says "1 to check".        |

## The simple pantry is the next work

The pantry is the weakest part on the phone. Version 0.6.0 makes it simple: a level or a count for each package, one card with a bar that you drag, meals that take from the open package, a verdict for each brand, and a weekly audit. The [pantry stories](v0.6.0/pantry-stories.md) have the 11 stories and their sequence. They replace the unit system, loose food, the empty row, and the drag in round steps of the first work of this version, so those tests are off this page.

## More settings come after the first use

The plugin has a fixed value for each of these. A value becomes a setting when it is wrong for your kitchen.

| Setting                              | The fixed value                                                  |
| ------------------------------------ | ---------------------------------------------------------------- |
| How long the alarm rings             | One minute                                                       |
| The sequence that a part starts with | "By place" for the pantry, "Best for the pantry" for the recipes |
| The sequence of the places           | A to Z                                                           |
| The heading of the cook record       | "Cooked"                                                         |

## Three ideas have no decision

- **Preparation from the pantry.** Food in a place with the name "Freezer" needs time before you can cook it. The plugin does not tell you this: only the callout of a recipe is a preparation.
- **Groups by store.** You go to more than one store, and one store can be cheaper for some items. The list does not tell you which item to buy in which store, and it has no group for each store.
- **Standard units in a recipe.** The pantry takes only a unit of its [unit list](../architecture/amounts.md#the-units-of-a-package-size), so a typo such as "1 gall" cannot get in. A recipe can: "1 gall" in a recipe makes a count that compares with nothing. The unit list for intake is a later initiative.

The choices of the first version have a decision. See the [decision log of the open choices](../initiatives/open-choices-of-the-first-version/decision-log.md).

## Further reading

- [What's for Dinner](../README.md): the loop that each item on this page serves.
