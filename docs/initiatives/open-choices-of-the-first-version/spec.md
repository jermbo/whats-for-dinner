---
title: "Spec: units of the vault"
summary: "The scope of the work that the open choices changed: one unit system for each vault, a rough rule between grams and millilitres, and the mark for food that the plugin cannot count."
parent: decision-log.md
status: agreed
---

[Wiki](../../README.md) / [Decision log: open choices of the first version](decision-log.md) / Spec: units of the vault

# Spec: units of the vault

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

> **Replaced in part.** The [simple pantry](../simple-pantry/spec.md) of the same version replaces the unit system, the bar in round steps, and the field "Package size". The rough rule and the mark "Check" stay. Only decisions 2, 3, and 4 change the plugin. Each other decision keeps what is built.

## The problem

The keeper records salt as "1.5 box" and taco seasoning as "1 bag". A recipe that wants 25 g of salt compares with nothing, so the plugin says "in the pantry" and counts nothing. The cook sees the same check for food that the plugin counted and for food that it guessed. A recipe in spoons, such as "1 tablespoon sugar", never compares with a bag of 250 g.

## The solution

Each vault has one unit system, and each row of the pantry is in it. A spoon of sugar compares with grams by one rough rule. Food that the plugin still cannot count gets the mark "Check".

An example: the vault is metric. The keeper adds salt with "26 oz", and the row gets "737 g". A recipe wants 1 tablespoon of sugar, and the pantry has 250 g: the plugin counts 15 g, and the end of the meal takes 15 g out. A recipe wants 1 onion, and the pantry has 500 g of onions: the line shows "Check".

## In scope

1. Mass and volume compare with the rule 1 ml = 1 g, for each food (decision 2)
   - a. The match, the shopping list, the level, Get out, and the end of a meal use the rule (decision 2)
   - b. A line that the rule converts has no mark (decision 2 a)
2. The vault has one unit system: metric or imperial (decision 3)
   - a. The setting "Units" has the two values, and metric is the default (decision 3 d)
   - b. Setup asks the unit system in its first step, with metric selected (decision 3 d)
   - c. A change of the setting does not change the rows that exist (decision 3 d)
   - d. Metric is g, kg, ml, and l. Imperial is oz and lb, and fl oz, cup, qt, and gal (decisions 3 and 3 e)
3. Each amount that you type for the pantry is in the unit system of the vault, or a plain count (decision 3)
   - a. The amount and the size of the Pantry form, the low line of that form, the amounts of the first food in setup, and the amount at put away (decision 3)
   - b. An amount in the other system changes at entry: "8 oz" becomes "227 g" in a metric vault, rounded to a whole gram or millilitre (decision 3 c)
   - c. An amount with a different unit, such as "1 jar", is not permitted. The field tells you to give the weight or the volume from the label (decision 3)
   - d. Text with no number, such as "tap", is permitted (decision 5)
4. Food that the plugin cannot count is "in the pantry" with the mark "Check" (decision 4)
   - a. The two cases: a count against a mass or a volume, and a row with no number against an amount (decision 4)
   - b. The recipe card and Get out show the mark on the line (decision 4)
   - c. The meal card of the plan shows the number of such lines, as "1 to check" (decision 4)
5. The rows of the test vault are in metric (decision 3)

## Out of scope

1. A table of the weight of a spoon for each food, and a weight in the food item note (decision 2)
2. "dozen" as 12 of a count (decision 2)
3. A toggle that shows a recipe in the other system (decision 3 f)
4. The rows that exist change when the setting changes (decision 3 d)
5. A unit of the label, such as "8 oz", in a metric vault (decision 3)
6. Water always there, or a list of food that is always there (decision 5)
7. Food that the plugin cannot count goes on the list (decision 4)

## What changes in the system

- [Amounts](../../architecture/amounts.md): the rough rule, and the unit system.
- [Match](../../architecture/match.md): the table of the statuses, with "Check".
- [Settings](../../architecture/settings.md): the setting "Units".
- [Setup](../../architecture/setup.md): the question of the first step.
- [Food item note](../../architecture/food-item-note.md): a row is in the unit system of the vault.
- [Facts of an item](../../architecture/put-away-facts.md): the amount at put away.
- [Cook Mode](../../architecture/cook-mode.md) and [Plan](../../architecture/plan.md): the mark.
- The data file gets the value `units`. A food item note keeps its form, but a row with a container word is not permitted at entry.

## How you test it

- On the phone: the mark on the recipe card, in Get out, and on the meal card. The message of the field for "1 jar". The question of setup.
- With no screen, worth an automatic test: an amount goes in with a unit system, and the amount of the row or a refusal comes out. A recipe and a food item note go in, and the status of each ingredient comes out.
