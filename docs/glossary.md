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
| Data file | The file of the plugin with your settings and your cart. It is not a note. |

## The pantry

| Word        | Meaning                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| Food item   | One food of the [pantry](architecture/pantry.md), as one note. Rice is a food item.                                       |
| Other name  | A name that a recipe can use for a food item, such as "pasta" for elbow pasta.                                            |
| Place       | Where food is, such as "Downstairs pantry". You give the places their names.                                              |
| Row         | One food item in one place: one row of the table in its note.                                                             |
| Amount      | A number and a unit, such as "500 g". See [amounts](architecture/amounts.md). Some amounts have no number, such as "tap". |
| Full amount | The most that the pantry had of a food item.                                                                              |
| Low line    | The amount below which a food item is low.                                                                                |
| Level       | What you have of a food item, against its full amount and its low line. See [level](architecture/level.md).               |
| Low         | Below the low line, with all places together.                                                                             |
| Out         | With no row. The food item is still a note.                                                                               |
| Use soon    | With a [use-by date](architecture/use-soon.md) in 5 days or less. The number of days is a setting.                        |

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

| Word     | Meaning                                                                                                                |
| -------- | ---------------------------------------------------------------------------------------------------------------------- |
| List     | The [shopping](architecture/shopping.md) list: the food that the week needs and that is missing.                       |
| Cart     | The rows of the list that you marked in the store.                                                                     |
| Put away | The [action](architecture/put-away.md) that adds the cart to the pantry.                                               |
| Step     | One instruction of a recipe, on one page of [Cook Mode](architecture/cook-mode.md).                                    |
| Record   | The line that a [cooked meal](architecture/end-of-a-meal.md) leaves in its recipe note: date, rating, note, and photo. |

## Further reading

- [Writing style](standards/writing-style.md): the rule "one word for one thing", and the other rules of the language.
