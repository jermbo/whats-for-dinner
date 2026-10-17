---
title: Shop stories
summary: "The user stories of the shopping list in version 0.2.0: thirteen pieces of work, with the sequence in which they depend on each other."
parent: ../README.md
---

[Wiki](../../README.md) / [Features](../README.md) / Shop stories

# Shop stories

The Shop part is where you make the list, mark what you take, and put the food away. This page lists its user stories for version 0.2.0. Each story is one piece of work that one agent or one person can complete.

## The goal of the feature

The list has more than the food of the meals: you add an item on any day, and the plugin suggests the staples that need a look. Each trip has a note. When you put the food away, the plugin fills in the amount, the place, the use-by date, and the price of each item. You check them, and the note becomes the receipt.

The Shop part has three stages, one for each moment of a trip. In "Extras", you decide the suggestions and add your own items, because the meals fill the list with no action from you. In "Shop", you tick the items into the cart. In "Put away", you check the facts and put the cart into the pantry.

The [spec](../../initiatives/shopping-list/spec.md) has the scope that is agreed, and each line of it names its decision. The wiki [glossary](../../glossary.md) has the words of these stories, such as "choice", "suggestion", and "receipt".

## The stories

| Story                                                                                           | Persona | Depends on              |
| ----------------------------------------------------------------------------------------------- | ------- | ----------------------- |
| 1. [Keep the cart in the shopping note](shop-keep-the-cart-in-the-shopping-note.md)             | Shopper | Nothing                 |
| 2. [Label a staple](shop-label-a-staple.md)                                                     | Keeper  | Nothing                 |
| 3. [See the staples that need a look](shop-see-the-staples-that-need-a-look.md)                 | Planner | Story 1                 |
| 4. [See food of a meal that is past its date](shop-see-food-of-a-meal-that-is-past-its-date.md) | Planner | Story 3                 |
| 5. [Add an item of your own](shop-add-an-item-of-your-own.md)                                   | Planner | Story 1                 |
| 6. [Get a receipt for each trip](shop-get-a-receipt-for-each-trip.md)                           | Keeper  | Story 1                 |
| 7. [Give the facts of each item at put away](shop-give-the-facts-of-each-item.md)               | Keeper  | Story 6                 |
| 8. [Start from the facts of the last receipt](shop-start-from-the-last-receipt.md)              | Keeper  | Story 7                 |
| 9. [Record the store of a trip](shop-record-the-store-of-a-trip.md)                             | Keeper  | Story 7                 |
| 10. [Put an item of your own into the pantry](shop-put-an-item-of-your-own-into-the-pantry.md)  | Keeper  | Stories 5 and 7         |
| 11. [Move between the three stages of a trip](shop-move-between-the-three-stages.md)            | Shopper | Stories 1, 3, and 7     |
| 12. [Decide the extras before the trip](shop-decide-the-extras.md)                              | Planner | Stories 3, 4, 5, and 11 |
| 13. [Tick the items into the cart](shop-tick-the-items-into-the-cart.md)                        | Shopper | Stories 1, 3, and 11    |

The [personas](../../personas.md) page tells who the shopper, the keeper, and the planner are.

## The sequence of the work

A story can start when the stories that it depends on are done. This gives six steps. The stories of one step can be built at the same time.

| Step | Stories      | What you have after the step                                                                    |
| ---- | ------------ | ----------------------------------------------------------------------------------------------- |
| 1    | 1 and 2      | The cart is a note of the vault, and a food item can be a staple.                               |
| 2    | 3, 5, and 6  | The plugin suggests staples, you add your own items, and each trip leaves a receipt.            |
| 3    | 4 and 7      | Food past its date is a suggestion, and put away records the facts and the price of an item.    |
| 4    | 8, 9, and 10 | Put away starts from the last receipt, records the store, and takes a new item into the pantry. |
| 5    | 11           | The Shop part has three stages: Extras, Shop, and Put away.                                     |
| 6    | 12 and 13    | Extras has only what the meals do not decide, and you tick each item into the cart.             |

Story 3 reads the property that story 2 writes. Story 2 does not stop story 3, because you can type the property into a note.

## What the test vault needs

The criteria of the stories use the notes of the test vault. The vault has four things for them, and the story that needs each of them tells its exact form.

| The vault needs                                               | For story           |
| ------------------------------------------------------------- | ------------------- |
| The guacamole in the plan, so that the list has two rows      | 1, 6, 7, 11, 12, 13 |
| A recipe with an ingredient that the pantry does not know     | 1                   |
| The properties `staple` and `bought` in eight food item notes | 3                   |
| Two receipts in the folder `Shopping`, each with a store      | 8, 9                |

## The form of a story

Each story has the form that the [user story](../../standards/user-story.md) page gives.

## The status of a story

The metadata of a story has its status. Each of the thirteen stories has the status `built`: the code is there, and nobody recorded a test on the phone. Stories 11 to 13 change the screen after the second test.

The stories use one test vault, and two of them do not agree in it. Story 7 tells milk with no receipt, and story 8 gives milk a receipt. So the check list of the test vault tests story 7 with food that has no receipt.

Story 3 and story 12 do not agree in the vault either. With the guacamole in the plan, avocados are on the list, so they are not a suggestion. So the criteria of story 3 start with no meal in the plan.

## Further reading

- [Decision log: shopping list](../../initiatives/shopping-list/decision-log.md): the reason for each rule of these stories.
- [Workflow](../../standards/workflow.md): what occurs after the stories.
