---
title: "Decision log: meal plan"
summary: "The options and the decisions for a weekly Plan that a new person understands with no explanation, and that shows a meal with its sides."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: meal plan

# Decision log: meal plan

The [Plan](../../architecture/plan.md) holds one recipe for each meal, in a group for each type. A new person needs an explanation before they can use it. And a dinner is usually a main dish with sides, which the Plan cannot hold. This page records each decision that makes the weekly Plan clear. The [spec](spec.md) has the scope that comes from them.

## The plan today

| Question                           | The plugin today                                                      |
| ---------------------------------- | --------------------------------------------------------------------- |
| What is a meal?                    | One recipe. A side is a meal of its own, with the type "side".        |
| How is the week arranged?          | One group for each type, such as dinner, with room for 7 meals.       |
| Does a meal have a day?            | No. "Today" selects it for one day. Only a meal of today has "Cook".  |
| Where are the ideas?               | Below the week. Each meal that you add pushes them down.              |
| Can a meal have more than a dish?  | No.                                                                   |

## What the owner had to explain

The owner showed the Plan to two people. Each one needed an explanation of three things:

- **What each group means.** The groups by type, each with its room, such as "2/7".
- **Where a meal goes.** Which group gets which recipe.
- **Why a meal needs "Today".** A meal with no day, and a button that gives it one day only.

The three things are worse with breakfast, lunch, and dinner: each one is a group, and each one needs "Today". Each person also asked about sides.

## Decisions

1. **The weekly Plan and the holiday planner are two screens.** They are two concerns: the Plan is for the food of an ordinary week, and the [holiday planner](../holiday-planner/decision-log.md) is for one occasion. The reason: in the second prototype of 21 October, each variant that put an occasion into the Plan did not convince the owner: one list in time order, a tab for occasions, and a card that builds the next meal.
2. **The new Plan needs no explanation.** The three things that the owner had to explain are the problems that the new Plan must remove.
3. **A meal has its dishes in one card.** A main dish and its sides are one meal. The reason: in the first prototype of 21 October, the owner liked the variant "meal with sides" because it shows the complete meal.
4. **The ideas must not go down the screen.** The reason: today each meal that you add pushes the ideas lower.
5. **The old screen is no limit.** The Plan gets a new design.
6. **The week is a set of options, and you can flag one of them for tonight.** You plan the meals at a calm moment. On the day, you look at the options and flag the meal that you plan to cook. The flagged meal goes into its own section "Tonight", at the top of the Plan, as a large dark card with its preparation. With no flag, the section is not there. One meal has the flag at a time. The flag is optional: each card has Cook, with or with no flag. If you forget, the other meals are still options. The reason: the plan must not tell you what to eat on which day, and the meal that you selected must be obvious at a glance. In the third prototype of 21 October, the owner selected the section "Tonight" because it is the most obvious, and asked that Cook stays on each card. Options that were rejected: a fixed day for each meal, which breaks on the first bad day; a selected meal that only moves to the top, which the owner did not see; a dark card in its own place in the list; a strip at the top that names the meal; a day in advance, because two kinds of selection are harder to explain; and Cook only on the selected meal.
7. **A side is a line below its main dish.** The card of the meal has "+ Side". A side is a recipe, or a name with no recipe. In the plan note, a side is an indented line below the task of its main dish, so you can read the full meal with no plugin. The food of a side goes on the list as the food of a meal does. The reason: the owner wants to see the complete meal. An option that was rejected: a side that is a meal of its own, next to the main dish on the screen only.
8. **The ideas are not on the Plan screen.** A button "Add a meal" at the top of the Plan, in a fixed place, opens the recipes, with the ideas for your pantry first. The reason: the screen is about your week, and the ideas are always one tap away, so they never go down. Two options were rejected: a row of ideas at the top that scrolls to the side, and a row of ideas only when the week is short.
9. **The week is one list, with no groups by type and no room.** Each card has a small label with its type, such as "Breakfast". The owner plans mostly dinners now, and the same list works when breakfast, lunch, and snacks come. The reason: the groups and their room, such as "2/7", were the first thing that the owner had to explain. An option that was rejected: the groups by type with no room.
10. **A meal that you cooked leaves the plan, and the plan has no "Start a new week".** The note of the recipe keeps the record below "Cooked". A meal that you did not cook stays as an option until you cook it or remove it. You still plan the week at a calm moment. The reason: the meals that you did not cook are options that are ready on a bad day, and a plan that you do not empty cannot be lost. An option that was rejected: a cooked meal that stays with a line through it until a new week.
11. **The Plan has no find, sequence, or filters.** A week has 7 to 10 meals, and you see all of them. The stickers of each card, such as "Uses spinach soon" and the preparation, give the facts that the filters gave. The reason: each control is one more thing to explain. An option that was rejected: the bar of today.
12. **Small rules of the meal card and of the end of a meal.** The reason for each: it is the simplest rule that agrees with decisions 6, 7, and 10.
    - a. You can remove a side from its card.
    - b. Cook on a meal opens its main dish. Each side that is a recipe has its own Cook, on each card.
    - c. A flag of a day that is past has no effect: the meal is an option again.
    - d. The sides of a meal leave the plan with their main dish.
    - e. The part keeps the name "Plan".
    - f. Cook Mode, and the record of a meal in the recipe note, do not change.
