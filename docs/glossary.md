---
title: Glossary
summary: "The words of the kitchen, each with one meaning, as the wiki and the plugin use them."
parent: README.md
---

[Wiki](README.md) / Glossary

# Glossary

The wiki and the screens of the plugin use one word for one thing. Two words for one thing make a reader think that there are two things. This page gives each word and its meaning.

## The kitchen

| Word      | Meaning                                                                  |
| --------- | ------------------------------------------------------------------------ |
| Kitchen   | The tab of the plugin in Obsidian.                                       |
| Part      | One of the four screens of the kitchen: Pantry, Recipes, Plan, and Shop. |
| Data file | The file of the plugin with your settings. It is not a note.             |

## The pantry

| Word          | Meaning                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Food item     | One food of the [pantry](architecture/pantry.md), as one note. Rice is a food item.                                       |
| Other name    | A name that a recipe can use for a food item, such as "pasta" for elbow pasta.                                            |
| Place         | Where food is, such as "Downstairs pantry". You give the places their names.                                              |
| Row           | One food item in one place: one row of the table in its note.                                                             |
| Amount        | A number and a unit, such as "500 g". See [amounts](architecture/amounts.md). Some amounts have no number, such as "tap". |
| Full amount   | The most that the pantry had of a food item.                                                                              |
| Low line      | The amount at which a food item is low. Food at the line or below it is low.                                              |
| Level         | What you have of a food item, against its full amount and its low line. See [level](architecture/level.md).               |
| Low           | Below the low line, with all places together.                                                                             |
| Out           | With no row. The food item is still a note.                                                                               |
| Use soon      | With a [use-by date](architecture/use-soon.md) in 5 days or less. The number of days is a setting.                        |
| Past its date | With a use-by date before today. The date of today is not past.                                                           |
| Staple        | A food item that you always want, plan or no plan. Its note has the label [staple](architecture/staples.md).              |
| Kind          | How often you buy a staple: "Often", "Sometimes", or "Seldom". It tells when the plugin asks about the staple again.      |
| Purchase date | The day on which you put a food item away the last time.                                                                  |

## The recipes and the week

| Word        | Meaning                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| Recipe      | A note in the RecipeMD format. The [recipes](architecture/recipes.md) page tells more.                    |
| Type        | The first tag of a recipe, such as "dinner".                                                              |
| Ready       | A recipe is ready when the pantry has each of its ingredients.                                            |
| Preparation | [Work](architecture/preparation.md) that a recipe needs before you can cook, such as food that must thaw. |
| Meal        | A recipe that is in the [plan](architecture/plan.md).                                                     |
| Week        | The meals of the plan that you did not cook.                                                              |

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
| Fact          | One of the five things that you give for an item at [put away](architecture/put-away-facts.md): the amount, the place, the use-by date, the price, and the mark "Sale".                                                                                                                   |
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

## Further reading

- [Writing style](standards/writing-style.md): the rule "one word for one thing", and the other rules of the language.
