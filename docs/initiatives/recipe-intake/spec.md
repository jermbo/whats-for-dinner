---
title: "Spec: recipe intake"
summary: "The scope that is agreed to make a recipe note from a card, a cookbook, or an old note, to keep a photo of each step, and to see the photos of each meal."
parent: decision-log.md
status: agreed
---

[Wiki](../../README.md) / [Decision log: recipe intake](decision-log.md) / Spec: recipe intake

# Spec: recipe intake

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

The **cook** has a recipe on a family card or in a cookbook, in the kitchen with the phone. The kitchen reads only a **recipe** in the RecipeMD format, so today the cook types that note by hand, with each link and each italic amount. The **writer** has old recipe notes that fail, and a **step** has no photo that shows what the food must look like.

## The solution

The cook taps "Add recipe" and types the recipe one **line** at a time. Each line shows its amount and its **food item** as the cook types, and "Save" writes a correct recipe note, with a **stub** for each new food. A **step photo** that the cook takes in **Cook Mode** stays below its step, and the **gallery** shows the photo of each meal.

An example: the cook types "Pancakes" from page 46 of "One Pan Wonders", takes a **source photo** of the page, and types "_2_ eggs" and "_250 ml_ buttermilk". "Eggs" finds the food item `Eggs`. "Buttermilk" shows the chip "New: Buttermilk", and "Save" makes its stub, which is "Out" in the stage Extras. On the next Sunday, the cook takes a photo of step 3, and the step page shows it the next time.

## In scope

1. You start **intake** with the button "Add recipe" in the Recipes **part**, or with a command of Obsidian, on the phone and on the computer (decision 2)
2. Intake has a field for the title, the tags, the yield, the ingredients, and the steps (decision 5)
   - a. You type one ingredient or one step on each **line**. Enter gives the next empty line (decisions 5 and 6)
   - b. Text that you paste goes into the field where you paste it (decisions 3 and 5)
   - c. Each ingredient line shows its result below it as you type: its amount and its food item (decision 6)
   - d. The tags field shows the tags of your recipes as chips. A tap adds one, and you can type a new tag (decision 7)
   - e. When the vault has a recipe with the same title, intake tells you, and you can change the title there. It does not stop you (decision 8)
   - f. Intake has a field for the source, and it takes **source photos**. A photo of the finished food at intake is a source photo (decisions 4, 19, and 19 a)
3. "Save" at the end of the fields writes a correct RecipeMD note in the recipes folder (decision 6)
   - a. The source is a line of the description, below the title, such as "Source: One Pan Wonders, page 46". The source photos are below that line (decision 9)
   - b. Each ingredient links to its food item. You type no link (decision 11)
   - c. When two food items fit one ingredient, such as "pasta", the ingredient gets no link (decision 11 a)
   - d. The plugin does not divide a line. One line is one food (decision 10)
4. An ingredient with no food item shows the chip "New: Kosher salt" (decision 12)
   - a. A tap on the chip finds an existing food item instead, such as "Salt" (decision 12)
   - b. With no tap, "Save" makes a **stub** in the pantry folder of the settings (decisions 11 and 12)
5. Each food item with no **row** is a **suggestion** "Out" in the stage Extras, unless it has `suggest: never`. This includes each stub (decisions 13 and 13 a)
6. On the page "Get out" of Cook Mode, a line that fits two food items has one food item selected before you tap (decision 14)
   - a. The sequence: the food item with the earliest use-by date, then the food item that the recipe uses up, then the food item that you have the most of (decision 14)
   - b. You mark the food item that is on the counter, and the last page takes the amount out of that food item. The last page does not ask for the food item (decision 14)
   - c. "Next" works with a choice that you did not make. The line shows "Which one?" in the accent colour, and the last page uses the selected food item (decision 15)
7. Each step page of Cook Mode has a camera button. A photo goes into the vault at once (decision 19)
   - a. In a step that is a list item, the photo is a line with an indent in that item, below its text (decision 16)
   - b. In a step that is a paragraph, the photo is on the line directly below the text, with no blank line (decision 16 b)
   - c. The step reader takes the photo out of the text of the step, and Cook Mode shows it as a photo (decision 16 a)
