---
title: "Spec: a simple pantry"
summary: "The scope of the work on a simple pantry: a level or a count for each package, units from a list, one bar for each food item, a short form, meals that take from the open package, and a weekly audit."
parent: decision-log.md
updated: 2026-10-19
status: agreed
---

[Wiki](../../README.md) / [Decision log: a simple pantry](decision-log.md) / Spec: a simple pantry

# Spec: a simple pantry

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

The keeper stands at the fridge with two gallons of milk, and the phone shows one gallon. The form of milk has eleven fields, a date field out of its border, and a unit that you must type. The planner wants a week planned in 30 minutes, but the pantry is wrong and hard to correct.

## The solution

Each package has a level or a count, which you set with one tap. One bar for each food item shows all its packages, with the place in focus dark. A meal takes from the open package first. Once a week, the audit walks each place, and you confirm or correct each food item.

An example: milk has a jug at 1/4 and a full jug in the fridge. The bar is 2 gal long with 1 1/4 gal filled. The pancakes take 1 cup from the open jug, and its level stays 1/4. In the audit, you see that the jug is nearly empty, and you tap "Empty". The jug goes out of the note, and milk is low.

## In scope

### The food item note

1. A food item is counted or measured, and its package size tells which (decision 2)
2. A package has a place, what is left, a package size, and a use-by date (decisions 1, 3, and 4)
   - a. What is left is a level for a measured package: full, 3/4, 1/2, 1/4 (decision 3)
   - b. What is left is a count for a counted package (decision 4)
3. The unit of a package size is one of: tsp, tbsp, cup, fl oz, pt, qt, gal, ml, l, oz, lb, g, kg (decision 5)
4. A package that is empty goes out of the note, and a note with no package is out (decision 11)
5. The properties `full`, `low`, and `loose` go out, and the unit system of the vault goes out (decisions 6, 12, and 13)
6. The properties for other names, staple, and brands stay (decisions 14 and 15)

### Low and meals

7. A food item is low when only one package is left, at 1/4 or less of its size (decision 12)
8. A meal takes food from the open package first, then the first use-by date, then the higher row (decision 9)
9. A meal converts the amount of the recipe to a part of the package, and the level rounds to the nearest level (decision 7)
   - a. A full package that a meal takes from is 3/4 or less (decision 8)
   - b. Food that the plugin cannot convert does not change, and it is "to check" (decision 10)

### The pantry bar

10. Each line of the Pantry part has one bar for the food item, with one part for each package (decision 17)
    - a. A part is as long as its package size, and its fill is its level or its count (decision 17)
    - b. The total of all places shows below the bar: "1 1/4 gal · 2 packages" (decision 17)
11. The packages of the place of the group are dark, and the packages of other places are grey (decision 18)
12. A tap on a line opens its card, as in the first design (decision 27)
    - a. The card shows the name, the place, the count of packages here and of places, and a large total (decision 27)
    - b. The bar of the card is 44 pixels high, with a thin line between two packages (decision 27)
    - c. A drag on a package puts the olive handle on it, and the fill snaps to a quarter or to one (decision 27)
    - d. A drag stops at one stop. The link "Empty" takes the package away (decision 30)
    - e. The scale shows 0, the package under the handle, and the size of all packages (decision 27)
    - f. The sequence of the packages stays fixed while the card is open (decision 29)
    - g. "Done" closes the card (decision 27)
13. "+ Add package" adds a full package with the size of the newest package of this place, and gives it the handle (decision 28)
14. A metric amount shows as on its label, such as 425 g and 2.7 kg. Other units show in quarters (decision 31)

### The forms

15. The link "Place and date" opens the place chips and the date field inside the card (decisions 20 and 32)
16. The form of the food item has the package size, the other names, the staple, and the brands (decisions 14 and 20)
    - a. A link in the card opens it (decision 20)
    - b. The unit of the package size is a chip of the unit list (decision 5)
17. Each part of each form stays in its border on a screen of 375 pixels (decision 21)
18. "Add to pantry" asks for a name, and then it opens the card of that food item (decision 22)
    - a. It finds a food item by its name, its other names, or a brand (decision 22)
    - b. The place and the package size come from the last package (decision 22)
    - c. A new food item asks for its package size first (decision 22)

### Brands

19. A brand has a verdict: "Buy again", "Avoid", or none (decision 16)
    - a. The verdict shows on the photo of the brand in the store (decision 16)

### The audit

20. The audit shows one place at a time, with each food item and its bar in focus (decision 23)
    - a. "Right" confirms a food item (decision 23)
    - b. A tap on a food item opens its card, where you drag or empty a package (decisions 23 and 27)
    - c. The food items that are "to check" come first (decisions 10 and 23)
21. The audit remembers the last place that you finished (decision 24)

### What stays

22. Recipes find food items and sort by the pantry as today (decision 25)
23. Put away makes one package for each line: full, or the count of its size (decision 26)

## Out of scope

1. An exact amount in a package, also behind a level (decision 3)
2. Level chips, and "−" and "+" (decision 27)
3. A table of densities, to compare a volume with a weight (decision 10)
4. A unit system for the vault (decision 6)
5. Loose food (decision 13)
6. Stars for a brand (decision 16)
7. A migration of the notes of today (decision 1)

## What changes in the system

| Page                                                          | The change                                                                 |
| ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Pantry](../../architecture/pantry.md)                        | The new model, the bar, the two forms, and the audit.                      |
| [Food item note](../../architecture/food-item-note.md)        | The new table: `Left` is a level or a count. Fewer properties.             |
| [Level](../../architecture/level.md)                          | A level of a package, and the new rule for low.                            |
| [Amount bar](../../architecture/amount-bar.md)                | Replaced by the pantry bar.                                                |
| [End of a meal](../../architecture/end-of-a-meal.md)          | The open package first, the rounding, and "to check".                      |
| [Brands](../../architecture/brands.md)                        | The verdict.                                                               |
| [Amounts](../../architecture/amounts.md), [Convert](../../architecture/convert.md) | The unit list, and no unit system.                    |
| A new page "Audit"                                            | The weekly walk.                                                           |

The note of milk after this work:

```markdown
---
aliases:
  - whole milk
staple: often
---

| Place  | Left | Size  | Use by     |
| ------ | ---- | ----- | ---------- |
| Fridge | 1/4  | 1 gal | 2026-10-22 |
| Fridge | full | 1 gal | 2026-10-29 |
```

## How you test it

On the phone:

1. Two gallons of milk, one at 1/4, show a bar of 2 gal with "1 1/4 gal · 2 packages".
2. A drag of the full jug to 1/4 and "Empty" on the other jug leave one jug at 1/4, and milk shows as low.
3. The card of milk, with "Place and date" open, has no field out of its border on a phone.
4. "+ Add package" on eggs, two times, gives three cartons. A drag of the first can of beans to full does not move the handle to a different can.
5. A new food item "Oat milk" gets the package size "64 fl oz" with a chip, and no unit is typed.
6. The omelette takes 3 eggs: the 4 of the open carton become 1, and the new carton stays 12.
7. The pancakes ask for 2 cups of flour against a bag of 2 lb, and the audit shows flour first.
8. The audit stops after "Fridge", and it continues at the next place.
9. Brand A with "Avoid" shows the mark on its photo in the Shop part.

Worth an automatic test: the sequence in which a meal takes from packages, the rounding of a level, and the rule for low.
