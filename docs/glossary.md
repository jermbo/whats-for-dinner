---
title: Glossary
summary: "The words of the kitchen, each with one meaning, as the wiki and the plugin use them."
parent: README.md
---

[Wiki](README.md) / Glossary

# Glossary

The wiki and the screens of the plugin use one word for one thing. Two words for one thing make a reader think that there are two things. This page gives each word and its meaning.

## The kitchen

| Word      | Meaning                                                                    |
| --------- | -------------------------------------------------------------------------- |
| Kitchen   | The tab of the plugin in Obsidian.                                         |
| Part      | One of the four screens of the kitchen: Pantry, Recipes, Plan, and Shop.   |
| Data file | The file of the plugin with your settings. It is not a note.               |

## The pantry

| Word          | Meaning                                                                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List          | The items to buy at the next trip. The plugin [calculates](architecture/shopping.md) it, and the Shop part shows it. "Shopping list" and "grocery list" are two more names for it. |
| Trip          | One visit to a store. It can be on any day. It is open from your first action until put away ends it, and one trip is open at a time.                                              |
| Shopping note | The [note](architecture/shopping-note.md) of one trip. It starts with your first action for that trip. You do not shop from it.                                                    |
| Suggestion    | A staple that [needs a look](architecture/suggestions.md), with the reason. You accept it or you skip it. It is a row of the list only after you accept it.                        |
| Choice        | An item that is on the list because you put it there: a suggestion that you accepted, or an item of your own.                                                                      |
| Cart          | The items that you marked in the store. Each of them is a task with a mark in the shopping note.                                                                                   |
| Put away      | The [action](architecture/put-away.md) that adds the cart to the pantry.                                                                                                           |
| Receipt       | The [shopping note](architecture/receipt.md) of a trip that is complete: each item that you bought. Its name is the day of the trip.                                               |
| Step          | One instruction of a recipe, on one page of [Cook Mode](architecture/cook-mode.md).                                                                                                |
| Record        | The line that a [cooked meal](architecture/end-of-a-meal.md) leaves in its recipe note: date, rating, note, and photo.                                                             |

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

| Word          | Meaning                                                                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| List          | The items to buy at the next trip. The plugin [calculates](architecture/shopping.md) it, and the Shop part shows it. "Shopping list" and "grocery list" are two more names for it.              |
| Trip          | One visit to a store. It can be on any day. It is open from your first action until put away ends it, and one trip is open at a time.                                                           |
| Shopping note | The [note](architecture/shopping-note.md) of one trip. It starts with your first action for that trip. You do not shop from it.                                                                 |
| Choice        | An item that is on the list because you put it there, such as an item of your own that you type into the shopping note.                                                                         |
| Cart          | The items that you marked in the store. Each of them is a task with a mark in the shopping note.                                                                                                |
| Put away      | The [action](architecture/put-away.md) that adds the cart to the pantry.                                                                                                                        |
| Step          | One instruction of a recipe, on one page of [Cook Mode](architecture/cook-mode.md).                                                                                                             |
| Record        | The line that a [cooked meal](architecture/end-of-a-meal.md) leaves in its recipe note: date, rating, note, and photo.                                                                          |

## Further reading

- [Writing style](standards/writing-style.md): the rule "one word for one thing", and the other rules of the language.
