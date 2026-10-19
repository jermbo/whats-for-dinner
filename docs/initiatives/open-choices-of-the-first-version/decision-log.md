---
title: "Decision log: open choices of the first version"
summary: "The choices that the first version made with no decision from the owner, and the decision for each of them."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: open choices of the first version

# Decision log: open choices of the first version

The eight slices of the [build plan](../../../PLAN.md) were built before each choice had a decision, so that the full loop could be tested. The plan has a table "Choices that are not decided". This page closes that table, one choice at a time, and records each decision with its reason.

> **Replaced in part.** The [simple pantry](../simple-pantry/decision-log.md) of the same version replaces decisions 3, 6, 7, and 9: the vault has no unit system, and the card with its stops replaces the bar in round steps and the field "Package size". Decisions 1, 2, 4, 5, and 8 stay.

## The state of today

The table has 47 rows. Fourteen of them are not open now.

| Rows                                                                 | Why they are not open                                                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Fonts, Pantry look                                                   | The table marks them "Decided".                                                       |
| Pantry row, Set an amount, Open row, Bar is full                     | [One row for each package](../one-row-for-each-package/decision-log.md) replaced them. |
| Pantry filter                                                        | Decision 8 of [one bar for each part](../one-bar-for-each-part/decision-log.md) replaced it. |
| Put away, Same place, New food, Low on the list, Fill                | The [shopping list](../shopping-list/decision-log.md) decisions replaced them.        |
| Recipe find, Get out                                                 | Stories of a later version decided them.                                              |

The other 33 rows are open. This grill takes them in groups by subject:

1. The match: names, units, no comparison, water, not counted, other unit.
2. The pantry: use soon, level, full amount, low line, pantry find.
3. The recipe note: recipe type, types, preparation, steps, timer, record.
4. The plan: which notes, plan, plan note, new week, week, today, cook in the plan, prep is done.
5. Cook Mode: alarm, cook screen, take out, amount left.
6. The look: prep in notes, look, accent colour, settings.

## Decisions

### The match

1. **A recipe name finds a food item by its name or by one of its other names. Singular and plural are equal.** "egg" finds "Eggs". When "pasta" is an other name of elbow pasta and of shell pasta, the recipe finds the two, and Get out selects the one to use first. The reason: the usual cases need no work from you, and the "7 of 9" stays true. Two options were rejected:
   - The name only. You must add each other name yourself, and "egg" does not find "Eggs".
   - A loose match, such as "chicken" for "chicken thighs". "Pepper" finds bell pepper and black pepper, and the count is wrong with no warning.
2. **Mass converts with mass, and volume with volume. Mass and volume convert roughly, with 1 ml = 1 g for each food. A count compares only with the same unit.** Mass is g, kg, oz, and lb. Volume is ml, cl, dl, l, tsp, tbsp, cup, fl oz, pt, qt, and gal. 2 cups of milk compare with 1/2 gal. 1 tbsp of sugar is always 15 g against a row of 250 g. "2 cans" and "1 can" add up, and case, a dot, and the plural do not matter. The reason: you mostly cook, and close is good. One rule that is always the same is easy to trust, and it needs no new fact from you. Sugar is near (about 12 g in a spoon), flour is far (about 8 g), and your baking recipes are in metric. A typo, such as "1 gall", is the roadmap idea "standard units". Four options were rejected:
   - No conversion of mass and volume. The sugar line compares with nothing.
   - A fixed table of the weight of a spoon for common foods. It is a list to maintain, for a precision that cooking does not need.
   - A weight for each spoon in the food item note. It is a new fact for each food item, and that is work for the keeper.
   - "dozen" as 12 of a count.
   - a. A line that the rough rule converts has no mark. The rule is always the same, so the count is a count.
