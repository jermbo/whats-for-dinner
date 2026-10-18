---
title: "Spec: one row for each package"
summary: "The scope of the work on packages: a pantry row that is one package with its own size and date, a bar that fits the package, and put away, meals, and the list that agree with it."
parent: decision-log.md
updated: 2026-10-18
status: agreed
---

[Wiki](../../README.md) / [Decision log: one row for each package](decision-log.md) / Spec: one row for each package

# Spec: one row for each package

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

The keeper stands at the fridge with two gallons of milk: one is half full, and one is new, each with its own date. The pantry has one row "1.5 gal" with one date, and its bar stops at the full amount of 1 gal. The bar moves by half a gallon, and eggs move by 2, so the keeper cannot set what is in front of them.

## The solution

Each package is one row, with its own size, its own amount left, and its own use-by date. The bar of a package is as long as the package, and it moves in small steps. Put away, meals, and the list keep the packages correct with no extra work.

An example: milk has two rows in the kitchen fridge: 1/2 of 1 gal until 22 October, and 1 of 1 gal until 29 October. The keeper drags the open jug to 1/4 gal. The pancakes need 1/2 gal, so the end of the meal takes 1/4 gal from the open jug and 1/4 gal from the new one. The open jug is now an empty row, and the next gallon at put away takes its place.

## In scope

### The rows

1. One row of the table is one package, with its own size, amount left, and use-by date (decisions 1 and 2)
   - a. Packages that are the same are each their own row (decision 2)
2. The table of the food item note gets the column `Size` (decision 3)
   - a. Each row has a size. A row with no size gets its own amount as its size (decision 6)
   - b. A row with no number, such as "a full bag", has no bar, as today (decision 6)
3. A food item with `loose: true` has no packages (decision 11)
   - a. It has one row for each place, and new food goes into that row (decision 11)
   - b. The size of a loose row is its amount after each addition (decision 11)
   - c. The chip "Loose" on the line of put away and in the form of the Pantry part writes `loose: true` (decision 11)
4. A package that is used up keeps its row, with nothing left (decision 17)
   - a. One empty row stays for each place of a food item. The next empty package of that place goes out of the table (decision 20)
   - b. A food item is out when each row has nothing left, or when the note has no row (decision 19)
   - c. An empty row has no use-by date that counts (decision 27)

### The bar and the level

5. The bar of a package is as long as its size (decisions 1 and 4)
   - a. A step is 1/8 of the size for a measure, and 1 for a count (decision 4)
6. The full amount and the low line stay for the level, and no bar stops at the full amount (decision 5)
   - a. The plugin learns the full amount as it does today (decision 5)

### The Pantry part

7. The Pantry part has one line for each food item in each place, such as "Beans · 8 cans" (decision 9)
   - a. The badge of the line shows the first date of its packages (decision 9)
   - b. A line with only empty rows shows "Out" (decision 22)
8. A tap on the line opens its packages (decisions 9 and 10)
   - a. The sealed packages show as one count with "−" and "+", one count for each date (decision 10)
   - b. Each open package shows its own bar and its own date (decision 10)
   - c. An empty row does not show (decision 22)
   - d. "Add package" copies the size of the last package, with an empty date (decision 13)
   - e. "Used up" on a package sets it to nothing (decisions 13 and 17)
   - f. A tap on a sealed count opens one package of it (decision 28)
   - g. "−" on a sealed count makes one package an empty row, and "+" adds one sealed package (decision 29)

### Put away and the receipt

9. Put away has one line for each package, each with its own date (decision 7)
   - a. The number of lines is the amount of the list divided by the last size. With no last size, it is 1 line (decision 12 and answer b)
   - b. "+ package" copies a line (decision 12)
   - c. The last size comes from the newest receipt row (decision 15)
   - d. A new food item gets the amount of its line as its size (decision 14)
10. Each line of put away makes a new row, or writes over the empty row of its place (decisions 7 and 21)
    - a. Loose food goes into the row of its place (decision 11)
11. The receipt has one row for each package, and the price of a row is the price of one package (decision 15)

### Meals and the list

12. A meal takes from as many packages as it needs (decision 18)
    - a. It takes from the package with the first date first (decision 8)
    - b. With the same date, or no date, the open package gives first (decision 8)
13. The list asks for the amount that the meals need, as today (decision 16)
    - a. The list never asks for a size (answer a)
    - b. A row of the list shows the price of the newest receipt row, as today (answer c)

### The units

