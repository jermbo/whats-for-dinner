---
title: See an occasion
summary: "The planner opens an occasion and sees it on one page: the ink card, who brings what, and the menu by course."
parent: occasion-stories.md
updated: 2026-10-31
persona: Planner
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Occasion stories](occasion-stories.md) / See an occasion

# See an occasion

As the [planner](../../personas.md), I want to see an occasion on one page, with who brings what and the menu, so that I see the day at one look.

## Requirements

1. The plugin reads each note in the occasions folder as an occasion
   - a. The occasions folder is a setting in the group "Where your notes are", and it starts as `Larder/Occasions`
   - b. The name of the occasion is the name of the note, with no `.md`
   - c. The day of the occasion is the property `date`, as year-month-day
   - d. A change of the folder in the settings makes the kitchen read the vault again
2. Each task line above the heading `## To do` is a dish, also called a job
   - a. A link to a note is the recipe of the dish. Other text is the name of a dish with no recipe
   - b. The fields of a dish come after ` · `
   - c. A field of the form `×` and a number is the scale. With no such field, the scale is ×1
   - d. The words `prep done` are not a course and not a person
   - e. Of the other fields, the first is the course and the second is the person
   - f. A person can be a link, such as `[[Mum]]`. The screen shows the name of the link
   - g. The person `?` is no person: the job is open
   - h. A task with a mark is a dish that is ready
3. The screen of an occasion starts with the ink card
   - a. The card has the date and the days, "⋯", the name, and four numbers: coming, open, to buy, and to do
   - b. The days are "today" on the date, "1 day" one day before it, "5 days" five days before it, and "yesterday" on the day after. A note with no date shows "No date"
   - c. A tap on a number scrolls to its section. "coming" opens the tab "Guest list"
4. Above the card, "← Occasions" goes back to the list of the occasions
5. "Who brings" has one place card for each person with a job
   - a. The first card is "You": each dish with no person. It shows also with no dish
   - b. Then one card for each guest with a job, in the sequence of the guest list
   - c. The last card is "Open": each job with the person `?`. It shows also with no job
   - d. A card has the name above a fold line, and below it the jobs
   - e. Each job shows its name, its scale when it is not ×1, and its course as a small label
   - f. An open job shows the dashed sticker "Who brings?"
6. The menu has one card for each course
   - a. The known courses come first: starter, main, side, dessert, drink, and things
   - b. Then each other course, in the sequence of the note, and "other" last
   - c. A dish with no course gets the type of its recipe. A dish with no recipe gets the course "other"
   - d. A course with no dish is a dashed card with the text "No dessert yet", for each course
   - e. A dish shows a sticker of its person: olive for "You", an outline for a guest, and dashed "Who brings?" when it is open
7. A dish that is ready shows a full check, and a line through its name
8. A change of the note, in the kitchen or by hand, shows on the screen

## Acceptance criteria

Each criterion starts with the occasion notes of the test vault, as the [occasion stories](occasion-stories.md#the-test-data) page gives them, and today is 2026-11-21. The planner opened "Thanksgiving 2026" from the Occasions part.

1. GIVEN the screen of "Thanksgiving 2026" WHEN the planner looks at the ink card THEN it shows "26 Nov · 5 days" and "Thanksgiving 2026"
   - a. AND the numbers are "8 coming", "1 open", the number of rows of "To buy", and "3 to do"
2. GIVEN today is 2026-11-26 WHEN the planner opens "Thanksgiving 2026" THEN the card shows "· today"
3. GIVEN today is 2026-11-27 WHEN the planner opens "Thanksgiving 2026" THEN the card shows "· yesterday"
4. GIVEN the screen WHEN the planner looks at "Who brings" THEN the cards are "You", "Mum", "Sam", and "Open", in this sequence
   - a. AND "You" has "Beef tacos", "Honey glazed carrots", and "Apple crumble"
   - b. AND "Mum" has "Pumpkin pie"
   - c. AND "Sam" has "Rolls"
   - d. AND "Open" has "Plates" with the sticker "Who brings?"
   - e. AND "The Smiths" have no card
5. GIVEN the screen WHEN the planner looks at "Honey glazed carrots" THEN it shows "×2" and the label "Side"
   - a. AND "Beef tacos" shows no scale
6. GIVEN the screen WHEN the planner looks at "Rolls" THEN it shows a full check and a line through its name
7. GIVEN the screen WHEN the planner looks at the menu THEN the cards are Starter, Main, Side, Dessert, Drink, Things, and Bread, in this sequence
   - a. AND "Starter" and "Drink" are dashed, with "No starter yet" and "No drink yet"
   - b. AND "Dessert" has "Apple crumble" with the sticker "You", and "Pumpkin pie" with the sticker "Mum"
   - c. AND "Things" has "Plates" with the sticker "Who brings?"
8. GIVEN the line `- [ ] [[Recipes/Pancakes|Pancakes]]` in the note WHEN the screen reads it THEN the menu has the card "Breakfast" with "Pancakes"
9. GIVEN the line `- [ ] Cheese board` in the note WHEN the screen reads it THEN the menu has the card "Other" with "Cheese board", as the last card
10. GIVEN the line `- [ ] Rolls · Sam` in the note WHEN the screen reads it THEN "Rolls" is in the card "You", with the label "Sam"
11. GIVEN the line `- [ ] Pumpkin pie · dessert · [[Mum]]` in the note WHEN the screen reads it THEN "Pumpkin pie" is in the card "Mum"
12. GIVEN the screen WHEN the planner taps "1 open" THEN the screen scrolls to "Who brings"
    - a. WHEN the planner taps "8 coming" THEN the tab "Guest list" is on
13. GIVEN the screen WHEN the planner changes `×2` to `×3` in the note by hand THEN "Honey glazed carrots" shows "×3"
14. GIVEN the screen WHEN the planner taps "← Occasions" THEN the list of the occasions shows
15. GIVEN a note "Game night" with no property `date` WHEN the planner opens it THEN the card shows "No date"

## Depends on

[See the occasions](occasion-see-the-occasions.md): the screen of an occasion opens from the Occasions part.

## Architecture

- [Occasion](../../architecture/occasion.md): what an occasion is, when it is active, the Occasions part, and the screen of an occasion.
- [Occasion note](../../architecture/occasion-note.md): the form of the note, and what the plugin changes.
- [Kitchen state](../../architecture/kitchen-state.md): how the kitchen reads the notes, and which part is on the screen.
- [Plan note](../../architecture/plan-note.md): the form of a task line with its fields after ` · `, which an occasion note follows.
- [Recipes](../../architecture/recipes.md): the type of a recipe, its first tag.
- [Settings](../../architecture/settings.md): the folders of the plugin home.