3. **The vault has one unit system: metric or imperial. Each row of the pantry has its amount and its size in that system, or as a plain count.** Your vault is metric: g, kg, ml, and l. A cook who wants imperial has each row in oz, lb, fl oz, and gal. A container word such as "jar", "bag", or "box" is not a unit: at entry, you give the weight or the volume from the label, so "1 jar" becomes "250 g". A label in the other system changes at entry, so "8 oz" becomes "227 g" in your vault. Eggs and apples stay a count. The reason: a pantry in one system is easy to read and to compare. A recipe that wants 25 g takes 25 g from the jar. Two options were rejected:
   - The unit of the label, such as "8 oz" in a metric vault. One food item then shows in two systems.
   - A container word as a unit, as today. "1 jar" compares with nothing.
   - a. This decision closes the rows "Not counted" and "Other unit" of the build plan. A row with "a full bag" or "3 bags" is not permitted.
   - b. Recipes can be in either system, so decision 2 stays. You select metric recipes when you can.
   - c. The fields of entry accept the units of the other system and write the units of the vault. You type "8 oz", and the row gets "227 g", rounded to a whole gram or millilitre. You read the label as it is, and you do not calculate at the shelf.
   - d. The unit system is a setting, and setup asks it with metric selected. A change of the setting later does not change the rows that exist.
   - e. The imperial system is oz and lb for mass, and fl oz, cup, qt, and gal for volume.
   - f. Out of scope: a toggle that shows a recipe in the other system. It is an idea on the [roadmap](../../features/roadmap.md).
4. **Food that the plugin cannot count is "in the pantry", with a mark "check".** It counts in the "7 of 9", and it stays off the list. The recipe card, the plan, and Get out show the mark on that line. Two cases give the mark: a count against a mass or a volume, such as "1 onion" against a row of 500 g, and a row with no number, such as water "tap". The reason: Get out is where you put each ingredient on the counter before you start. Food that you do not buy, such as water, is still an ingredient to call out, and the mark tells you that this line is not a count. Two options were rejected:
   - "In the pantry" with no mark, as today. A jar that is nearly empty looks full.
   - Missing, and on the list. The onion goes on the list each week, and you have 500 g.
5. **Water is a food item like each other food item. A recipe finds water only when the pantry has a row for it, such as "tap".** Get out shows water as a line, as it shows each ingredient of the recipe. The reason: the rule is built, and it has no exception. What matters is that water is called out in Get out, and it is. Two options were rejected:
   - Water always there, with fixed code. It is an exception for one food.
   - A setting with a list of food that is always there. Nearly no food other than water needs it.

### The rest of the table

The owner asked for the rest of the table to be decided with no question: each of these choices is built and works, and a choice that is wrong in the test changes then. So each row keeps the choice of the first version, with the reason below.

| Subject          | Decision: as built                                                                                      | The reason                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Use soon         | 5 days or less. A setting gives 1 to 14.                                                                | One number for each food is work, and the setting fixes a wrong default.                     |
| Level            | The level counts all places of a food item.                                                             | You buy too much when you do not think of all the places.                                    |
| Full amount      | The most that the pantry had. The plugin writes it, and you can change it.                              | Automatic first: no number to type.                                                          |
| Low line         | The property `low`, or 25% of the full amount. The percentage is a setting.                             | Each food is low with no work, and one property corrects the food that is wrong.             |
| Pantry find      | The name, the other names, or the brands.                                                               | In the store you read a brand on the shelf.                                                  |
| Recipe type      | The first tag of the recipe, such as "dinner".                                                          | It is in the note, and intake writes it.                                                     |
| Types            | Dinner, breakfast, lunch, and snack always show, in this sequence. Each other type shows with a meal.   | They are the meals of a day.                                                                 |
| Preparation      | A callout of the type "prep". The first one counts.                                                     | It is plain Markdown, and you read it with no plugin.                                        |
| Steps            | Each item of a list is a step. With no list, each paragraph is a step.                                  | It is the RecipeMD form, and old notes with paragraphs still work.                           |
| Timer            | The first time in a step is its timer. "1 hour 30 minutes" is one time.                                 | Most steps have one time.                                                                    |
| Record           | The date, the rating, the note, and the photo go below the heading "Cooked".                            | The record stays in the recipe note, where you read it in 20 years.                          |
| Which notes      | The recipes folder of setup. With no folder, the plugin tries each other note.                          | Setup always sets the folder. The other case is for an old vault.                            |
| Plan             | One note, with one task for each meal. A done task is cooked.                                           | A task works in Obsidian with no plugin.                                                     |
| Plan note        | The plugin changes only the lines of the meals. All other text stays.                                   | Your notes in the plan note are yours.                                                       |
| New week         | "Start a new week" removes each meal, after a question.                                                 | It removes text, so it asks first.                                                           |
| Week             | Room for 7 meals of each type that you did not cook.                                                    | A meal has no fixed day, so one bad day does not break the plan.                             |
| Today            | "Today" gives the task the date. The selection ends with the day.                                       | The meal of today is the one to prepare.                                                     |
| Cook in the plan | Only a meal of today has "Cook" in the plan. A recipe in Recipes has "Cook" always.                     | The plan leads you to the meal of today. Recipes stay open for a meal with no plan.          |
| Prep is done     | A check box. The task gets "prep done". "Cook" is quiet until then, but not locked.                     | You can cook with no prep when you know better.                                              |
| Alarm            | The sound comes again and again, until "OK" or one minute.                                              | A cook away from the stove hears it.                                                         |
| Cook screen      | The two buttons do not move. A long page scrolls inside the card.                                       | Dirty hands find the buttons in the same place.                                              |
| Take out         | The row with the first use-by date gives its food first.                                                | Food is used before it spoils.                                                               |
| Amount left      | A row keeps its unit if the amount left is round in it, such as "1.7 kg". If not, it is in g or ml.     | You read the amount as the package shows it.                                                 |
| Prep in notes    | The callout gets a clock and the orange of your theme.                                                  | The prep stands out when you read the note.                                                  |
| Look             | The Larder look. In the dark scheme, paper and ink change places.                                       | It is the look that you selected.                                                            |
| Accent colour    | Olive, or the accent colour of your theme. The default is olive.                                        | Olive is the colour of the Larder look.                                                      |
| Settings         | The look of Obsidian. The values are in the data file.                                                  | A settings screen of a plugin looks like Obsidian.                                           |