14. Gallons, quarts, pints, and fluid ounces are volumes, and the plugin converts them (decision 25)
15. An eighth that is not round with 2 decimals shows as a fraction, such as "3/8 gal" (decision 26)

## Out of scope

1. One row for each place with one date, and one row for sealed packages that are the same (decisions 1 and 2)
2. One package size for the food item, and the form "2 of 12" for an amount (decision 3)
3. A bar that stops at the full amount, and steps from the full amount (decisions 4 and 5)
4. A low line that counts packages (decision 5)
5. One line for each package in the Pantry part, and one bar for each sealed package (decisions 9 and 10)
6. A list that shows or counts packages, such as "2 × 1 gal" (decision 16)
7. The first fill of the pantry in setup (decision 23)
8. A brand on a row of the pantry (decision 24)
9. A fixed list of units, with a unit chip in place of typed text. It is a later initiative (decision 30)

## What changes in the system

Architecture pages that change:

- [Food item note](../../architecture/food-item-note.md): the column `Size`, the property `loose`, and the empty row.
- [Amounts](../../architecture/amounts.md): gallons, quarts, pints, and fluid ounces, and eighths as fractions.
- [Amount bar](../../architecture/amount-bar.md): one bar for each open package, the steps, and the count of the sealed packages.
- [Level](../../architecture/level.md): the full amount only for the level, and out with empty rows.
- [Pantry](../../architecture/pantry.md): one line for each food item in each place, "Add package", and "Used up".
- [Put away](../../architecture/put-away.md) and [facts of an item](../../architecture/put-away-facts.md): one line for each package, "+ package", the chip "Loose", and the empty row.
- [Receipt](../../architecture/receipt.md): one row for each package.
- [End of a meal](../../architecture/end-of-a-meal.md) and [use soon](../../architecture/use-soon.md): a meal that takes from more than one package.
- The wiki [glossary](../../glossary.md): package, package size, left, step, open package, sealed, and the new meaning of row. The [features](../../features/README.md) page and the [roadmap](../../features/roadmap.md): the roadmap item on the full amount of the bar goes.

Notes and data that get a different form:

- **The food item note** gets the column `Size` and the property `loose`. Prototype data is disposable, so the notes of the test vault are reset to the new form. `Milk.md` and `Eggs.md` get one row for each package.
- **The receipt** gets one row for each package. The receipts of today count as rows of one package each.
- **The shopping note** and **the data file** do not change.

## How you test it

Checks that need the phone:

1. Milk with two rows, 1/2 of 1 gal and 1 of 1 gal, shows "Milk · 1.5 gal" on one line. The open line shows two bars, and the open jug moves to 1/4 gal. (Scope 1, 5, 7, 8 b)
2. Eggs with 2 of 12 and 12 of 12: the open carton moves to 3, and the sealed carton shows as "1 sealed". (Scope 5 a, 8 a)
3. Cook an omelette with 3 eggs. The open carton is empty and does not show, and the sealed carton is open with 11. (Scope 4, 8 c, 12)
4. Put away "Milk, 1.5 gal" with a last size of 1 gal. It gives 2 lines, each with its own date, and the receipt has 2 rows. The new jug takes the empty row of the kitchen fridge. (Scope 9, 10, 11)
5. Put away 6 apples with the chip "Loose" on, and then 6 more. The note has one row of 12 in its place. (Scope 3)
6. "Used up" on the last gallon shows "Out", and milk is on the list. (Scope 4 b, 7 b, 8 e)

Rules that are worth an automatic test, each with the place where a test sees the behaviour from outside:

1. **The rows of a food item.** The text of a food item note goes in. The rows come out, each with its size, and a row with no size has its amount as its size. (Scope 1, 2)
2. **The step of the bar.** A package size goes in. The step comes out: 1 pint for 1 gal, 1 for 12 eggs. (Scope 5 a)
3. **A meal takes from the packages.** The rows of a food item and an amount go in. The new rows come out, with the first date first, the open package first on the same date, and one empty row for each place. (Scope 4 a, 12)
4. **Put away into the rows.** The text of a food item note and a package go in. The new text comes out: a new row, the empty row of the place written over, or a loose row that grows. (Scope 3 a, 10)
5. **The lines of put away.** The amount of the list and the last size go in. The number of lines comes out. (Scope 9 a)
6. **Out.** The rows of a food item go in. Out comes out when each row has nothing left. (Scope 4 b)

## Further reading

- [Glossary: one row for each package](glossary.md): the words of this page.