8. A step keeps each of its photos. The mark `|best` in a link tells the best photo (decision 17)
   - a. Cook Mode shows the best photo of a step. With no mark, it shows the newest photo (decision 18)
   - b. A tap on the photo shows the other photos of the step (decision 18)
   - c. That view has a button "Best" on each photo. A tap moves the mark to that photo, so a step has one best photo or none (decision 18 a)
9. Each photo of a recipe goes into the folder `Photos` in the recipes folder: a source photo, a step photo, and the photo of a meal (decision 20)
   - a. The plugin makes the folder when it saves the first photo (decision 20)
   - b. The plugin names each photo from the recipe, the part, and the date: `Pancakes - step 3 2026-10-18.jpg`, `Pancakes - source 2026-10-18.jpg`, and `Pancakes 2026-10-18.jpg`. A name in use gets a number from Obsidian (decision 21)
   - c. The plugin makes each photo smaller: the longest side is 1600 pixels or less, as a JPEG with the quality 100%. A smaller photo keeps its size (decision 22)
10. The **gallery** shows the **records** of a recipe that have a photo: the photo, the date, the rating, and the note (decision 23)
    - a. A tap on the photo of a recipe card in the Recipes part opens it, and so does a command of Obsidian (decision 25)
    - b. It shows one record at a time, full screen, and a swipe goes to the next (decision 25)
11. A note that fails gets a button "Convert" in the Recipes list. It opens intake with the text of that note (decision 26)
    - a. "Save" replaces the text of the same note, and the note keeps its name (decision 27)
    - b. The property block stays. Each tag of the note goes into the tags field, and each source link or source text goes into the description (decision 27)
    - c. A text that the plugin cannot put into a field stays in the description (decision 27)

## Out of scope

1. A request to the network, such as a link that the plugin downloads to read its recipe. It is open for a later version (decision 3)
2. Text recognition in the plugin, or the text recognition of the phone as a step of intake (decision 4)
3. One large field that the plugin divides into ingredients and steps (decision 5)
4. A review screen after the fields, a note that the plugin writes at once and then shows as failed, and a note that opens in the editor (decision 6)
5. A tags field for text only (decision 7)
6. A title in use that stops "Save" (decision 8)
7. A heading "Source" after the steps (decision 9)
8. A line with two foods, and a button that divides a line (decision 10)
9. A tap at intake that fixes the link of an ingredient that fits two food items (decision 11 a)
10. A stub for each line with no food item, with no chip to find an existing food item (decision 12)
11. A stub that shows in Shop only when a meal needs it, and a stub that writes the date of intake as `bought` (decisions 13 and 13 a)
12. A line of "Get out" with nothing selected, a food item that the match selects with no look from you, and a "Next" that waits for a tap (decisions 14 and 15)
13. A step photo in the record with the number of its step, and a step photo with no link (decision 16)
14. No camera button for a recipe with paragraph steps, and a step photo that changes the paragraphs into a list (decision 16 b)
15. One photo for each step that a new photo replaces, the newest or the first photo as the best with no mark, and the best photo in a property (decision 17)
16. A row of all the photos of a step (decision 18)
17. A chip "Best" directly after the shot, and a mark that you can set only by hand (decision 18 a)
18. A photo of a step that waits for the last page of Cook Mode (decision 19)
19. A first record with no date for a photo of intake (decision 19 a)
20. A setting for the photo folder, the attachment folder of Obsidian, and the folder `Larder/Photos`. The choice of the recipes folder is a different discussion (decision 20)
21. A name that you type for a photo, and the time of day in its name (decision 21)
22. The original photo, the quality 80%, and the format WebP (decision 22)
23. The time of day in a record (decision 24)
24. A recipe that you type again by hand, a script that converts the notes one time outside the plugin, and a converted note next to the old note (decisions 26 and 27)
25. A rule for the habits of one vault, such as its own tags or links (decision 27)

## What changes in the system

Architecture pages that change:

