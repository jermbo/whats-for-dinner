---
title: See an occasion
summary: "The planner sees each active occasion in a fifth part of the kitchen: its name, its days, and each dish in the group of the person who brings it."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: []
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / See an occasion

# See an occasion

As the [planner](../../personas.md), I want the kitchen to show each active occasion in a part of its own, with each dish and who brings it, so that I see the menu of the day at one look.

## Requirements

1. The plugin reads each note in the occasions folder as an occasion
   - a. The occasions folder is a setting in the group "Where your notes are", and it starts as `Larder/Occasions`
   - b. The name of the occasion is the name of the note, with no `.md`
   - c. The day of the occasion is the property `date`, as year-month-day
   - d. A change of the folder in the settings makes the kitchen read the vault again
2. Each task line above the heading `## To do` is a dish
   - a. A link to a note is the recipe of the dish. Other text is the name of a dish with no recipe
   - b. The fields of a dish come after ` · `
   - c. A field of the form `×` and a number is the scale. With no such field, the scale is ×1
   - d. The words `prep done` are not a course and not a person
   - e. Of the other fields, the first is the course and the second is the person
   - f. A person can be a link, such as `[[Mum]]`. The part shows the name of the link
   - g. A task with a mark is a dish that is ready
3. An occasion is active from the moment that its note exists, up to the day after its date
   - a. A note with no `date` is active
4. While an occasion is active, the nav has a fifth option after "Shop", with the name and the days
   - a. The days are "today" on the date, "1 day" one day before it, "5 days" five days before it, and "yesterday" on the day after
   - b. A note with no date shows only its name
   - c. With no active occasion, the nav has four options
   - d. The part comes in from the side of its option, as each other part does
5. The part shows the dishes in groups by person
   - a. The first group is "You": each dish with no person
   - b. Then one group for each person, in the sequence of the note
   - c. A group with no dish does not show
6. Inside a group, the dishes go in the sequence of their courses
   - a. The known courses come first: starter, main, side, dessert, drink
   - b. Then each other course, in the sequence of the note
   - c. Dishes with the same course keep the sequence of the note
   - d. A dish with no course gets the type of its recipe. A dish with no recipe gets the course "Other", which comes last
7. Each dish shows its name, and its course as a small label
   - a. The scale shows next to the name when it is not ×1, such as "×2"
   - b. A dish that is ready shows a full check, and a line through its name
8. With two active occasions or more, the part shows the occasion with the nearest date
   - a. The nav option has the name and the days of that occasion
   - b. A chip for each other active occasion is in the head of the part
   - c. A tap on a chip shows that occasion, and its name goes into the nav option
   - d. A note with no date comes after each note with a date
9. A change of the note, in the kitchen or by hand, shows in the part

## Acceptance criteria

Each criterion starts with the occasion notes of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives them. Where a criterion names one occasion only, the other occasion notes are not in the vault.

1. GIVEN the note "Thanksgiving 2026" and today is 2026-11-21 WHEN the planner opens the kitchen THEN the nav has the fifth option "Thanksgiving 2026 · 5 days"
2. GIVEN the note "Thanksgiving 2026" and today is 2026-11-25 WHEN the planner opens the kitchen THEN the fifth option is "Thanksgiving 2026 · 1 day"
3. GIVEN the note "Thanksgiving 2026" and today is 2026-11-26 WHEN the planner opens the kitchen THEN the fifth option is "Thanksgiving 2026 · today"
4. GIVEN the note "Thanksgiving 2026" and today is 2026-11-27 WHEN the planner opens the kitchen THEN the fifth option is "Thanksgiving 2026 · yesterday"
5. GIVEN the note "Thanksgiving 2026" and today is 2026-11-28 WHEN the planner opens the kitchen THEN the nav has 4 options
   - a. AND the vault still has the note "Thanksgiving 2026"
