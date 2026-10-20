# Build plan

The plugin grows in small slices. Each slice ends with one result that you can test in the test vault, on the computer and on the phone.

All eight slices are built as a first version. The work that is left is in the [roadmap](docs/features/roadmap.md).

## Two fixed decisions

- A recipe is a note in the [RecipeMD](https://recipemd.org/specification.html) format, version 2.4.0.
- The product is a plugin for Obsidian. Obsidian loads three files from `.obsidian/plugins/<id>/` in the vault: `main.js`, `manifest.json`, and `styles.css`.

## The slices

| Slice               | At the end, you can                                                                            | Decision that the slice needs                                        |
| ------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1. The plugin loads | Open one view of the plugin in the test vault.                                                 | Decided: Obsidian Sync moves the plugin to the phone.                |
| 2. Recipes          | See each recipe with its tags, its yield, and its ingredients. A bad note shows the reason.    | Decided: properties are permitted. A wikilink is the name of a note. |
| 3. Pantry           | Add a food with an amount, a place, and a spoil date. Change the amount.                       | Decided: a note for each food item, with brands and a table.         |
| 4. Match            | See the recipes sorted by the pantry: "7 of 9 in the pantry".                                  | Decided: other names (`aliases`). Choice: see below.                 |
| 5. Week plan        | Add recipes to the week. The plugin proposes recipes that use up the pantry.                   | Choice: the note `Meal plan.md`. See below.                          |
| 6. Shopping list    | See only the missing items, mark them in the store, and put the trip into the pantry.          | Decided: the cart is in the shopping note "Next trip".               |
| 7. Cook Mode        | Cook one step at a time, with timers. The food goes out of the pantry at the end.              | Choice: an item of a list is a step. See below.                      |
| 8. Use first        | See recipes move up when their food spoils soon. Keep a photo, a rating, and a note of a meal. | Decided: the rating is a property. Choice: see below.                |

## The choices of the first version

All slices were built as a first version, with choices that had no decision, so that the full loop could be tested. The [decision log of the open choices](docs/initiatives/open-choices-of-the-first-version/decision-log.md) closes each of them.

## The food item

A food item is one note. The name of the note is the name of the food item.

- **Kind:** elbow pasta and shell pasta are two food items, thus two notes.
- **Brand:** a brand is a detail in the note of its food item. Taco seasoning is one note, with its brands. In the store, you take the brand that is on sale.
- **Place:** a food item can be in more than one place, such as the downstairs pantry and the outside fridge. The note has the amount for each place. You buy too much when you do not think of all the places.
- **Level:** each package has a level as you see it, from `full` to `1/4`, or a count, such as 4 of 12 eggs. A food item is low when it has one package, and that package is at 1/4. The note has no property for this.

There is no general level: no note "pasta" collects elbow pasta and shell pasta. A food item has other names (`aliases`) for this. Elbow pasta and shell pasta each have the other name "pasta", and you select which one you use.

The rating of a recipe is also an important part of the use of the plugin.

## The test vault

`test-vault/` is a vault for Obsidian. Open it with "Open folder as vault".

- `Larder/Pantry/` has 14 food items. Each note has a table with one row for each package: `Place | Left | Size | Use by`.
- `Larder/Meal plan.md` is the plan note. `Larder/Shopping/` has the note "Next trip" and the receipts of three trips.
- `Recipes/` is the recipes folder. Git ignores it, so each computer keeps its own recipes. A check list names the recipes that it needs, such as "Boiled eggs".
- Each set of stories has its check list at the root of the vault, such as `Pantry check list.md`. A check list tells the state that the notes need, and each test on the phone.
- `_old/` keeps the check lists, the edge cases, and the notes of the earlier versions, with `Start here.md`.

The build of the plugin puts its three files into `test-vault/.obsidian/plugins/`.
