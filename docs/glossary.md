---
title: Glossary
summary: "The words of the kitchen, each with one meaning, as the wiki and the plugin use them."
parent: README.md
---

[Wiki](README.md) / Glossary

# Glossary

The wiki and the screens of the plugin use one word for one thing. Two words for one thing make a reader think that there are two things. This page gives each word and its meaning.

## The kitchen

| Word        | Meaning                                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Kitchen     | The tab of the plugin in Obsidian.                                                                                               |
| Part        | One of the four screens of the kitchen: Pantry, Recipes, Plan, and Shop.                                                         |
| Data file   | The file of the plugin with your settings. It is not a note.                                                                     |
| Setup       | The [steps](architecture/setup.md) that the kitchen shows the first time, before the four parts.                              |
| Plugin home | The one folder that holds each note of the plugin, but the recipes. You delete it to remove the notes of the plugin.            |
| Larder      | The name that the plugin home starts with: `Larder/`. It is not the Pantry part, and not the pantry folder `Larder/Pantry/`. |

## The pantry

| Word          | Meaning                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Food item     | One food of the [pantry](architecture/pantry.md), as one note. Rice is a food item.                                       |
| Other name    | A name that a recipe can use for a food item, such as "pasta" for elbow pasta.                                            |
| Place         | Where food is, such as "Downstairs pantry". You give the places their names.                                              |
| Row           | One package of a food item: one row of the table in its note, with its own size and its own use-by date. |
| Package       | One container of a food item that you can hold in your hand: one gallon of milk, one carton of eggs.                      |
| Package size  | The amount of a package when it is new: 1 gal for the milk, 12 for the carton of eggs. It is the column `Size` of a row. |
| Card          | The open line of a food item: its total, one bar with a part for each package, and an olive handle that you drag. See [card](architecture/card.md). |
| Handle        | The olive mark on the package that you drag. It snaps to a quarter, or to one egg.                                     |
| Audit         | The weekly walk through each place, in which you confirm or correct each food item. See [audit](architecture/audit.md). |
| To check      | A food item that a meal could not take food from. Its note has `check: true`, and the audit shows it first.          |
| Verdict       | What you think of a brand: "Buy again" or "Avoid". The photo of the brand shows it in the store.                      |
| Left          | What is still in one package: a level, such as 1/4, or a count, such as 4 eggs. It is the column `Left` of a row. |
| Open package  | A package with less than its size left, and more than nothing: the carton with 2 eggs.                                   |
| Sealed        | A package with its full size left.                                                                                        |
| Amount        | A number and a unit, such as "500 g". See [amounts](architecture/amounts.md). Some amounts have no number, such as "tap". |
| Level         | What is left in one measured package, as you see it: full, 3/4, 1/2, or 1/4. See [level](architecture/level.md). |
| Low           | One package is left, and it is at 1/4, or at 1/4 of its count or less.                                                  |
| Out           | With no package. The food item is still a note.                                                                         |
| Stub          | A food item note that [intake](architecture/intake.md) makes for an ingredient with no food item. It has no row, so the food item is out. |
| Use soon      | With a [use-by date](architecture/use-soon.md) in 5 days or less. The number of days is a setting.                        |
| Past its date | With a use-by date before today. The date of today is not past.                                                           |
| Staple        | A food item that you always want, plan or no plan. Its note has the label [staple](architecture/staples.md).              |
| Kind          | How often you buy a staple: "Often", "Sometimes", or "Seldom". It tells when the plugin asks about the staple again.      |
| Purchase date | The day on which you put a food item away the last time.                                                                  |
| Brand         | One package of a food item that you can buy, such as Brand A of taco seasoning. It has a name, a photo, or the two. See [brands](architecture/brands.md). |
| Brand photo   | A photo of the package of one brand. It is in the section "Brands" of the food item note, below its brand.               |
| Brands section | The heading "Brands" of a food item note, with one list item for each brand and its photos below it.                    |

