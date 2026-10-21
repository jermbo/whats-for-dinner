---
title: "Decision log: holiday planner"
summary: "The options and the decisions for an occasion with many dishes, such as a holiday or a birthday: one note, and its own screen while it is active."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: holiday planner

# Decision log: holiday planner

For a holiday you cook many dishes, and other people bring some of them. You want to plan the menu, and you want to know who brings what. The weekly [Plan](../../architecture/plan.md) holds one recipe for each meal, and it cannot tell that Mum brings the pie. This page records each decision for a planner of one [occasion](glossary.md).

## What the plugin does today

| Question                                 | The plugin today                                                                        |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| Can a meal have more than one dish?      | No. One task of the [plan note](../../architecture/plan-note.md) is one recipe.         |
| Can a dish come from a different person? | No.                                                                                     |
| Can a recipe change its amounts?         | No. The plugin has no scale. The yield of a recipe is free text, such as "4 servings".  |
| What goes on the list?                   | Each ingredient of each meal that you did not cook, minus the pantry.                   |
| How many parts has the kitchen?          | Four: Pantry, Recipes, Plan, and Shop.                                                  |

## Decisions

1. **The holiday planner is a screen of its own, not a part of the weekly Plan.** The reason: the owner tried an occasion inside the Plan in two prototypes of 21 October, and the [meal plan](../meal-plan/decision-log.md) log records why it did not convince. Holiday planning is a different concern.
2. **An occasion is one note.** The note holds the full plan of the occasion in Markdown, so you can read it and change it with no plugin.
3. **An occasion is not from a list of holidays.** You give it a name and a day, such as "Sam's birthday" on a Saturday, or Thanksgiving. The reason: the owner also cooks for a birthday, or for no reason.
4. **While an occasion is active, the plugin has a place for it.** The screen must be pleasant to look at, and easy to understand.
5. **The screen of an occasion shows each dish, who brings it, and what you must buy.** The reason: in the first prototype, the owner liked the page that put the dishes of each person together.
6. **The occasion notes are in the occasions folder: `Larder/Occasions`.** It is a setting, as the shopping folder is. The name of the note is the name of the occasion, such as `Thanksgiving 2026.md`. The reason: each note of the plugin goes into a folder that a setting names, inside the plugin home.
7. **The day of the occasion is the property `date`**, as year-month-day: `date: 2026-11-26`. The reason: a property is the place for one fact of a full note, and Obsidian shows it in a calendar view.
8. **A dish is a recipe or only a name.** "Pumpkin pie" that Mum brings needs no recipe. The reason: you do not keep the recipes of other people.
9. **The person of a dish is plain text, such as "Mum". A dish with no person is a dish that you cook.** A link such as `[[Mum]]` also works, and the screen shows its name. The reason: most dishes are yours, so you write a person only for the other dishes.
10. **The course of a dish is a free word.** With no course, a recipe gives its [type](../../architecture/type.md), and a name with no recipe goes into "Other". The screen puts the known courses first: starter, main, side, dessert, drink. The reason: the type of a recipe is usually correct, and a word of your own, such as "bread", must also work.
11. **Only the dishes that you cook go on the list.** A dish of a different person never puts food on the list. The reason: Mum buys her own pumpkins.
12. **The pantry is one pantry.** The list adds the food of the occasion to the food of the week, and then takes off the pantry, as for two meals. A row of the list names the occasion as its reason, as a row names its meal. The reason: the week and the occasion take food from the same shelves.
13. **A dish that you cook has "Cook", and Cook Mode does not change.** After the meal, Cook Mode writes the record in the recipe and updates the pantry, as for a meal of the week. The reason: the end of a meal works, and an occasion needs nothing different there.
14. **A task that is done is a dish that is ready: you cooked it, or it came.** A dish that you cooked takes its food off the list. The task stays in the note with its mark, so the note of the occasion is the record of the day. The reason: you see at one look what is ready. This is not the rule of the weekly plan, where a cooked meal leaves the note (see the [meal plan](../meal-plan/decision-log.md) log).
15. **With two active occasions, the screen shows the nearest one first, and a chip opens the other.** The reason: two occasions at the same time are rare, so the screen must not get more complex for them.
16. **The weekly Plan gets only the button "New occasion" (decision 21).** It does not show the occasion, and the occasion does not take a place of the week. The reason: the [meal plan](../meal-plan/decision-log.md) initiative changes the Plan, and the two concerns stay apart.
17. **A dish is one task line, with its fields after a dot, as in the plan note.** The fields are the course, the scale, and the person, each one optional:

    ```markdown
    ---
    date: 2026-11-26
    ---
    - [ ] [[Recipes/Roast turkey|Roast turkey]] · main
    - [ ] [[Recipes/Green beans|Green beans]] · side · ×2
    - [ ] Pumpkin pie · dessert · Mum
    - [x] Rolls · bread · Sam

    ## To do

    - [ ] Borrow chairs · 2026-11-24
    ```

    The reason: you know the form from the plan note, one line is one dish, and a new person for a dish is a change of one word. Options that were rejected: one heading for each person, because a new person moves the line; and one table, because it has no check box.
