# Build plan

The plugin grows in small slices. Each slice ends with one result that you can test in the test vault, on the computer and on the phone.

## Two fixed decisions

- A recipe is a note in the [RecipeMD](https://recipemd.org/specification.html) format, version 2.4.0.
- The product is a plugin for Obsidian. Obsidian loads three files from `.obsidian/plugins/<id>/` in the vault: `main.js`, `manifest.json`, and `styles.css`.

## The slices

| Slice               | At the end, you can                                                                             | Decision that the slice needs                                       |
| ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1. The plugin loads | Open one view of the plugin in the test vault.                                                  | Decided: Obsidian Sync moves the plugin to the phone.               |
| 2. Recipes          | See each recipe with its tags, its yield, and its ingredients. A bad note shows the reason.     | Decided: properties are permitted. Open: wikilinks, and which notes. |
| 3. Pantry           | Add a food with an amount, a place, and a spoil date. Change the amount.                        | Decided: one note for each food item. Open: the form of the note.   |
| 4. Match            | See the recipes sorted by the pantry: "7 of 9 in the pantry".                                   | How an ingredient name matches a pantry item. How units compare.    |
| 5. Week plan        | Add recipes to the week. The plugin proposes recipes that use up the pantry.                    | Where the plan is kept.                                             |
| 6. Shopping list    | See only the missing items, mark them in the store, and put the trip into the pantry.           | None.                                                               |
| 7. Cook Mode        | Cook one step at a time, with timers. The food goes out of the pantry at the end.               | What one step is. How a step finds its ingredients and its time.    |
| 8. Use first        | See recipes move up when their food spoils soon. Keep a photo, a rating, and a note of a meal.  | Decided: the rating is a property. Open: the spoil date, the record. |

## The food item

A food item is one note. The name of the note is the name of the food item.

- **Kind:** elbow pasta and shell pasta are two food items, thus two notes.
- **Brand:** a brand is a detail in the note of its food item. Taco seasoning is one note, with its brands. In the store, you take the brand that is on sale.
- **Place:** a food item can be in more than one place, such as the downstairs pantry and the outside fridge. The note has the amount for each place. You buy too much when you do not think of all the places.

There is no general level: no note "pasta" collects elbow pasta and shell pasta.

The rating of a recipe is also an important part of the use of the plugin.

## The test vault

`test-vault/` is a vault for Obsidian. Open it with "Open folder as vault".

- `Recipes/` has five correct recipes.
- `Edge cases/` has one note for each case that the plugin must decide about. The description of each note tells what it tests.
- `Pantry/` has five food items, as a proposal for the form of the note.

The build of the plugin puts its three files into `test-vault/.obsidian/plugins/`.
