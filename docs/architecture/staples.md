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

## The label adds reminders

Each food item that is out, low, or near its use-by date is a [suggestion](suggestions.md), with or with no label. The label adds the reminders that the amount and the date cannot give: the time since the purchase. A staple is not on the list at each trip. When it needs a look, you accept it or you skip it. Thus you look at the food before you buy it.

A staple that is low or out, and that a meal of the week needs, is not a suggestion. The meal uses what is left, so the staple is on the list with no action from you, as the [shopping](shopping.md) page tells.

Food that is low and that is not a staple is a suggestion "Low" too. When a meal needs it, the meal puts it on the list.

## A staple on the list fills

The amount of a staple on the list is one package: the size of its newest package. Flour has one bag of 1 kg at 1/4, so the row says "Flour, 1 kg". If the meals need more than that, the row has the amount of the meals. Your last receipt comes first: when it has an amount for the food, the row has that amount.

This rule does not ask how the staple got on the list. So the amount of a row does not change when you tap it.

A staple that the plugin cannot count, such as salt with the row "1 box", has a row with no amount. You decide how much you buy.

## Further reading

- [Level](level.md): how the plugin decides that a food item is low.
