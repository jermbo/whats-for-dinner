# Build plan

The plugin grows in small slices. Each slice ends with one result that you can test in the test vault, on the computer and on the phone.

## Two fixed decisions

- A recipe is a note in the [RecipeMD](https://recipemd.org/specification.html) format, version 2.4.0.
- The product is a plugin for Obsidian. Obsidian loads three files from `.obsidian/plugins/<id>/` in the vault: `main.js`, `manifest.json`, and `styles.css`.

## The slices

| Slice               | At the end, you can                                                                             | Decision that the slice needs                                       |
| ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1. The plugin loads | Open one view of the plugin in the test vault.                                                  | Decided: Obsidian Sync moves the plugin to the phone.               |
| 2. Recipes          | See each recipe with its tags, its yield, and its ingredients. A bad note shows the reason.     | Decided: properties are permitted. A wikilink is the name of a note. |
| 3. Pantry           | Add a food with an amount, a place, and a spoil date. Change the amount.                        | Decided: a note for each food item, with brands and a table.        |
| 4. Match            | See the recipes sorted by the pantry: "7 of 9 in the pantry".                                   | Decided: other names (`aliases`). Choice: see below.                |
| 5. Week plan        | Add recipes to the week. The plugin proposes recipes that use up the pantry.                    | Choice: the note `Meal plan.md`. See below.                         |
| 6. Shopping list    | See only the missing items, mark them in the store, and put the trip into the pantry.           | Choice: the cart is in the data file of the plugin.                 |
| 7. Cook Mode        | Cook one step at a time, with timers. The food goes out of the pantry at the end.               | Choice: an item of a list is a step. See below.                     |
| 8. Use first        | See recipes move up when their food spoils soon. Keep a photo, a rating, and a note of a meal.  | Decided: the rating is a property. Choice: see below.               |

## Choices that are not decided

All slices are built as a first version, so that the full loop can be tested. Each of these choices is open to change.

| Subject        | Choice in the first version                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| Which notes    | The notes in the folder `Pantry` are food items. All other notes are tried as recipes.                        |
| Names          | A recipe name matches a food item by its name or by one of its other names. Singular and plural are equal.    |
| Units          | Mass (g, kg, oz, lb) and volume (ml, l, tsp, tbsp, cup) convert. All other units compare only with themselves. |
| No comparison  | If the pantry has the food in a unit that does not compare, the food counts as "in the pantry".               |
| Water          | Water is always there. It is not in the pantry and not on the shopping list.                                  |
| Use soon       | Food with a use-by date in 5 days or less is food to use soon. Its recipes go to the top.                     |
| Plan           | The plan is the note `Meal plan.md`: one task for each meal. A done task is a cooked meal.                    |
| Put away       | The amount that goes into the pantry is the missing amount. The place is the place where the food item is now. |
| New food       | A food item that is new goes to the place "Kitchen".                                                          |
| Steps          | Each item of a list in the instructions is a step. With no list, each paragraph is a step.                    |
| Timer          | The first time in the text of a step is the time of its timer.                                                |
| Take out       | At the end of Cook Mode, the row with the first use-by date gives its food first.                             |
| Record         | The date, the rating, the note, and the photo go below the heading "Cooked" in the recipe note.               |
| Look           | The Larder look from the archived design pages. In the dark scheme, paper and ink change places.              |
| Fonts          | Decided: Bricolage Grotesque for titles, names, and numbers. The system font for all other text.              |
| Recipe type    | The type of a recipe is its first tag, such as "dinner".                                                      |
| Pantry row     | One row is one food item in one place. A tap opens the row, and you change it there.                          |

## The food item

A food item is one note. The name of the note is the name of the food item.

- **Kind:** elbow pasta and shell pasta are two food items, thus two notes.
- **Brand:** a brand is a detail in the note of its food item. Taco seasoning is one note, with its brands. In the store, you take the brand that is on sale.
- **Place:** a food item can be in more than one place, such as the downstairs pantry and the outside fridge. The note has the amount for each place. You buy too much when you do not think of all the places.

There is no general level: no note "pasta" collects elbow pasta and shell pasta. A food item has other names (`aliases`) for this. Elbow pasta and shell pasta each have the other name "pasta", and you select which one you use.

The rating of a recipe is also an important part of the use of the plugin.

## The test vault

`test-vault/` is a vault for Obsidian. Open it with "Open folder as vault".

- `Recipes/` has seven correct recipes.
- `Edge cases/` has one note for each case that the plugin must decide about. The description of each note tells what it tests.
- `Pantry/` has 15 food items. Each note has its brands and its other names as properties, and a table with one row for each place.

The build of the plugin puts its three files into `test-vault/.obsidian/plugins/`.