- [Recipes](../../architecture/recipes.md): intake and "Convert". The plugin now writes the text of a recipe, not only its record.
- [Recipe note](../../architecture/recipe-note.md): the source line and the source photos in the description, the step photos and the mark `|best`, and the links that intake makes.
- [Steps](../../architecture/steps.md): a photo in a step is not text of the step, in a list item and in a paragraph.
- [Cook Mode](../../architecture/cook-mode.md): the camera button and the best photo on each step page, and the selected food item on "Get out".
- [End of a meal](../../architecture/end-of-a-meal.md): the last page does not ask for the food item. The photo goes into `Photos` in the recipes folder, with the quality 100%.
- [Suggestions](../../architecture/suggestions.md): each food item with no row is "Out". The rule "the pantry had it before" goes away.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): the folder `Photos` in the recipes folder, and the stubs that intake makes in the pantry folder.
- [Food item note](../../architecture/food-item-note.md): a stub is a food item note with no row and no property.

New architecture pages:

- Intake: the fields, the result of a line, and "Save".
- Gallery: the records with a photo, and how you go from one to the next.

The words intake, source photo, step photo, stub, line, and gallery go from [Glossary: recipe intake](glossary.md) to the wiki [glossary](../../glossary.md).

Notes and files that get a different form:

- **A recipe note** that intake writes has a source line and source photos in its description, and a link in each ingredient with one food item. A step can have photo lines.
- **A recipe note that you convert** gets new text below its property block. The core plugin "File recovery" of Obsidian keeps the old version.
- **A recipe note that you cook** gets step photos, and the mark `|best` moves between its links.
- **A food item note** can be a new stub in the pantry folder.
- **A food item note with no row**, also one that you made by hand, is now a suggestion "Out".
- **The folder `Photos`** in the recipes folder is new. Photos of meals from before this version stay in the attachment folder, and their links still work.
- **The data file** does not change.

## How you test it

Checks that need the phone:

1. Scope 1: "Add recipe" in the Recipes part, and the command, each open intake.
2. Scope 2: type a recipe one line at a time. Each ingredient line shows its amount and food item, Enter gives the next line, a tag chip adds a tag, and a title in use shows the message.
3. Scope 3 and 4: "Save", and open the note in Obsidian. It has the source line, the source photos, a link for each food item, no link for "pasta", and a stub for "New: Buttermilk". A tap on a "New" chip finds an existing food item, and that line gets no stub.
4. Scope 5: the stage Extras shows each new stub in the group "Out".
5. Scope 6: cook a recipe with "pasta" and two kinds of pasta. "Get out" selects one, "Next" works with no tap, the line shows "Which one?", and the pantry loses the amount from the selected kind.
6. Scope 7 and 8: take two photos of one step, one in a list recipe and one in a paragraph recipe. Close Cook Mode before the last page, and the photos are in the note. The step count does not change. Mark one photo "Best", and the step page shows it.
7. Scope 9: each new photo is in `Photos` of the recipes folder, with its automatic name, sharp on the phone, and below 5 MB.
8. Scope 10: a tap on the photo of a recipe card opens the gallery, and a swipe goes to the next record.
9. Scope 11: "Convert" on a note that fails. After "Save", the note is a recipe in the list, its properties and its name stay, and no text is lost.

Rules that are worth an automatic test, each with the place where a test sees the behaviour from outside:

1. **The note of intake.** The fields of intake go in, and the text of a recipe note comes out. When the reader of recipes reads that text, it gives the same title, tags, yield, ingredients, steps, and source (scope 3).
2. **The result of a line.** An ingredient line and the food item notes go in. The amount and one food item, two food items, or "New" come out (scope 2 c, 3 c, and 4).
3. **Suggestions.** Food item notes go in, and the suggestions come out: a note with no row is "Out", unless it has `suggest: never` (scope 5).
4. **The selected food item.** One line of "Get out", the recipe, and the food item notes go in. The food item that is selected comes out (scope 6 a).
5. **Steps and their photos.** A recipe note goes in, and its steps come out, each with its text, its photos, and its best photo. The same note with the mark on a different photo comes out of "Best" (scope 7 and 8).
6. **Convert.** A note that fails goes in, and the values of the fields come out. Each text of the note is in a field or in the description (scope 11).
7. **The name of a photo.** The recipe, the part, and the date go in, and the name comes out (scope 9 b).

## Further reading

- [Decision log: recipe intake](decision-log.md): the reasons for each line of this page.
- [Glossary: recipe intake](glossary.md): the words of the initiative.