## The recipes and the week

| Word        | Meaning                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| Recipe      | A note in the RecipeMD format. The [recipes](architecture/recipes.md) page tells more.                    |
| Type        | The first tag of a recipe, such as "dinner".                                                              |
| Ready       | A recipe is ready when the pantry has each of its ingredients.                                            |
| Check       | The sticker of an ingredient that the pantry has, but that the plugin cannot [count](architecture/match.md), such as 1 onion against 500 g. |
| Preparation | [Work](architecture/preparation.md) that a recipe needs before you can cook, such as food that must thaw. |
| Intake      | The [work](architecture/intake.md) that makes a recipe note from a source, such as a card or a cookbook, up to "Save". |
| Line        | One ingredient or one step in a field of intake. It is not a row of the pantry.                           |
| Source photo | A photo of the original of a recipe, such as the card or the page of the cookbook. [Intake](architecture/intake.md) puts it below the title. |
| Step photo  | A photo that shows one [step](architecture/steps.md) of a recipe, in the note below that step. The mark `\|best` tells the best one. |
| Gallery     | The [view](architecture/gallery.md) of the records of a recipe that have a photo: each photo with its date, its rating, and its note. |
| Meal        | A main dish and its sides, which you eat at one time. A meal is in the [plan](architecture/plan.md) until you cook it. |
| Dish        | One part of a meal: a recipe, or only a name, such as "Salad".                                           |
| Main dish   | The first dish of a meal: a recipe. The card of the meal has its name.                                    |
| Side        | A dish that goes with a main dish, such as mashed potatoes. "Side" is also the type of a recipe with the tag "side".                  |
| Week        | The meals of the plan: the options that you planned at a calm moment.                                     |

## The store and the stove

| Word          | Meaning                                                                                                                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List          | The items to buy at the next trip. The plugin [calculates](architecture/shopping.md) it, and the Shop part shows it. "Shopping list" and "grocery list" are two more names for it.                                                                                                        |
| Item          | One thing to buy. It is food of the pantry, or an item of your own, such as batteries.                                                                                                                                                                                                    |
| Trip          | One visit to a store. It can be on any day. It is open from your first action until put away ends it, and one trip is open at a time.                                                                                                                                                     |
| Shopping note | The [note](architecture/shopping-note.md) of one trip. It starts with your first action for that trip. You do not shop from it.                                                                                                                                                           |
| Suggestion    | A food item that [needs a look](architecture/suggestions.md), with the reason: it is out or low, a staple has a date or a time to check, or a meal needs it and it is past its date. You accept it, you skip it, or you never ask. Food that a meal puts on the list is not a suggestion. |
| Extra         | An item that is on the list because you put it there: a suggestion that you accepted, or an item of your own.                                                                                                                                                                             |
| Stage         | One of the three moments of a trip in the Shop part: "Extras", "Shop", and "Put away". A strip at the top opens each [stage](architecture/shopping.md).                                                                                                                                   |
| Cart          | The items that you marked in the store. Each of them is a task with a mark in the shopping note.                                                                                                                                                                                          |
| Put away      | The [third stage and its button](architecture/put-away.md) that add the cart to the pantry, and that end the trip.                                                                                                                                                                        |
| Fact          | One of the six things that you give for an item at [put away](architecture/put-away-facts.md): the amount, the place, the use-by date, the price, the mark "Sale", and the brand.                                                                                                       |
| Bought brand  | The brand on a row of a receipt or a cart task: the brand that you took in the store, or that put away selected. The row links to its photo, or has its name.                                                                                                                         |
| Price         | What you paid for the full amount of an item. It has no currency, and it is only in a receipt.                                                                                                                                                                                            |
| Store         | Where you made a trip. A receipt can have one store.                                                                                                                                                                                                                                      |
| Receipt       | The [note](architecture/receipt.md) of a trip, with each item that you bought. It starts as active when put away opens, and it is complete with the last item. Its name is the day on which it starts.                                                                                    |
| Known item    | An item of the cart whose last receipt has an amount, a place, and a price. Put away shows it in the closed group "Known".                                                                                                                                                                |
| Usual amount  | The newest amount of the receipts of an item, in the unit of its food item. The list and put away start from it.                                                                                                                                                                          |
| Store order   | The sequence of the list in which each item is where it was on the newest receipt of the store of the trip.                                                                                                                                                                               |
| Last receipt  | The newest receipt with a row for an item. Put away starts from it.                                                                                                                                                                                                                       |
| Regular price | The price of the newest receipt row of an item that has no sale mark. Put away proposes it, because a sale ends.                                                                                                                                                                          |
| Step          | One instruction of a recipe, on one page of [Cook Mode](architecture/cook-mode.md).                                                                                                                                                                                                       |
| Record        | The line that a [cooked meal](architecture/end-of-a-meal.md) leaves in its recipe note: date, rating, note, and photo.                                                                                                                                                                    |