18. **A dish has a scale, such as `×3`, in its line.** The list uses the scale. Cook Mode shows "×3" at the top, and the amounts stay as the recipe has them. With no scale, it is `×1`. The reason: you know that a pie for 8 is enough for 12, and the plugin does not. Options that were rejected: no scale; and a number of guests that the plugin divides by the yield, because the yield is free text.
19. **An occasion is active from the moment that its note exists, up to the day after its date.** The reason: you made the note on purpose, and you never have to remember a status. The day after is there for the leftovers and the dishes that you did not mark. Options that were rejected: a window of 14 days before the date; and a property `status: active`.
20. **An active occasion is a fifth part of the kitchen, with its name and its days, such as "Thanksgiving · 5 days".** The part shows only while an occasion is active. The reason: the occasion is a place of its own (decision 1), and the part goes away after the day. Options that were rejected: a card at the top of the Plan; and a card at the top of each part.
21. **You start an occasion with "New occasion" in the Plan part, or with an Obsidian command.** The reason: with no active occasion, the fifth part is not there, and the Plan is the part of the food that is to come. An option that was rejected: only the command, or a note by hand.
22. **Your dishes go on the list 7 days before the date.** Before that, the screen of the occasion shows what to buy, and "Add to the list" on a row puts it on the list earlier. 7 days is a fixed rule, not a setting. The reason: a plan for Thanksgiving in October must not put a turkey on each list for 5 weeks. Options that were rejected: on the list at once; and only after a tap on "Put on the list".
23. **The screen of the occasion changes the note.** You add a dish from the recipes or by name, you give it a person, a course, and a scale with chips, and you remove it. The reason: you plan on the phone, and to type the form of a line on a phone is slow. An option that was rejected: a screen that only shows the note.
24. **The screen shows the preparation of each of your dishes with "Prep is done", and your occasion tasks in the sequence of their days.** The occasion tasks are the task lines below the heading `## To do`, such as `- [ ] Borrow chairs · 2026-11-24`. Each other task line of the note is a dish. A task with no day comes last. The reason: the work for a holiday is more than food, and a task is plain Markdown. The heading tells a task from a dish with no recipe, such as "Pumpkin pie". An option that was rejected: a timeline that the plugin calculates back from the time that you eat, because a recipe has no time.
25. **After the day, the fifth part goes away, and the note stays as it is.** The reason: the note is the record of the occasion.
26. **"New occasion" can start from a past occasion.** It copies the dishes, the persons, the scales, and the occasion tasks with no day into a new note, with a new name and a new date. Each task of the copy has no mark. The reason: next Thanksgiving starts from this Thanksgiving. An option that was rejected: a review with a rating for each dish on the day after, because Cook Mode already asks for a rating of each dish that you cook.

## Further reading

- [Workflow](../../standards/workflow.md): the step of the work that this page is in.
- [Plan note](../../architecture/plan-note.md): the form of a task line that the occasion note can follow.
