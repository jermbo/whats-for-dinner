---
title: "Spec: holiday planner"
summary: "The scope that is agreed for an occasion with many dishes: one note, a fifth part while it is active, who brings what, and your dishes on the list a week before."
parent: decision-log.md
status: agreed
---

[Wiki](../../README.md) / [Decision log: holiday planner](decision-log.md) / Spec: holiday planner

# Spec: holiday planner

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

For a holiday, the planner plans many dishes, and other people bring some of them. The weekly Plan holds meals, and it cannot tell that Mum brings the pie. So the menu, the persons, and the work before the day are in the head of the planner, or on paper.

## The solution

The planner starts an occasion with a name and a day. While the occasion is active, the kitchen has a fifth part for it. That part shows each dish, who brings it, the preparation, the tasks, and what to buy. Seven days before the day, your dishes go on the list. On the day, you cook your dishes, and you tick each dish that is ready.

An example: in October the planner starts "Thanksgiving 2026" for 26 November. The planner adds the roast turkey, green beans ×2, and a pumpkin pie that Mum brings. On 19 November, the food for the turkey and for two times the beans goes on the list, and the pie puts nothing there. On the day, the cook cooks the turkey, and ticks the pie when Mum comes.

## In scope

1. The planner starts an occasion with "New occasion" in the Plan part, or with an Obsidian command (decision 21)
   - a. "New occasion" is a link button in the head of the Plan part (decision 21)
   - b. The planner gives the occasion a name and a day. There is no list of holidays (decision 3)
   - c. A day before today, or a name that an occasion has, does not start an occasion (decision 21)
   - d. "New occasion" can start from one of the 5 newest past occasions. The copy gets the dishes, the persons, the scales, and the occasion tasks with no day, each with no mark and with no `prep done` (decision 26)
2. An occasion is one note in the occasions folder (decisions 2 and 6)
   - a. The occasions folder is a setting, and it starts as `Larder/Occasions` (decision 6)
   - b. The name of the note is the name of the occasion, such as `Thanksgiving 2026.md` (decision 6)
   - c. The day is the property `date`, as year-month-day (decision 7)
3. Each dish is one task line: a recipe or only a name, then its course, its scale, and its person, each optional (decisions 8 and 17)
   - a. A field of the form `×3` is the scale. With no scale, it is `×1` (decisions 17 and 18)
   - b. Of the other fields, the first is the course and the second is the person (decision 17)
   - c. A person is plain text, or a link such as `[[Mum]]` that the screen shows as its name (decision 9)
   - d. A dish with no person is your dish (decision 9)
   - e. A course is a free word (decision 10)
4. Each task line below the heading `## To do` is an occasion task, with an optional day (decision 24)
5. An occasion is active from the moment that its note exists, up to the day after its date (decision 19)
   - a. A note with no `date` is active, with no end (decision 19)
6. While an occasion is active, the kitchen has a fifth part, with the name and the days, such as "Thanksgiving · 5 days" (decisions 4 and 20)
   - a. The days are "today", "1 day", "5 days", and "yesterday" on the day after. A note with no date shows only its name (decision 20)
   - b. After the day after the date, the part goes away, and the note stays as it is (decision 25)
   - c. With two active occasions, the part shows the nearest one, and a chip opens the other (decision 15)
7. The part shows each dish, who brings it, and what you must buy (decision 5)
   - a. The dishes are in groups by person: "You" first, then each person in the sequence of the note (decision 5)
   - b. Inside a group, the known courses come first: starter, main, side, dessert, drink. Each word of your own comes after them (decision 10)
   - c. A dish with no course gets the type of its recipe. A name with no recipe goes into "Other" (decision 10)
8. The planner changes the dishes on the screen, and the screen writes the note (decision 23)
   - a. "Add a dish" is one field that proposes the recipes that the name finds, and adds a name with no recipe as a dish (decision 23)
   - b. Give a dish a person, a course, and a scale with chips. The scales are ×1, ×1.5, ×2, ×3, and ×4 (decision 23)
   - c. When a dish has a person, the screen also writes its course (decision 17)
   - d. Remove a dish (decision 23)
9. Only your dishes put food on the list (decision 11)
   - a. Your dishes go on the list 7 days before the date, each with its scale (decisions 18 and 22)
   - b. Before that, "Add to the list" on a row of the screen adds the food item as an extra (decision 22)
   - c. A note with no date puts food on the list only with "Add to the list" (decision 22)
   - d. The list adds the food of the occasion to the food of the week, and then takes off the pantry (decision 12)
   - e. A row of the list names the occasion as its reason, as a row names its meal (decision 12)
10. Each of your dishes that is a recipe has "Cook" (decision 13)
    - a. Cook Mode shows the scale, such as "×3", at the top. The amounts of the steps stay as the recipe has them (decision 18)
    - b. The last page takes the amounts times the scale out of the pantry (decision 18)
    - c. The end of the meal writes the record in the recipe, as for a meal of the week (decision 13)
    - d. "Cook" on a dish does not change the weekly plan (decision 13)
