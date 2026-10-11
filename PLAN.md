# Build plan

The plugin grows in small slices. Each slice ends with one result that you can test in the test vault, on the computer and on the phone.

## Two fixed decisions

- A recipe is a note in the [RecipeMD](https://recipemd.org/specification.html) format, version 2.4.0.
- The product is a plugin for Obsidian. Obsidian loads three files from `.obsidian/plugins/<id>/` in the vault: `main.js`, `manifest.json`, and `styles.css`.

## The slices

| Slice               | At the end, you can                                                                             | Decision that the slice needs                                       |
| ------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1. The plugin loads | Open one view of the plugin in the test vault.                                                  | Decided: Obsidian Sync moves the plugin to the phone.               |
| 2. Recipes          | See each recipe with its tags, its yield, and its ingredients. A bad note shows the reason.     | Which notes are recipes. Properties and wikilinks: permitted or not. |
| 3. Pantry           | Add an item with a quantity, and change the count.                                              | Where the pantry data is kept.                                      |
| 4. Match            | See the recipes sorted by the pantry: "7 of 9 in the pantry".                                   | How an ingredient name matches a pantry item. How units compare.    |
| 5. Week plan        | Add recipes to the week. The plugin proposes recipes that use up the pantry.                    | Where the plan is kept.                                             |
| 6. Shopping list    | See only the missing items, mark them in the store, and put the trip into the pantry.           | None.                                                               |
| 7. Cook Mode        | Cook one step at a time, with timers. The food goes out of the pantry at the end.               | What one step is. How a step finds its ingredients and its time.    |
| 8. Use first        | See recipes move up when their food spoils soon. Keep a photo, a rating, and a note of a meal.  | Where the spoil date and the record of a meal are kept.             |

## The test vault

`test-vault/` is a vault for Obsidian. Open it with "Open folder as vault".

- `Recipes/` has five correct recipes.
- `Edge cases/` has one note for each case that the plugin must decide about. The description of each note tells what it tests.

The build of the plugin puts its three files into `test-vault/.obsidian/plugins/`.
