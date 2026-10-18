---
title: "Decision log: recipe intake"
summary: "The options and the decisions to make a recipe note from a web page, a family card, or a cookbook, and to keep a photo of each step."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: recipe intake

# Decision log: recipe intake

Your recipes are on web pages, on cards from your family, and in cookbooks. The kitchen reads only a note in the RecipeMD format, and today you type that note yourself. This page records each decision that makes a recipe note from such a source with little work, and that keeps a photo of a step, so that you see later what the food must look like.

## The recipes and the photos today

| Part                    | The plugin today                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Add a recipe            | No control. You write the note by hand, in the recipes folder of the settings.                                             |
| A note that fails       | The end of the recipe list shows it, with its reason, such as "no rule before the ingredients".                            |
| The format              | RecipeMD 2.4.0. Properties above the title are permitted. The plugin never writes a property.                              |
| A step                  | Each item of a list in the instructions. With no list, each paragraph. The text below a later heading is not a step.       |
| The photo of a meal     | One photo on the last page of Cook Mode. It goes into the record below the heading "Cooked", as `![[Tacos 2026-10-12.jpg]]`. |
| The size of a photo     | The plugin draws it again as a JPEG, with the longest side 1600 pixels or less. Decision 22 changes the quality to 100%.    |
| The folder of a photo   | The folder that Obsidian uses for attachments. Decision 20 changes this to the folder `Photos` in the recipes folder.       |
| The photo of a step     | None.                                                                                                                       |
| The network             | The plugin makes no request to the network. It has no AI ([decision 29 of the shopping list](../shopping-list/decision-log.md)). |

## Decisions

The decisions are in groups by subject. Each decision has the final rule, and its rejected options keep the history.

### The scope and the fields of intake

1. **Intake and step photos are one initiative.** The reason: the two use the same rules for a photo: its name, its folder, and its size. This initiative answers questions 8 to 11 of [brands and photos](../brands-and-photos/decision-log.md) for the photos of a recipe. An option that was rejected: two initiatives.
2. **You start an [intake](glossary.md) with the button "Add recipe" in the Recipes part, or with a command of Obsidian.** The two work on the phone and on the computer. The reason: the cookbook and the card are in the kitchen with the phone, and on the computer a command is quicker.
3. **The plugin makes no request to the network in this version. You type the recipe.** Text that you paste is also permitted. The reason: the plugin stays as local as possible. An option that is open for a later version: you paste a link, and the plugin downloads the page and reads its recipe data. It has no AI and sends no vault data out, but it is the first request of the plugin to the network.
4. **For a card or a cookbook, you type the text and keep a [source photo](glossary.md).** The source photo shows the original, such as the card in the hand of your grandmother. Two options were rejected: text recognition in the plugin, which needs a large package and reads handwriting badly, and text recognition of the phone as a step of the flow.
5. **Intake has a field for each part: the title, the tags, the yield, the ingredients, and the steps. You type one ingredient or one step on each [line](glossary.md), one line at a time.** The reason: the plugin knows what each line is, so it guesses less, and the work is as simple as possible. Text that you paste goes into its field. An option that was rejected: one large field that the plugin divides.
6. **Each line shows its result below it, as you type: its amount and its food item. Enter gives the next empty line, and "Save" at the end of the fields writes a correct RecipeMD note.** The reason: the plugin fills in each fact, and you correct a line where you typed it. Three options were rejected: a separate review screen after the fields, which was the first choice and is one screen more; a note that the plugin writes at once and then shows as failed; and a note that opens in the editor.
7. **The tags field shows the tags of your recipes as chips, such as "dinner" and "breakfast". A tap adds one, and you can type a new tag.** The reason: the type of a recipe is its first tag, and the Plan needs it. An option that was rejected: a field for text only.
8. **When the vault has a recipe with the same title, intake tells you, and you can change the title there.** It does not stop you, because two versions of a recipe can both be correct.
9. **The source is a line of the description, below the title, such as "Source: One Pan Wonders, page 46". The source photos are below that line.** The RecipeMD format has no field for a source or for a photo, and its description is "zero or more paragraphs", so the line and the photos keep the note correct. The reason: the description is the first part of the note that you see. An option that was rejected: a heading "Source" after the steps. It is also correct RecipeMD, but it must come before the heading "Cooked".