## The look

The kitchen uses "part", "card", "row", and "line" for its own things. So the look uses different words for the things of the screen.

| Word          | Meaning                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Look          | All that you see of the plugin but the data: colour, font, size, space, corners, lines, and motion. See [look](architecture/look.md).           |
| Token         | One value of the look with a name, such as `--wfd-color-text`. A screen uses the name, not the value. Then one change of the token changes each screen. |
| Scale         | A short list of tokens for one kind of value, from small to large, such as the six font sizes.                                                  |
| Palette token | A token that names a plain value, such as the colour olive. Only a role token uses it.                                                          |
| Role token    | A token that names a job, such as "primary" or the font size of a name. Screens and pieces use it.                                              |
| Piece token   | A token of one piece that points to a role token, such as the motion of a card. You change it to try a different value on that piece only.      |
| Piece         | One shared thing of the screen with its own look, such as a button, a chip, or a sticker. Each screen uses the same [piece](architecture/pieces.md). |
| Frame         | The dark area around Cook Mode and the gallery. It is dark in the light scheme and in the dark scheme.                                          |
| Circle        | The shape of each change of a card or a screen. It grows from the point of your tap, and goes back to it. See [open card](architecture/open-card.md). |
| Ink           | The dark circle that opens a card. The text changes to the colour on the ink when the circle covers about half the card.                        |
| Paper         | The light circle over the ink of a card that holds a form, such as the edit form of a recipe.                                                   |
| Step back     | What the other cards do while a card is open: they get lighter.                                                                                 |
| Pill          | The button of an action that completes a task or goes forward: round ends, the accent colour, and an arrow in a circle when it opens a different screen. |
| Meter         | The bar of an open recipe, with one piece for each ingredient, in the colour of its state.                                                      |
| Style guide   | The pages that tell the tokens, the scales, and the pieces, and when to use each one: [look](architecture/look.md) and the pages below it.       |

## The tests

| Word        | Meaning                                                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit test   | Code that calls one function of the plugin with a known input, and compares the answer with the answer that you expect. It needs no Obsidian. See [unit tests](standards/unit-tests.md). |
| Test file   | One file of unit tests for one file of the code: `level.test.ts` tests `level.ts`.                                                            |
| Test run    | One command, `npm test`, that runs all unit tests and tells which ones fail. It runs on the computer, not on the phone.                        |
| Fixture     | The input of a test: the text of a note, a list of rows, or an amount such as "1000 g" of rice.                                               |
| Bad note    | A note that a reader of the plugin cannot read completely: a half-typed amount, a missing section, a table with a broken row.                 |
| Phone check | One test of a check list at the root of `test-vault/`. You do it by hand, on the phone. A unit test does not replace it.                      |

## Further reading

- [Writing style](standards/writing-style.md): the rule "one word for one thing", and the other rules of the language.
