---
title: "Spec: holiday planner"
summary: "The scope that is agreed for an occasion with many dishes: one note, an Occasions part, a guest list, who brings what, and your dishes on the list a week before."
parent: decision-log.md
status: agreed
---

[Wiki](../../README.md) / [Decision log: holiday planner](decision-log.md) / Spec: holiday planner

# Spec: holiday planner

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

For a holiday, the planner plans many dishes, and other people bring some of them. The weekly Plan holds meals, and it cannot tell that Mum brings the pie. So the menu, the persons, and the work before the day are in the head of the planner, or on paper.

## The solution

The kitchen has a fifth part, Occasions, with each occasion. The planner starts an occasion with a name and a day. The screen of an occasion shows the guests, who brings what, the menu, the preparation, the tasks, and what to buy. Seven days before the day, your dishes go on the list. On the day, you cook your dishes, and you tick each dish that is ready.

An example: in October the planner starts "Thanksgiving 2026" for 26 November. The planner adds the roast turkey, green beans ×2, and a pumpkin pie that Mum brings. On 19 November, the food for the turkey and for two times the beans goes on the list, and the pie puts nothing there. On the day, the cook cooks the turkey, and ticks the pie when Mum comes.

## In scope

1. The planner starts an occasion with "New occasion" in the Occasions part, or with an Obsidian command (decision 21)
   - a. "New occasion" is a wide button below the head of the Occasions part (decisions 21 and 27)
   - b. The planner gives the occasion a name and a day. There is no list of holidays (decision 3)
   - c. A day before today, or a name that an occasion has, does not start an occasion (decision 21)
   - d. "New occasion" can start from one of the 5 newest past occasions. The copy gets the dishes, the persons, the scales, the guest list, and the occasion tasks with no day, each with no mark and with no `prep done` (decisions 26 and 28)
2. An occasion is one note in the occasions folder (decisions 2 and 6)
   - a. The occasions folder is a setting, and it starts as `Larder/Occasions` (decision 6)
   - b. The name of the note is the name of the occasion, such as `Thanksgiving 2026.md` (decision 6)
   - c. The day is the property `date`, as year-month-day (decision 7)
3. Each dish is one task line: a recipe or only a name, then its course, its scale, and its person, each optional (decisions 8 and 17)
   - a. A field of the form `×3` is the scale. With no scale, it is `×1` (decisions 17 and 18)
   - b. Of the other fields, the first is the course and the second is the person (decision 17)
   - c. A person is plain text, or a link such as `[[Mum]]` that the screen shows as its name (decision 9)
   - d. A dish with no person is your dish. A dish with the person `?` is an open job (decisions 9 and 29)
   - e. A course is a free word (decision 10)
4. Each task line below the heading `## To do` is an occasion task, with an optional day (decision 24)
5. An occasion is active from the moment that its note exists, up to the day after its date (decision 19)
   - a. A note with no `date` is active, with no end (decision 19)
6. The kitchen has a fifth part, "Occasions", at all times (decisions 4 and 20)
   - a. From the top: the head, "New occasion", the ink card "Next up", one row of chips, and one row for each other occasion (decision 27)
   - b. "Next up" is the nearest occasion that is not past, with its name, date, days, and four numbers: coming, open, to buy, and to do (decision 27)
   - c. The chips are the filters "Upcoming", "Past", and "All", and the sequences "Nearest first", "Newest first", and "A to Z" (decision 27)
   - d. The days are "today", "1 day", "5 days", and "yesterday" on the day after. A note with no date shows only its name (decision 20)
   - e. After the date, the occasion is past, and the note stays as it is (decision 25)
   - f. A tap on an occasion opens its screen. "← Occasions" goes back to the list (decision 30)
7. The screen of an occasion is one page: the ink card, "Who brings" with the tab "Guest list", the menu, "To buy", and "To do" (decisions 5 and 30)
   - a. The ink card is the card "Next up": the date, the days, the name, "⋯", and the four numbers. A number scrolls to its section (decision 30)
   - b. "Who brings" has a place card for you, for each guest with a job, and for the open jobs (decision 30)
   - c. The menu has one card for each known course and each course of your own. The known courses are starter, main, side, dessert, drink, and things. An empty course is a dashed card (decisions 10, 29, and 30)
   - d. A dish with no course gets the type of its recipe. A name with no recipe goes into "Other" (decision 10)
8. The planner changes the dishes on the screen, and the screen writes the note (decision 23)
   - a. "Add a dish" is one field that proposes the recipes that the name finds, and adds a name with no recipe as a dish (decision 23)
   - b. A tap on a dish opens "Who brings?", a sheet with a large button for each person, the courses, the scales, and "Remove dish". The scales are ×1, ×1.5, ×2, ×3, and ×4 (decisions 23 and 31)
   - c. When a dish has a person, the screen also writes its course (decision 17)
   - d. "Add a dish" is in the card of each person, and "Add a dessert" in the card of each course (decision 30)
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
    - b. "Add a task" adds a task with no day (decision 24)
