# Build plan

The plugin grows in small slices. Each slice ends with one result that you can test in the test vault, on the computer and on the phone.

All eight slices are built as a first version. The work that is left is in the [roadmap](docs/roadmap.md).

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
| 6. Shopping list    | See only the missing items, mark them in the store, and put the trip into the pantry.          | Choice: the cart is in the data file of the plugin.                  |
| 7. Cook Mode        | Cook one step at a time, with timers. The food goes out of the pantry at the end.              | Choice: an item of a list is a step. See below.                      |
| 8. Use first        | See recipes move up when their food spoils soon. Keep a photo, a rating, and a note of a meal. | Decided: the rating is a property. Choice: see below.                |

## Choices that are not decided

All slices are built as a first version, so that the full loop can be tested. Each of these choices is open to change.

| Subject          | Choice in the first version                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| Which notes      | Settings give the pantry folder and the recipes folder. With no recipes folder, each other note is tried.            |
| Names            | A recipe name matches a food item by its name or by one of its other names. Singular and plural are equal.           |
| Units            | Mass (g, kg, oz, lb) and volume (ml, l, tsp, tbsp, cup) convert. All other units compare only with themselves.       |
| No comparison    | If the pantry has the food in a unit that does not compare, the food counts as "in the pantry".                      |
| Water            | No food is always there. A recipe finds water only if the pantry has a row for water, such as "tap".                 |
| Use soon         | Food with a use-by date in 5 days or less is food to use soon. The number of days is a setting.                      |
| Plan             | The plan is one note, `Meal plan.md` or the note of the settings: one task for each meal. A done task is cooked.     |
| Plan note        | The plugin changes only the lines of the meals in the plan note. All other text of the note stays.                   |
| New week         | "Start a new week" removes each meal from the plan note. The plugin asks before it does this.                        |
| Week             | The week has room for 7 meals of each type that you did not cook. The type of a meal is the first tag of its recipe. |
| Types            | Dinner, breakfast, lunch, and snack show always, in this sequence. Each other type shows when it has a meal.         |
| Today            | "Today" selects a meal for this day. Its task gets the date. The selection ends with the day.                        |
| Cook in the plan | Only a meal of today has "Cook" in the plan. A recipe in Recipes has "Cook" always.                                  |
| Preparation      | A callout of the type "prep", in the description or in the instructions. The first one counts.                       |
| Prep is done     | A check box on the meal. Its task gets the words "prep done". "Cook" is quiet until then, but it is not locked.      |
| Prep in notes    | The plugin gives the callout a clock and the orange of your theme.                                                   |
| Put away         | The amount that goes into the pantry is the missing amount. The place is the place where the food item is now.       |
| Same place       | An amount goes into the row of its place, if the use-by dates are the same. If not, it is a new row.                 |
| New food         | A food item that is new goes to the place "Kitchen", or to the place of the settings.                                |
| Steps            | Each item of a list in the instructions is a step. With no list, each paragraph is a step.                           |
| Timer            | The first time in the text of a step is the time of its timer. "1 hour 30 minutes" is one time.                      |
| Alarm            | A timer that ends gives a sound, again and again, until "OK" or one minute. Sound and volume are settings.           |
| Cook screen      | The two buttons do not move. A long page scrolls inside the card. Your note is one line; a tap opens it.             |
| Take out         | At the end of Cook Mode, the row with the first use-by date gives its food first.                                    |
| Amount left      | A row keeps its unit if the amount left is round in it: "1.7 kg". If not, it is in g or ml: "996 g".                 |
| Record           | The date, the rating, the note, and the photo go below the heading "Cooked" in the recipe note.                      |
| Look             | The Larder look from the archived design pages. In the dark scheme, paper and ink change places.                     |
| Fonts            | Decided: Bricolage Grotesque for titles, names, and numbers. A setting gives a different font.                       |
| Recipe type      | The type of a recipe is its first tag, such as "dinner".                                                             |
| Pantry row       | One row is one food item in one place. A tap opens the row, and you change it there.                                 |
| Pantry find      | The text finds a food item by its name, its other names, or its brands.                                              |
| Pantry filter    | One filter is on at a time: food that is low, food to use soon, food that is out, or one place.                      |
| Pantry look      | Decided: levels. Each row has a bar with the amount against the full amount, and a tick at the low line.             |
| Level            | The level counts all places of a food item. On a row, the light part is the other places, the dark this one.         |
| Full amount      | The property `full` is the most that the pantry had of the food. The plugin writes it; you can change it.            |
| Low line         | The property `low`. With no `low`, the line is at 25% of the full amount. The percentage is a setting.               |
| Set an amount    | A tap opens a row as a bar that you drag. The amount snaps to about 20 steps.                                        |
| Open row         | The bar has one piece for each place. You select the place to update; its piece is last, at the green line.          |
| Bar is full      | The green line stops when all places together have the full amount. A larger amount goes in with the form.           |
| Not counted      | A row with no number, such as "a full bag", has no bar.                                                              |
| Other unit       | If the full amount is "2 kg" and the rows are "3 bags", the plugin does not count the food item.                     |
| Accent colour    | The olive of the Larder look, or the accent colour of Obsidian (from the theme). The default is olive.               |
| Settings         | The settings screen has the look of Obsidian. The values are in the data file of the plugin, with the cart.          |
| Recipe find      | The text finds a recipe by its title or by the name of one of its ingredients.                                       |
| Get out          | The list has one group for each group of the recipe, with its count. A group in a group has the two titles.          |
| Low on the list  | The chip "Low food" in Shop puts all low food on the list: food below its low line, and food that is out.            |
| Fill             | Low food goes on the list with the amount that makes it full again. If the meals need more, their amount stays.      |

## The food item

A food item is one note. The name of the note is the name of the food item.

- **Kind:** elbow pasta and shell pasta are two food items, thus two notes.
- **Brand:** a brand is a detail in the note of its food item. Taco seasoning is one note, with its brands. In the store, you take the brand that is on sale.
- **Place:** a food item can be in more than one place, such as the downstairs pantry and the outside fridge. The note has the amount for each place. You buy too much when you do not think of all the places.
- **Level:** a food item has a full amount (`full`) and a low line (`low`), as properties of its note. Below the low line, the food item is low.

There is no general level: no note "pasta" collects elbow pasta and shell pasta. A food item has other names (`aliases`) for this. Elbow pasta and shell pasta each have the other name "pasta", and you select which one you use.

The rating of a recipe is also an important part of the use of the plugin.

## The test vault

`test-vault/` is a vault for Obsidian. Open it with "Open folder as vault".

- `Recipes/` has seven correct recipes.
- `Edge cases/` has one note for each case that the plugin must decide about. The description of each note tells what it tests.
- `Pantry/` has 35 food items. Each note has its brands, its other names, its full amount, and its low line as properties, and a table with one row for each place.
- `Start here.md` tells the state in which the vault starts: which food is low, which is out, and which meals are in the plan.

The build of the plugin puts its three files into `test-vault/.obsidian/plugins/`.
