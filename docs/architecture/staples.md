---
title: Staples
summary: "How the food that you always want gets a label, and how the kind of that label tells the plugin when to ask about it."
parent: shopping.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / Staples

# Staples

The shopping list comes from the plan. But some food you want always, plan or no plan: bread, eggs, flour, salt. This page tells how you label such food, and what the label does.

## The plan does not see the bread

You eat bread with no recipe. So no meal takes it out of the pantry, and no meal puts it on the list. The amount in the pantry does not tell that the bread is gone. The plugin must ask you about it, and you tell the plugin which food it must ask about.

## A staple is a food item with a label

You label a food item in the form of its row, in the Pantry. The label is the property `staple` of the [food item note](food-item-note.md). A staple does not have to be food: dish soap can be a staple, with an amount and a place.

## The kind tells how often you buy it

| Kind      | It is for food that                              | The plugin asks          |
| --------- | ------------------------------------------------ | ------------------------ |
| Often     | Spoils fast, or that you use fast, such as bread | At each trip             |
| Sometimes | Keeps for some time, such as cereal or potatoes  | 21 days after a purchase |
| Seldom    | Keeps for a long time, such as salt              | 60 days after a purchase |

The three kinds are steps of one question: "how often do you buy it?". The plugin counts the days from the purchase date, which [put away](put-away.md) writes into the note.

## The label makes a suggestion, not a row

A staple is not on the list at each trip. When it needs a look, the Shop part shows it as a [suggestion](suggestions.md), with the reason. You accept it or you skip it. Thus you look at the food before you buy it.

A staple that is low or out, and that a meal of the week needs, is not a suggestion. The meal uses what is left, so the staple is on the list with no action from you, as the [shopping](shopping.md) page tells.

Food that is low and that is not a staple gets no suggestion. It is on the list when a meal needs it, and the Pantry shows it as low.

## A staple on the list fills

The amount of a staple on the list is what makes the food item full again: the full amount less what you have. Flour has 200 g of 1 kg, so the row says "Flour, 800 g". If the meals need more than that, the row has the amount of the meals.

This rule does not ask how the staple got on the list. So the amount of a row does not change when you tap it.

A staple that the plugin cannot count, such as salt with the row "1 box", has a row with no amount. You decide how much you buy.

## Further reading

- [Level](level.md): the full amount, and how the plugin decides that a food item is low.