### The links to the pantry

10. **One line is one food.** Salt and pepper are two lines, "salt" and "pepper", and each line links to its own food item. The plugin does not divide a line, and it has no button to divide one. The reason: one food on each line is simple, and each line connects to the pantry automatically. An option that was rejected: one line with two foods, and a button that proposes to divide it.
11. **Each ingredient links to its [food item](../../glossary.md). An ingredient with no food item gets a new food item note, the [stub](glossary.md).** Intake makes the links, so you type no link. The reason: the match does not need to guess, and the stub is "out", so the Shop part shows it. The match reads such a link today: `*500 g* [[Larder/Pantry/Chicken thighs|chicken thighs]]` is the food item `Chicken thighs`. The stub is in the pantry folder of the settings, so the plugin makes no note outside its folders.
    - a. When two food items fit one ingredient, intake makes no link. "Pasta" fits elbow pasta and shell pasta, so the recipe keeps "pasta", and you select the food item when you cook (decision 14). The reason: the best food item depends on the pantry on the day that you cook, and a link fixes it for each meal. An option that was rejected: one tap at intake that fixes the link.
12. **A line with no food item shows the chip "New: Kosher salt". A tap on the chip finds an existing food item instead, such as "Salt".** With no tap, "Save" makes the stub. The reason: a line with a long text must not become a food item when the pantry has the food already. An option that was rejected: a stub for each such line.
13. **A stub is a suggestion "Out" in the stage Extras at once.** This is the rule of today for each food item with no row, so it needs no new code. A recipe with 8 new ingredients gives 8 suggestions, and "Skip" removes each with one tap. An option that was rejected: a stub that goes on the list only when a meal needs it.

### Cook Mode

14. **On the page "Get out", a line that fits two food items needs a choice, and the plugin selects one before you tap, so that the food is used wisely.** The sequence: first the food item with the earliest use-by date, then the food item that the recipe uses up, and then the food item that you have the most of. "Pasta" with 200 g of shell pasta that the recipe uses up, and 1 kg of elbow pasta, selects the shell pasta. You mark the food item that is on the counter, and the last page takes the amount out of it. The reason: the correct food item is usually selected, and you only check it. Two options were rejected: nothing selected, so that you always tap, and the match that selects alone, with no look from you. This changes the pages [Cook Mode](../../architecture/cook-mode.md) and [end of a meal](../../architecture/end-of-a-meal.md): today the last page asks for the food item, with a list to select from.
15. **"Next" on "Get out" works with a choice that you did not make. The line shows "Which one?" in the accent colour.** With no tap, the last page uses the food item that the plugin selected. The reason: a food item is always selected, so the line must be visible, but it does not stop you. An option that was rejected: "Next" that waits for a tap.

### The photos

16. **A [step photo](glossary.md) is in the note, below its step.** It is a line with an indent in the list item, such as `   ![[Pancakes - step 3 2026-10-18.jpg]]`. The reason: the photo is near its step, and you see it with no plugin. The RecipeMD format permits all Markdown in the instructions, and a line with an indent continues the list item, so the note stays a correct recipe. Two options were rejected: the photo in the record, with the number of the step, and a photo with no link that the plugin finds by its name.
    - a. Today the step reader adds that line to the text of the step. The reader must take the photo out of the text, and Cook Mode must show it as a photo. This changes the page [steps](../../architecture/steps.md).