### The open line in a metric vault

Decision 3 made the vault metric. A jug of milk became 3.79 l, and the bar of [one row for each package](../one-row-for-each-package/decision-log.md) did not follow. A step of 1/8 of the jug is 0.47 l, and the bar showed "0.3 l" where the bottle says 300 ml. The owner, after the first test of version 0.6.0:

> I dont think the edit sliders are working as expected. And there are a lot of style issues
>
> Where did my slider go? why is it behind an extra tap? Why can I not take things in smaller steps. The milk does 2 gallons to 1 gallon to empty. The olive oil is only to .3 ml when the full is 1 l. Etc
>
> I feel like the pantry addition and modification has regressed. Please take a careful look at this and make sure it does what we need it to.

The owner asked for a fix, so these four decisions are choices of the build. Each one keeps what the owner decided before, and changes only what the test showed to be wrong.

6. **An open line always has a bar.** When no package of the line is open, the first sealed package shows as a bar, full, and its count is 1 less. With no change, it stays sealed. The other sealed packages stay counts, and a tap on a count still opens one more. The reason: you open the line to set what is left, so the bar must be there with no second tap. Decision 10 of the packages stays: 8 cans do not give 8 bars. This replaces the extra tap of decision 28 of the packages for the first package.
7. **A step is a round amount, about 1/40 of the package.** In grams or millilitres, the step is the smallest of 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, and so on that is 1/40 of the package or more. A jug of 3.79 l moves by 100 ml, a bottle of 1 l by 25 ml, and a can of 425 g by 20 g. Ounces and pounds use the same list in their own unit. A gallon, a quart, a pint, and a cup move by 1/8 of one unit, so a 2 gal jug moves by 1/8 gal and not by 1/4 gal. A count moves by 1. The reason: about 40 stops is a small step for a thumb on a phone, and a round step gives an amount such as "1.2 l" and not "1.42 l". This replaces decision 4 of the packages.
8. **A metric amount shows as the label shows it.** Less than 1000 is in g or ml, and 1000 or more in kg or l, as decision 3 tells for entry. The bar of a bottle of 1 l shows "300 ml", and the row gets `300 ml`. The reason: you read the label, and the label says 300 ml.
9. **The form "Add to pantry" asks for the package size.** The field "Package size" is next to "How much". It is optional: with no size, the amount is the size, as decision 14 of the packages tells. So a bottle of olive oil of 1 l with 300 ml left is `300 ml | 1 l`, and its bar ends at 1 l. The reason: you add food that is already open, and with no size the bar of that bottle ended at 300 ml. Put away does not change: there, you bought the package, so its amount is its size.

## What this grill changes

Only decisions 2, 3, and 4 change the plugin of today:

- The match converts ml and g with 1 ml = 1 g.
- The vault has a unit system. Entry writes each row in it, and a container word is not a unit.
- A line with no count gets the mark "check" in the recipe card, the plan, and Get out.

Decisions 6 to 9 came after the first test, and change the open line of the Pantry part and the form "Add to pantry".

Each other decision keeps what is built.

## Further reading

- [Roadmap](../../features/roadmap.md): the five ideas with no decision, which this grill does not close.