14. An occasion has a guest list: the heading `## Guests`, with one line for each guest, such as `- The Smiths ×4` (decision 28)
    - a. A line with no `×` is 1. You count as 1. "N coming" adds them (decision 28)
    - b. A person of a dish who is not on the list is a guest of size 1 (decision 28)
    - c. The guest list has one row for each guest: the name, the jobs or "Visitor", the party size with − and +, and ✕ (decision 30)
    - d. A new person in "Who brings?" is also a new guest (decision 31)
    - e. When you remove a guest, each job of that guest becomes open (decision 29)
15. A job is a dish line: a dish, a course with no dish yet, or a thing that is not food, with the course `things` (decision 29)
16. "⋯" on the ink card has "Open the note" and "Delete occasion". "Delete occasion" asks first, and moves the note to the trash (decision 32)

## Out of scope

1. An occasion in the weekly Plan, as a card at the top of the Plan or of each part (decisions 1, 16, and 20)
2. A list of holidays to select from (decision 3)
3. Only groups by course, with the person on each dish (decision 5)
4. One heading for each person, a table, or a word before the person, in the note (decision 17)
5. A number of guests that the plugin divides by the yield of a recipe (decision 18)
6. A window of 14 days before the date, or a property `status` (decision 19)
7. Food on the list for a dish of a different person (decision 11)
8. Your dishes on the list at once, or only after a tap on "Put on the list" (decision 22)
9. A setting for the 7 days (decision 22)
10. "Add a dish" that opens the Recipes part (decision 23)
11. A field to give a task a day on the screen (decision 24)
12. A timeline that the plugin calculates back from the time that you eat (decision 24)
13. A review with a rating of each dish on the day after (decision 26)
14. A change of Cook Mode other than the scale (decisions 13 and 18)
15. A property `people`, one number of guests for the occasion, or role labels on a guest (decision 28)
16. Things that are not food in "To do" (decision 29)
17. Four tabs, a card for each guest, or a board where you drag a job (decision 30)
18. A row of small chips below a dish (decision 31)

## What changes in the system

Architecture pages that are new:

- **Occasion**: what an occasion is, when it is active, the Occasions part, the screen of an occasion, and what it puts on the list.
- **Occasion note**: the exact form of the note, what the plugin reads, and what it changes.

Architecture pages that change:

- [Plan](../../architecture/plan.md): no change. The button "New occasion" is in the Occasions part.
- [Shopping](../../architecture/shopping.md): the food of an occasion on the list, from 7 days before its date.
- [Cook Mode](../../architecture/cook-mode.md): the scale at the top.
- [End of a meal](../../architecture/end-of-a-meal.md): the amounts times the scale, and the mark of a dish of an occasion.
- [Preparation](../../architecture/preparation.md): the screen of an occasion shows it.
- [Settings](../../architecture/settings.md): the occasions folder in the plugin home.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): the occasion note is a fifth kind of note.
- [Kitchen state](../../architecture/kitchen-state.md): a fifth part, Occasions, and the occasion that it shows.
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
- [ ] Plates · things · ?

## Guests

- Mum ×2
- Sam
- The Smiths ×4

## To do

- [ ] Borrow chairs · 2026-11-24
```

- **The data file** gets the setting of the occasions folder.

## How you test it

Checks that need the phone:

1. The planner starts "Thanksgiving 2026", and adds four dishes with persons, courses, and scales. Only the names need the keyboard.
2. On a narrow phone, the nav shows the five parts, and "Who brings?" opens from the bottom, in reach of the thumb.
3. The occasion note, read with no plugin, shows each dish with its course, its scale, and its person, and each task.
4. On the day after the date, the occasion is "Next up". On the day after that, it is in "Past".

Rules that are worth an automatic test, each with the place where a test sees the behaviour from outside:

1. **The occasion note.** The text of the note goes in. The dishes come out, each with its recipe or name, course, scale, person, mark, and preparation, the tasks with their days, and the guests with their party sizes.
2. **A change of the occasion.** The text of the note and one action go in: add a dish, set a course, a person, or a scale, remove a dish, a mark, "Prep is done", add a task, add or remove a guest, or a party size. The new text of the note comes out, with your own text unchanged.
3. **Active.** The date of the note and today go in. Active or not, and the days, come out.
4. **The list.** The meals, the occasions, today, and the pantry go in. The rows of the list come out: only your dishes with no mark, each with its scale, from 7 days before the date, with the occasion as the reason.
5. **The end of a dish.** The pantry, the recipe, and a scale go in. The new rows of each food item come out, with the amounts times the scale.
6. **A copy.** The text of a past occasion, a new name, and a new date go in. The text of the new note comes out, with no marks, no `prep done`, and no task that has a day.

## Further reading

- [Glossary: holiday planner](glossary.md): the words of this page.
- [Spec: meal plan](../meal-plan/spec.md): the other half of the work on meals.