17. **A step keeps each of its photos, and a mark in the link tells the best one: `![[Pancakes - step 3 2026-10-18.jpg|best]]`.** For an image, Obsidian reads the text after `|` as the alternative text, or as the width when it is a number. So the mark shows nothing, and the note stays plain Markdown. The reason: the photos of each meal show how the step can look, and you select the photo that shows how it must look. Four options were rejected: one photo that a new photo replaces, the newest photo with no mark, the first photo below the step as the best, and a property.
18. **Cook Mode shows the best photo of a step, and a tap shows the others.** With no mark, it shows the newest photo. The reason: the page has room for one photo next to the large text. An option that was rejected: a row of all the photos.
19. **The camera button is on each step page of Cook Mode, and intake also takes photos.** A photo of Cook Mode goes into the vault at once. The reason: a photo that waits for the last page is lost when you close Cook Mode. At intake, you can have photos already, such as the photo of the cookbook page.
    - a. A photo of the finished food at intake, such as the photo of the cookbook, is a source photo. The reason: a record is a meal that you cooked, and the gallery shows only your own meals. An option that was rejected: a first record with no date.
20. **Each photo of a recipe is in the folder `Photos` in the recipes folder that you selected, such as `Recipes/Photos`.** This holds for a source photo, a step photo, and the photo of a meal. The folder has no setting of its own, and the plugin makes it when it saves the first photo. The reason: the recipes and their photos are one unit. When you move or rename the recipes folder in Obsidian, the photos go with it. The setup of the vault decides the recipes folder, in its own discussion. Two options were rejected: a setting that starts as the attachment folder of Obsidian, and the folder `Larder/Photos`, which you delete with the plugin home.
21. **The plugin names each photo automatically, from the recipe, the part, and the date.** A step photo is `Pancakes - step 3 2026-10-18.jpg`. A source photo is `Pancakes - source 2026-10-18.jpg`. The photo of a meal is `Pancakes 2026-10-18.jpg`, as today. You type no name. The date has no time, because the time of day tells nothing more. When a name is in use, Obsidian adds a number, such as `Pancakes - source 2026-10-18 1.jpg`.
22. **The plugin makes each photo smaller automatically: the longest side is 1600 pixels or less, as a JPEG with the quality 100%.** A photo that is smaller already keeps its size. The screen shows each photo in a standard size. The reason: an original photo of a phone is 2 to 15 MB, and Obsidian Sync has a limit for the size of a file: 5 MB on the Standard plan. A phone screen shows about 1300 pixels across, so 1600 pixels is sharp, also full screen in the gallery. At the quality 100%, a photo is about 0.7 to 1.2 MB. When the plugin draws the photo again, the GPS location in the data of the photo goes away. Three options were rejected: the original photo, which can be larger than the limit of Sync; the quality 80% of today, because the owner wants no visible loss; and the format WebP, which Safari on iOS cannot make. This changes the page [end of a meal](../../architecture/end-of-a-meal.md) and the code of today, which uses the quality 80%.

### The record and the gallery

23. **The photo of a cooked meal stays in the record of that meal, with its date. A [gallery](glossary.md) shows the records with a photo: the photo, the rating, and the note.** The record of today already has the date, the rating, the note, and the photo in one line, so the gallery reads it from the note.
24. **The record keeps the date of the meal, not the time of day.** You do not cook one recipe two times on one day.
25. **The gallery opens with a tap on the photo of a recipe card in the Recipes part, and with a command of Obsidian.** It shows one record at a time, full screen, and a swipe goes to the next.

### Convert

26. **A note that fails gets a button "Convert" in the Recipes list.** It opens intake with the text of that note. The reason: a recipe that you wrote before the plugin goes through the same flow as a new recipe, one at a time. Two options were rejected: to type each note again, and a script that runs one time outside the plugin.
27. **"Convert" replaces the text of the same note, and it keeps what the note has.** The property block stays. Each tag of the note goes into the tags field, and each source link or source text goes into the description. A text that the plugin cannot put into a field stays in the description, so nothing is lost. Each person writes recipes in a different way, so the plugin has no rule for the habits of one vault. The note keeps its name, so each link to it still works. The core plugin "File recovery" of Obsidian keeps the old version. An option that was rejected: a new note next to the old one.

## Choices that are not confirmed

None.

## Further reading

- [Recipe note](../../architecture/recipe-note.md): the exact form that each new note must have.
- [Brands and photos](../brands-and-photos/decision-log.md): the questions about the photos of an item, which decisions 20, 21, and 22 answer for a recipe.
