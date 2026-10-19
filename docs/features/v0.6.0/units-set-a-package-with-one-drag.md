---
title: Set a package with one drag
summary: "The open line always has a bar, the bar moves in round small steps, a metric amount shows as the label shows it, and the form for new food asks for the package size."
parent: units-stories.md
updated: 2026-10-18
persona: Keeper
depends-on: [units-keep-the-pantry-in-one-unit-system.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Units stories](units-stories.md) / Set a package with one drag

# Set a package with one drag

As the [keeper](../../personas.md), I want to open a line and drag its bar to what I see, in small steps, so that a jug of milk or a bottle of oil is correct with one move.

## Requirements

1. An open line always has a bar (decision 6)
   - a. With no open package, the first sealed package shows as a bar, full, and its count is 1 less
   - b. The first sealed package is the one with the first date. A package with no date is last
   - c. With no change, the package stays sealed, and "Done" writes nothing
   - d. A tap on a count still opens one more package of it
2. A step is a round amount (decision 7)
   - a. In g or ml, the step is the smallest value of 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000 that is 1/40 of the size or more
   - b. In oz, lb, or fl oz, the step is from the same list, in that unit, and the list also has 0.1, 0.2, 0.25, and 0.5
   - c. In gal, qt, pt, or cup, the step is 1/8 of one unit
   - d. For a count, the step is 1
   - e. The amount goes to the nearest step, and the middle of two steps goes up. The size is always a stop
3. A metric amount shows as the label shows it (decision 8)
   - a. Less than 1000 is in g or ml. 1000 or more is in kg or l
   - b. The bar, the end of the bar, and the row that "Done" writes use this form
4. The form "Add to pantry" has the field "Package size" (decision 9)
   - a. The field is next to "How much", and is optional
   - b. With no package size, the amount is the size
   - c. The size goes into the unit system of the vault, as the amount does
   - d. The form of one package names the field "Package size" too
5. The style of the open line
   - a. The text of a count wraps, and never goes below "−" or "+"
   - b. "Add package" and "Done" are each on one line. In a narrow column, they go one below the other
   - c. A part, a bar, and a group of chips show no tooltip when the pointer is on them

## Acceptance criteria

Each criterion starts with the vault of the [list page](units-stories.md#what-the-vault-needs).

1. GIVEN the row of milk with the date 2026-10-22 is an empty row WHEN the keeper taps the line of milk THEN the open line shows one bar with the date 2026-10-29 at "3.79 l"
   - a. AND no count
2. GIVEN the open line of milk from AC 1 WHEN the keeper taps "Done" THEN the plugin does not write `Milk.md`
3. GIVEN the open line of milk from AC 1 WHEN the keeper presses the bar at 1/4 of its length THEN the amount is "900 ml"
   - a. AND after "Done", `Milk.md` has the row `Fridge | 900 ml | 3.79 l | 2026-10-29`
4. GIVEN the focus is on the bar of the open jug of milk at 1.89 l WHEN the keeper presses the right arrow key THEN the amount is "2 l"
5. GIVEN the open line of black beans WHEN the keeper presses the right arrow key on the bar of the open can at 213 g THEN the amount is "240 g"
   - a. AND the counts "5 sealed · 2027-03-01" and "2 sealed · 2027-06-01" are as before
6. GIVEN the form "Add to pantry" WHEN the keeper types "Olive oil", the place "Kitchen pantry", the amount "300 ml", the package size "1 l", and taps "Save" THEN `Olive oil.md` has the row `Kitchen pantry | 300 ml | 1 l |`
   - a. AND the open line of olive oil has a bar at "300 ml" that ends at "1 l"
7. GIVEN the form "Add to pantry" WHEN the keeper types "Rice", the amount "1 kg", no package size, and taps "Save" THEN `Rice.md` has the row with the amount `1 kg` and the size `1 kg`
8. GIVEN the form "Add to pantry" in a metric vault WHEN the keeper types the package size "1 gal" and taps "Save" THEN the row has the size `3.79 l`
9. GIVEN the open line of milk in a column of 280 px WHEN the keeper looks at it THEN "Add package" and "Done" each show on one line
10. GIVEN the Pantry part on the computer WHEN the pointer is on an empty part of the screen or on a bar THEN no tooltip shows

## Depends on

- [Keep the pantry in one unit system](units-keep-the-pantry-in-one-unit-system.md): the metric rows that the bar must follow.

## Architecture

- [Amount bar](../../architecture/amount-bar.md): the open line, the steps, and the form of an amount.
- [Pantry](../../architecture/pantry.md): the form "Add to pantry".
- [Decision log: open choices](../../initiatives/open-choices-of-the-first-version/decision-log.md): decisions 6 to 9.