11. A dish with a mark is ready: you cooked it, or it came (decision 14)
    - a. A dish that you cooked gets its mark, and its food goes off the list (decision 14)
    - b. A tap on the check of a dish gives it its mark, and a second tap takes the mark off (decision 14)
    - c. The task keeps its mark in the note, so the note is the record of the day (decision 14)
12. The screen shows the preparation of each of your dishes, with "Prep is done" (decision 24)
    - a. "Prep is done" writes the words `prep done` in the line of the dish (decision 24)
13. The screen shows the occasion tasks in the sequence of their days. A task with no day comes last (decision 24)
    - a. A tap on a task gives it its mark (decision 24)

## Out of scope

1. An occasion in the weekly Plan, as a card at the top of the Plan or of each part (decisions 1, 16, and 20)
2. A list of holidays to select from (decision 3)
3. Groups by course, with the person on each dish (decision 5)
4. One heading for each person, a table, or a word before the person, in the note (decision 17)
5. A number of guests that the plugin divides by the yield of a recipe (decision 18)
6. A window of 14 days before the date, or a property `status` (decision 19)
7. Food on the list for a dish of a different person (decision 11)
8. Your dishes on the list at once, or only after a tap on "Put on the list" (decision 22)
9. A setting for the 7 days (decision 22)
10. "Add a dish" that opens the Recipes part (decision 23)
11. A field to add an occasion task on the screen (decision 24)
12. A timeline that the plugin calculates back from the time that you eat (decision 24)
13. A review with a rating of each dish on the day after (decision 26)
14. A change of Cook Mode other than the scale (decisions 13 and 18)

## What changes in the system

Architecture pages that are new:

- **Occasion**: what an occasion is, when it is active, its fifth part, and what it puts on the list.
- **Occasion note**: the exact form of the note, what the plugin reads, and what it changes.

Architecture pages that change:

- [Plan](../../architecture/plan.md): the button "New occasion".
- [Shopping](../../architecture/shopping.md): the food of an occasion on the list, from 7 days before its date.
- [Cook Mode](../../architecture/cook-mode.md): the scale at the top.
- [End of a meal](../../architecture/end-of-a-meal.md): the amounts times the scale, and the mark of a dish of an occasion.
- [Preparation](../../architecture/preparation.md): the screen of an occasion shows it.
- [Settings](../../architecture/settings.md): the occasions folder in the plugin home.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): the occasion note is a fifth kind of note.
- [Kitchen state](../../architecture/kitchen-state.md): a fifth part, only while an occasion is active.
- The wiki [glossary](../../glossary.md): the words of the [glossary](glossary.md) of this initiative. The [features](../../features/README.md) page.

Notes and data that get a different form:

- **The occasion note** is new. The other notes do not change.

```markdown
---
date: 2026-11-26
---
- [ ] [[Recipes/Roast turkey|Roast turkey]] · main · prep done
- [ ] [[Recipes/Green beans|Green beans]] · side · ×2
- [ ] Pumpkin pie · dessert · Mum
- [x] Rolls · bread · Sam

## To do

- [ ] Borrow chairs · 2026-11-24
```

- **The data file** gets the setting of the occasions folder.

## How you test it

Checks that need the phone:

1. The planner starts "Thanksgiving 2026", and adds four dishes with persons, courses, and scales. Only the names need the keyboard.
2. On a narrow phone, the nav shows the five parts, and the name and the days of the occasion can be read.
3. The occasion note, read with no plugin, shows each dish with its course, its scale, and its person, and each task.
4. On the day after the date the part is there, and on the day after that it is gone.

Rules that are worth an automatic test, each with the place where a test sees the behaviour from outside:

1. **The occasion note.** The text of the note goes in. The dishes come out, each with its recipe or name, course, scale, person, mark, and preparation, and the tasks with their days.
2. **A change of the occasion.** The text of the note and one action go in: add a dish, set a course, a person, or a scale, remove a dish, a mark, or "Prep is done". The new text of the note comes out, with your own text unchanged.
3. **Active.** The date of the note and today go in. Active or not, and the days, come out.
4. **The list.** The meals, the occasions, today, and the pantry go in. The rows of the list come out: only your dishes with no mark, each with its scale, from 7 days before the date, with the occasion as the reason.
5. **The end of a dish.** The pantry, the recipe, and a scale go in. The new rows of each food item come out, with the amounts times the scale.
6. **A copy.** The text of a past occasion, a new name, and a new date go in. The text of the new note comes out, with no marks, no `prep done`, and no task that has a day.

## Further reading

- [Glossary: holiday planner](glossary.md): the words of this page.
- [Spec: meal plan](../meal-plan/spec.md): the other half of the work on meals.
