---
title: Keep the pantry in one unit system
summary: "The vault is metric or imperial. Each amount that you type for the pantry goes into that system, and a container word is not a unit."
parent: units-stories.md
updated: 2026-10-18
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Units stories](units-stories.md) / Keep the pantry in one unit system

# Keep the pantry in one unit system

As the [keeper](../../personas.md), I want each amount that I type to go into the unit system of my vault, so that each row compares with each recipe and I never record "1 jar".

## Requirements

1. The setting "Units" has the values "Metric" and "Imperial". Metric is the default
   - a. Metric is g, kg, ml, and l. Imperial is oz and lb, and fl oz, cup, qt, and gal
   - b. A change of the setting does not change the rows that exist
2. The first step of setup asks the unit system, with two chips and "Metric" selected
3. Each amount that you type for the pantry goes into the unit system of the vault
   - a. The fields: the amount, the size, and the low line of the Pantry form, the amounts of the first food in setup, and "Another amount" at put away
   - b. An amount in the other system changes: "8 oz" becomes "227 g" in a metric vault, and "500 g" becomes "17.64 oz" in an imperial vault
   - c. Metric rounds to a whole gram or millilitre, and shows 1000 or more as kg or l
   - d. A plain count, such as "12", stays as it is
   - e. Text with no number, such as "tap", stays as it is
4. An amount with a different unit, such as "1 jar" or "2 bags", is not permitted
   - a. The field shows "Give the weight or the volume from the label, such as 250 g, or a plain count, such as 6.", and "Save" or "Put away" does nothing
   - b. In an imperial vault, the example is "8 oz"

## Acceptance criteria

Each criterion starts with the vault of the [list page](units-stories.md#what-the-vault-needs), which is metric.

1. GIVEN the form "Add food" WHEN the keeper types "Salt", the amount "26 oz", and taps "Save" THEN `Salt.md` has a row with `737 g`
2. GIVEN the form of sugar WHEN the keeper types the amount "1 jar" and taps "Save" THEN the field shows "Give the weight or the volume from the label, such as 250 g, or a plain count, such as 6."
   - a. AND `Sugar.md` does not change
3. GIVEN the form of milk WHEN the keeper types the size "1 gal" and taps "Save" THEN the row of milk has the size `3.79 l`
4. GIVEN the form "Add food" WHEN the keeper types "Water", the amount "tap", and taps "Save" THEN `Water.md` has a row with `tap`
5. GIVEN a line of eggs at put away WHEN the keeper selects "Another amount", types "12", and taps "Put away" THEN the new row of eggs has `12`
6. GIVEN the setting "Units" is "Imperial" WHEN the keeper adds "Rice" with "500 g" THEN `Rice.md` has a row with `17.64 oz`
7. GIVEN a new vault WHEN setup opens THEN its first step has the chips "Metric" and "Imperial", with "Metric" on

## Depends on

Nothing.

## Architecture

- [Amounts](../../architecture/amounts.md): the unit system.
- [Settings](../../architecture/settings.md): the setting "Units".
- [Setup](../../architecture/setup.md): the question of the first step.
- [Food item note](../../architecture/food-item-note.md): a row in the unit system.
- [Facts of an item](../../architecture/put-away-facts.md): the amount at put away.
- [Spec: units of the vault](../../initiatives/open-choices-of-the-first-version/spec.md): scope 2, 3, and 5.
