---
title: Write mode
summary: 'Write mode asks for text only: steps as a list that you can paste, and ingredients as a name and a number.'
parent: README.md
updated: 2026-10-03
---

[Wiki](../README.md) / [Recipes](README.md) / Write mode

# Write mode

A recipe that is slow to type does not get typed. Write mode has one goal: you put a recipe into the app in about the time that you need to read it.

## Only text

A recipe needs a name, its steps, and its ingredients. The meal type, the servings, and the source have a usual value, so you change them only when it is necessary.

There is no photo button and no timer field. The photos come from [Cook mode](cook-mode.md). The timers come from [the text of a step](step-text.md).

## Steps are a list

Each step is one row. You type a step and press Enter, and the cursor is in the next step. There is no "Add" button.

You can also paste. The app makes one step from each line. It removes a number at the start of a line, such as "1." or "2)". So a method from a web page or from a note becomes a list in one action.

## An ingredient is a name and a number

You type the first letters of a name, and the app shows the ingredients that it knows. You select one and type the number. You do not type a unit, because each ingredient has one unit in the full app.

| You type      | The app shows            | Then you type | The row     |
| ------------- | ------------------------ | ------------- | ----------- |
| "ri"          | Rice                     | 300           | Rice, 300 g |
| "curry paste" | Nothing: the name is new | The unit      | Curry paste |

For a new name, the app asks for the unit one time and makes the ingredient.

## There is no Save button

The app saves each change at once. If you put the phone down in the middle of a recipe, nothing is lost.

## An example

You paste five lines for "Chicken curry" and add four ingredients. The app gives each step an ID at this moment. The ID is the reason that a step [keeps its photos and notes](data-model.md) when you change its text.

## Further reading

- [Share a recipe](share-a-recipe.md): how a recipe that you type on the desktop gets to the phone.