6. GIVEN the occasions folder has no note WHEN the planner opens the kitchen THEN the nav has 4 options
7. GIVEN a note "Game night" with no property `date` WHEN the planner opens the kitchen THEN the fifth option is "Game night"
8. GIVEN the note "Thanksgiving 2026" WHEN the planner taps the fifth option THEN the part comes in from the right
9. GIVEN the part of "Thanksgiving 2026" WHEN the planner looks at the groups THEN the groups are "You", "Mum", and "Sam", in this sequence
   - a. AND "You" has "Beef tacos", "Honey glazed carrots", and "Apple crumble", in this sequence
   - b. AND "Mum" has "Pumpkin pie"
   - c. AND "Sam" has "Rolls"
10. GIVEN the part of "Thanksgiving 2026" WHEN the planner looks at "Honey glazed carrots" THEN it shows "×2" and the label "Side"
    - a. AND "Beef tacos" shows no scale
11. GIVEN the part of "Thanksgiving 2026" WHEN the planner looks at "Rolls" THEN it shows a full check and a line through its name
12. GIVEN the line `- [ ] [[Recipes/Pancakes|Pancakes]]` in the note WHEN the part reads it THEN "Pancakes" has the label "Breakfast", the type of its recipe
13. GIVEN the line `- [ ] Cheese board` in the note WHEN the part reads it THEN "Cheese board" is in "You" with the label "Other"
    - a. AND it is the last dish of "You"
14. GIVEN the line `- [ ] Rolls · Sam` in the note WHEN the part reads it THEN "Rolls" is in "You" with the label "Sam"
15. GIVEN the line `- [ ] Pumpkin pie · dessert · [[Mum]]` in the note WHEN the part reads it THEN "Pumpkin pie" is in the group "Mum"
16. GIVEN the line `- [ ] [[Recipes/Beef tacos|Beef tacos]] · main · prep done` in the note WHEN the part reads it THEN "Beef tacos" is in "You" with the label "Main"
17. GIVEN the line `- [ ] Bread · bread · ×1.5` in the note WHEN the part reads it THEN "Bread" shows "×1.5" and the label "Bread"
    - a. AND it comes after "Apple crumble" in "You"
18. GIVEN the notes "Sam's birthday" and "Thanksgiving 2026", and today is 2026-11-10, WHEN the planner opens the kitchen THEN the fifth option is "Sam's birthday · 4 days"
    - a. AND the part shows the dishes of "Sam's birthday"
    - b. AND the head of the part has the chip "Thanksgiving 2026"
19. GIVEN the part of "Sam's birthday" with the chip "Thanksgiving 2026" WHEN the planner taps the chip THEN the part shows the dishes of "Thanksgiving 2026"
    - a. AND the fifth option is "Thanksgiving 2026 · 16 days"
    - b. AND the head of the part has the chip "Sam's birthday"
20. GIVEN the notes "Game night" with no date and "Thanksgiving 2026" WHEN the planner opens the kitchen THEN the fifth option is "Thanksgiving 2026" with its days
21. GIVEN the part of "Thanksgiving 2026" is open WHEN the planner changes `×2` to `×3` in the note by hand THEN "Honey glazed carrots" shows "×3"
22. GIVEN the note "Thanksgiving 2026" is in the folder `Events` WHEN the planner sets the occasions folder to `Events` THEN the nav has the option "Thanksgiving 2026"
23. GIVEN a phone with a screen 375 px wide and the note "Thanksgiving 2026" WHEN the planner opens the kitchen THEN the five options of the nav are in view, and the nav does not scroll to the side
    - a. AND the text "Thanksgiving 2026 · 5 days" is complete, with no "…"

## Depends on

Nothing. The occasion notes of the test vault are written by hand, so this story needs no other story.

## Architecture

- [Kitchen state](../../architecture/kitchen-state.md): how the kitchen reads the notes, and which part is on the screen.
- [Plan note](../../architecture/plan-note.md): the form of a task line with its fields after ` · `, which an occasion note follows.
- [Recipes](../../architecture/recipes.md): the type of a recipe, its first tag.
- [Settings](../../architecture/settings.md): the folders of the plugin home.
