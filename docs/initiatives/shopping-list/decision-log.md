---
title: "Decision log: shopping list"
summary: "The options and the decisions for a list that has more than the meals, a note for each shopping trip, and a put away that records the price."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: shopping list

# Decision log: shopping list

The list has only the food that the meals of the week need. But each week you also buy bread, lunch meat, cereal, and yogurt, and you want to know what each item costs. This page records each decision that gives the list those items, and that gives each shopping trip its own note.

## The list today

| Question                           | The plugin today                                                                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What is on the list?               | The food that the meals of the week need and that the pantry does not have. The check box "Low food on the list" adds each food item that is low or out. |
| Can you add an item of your own?   | No.                                                                                                                                                      |
| Where is the list?                 | In no note. The plugin calculates it each time.                                                                                                          |
| Where is the cart?                 | In the data file: the rows that you tapped.                                                                                                              |
| What does put away ask?            | Nothing. One button puts all rows of the cart into the pantry.                                                                                           |
| Which amount goes into the pantry? | The amount that was missing. A row with no amount goes in as 1.                                                                                          |
| Which place gets the food?         | The place of the first row of the food item. With no row, the setting "Place for new food".                                                              |
| Which use-by date?                 | None.                                                                                                                                                    |
| What stays after put away?         | Nothing. The cart is empty. The plugin has no price and no record of a purchase.                                                                         |
| When does a week start?            | The plugin has no date for it. "New week" in the Plan takes each meal out of the plan note.                                                              |

An example: the pancakes need 300 ml of milk, and the kitchen has 100 ml. The list says "Milk, 200 ml". You buy 1 l. Put away adds 200 ml, so the pantry has 800 ml less than the fridge.

One page does not agree with the code. The [low food](../../architecture/staples.md) page tells about a chip. The Shop part has a check box.

## The first app had two moments

The first app is in the folder `_archive/`. Its shopping had a moment in the store, where you only tap, and a moment at home, where you confirm.

| Part         | The first app                                                                                                                                              | The plugin today             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| The list     | The meals minus the pantry, the low food that the Pantry sent, and the items that you typed, such as soap.                                                 | The meals, and the low food. |
| In the store | One tap puts an item in the cart. A tap on a photo selects the exact product. "2×" sets two packages.                                                      | One tap.                     |
| The record   | One purchase for each item of a trip: the food, the product, the packages, the quantity, the price, the answer to "Use within", and two times.             | None.                        |
| The trip     | One visit to a store: from the first tap until the cart is empty.                                                                                          | None.                        |
| Put away     | A receipt: one line for each item, the total, and the number of lines with no price. A tap on a line opens its card.                                       | One button.                  |
| The card     | The product, the quantity, the packages, the price of one package, "Use within", "Not bought", and "Put away".                                             | None.                        |
| What it knew | The quantity: the packages times the package size, then the quantity of the last time, then what the meals need. The price: the last price of the product. | The amount that was missing. |
| No time      | "Put all away" uses the quantities that the app proposes.                                                                                                  | The only action.             |
| A wrong line | You open a line that is put away, and you correct its product, its quantity, or its price.                                                                 | The bar of the Pantry.       |
| The spending | A screen with one line for each week: the sum of its trips, the number of trips, and the number of items with no price.                                    | None.                        |
| Where it was | A database on the phone.                                                                                                                                   | Notes of the vault.          |

## What the first app did not have

Four parts of the request are not in the pages, the code, or the design images of the first app.

- **A mark for "on sale".** A purchase had a price and no mark.
- **A choice of the place.** The food went to the fridge if it spoils, and to the pantry if it keeps. Only the answer "Freezer" of "Use within" selected a different location. The first app had three locations. The plugin has places with your names, such as "Downstairs pantry", so the plugin can give this choice.
- **Staples on the list.** A staple was a food with only "have, low, or out", such as salt. The low food of the plugin does the same work. Food that you buy each week, low or not, had no mechanism.
- **A list for each week.** The first app calculated its list, as the plugin does. The week was only a sum on the screen of the trips.

## Decisions

1. **The list and the shopping note are two different things.** The list is what you must buy. The plugin calculates it, and the Shop part shows it. The shopping note tells what you bought, and you do not shop from it. The reason: in the store you look at one list, on one screen. An option that was rejected: a note with the full list, which you can use with no plugin. The plugin must write such a note again at each change of the plan or of the pantry, and a line that you changed by hand can be lost.
   - a. "Shopping list" and "grocery list" are two more names for the list. The pages and the screens use "list". The [glossary](../../glossary.md) of the wiki tells this.
   - b. The meaning of "list" changes from "the food that the week needs and that is missing" to "the items to buy at the next trip". The reason: a staple is not food that a meal needs. This decision changes the row "List" of the wiki glossary.
2. **A shopping note is the note of one trip, and a trip can be on any day.** A trip usually comes when you plan the meals, but it can come in the middle of the week. The reason: the plugin needs no rule for the start of a week, and no setting for it. Two options were rejected: one note for each week of the calendar, and one note for each week of the Plan. With the calendar, a trip on Sunday for a week that starts on Monday is in the note of the wrong week.
3. **A staple is a food item that you label, and the plugin suggests it for the list.** A suggestion is not a row of the list. You accept it, you skip it, or you change it, each with little work. The reason: the plugin proposes, and you select, as it does with the ideas of the Plan. Three options were rejected: a staple that is on the list of each week until you buy it, one note with the names of the staples, and a high low line with no new mechanism.
4. **The plugin suggests a staple with no regard to the amount that the pantry has.** A suggestion shows three facts: the amount in the pantry, the date of the last purchase, and the use-by date. You look at them, and you decide. The reason: you eat bread with no recipe, so nothing tells the pantry that the bread is gone. A suggestion that needs a correct amount fails for the food that needs it most. An option that was rejected: only a staple that is low is a suggestion.
   - a. To plan the list is a moment of its own, usually when you plan the meals. In that moment you look at the pantry and you correct the amounts. The suggestions make you do this.
   - b. The plugin knows the purchase date of a food item. The reason: food that keeps, such as salt, can need a refresh two months after you bought it, and the amount does not tell this.
   - c. Three facts make a suggestion: the amount, the purchase date, and the use-by date.
   - d. A staple that keeps, such as salt or a spice, is not a suggestion at each trip. A staple that you use fast or that spoils fast, such as bread, milk, or cereal, is.
5. **You tell the plugin the kind of a staple when you label the food, and there are three kinds.** One kind is for food that spoils fast or that you use fast, such as bread. One kind is for food that keeps for a long time, such as salt. One kind is between the two, for food that keeps for some time but that you can use up between trips, such as cereal or potatoes. The reason: two kinds have no place for cereal. Two options were rejected. With the use-by date as the rule, cereal is food that keeps, because it has no near date. With a plugin that learns the days between your purchases, each food needs two purchases first, and you cannot see why the plugin suggests.
6. **The kind of a staple is a time, and one rule makes a suggestion.** The time tells how long after a purchase the plugin asks again. A staple is a suggestion when it needs a look: it is low, it is out, its use-by date is near, or the time of its kind is over. The reason: the three kinds are three points on one line, so one rule is sufficient, and a fourth kind is only one more time.
   - a. The kinds are "Often", "Sometimes", and "Seldom". "Often" has no time: the staple is a suggestion at each trip. "Sometimes" is 3 weeks. "Seldom" is 2 months. The reason: the three names are steps of one question, "how often do you buy it?", so their sequence is clear. The names "Every trip", "Infrequent", and "Keeps" were rejected: they are about three different things, and "Infrequent" can read as less often than "Keeps".
   - b. A suggestion tells its reason, such as "Potatoes: bought 3 weeks ago".
   - c. An example: potatoes are "Sometimes", and you bought them on 12 October. On 19 October they are not a suggestion. On 2 November they are. If you cook with them and they get low, they are a suggestion on any day.
7. **The label "staple" replaces the check box "Low food on the list".** Only a staple can be a suggestion. Food that is low and is not a staple gets on the list when a meal needs it, and the Pantry shows it as low. The reason: the check box is all or nothing, and it puts food on the list that you used one time. The label tells which food you always want. An option that was rejected: the check box stays, next to the suggestions. This decision changes the pages [low food](../../architecture/staples.md) and [shopping](../../architecture/shopping.md), the [features](../../features/README.md) page, and the test "Low food on the shopping list" of the [roadmap](../../features/roadmap.md). Decision 40 replaces this decision: each low food item is a suggestion now.
   - a. The amount alone does not tell that food is good. Ginger can be above its low line and too old to use. So where the plugin decides about a food item, it uses the facts together: the amount, the use-by date, and the purchase date.
8. **Food that a meal needs is a suggestion when its row in the pantry is past its use-by date.** The reason is "Past its date". The list counts only the amount, so food that is past its date is food that you have, and the list does not ask for it. The reason for the decision: the plugin has the date, and the suggestion needs no new entry from you. Two options were rejected: no change, and food past its date that does not count. A date is not exact: eggs that are 2 days past their date are good, and the list must not tell you to buy eggs.
   - a. Only a date that is past makes this suggestion. A date that is near is food to use soon, and the meal uses it.
   - b. The purchase date makes a suggestion only for a staple, because food with no kind has no time.
   - c. An example: the chicken curry needs ginger. The pantry has 50 g, with the date 1 October, and today is 12 October. The suggestion says "Ginger: past its date".
9. **The purchase date is a property of the food item note.** A food item has one purchase date. Put away writes it, and you can read it and correct it in the note. The reason: the salt that you have now was in the pantry before the first trip. With a property, it can get its date. Two options were rejected. With only the dates of the shopping notes, that salt has no date, and you cannot give one. With a column in the table, flour of August and flour of October are two rows in one place, and each trip adds rows to keep correct. This decision changes the page [food item note](../../architecture/food-item-note.md).
   - a. The date is also in the shopping note of its trip. If the two disagree, the food item note counts.
   - b. This work assumes that each food item has a purchase date. The data of today is for tests, so no note of today must stay correct.
10. **A trip has its shopping note from the moment that you plan it, and that note becomes the receipt.** The reason: you want a record of how often you go to the store, and of what each item cost over time. A note for each trip gives the two. An option that was rejected: a note that only put away writes, with your choices and the cart in the data file. The plugin reads the data file one time, when it starts, so a choice that you make on the computer is not on the phone in the store. This decision changes the page [notes of the kitchen](../../architecture/notes-of-the-kitchen.md), which gets a fourth kind of note.
11. **Put away records five facts for each item: the place, the amount, the use-by date, the price, and if the item was on sale.** The plugin adds the purchase date itself: it is the day on which you put the item away. The reason: these facts are the data for the cost of an item over time, and you have them only in the moment in which you put the item away. This decision changes the page [put away](../../architecture/put-away.md), which tells that put away asks nothing.
   - a. The amount adds to what the pantry has. It does not replace it. This is the rule of today, and it stays.
   - b. The place, the amount, and the use-by date go into the row of the food item note. The purchase date goes into its property.
   - c. An example: you put 12 eggs away in the outside fridge, with the date 2 November, for 3.49, on sale. The pantry had 6 eggs. Now it has 18, in two rows, because the two boxes have two use-by dates.
12. **Before the store, the shopping note has only your choices.** A choice is a suggestion that you accepted, or an item of your own. A row that the plugin calculates from the meals gets into the note when you put it in the cart. The screen has the full list. At the end, the note is the full receipt. The reason: the rows of the meals change when you add a meal or when you cook. So the plugin only adds a line or completes a line, and it does not write a line again that you changed by hand. An option that was rejected: a note with the full list from the moment that you plan.
   - a. An example: you accept the eggs and you add soap, so the note has two lines. The pancakes need milk. The milk is on the screen, and it gets into the note when you tap it in the store.
13. **The prices of a food item are only in the shopping notes.** The food item note has the state of now: its rows and its purchase date. The history of the eggs is the line "Eggs" of each receipt. The reason: the receipt must have each price in each case, because soap has no food item note and the total of the trip needs its price. A list of purchases in the food item note is then a copy, and two copies can disagree. An option that was rejected: put away also adds a line to a list of purchases in the food item note.
   - a. A line of a receipt links to its food item note. So the note of the eggs shows its trips as links, with no plugin.
   - b. The last price of a food item is the price on its newest receipt with no sale mark. The screen of put away proposes it. Before decision 30, it was the price on the newest receipt.
   - c. An example: you bought eggs on 28 September for 3.99, and on 12 October for 3.49, on sale. The two prices are in two receipts. The next put away proposes 3.99, because the 3.49 was a sale.
14. **A trip starts with your first action, and one trip is open at a time.** The first action is a suggestion that you accept, an item of your own that you add, or a row that you put in the cart. The plugin then makes the shopping note. There is no button for a new trip. The reason: a button is a step that you can forget, and with a button a tap on a row in the store does nothing until you start a trip. An option that was rejected: the button "New trip".
   - a. A trip can be open for days. You put an item on the list on Tuesday, and you go to the store on Saturday.
   - b. The list grows in three steps. In the week, you add the items that you hear about. When you plan the meals, the food that is missing gets on the list with no action from you, as it does today. Then you look at the pantry, and you accept the staples that need more.
15. **You can add an item of your own to the list on any day.** It is a choice, so it is a line of the shopping note at once. The reason: "do not forget to get this for me" comes in the middle of the week, with no trip to the store on that day. This decision takes the idea "Your own item on the shopping list" off the [roadmap](../../features/roadmap.md).
16. **The note of the open trip has a fixed name, and the receipt has the name of its day.** When put away ends the trip, the note gets the name of that day, such as `2026-10-18`. The reason: a trip can start on Tuesday with one item and be in the store on Saturday. With the day of put away as the name, each receipt has the day on which you bought the food, and the number of receipts is the number of trips. The open list is also always in one place, so you can type a line into it by hand. An option that was rejected: the note has the name of the day of its first line.
   - a. An example: on Tuesday 14 October you add "Batteries", and the plugin makes the note of the open trip. On Saturday 18 October you shop and put all away. The note is now `2026-10-18`. On Monday you add "Soap", and the plugin makes a new note for the open trip.
17. **The button of put away ends the trip.** The screen of put away shows each item of the cart with its facts. You check what the plugin proposes (decision 28), and then you press the button. The button puts each item of the cart into the pantry, and the note becomes the receipt. The reason: to put the food away is one moment, and you end it yourself. Two options were rejected: a trip that ends with no action when the last item of the cart is put away, and a second button "Trip is done".
   - a. The cart goes into the pantry in one step. It is not possible to put one part away today and the rest tomorrow.
18. **A choice that you did not buy goes into the note of the next trip.** The receipt has only what you bought. The reason: somebody asked you for the batteries, and the request still stands. An item of your own has no other way back to the list. This case is rare. An option that was rejected: the choice stays on the receipt as "not bought", and you add it again.
   - a. An example: the note has eggs, milk, and batteries, and the store has no batteries. After put away, the receipt has the eggs and the milk. The note of the next trip starts with one line: batteries.
19. **No empty fact stops the button of put away.** The plugin always proposes an amount and a place. A price and a use-by date can be empty. The screen tells how many prices are missing, before you press the button. The reason: the pantry must be correct first, because the list and the recipes use it. A missing price makes only one point of a later chart empty. An option that was rejected: the button works only when each item has a price. On a day with no time, the food is then not in the pantry.
   - a. The receipt is a note, so you can type a missing price into it later.
   - b. An example: the cart has eggs, milk, and a new brand of oats. The oats have no last price. The screen says "1 price is missing". After the button, the receipt has the oats with no price.
20. **Each line of a shopping note is an Obsidian link to the note of its item, and the link tells which item it is.** The name does not. The reason: the work must be as fail proof as possible. A name can find the wrong food item, or no food item. A link is exact, and it stays correct when the note gets a new name. The note of an item also shows each trip that has it. An option that was rejected: put away finds the food item by the name of the line.
   - a. The link is made when the item gets on the list, not when you put it away. So you see which note an item is before you shop.
   - b. An item is in the pantry when its link goes to a note of the pantry folder.
   - c. You can change the name of a note later. When you do this in Obsidian, Obsidian changes each link to the note. A new name that you give outside Obsidian does not change the links.
   - d. The plugin writes a link with the path of the note and the name of the item, as the plan note does. So two notes with one name do not get mixed.
21. **An item that is not in the pantry is a link with no note.** Obsidian shows a link to a note that does not exist, and it makes the note when you click the link. The plugin makes no note for such an item. The reason: the link is as exact with no note as with a note, and the vault does not get a note with no content for each item that you bought one time. An option that was rejected: the plugin makes a note for each item at once.
   - a. The link has the path of a folder that a setting names. So a click makes the note in that folder, and not in the place that Obsidian uses for new notes. This is an assumption about Obsidian, and it needs a test.
   - b. On the screen of put away, one tap puts such an item into the pantry. The plugin then makes its note in the pantry folder.
   - c. A note of the pantry folder is not only for food. Dish soap can be a staple, with an amount and a kind.
   - d. An example: you add "batteries", and no note has that name. The line is a link to `Batteries` in the folder for items. The receipt has "Batteries, 6.99", and the pantry does not change.
22. **The plugin makes each note in a folder that a setting names.** No note of the plugin is in a different place of the vault. Each setting has a value to start with. The reason: the plugin must work in a vault that has other notes, and that vault must not get shopping notes in random places.
   - a. This work adds two folders to the settings: one for the shopping notes, and one for the items that are not in the pantry.
23. **A receipt can have the store of its trip.** The store is one fact of the trip, not of each item, and it is optional. On the screen of put away, you tap a store that you used before, or you type a new name one time. The reason: you go to three stores in turn. Eggs for 3.49 in one store and for 4.29 in a different store look like a change of the price, if the receipt does not tell the store. An option that was rejected: the store is only your own text in the note, which the plugin does not read.
   - a. This work only records the store. A list in groups by store is a later subject, and the [roadmap](../../features/roadmap.md) has it as an idea.
24. **The brand and the photos of an item are not in this work.** A line of a receipt has no brand, and a food item has one last price: the price of the brand that you bought last. The reason: the brand is more than one question. Which brand did you buy? What occurs with a new brand? How does the pantry show one food item from two brands? And the product of the first app needs a photo, which needs a way to take it, a name from the context, and a folder of its own. The same questions hold for the photos of a recipe and of its steps. So the subject has its own initiative, [brands and photos](../brands-and-photos/decision-log.md), and the roadmap has it as an idea.
   - a. The form of the receipt has room for one more fact on a line, so that a brand can come later.
25. **The open note is a list of tasks, and the receipt is a table.** In the open note, a task with no mark is "to buy", and a task with a mark is "in the cart". The button of put away changes the tasks with a mark into the rows of a table, with one column for each fact. The page [shopping note](shopping-note.md) gives the two forms. The reason: a task is fast to type by hand, and six facts read best in columns. The food item note has a table too, and a brand later is one more column. Two options were rejected. With tasks from the start to the end, six facts are in one line by their position, and an empty fact moves the others. With a table from the start, you cannot type a line fast.
   - a. Two states are sufficient for the open note. The button puts the full cart away in one step, and a choice that you did not buy leaves the note. So an open note never has a line that is put away.
   - b. Your own text in the note stays when the note becomes the receipt.
   - c. The cart is in the open note, so the data file has no cart. This decision changes the row "Data file" of the wiki [glossary](../../glossary.md), and the section "What is not in a note" of the page [notes of the kitchen](../../architecture/notes-of-the-kitchen.md).
26. **The layout of the two new screens comes with the build, with no prototype.** The screens are the Shop part with the suggestions, and the screen of put away. The reason: the decisions tell what each screen does, and it is better to change a real screen than to stay with a prototype. An option that was rejected: a prototype of the two screens before the spec.
27. **This work assumes a vault that is set up and in use.** The folders of the settings are there, the pantry has its food items, and each food item has its purchase date. The reason: the work is about the main functions of the plugin first. The flow that sets up a vault comes later, with its own discussion. With this decision, the scope of this log is agreed.

## Decisions after the first test

The first test showed a screen of put away with a field and a chip on each line. With 7 items, it had 28 controls, and it looked like a form to fill. But the plugin already proposed each fact, and the button needed no entry. The goal of the plugin is to do as much as possible by itself, and then to make a correction easy. These decisions change the screen to that goal.

28. **The screen of put away opens with each fact filled in, and you only check it.** You read the lines at the counter, and you correct only what is wrong. The reason: a line that you must not change must not look like a field to fill. An option that was rejected: two steps, with the food into the pantry first and the prices later, on a second screen. It made the first step short, but you still typed each price.
   - a. A price that you do not change goes into the receipt as the price that you paid. Your check is the confirmation.
   - b. This decision changes decision 17: you do not fill in what is missing, you check what the plugin proposes.
29. **The plugin reads no receipt, and it has no AI.** The prices come from the receipts of the vault and from what you type. The reason: the plugin stays local. An option that was rejected: a photo of the paper receipt, which the Claude API reads. It gives the store, the prices, and the sales in one step, but it sends the photo out of the phone and needs a key.
30. **The price that the plugin proposes is never a sale price.** It is the price of the newest receipt on which the item was not on sale. The reason: a sale ends, so the plugin must not assume that the sale occurs again. This decision changes decision 13 b.
   - a. An example: you bought eggs on 28 September for 3.99, and on 4 October for 3.49, on sale. The next put away proposes 3.99.
31. **Each line has the chip "Sale", and you tap it when the item was on sale.** The tap marks the sale and opens the price with the keyboard for numbers, because a sale always has its own price. The field is empty, and it shows the regular price as a hint: "3.99 regular". The reason: one tap on the line of the item, with no step to open the line. An option that was rejected: "On sale" in the open line. The line has no control then, but a sale needs one more tap.
32. **The place of the last receipt is a safe start, and the screen makes the place easy to check.** The reason: the place is the fact that you check most, because you put the food away with your own hands. This decision confirms choice 16 of the list below.

## Decisions after the second test

The second test showed the Shop part as one long screen: the suggestions, the list, the cart, and the button of put away, one under the other. You could not see which items were suggestions, which were on the list, and which were ready to put away. These decisions give each moment of a trip its own stage.

33. **The Shop part has three stages, and each stage has one job.** In "Extras", you decide what the plugin cannot decide. In "Shop", you take the items of the list into the cart. In "Put away", you check the facts and put the cart into the pantry. An item goes from a suggestion to the list, from the list to the cart, and from the cart to the pantry. Each stage moves it one place. The reason: one stage shows one state of an item, so you always know where an item is. An option that was rejected: the one screen of the first build, with a heading for each group. This decision changes the pages [shopping](../../architecture/shopping.md) and [put away](../../architecture/put-away.md).
   - a. A strip at the top of the Shop part shows the three stages: "1 Extras", "2 Shop", and "3 Put away". Each stage has a count: the suggestions, the rows of the list, and the items of the cart.
   - b. One tap on the strip opens a stage, at any time. The reason: in the store you can remember an item of your own, and at home you can go back to a suggestion. An option that was rejected: a stage that opens only after the stage before it.
   - c. Each stage has one main button at the bottom. "Go shopping" opens the stage Shop. "Put away" opens the stage Put away. "Put into the pantry" ends the trip.
   - d. The screen of put away is the third stage. It does not open over the Shop part, so it has no "Back".
   - e. Motion connects the stages. When an item goes to a different stage, the count of that stage changes.
   - f. The word "step" is for a recipe, so the pages use "stage". The strip shows only the number and the name.
   - g. An example: on Thursday you open the Shop part. The strip shows "1 Extras 6", "2 Shop 2", and "3 Put away 0". You add flour and you skip salt, so it shows "1 Extras 4" and "2 Shop 3". In the store you tick the 3 rows, and it shows "2 Shop 0" and "3 Put away 3".
34. **The meals fill the list with no action from you, so the first stage has only the extras.** Its name is "Extras". It has the suggestions and the field "Add an item". One line at the top tells what the meals put on the list, such as "Your meals: 2 items on the list". The reason: the plan already tells what the meals need, so the plugin does not ask about it. The name tells that the meals are not in this stage. An option that was rejected: the name "Choose", which does not tell that the meals are done.
   - a. A tap on the line of the meals opens the stage Shop.
   - b. This decision agrees with decision 14 b. The meals fill the list first, and then you look at the staples.
35. **The word "extra" replaces the word "choice".** An extra is an item that is on the list because you put it there: a suggestion that you accepted, or an item of your own. The reason: the first stage has the name "Extras", and one thing has one word. This decision changes the row "Choice" of the wiki [glossary](../../glossary.md).
   - a. In the stage Shop, the row of an extra has the sticker "Extra". The row of a meal shows its meals, as before.
   - b. The filter "Your choices", and the group "Your choices" of the sequence "By meal", get the name "Extras".
36. **A staple that a meal of the week needs, and that is low or out, is on the list with no action from you. Food that a meal puts on the list is not a suggestion.** The reason: the meal uses the staple, so you need more of it, and the stage Extras must not ask about an item that the stage Shop already has. Two options were rejected. With the suggestion "Low" next to the row of the meal, one item shows in two stages. With only the second sentence, which was the first form of this decision, the row asks only for what the meals need, and a low staple that the pantry has enough of for the meal stays a suggestion. This decision changes the pages [shopping](../../architecture/shopping.md) and [suggestions](../../architecture/suggestions.md).
   - a. The row has the larger of two amounts: what the meals need, and what makes the staple full. It is the amount that "Add" gives a staple (choice 19).
   - b. The row shows its meals. It has no sticker "Low", because it is not an extra.
   - c. A low staple that no meal needs stays a suggestion. You decide it in the stage Extras.
   - d. When no meal needs the food any more, it is a suggestion again, if it still needs a look.
   - e. An example: eggs are a staple, with the low line 4 and the full amount 30. The pantry has 2 eggs, and the boiled eggs need 4. The list has the row "Eggs" with "28", for the boiled eggs, and the stage Extras has no line for eggs. With the pancakes, which need 1 egg, the row is the same: the pantry has enough for the meal, but the eggs are low.
   - f. A second example: avocados are a staple with the full amount 4, and the pantry has none. With the guacamole in the plan, the list has the row "Avocados" with "4". With no guacamole, avocados are a suggestion with the reason "Out".
37. **The stage Shop shows each row with a box to tick, and the cart as one closed line.** A tap on a row ticks its box, and the row goes into the line "In the cart". A tap on that line opens it, and each item in it has "Undo". The reason: a row with no box did not tell that a tap puts the item in the cart. The items of the cart also had a line through the name, which reads as "gone", not as "ready to put away". An option that was rejected: the cart as an open group under the list, with a line through each name.
   - a. The list has the heading "To get", with the number of its rows.
   - b. The bar of the list, with the field to find, the sequence, and the filters, is only in the stage Shop.
38. **The Shop part opens on the stage that has work.** That is the stage Extras when a suggestion needs a look and the cart is empty, and the stage Shop in each other case. The reason: with no suggestion, the first stage has nothing for you to do. When the cart has items, you are in the store, or you are back from it.

## Decisions after the third test

The third test put oats away with the amount "1". The receipt of 14 October had that amount, so put away proposed it again. But the note of the oats counts in grams. A "1" does not add to grams, so the oats stayed low after the trip.

39. **Put away proposes an amount in the unit of the food item.** It takes the newest amount of the receipts that is in that unit. With none, it takes the amount of the row on the list, then the full amount of the food item, and then "1". The reason: you buy the same bag each time, so an earlier purchase is the best guess. But an amount in a different unit does not add to the level, and the food stays low after put away. An option that was rejected: the amount of the newest receipt in each case. One bad amount then comes back at each trip. This decision changes choice 15.
   - a. "How much" offers only the amounts in the unit of the food item.
   - b. A food item that the pantry cannot count, and an item that is not in the pantry, take the newest amount, as before.
   - c. A new bag size needs one correction at put away. The next trip proposes the new amount, because it is the newest.
   - d. An example: the receipts of oats have "1" on 14 and 17 October, and the note counts oats in grams. The pantry has 7.5 g of 50 g. Put away proposes "42.5 g", the amount of the row on the list. With 50 g in the pantry and oats as an extra, the row has no amount, so put away proposes "50 g", the full amount.

## Decisions after the review of 17 October

The vault had 13 food items below their low line, and the Shop part showed none of them, because none was a staple. The owner's words: "I need to see what is low. Remember this is mean to be really easy to see and use." A review of the full flow then found what was missing before the trip, in the store, and at put away. These decisions come from it, in three slices.

### Slice 1: see each food item that needs a look

40. **Each food item that is out or low is a suggestion, staple or not.** A food item with no label is out when it has no row and the pantry had it before: it has a full amount or a purchase date. It is low when it is below its low line. A staple keeps each reason of decision 6, so the label only adds the reminders of time and date. The reason: the plugin finds what is low, and you decide. A label that you must set first hides the food that has no label. Two options were rejected: decision 7, which only suggested staples, and a closed group "Low in the pantry", which still hides the food. This decision replaces decision 7, and it changes the pages [suggestions](../../architecture/suggestions.md) and [staples](../../architecture/staples.md).
   - a. The suggestions are in four groups, in this sequence: "Out", "Low", "Use-by date", and "Time to check". A reason tells the group: "Past its date" and "Use by" are dates, and "Often", "Bought 3 weeks ago", and "No purchase date" are times.
   - b. A food item that the pantry never had, such as a note that a recipe made, is not a suggestion.
   - c. An example: butter has 40 g of 250 g, and its low line is 50 g. Butter is not a staple. It is a suggestion in the group "Low".
41. **"Skip" offers "Never ask" for food that you bought one time.** After "Skip", one line tells what you skipped, with "Never ask" and "Undo". "Never ask" writes the property `suggest: never` into the food item note, and the food is never a suggestion again. The form of the Pantry part has a fifth option "Never ask" next to the kinds of a staple, so you can undo it. The reason: with all low food in view, the curry paste of one recipe comes back at each trip. An option that was rejected: a list of hidden food in the settings, which you must look for.
42. **A suggestion shows the level, such as "150 ml of 1 l".** A food item that the pantry cannot count shows what it has, as before. The reason: you decide with no trip to the Pantry part.
43. **Put away adds to the row of the same place that has no use-by date.** The row gets the new date. Only put away does this. The form of the Pantry part keeps its rule, because there you type a date on purpose. The reason: put away proposes the date, so you did not make the second row on purpose. Oats with no date and a new bag of oats with a date became two rows. An option that was rejected: one rule for put away and the form.
44. **The open row of a food item in the Pantry part has "Add to the list".** It puts the food item on the list as an extra. A food item that is on the list shows "On the list". The reason: you see that the milk is low when you look at the fridge.

### Slice 2: the trip in the store

45. **The field to find in the stage Shop also adds.** When the text finds no row, the stage proposes the notes that the text finds, and "Add as new". One tap puts the item into the cart at once, as a task with a mark. The reason: in the store, you see the batteries and you take them. An option that was rejected: the field "Add an item" in the stage Shop too, which makes two fields on one screen.
46. **The list shows the amount that you usually buy.** It is the newest amount of the receipts in the unit of the food item. When the meals need more than that, the row has what the meals need. With no such receipt, the row is as before. Put away starts from the amount of the row, so the list and put away agree. The reason: you buy a box of 12 eggs, not 28 eggs and not 42.5 g of oats. This decision changes decision 36 a and decision 39.
   - a. An example: the receipts of eggs have 12. The boiled eggs need 4 eggs, and the pantry has 2. The row says "Eggs, 12".
47. **Each row of the list shows its regular price, and the stage Shop shows the totals.** The price is the regular price of the receipts. Below the list, a line says "About 9.40 in the cart · 14.18 in all". A row with no price adds nothing. The reason: the receipts have the prices already, so you see the cost of the trip with no entry. The total is "about", because the price is for the amount of the receipt.
48. **The screen stays on in the stage Shop.** The setting "Keep the screen on" of Cook Mode decides it. The reason: in the store, the phone must not lock between two shelves.
49. **The stage Put away shows the total of the trip.** It is the sum of the prices of its lines. This decision confirms choice 14.

### Slice 3: the store

50. **You select the store at the start of the trip, in the stage Shop.** The open note keeps it as the property `store`, so the phone and the computer have the same store. Put away shows that store, and you can change it there. The receipt gets it. The reason: the store tells the order of the list (decision 51), and it is a fact of the trip from its start. This decision changes decision 23 and choice 34.
51. **The list learns the order of each store.** A tick moves the task to the end of the tasks of the open note, so the receipt has the items in the order in which you took them. With a store, the list has the sequence "Store order": each row is where its item was in the newest receipt of that store. Items that you never bought there come last, from A to Z. The sequence is on when you select a store that has a receipt. The reason: you walk through a store in the same order each time, so the last trip is the best map. Two options were rejected: aisles that you type for each item, and AI.
   - a. The receipts from before this decision have the order of the note, not of your taps. The order is correct from the first trip after it.

## Decisions after the test of put away and Extras

The test of 17 October corrected one item at put away, and the stage had no "Put away" for that item. The owner's words: "I want to put items away individually. I will look at the receipt and find the item to update. When done with that item, call it a day." And: "I see myself editing a thing, being satisfied with it, then wanting to commit it to the pantry right then."

52. **The open line has "Put away", for that item only.** The item goes into the pantry at once, and its line goes off the screen. "Put into the pantry" puts the rest away. The reason: while the plugin does not know your food well, you check each item against the paper receipt, and an item that you checked is complete. "Put into the pantry" is for later, when most facts are correct with no change. This decision changes decision 17 and 17 a.
   - a. "Put away" is in the open line, next to "Not bought", because you correct the facts there. The closed line has no "Put away".
   - b. The row of the item goes into a table in the open note at once. Its task stays, so the receipt keeps the order of the store (decision 51). The stages Shop and Put away do not show the item again.
   - c. The trip ends when its last line goes off the screen of put away, with "Put away" or with "Not bought". The reason: an empty cart has no other action that ends the trip. Decision 17 rejected this, when one button put the full cart away.
   - d. The purchase date of the item is the day of its put away. The receipt gets the day of the end of the trip.
   - e. An example: the cart has milk, lime, and avocados. You open milk, type "1.29", and tap "Put away". The note `Milk` gets the food, and milk goes off the screen. You tap "Put into the pantry", and lime and avocados go in. The receipt has the three rows in the order of the store.

The same test found a gap in the stage Extras.

53. **Each food item near or past its use-by date is a suggestion, staple or not.** The reasons are "Past its date" and "Use by", in the group "Use-by date". Only the reasons of time stay for a staple. The reason: the test of 17 October showed no suggestion for spinach with the use-by date of the next day, because spinach is not a staple. The owner's words: "I do not see all the items that are low, expire, or out in the suggestion." This decision changes decision 40. Decision 8 stays: the list does not ask for food of a meal that is past its date, and the suggestion asks you to look.
54. **Food that is exactly at its low line is low.** This holds everywhere: the suggestions, the bars of the Pantry part, and the list. The reason: the same test showed no suggestion for ginger, with 20 g of 100 g and its line at 20 g, and for flour, with 300 g of 1 kg and its line at 300 g. The line is where you want more, so food at the line needs a look. The owner confirmed this rule. This decision changes the rule of the [level](../../architecture/level.md).

### Put away shows only what needs a look

The owner's words: "The put away can put away all the items where we can infer stuff. But then leave only the list of what cannot be inferred. [...] But the action of put away should still be manual." And: "I dont want to rely on app memory to store all this stuff. I want to create the receipt note as soon as we have some information, but the state is active or complete." And: "I would put it in its final location from the first fact. Why make it complicated and move files around?"

55. **Put away has a closed group "Known" for the items that the plugin knows.** An item is known when its last receipt has an amount, a place, and a price. "Put away 9 known" at the lower edge puts these items into the pantry. Each other item is a line in the groups by place, with its own "Put away". The reason: you look only at what the plugin cannot know, and you still decide when food goes into the pantry. This decision changes decision 52, and "Put into the pantry" is gone.
   - a. The group is closed, and you can open it. So you see each known item, and you can tap "Sale" on it before the button. The reason: no state of the pantry is hidden.
   - b. A known item that you correct stays in the group "Known". It does not move under your thumb.
   - c. The plugin never puts food away with no tap from you.
   - d. An example: the cart has eggs, milk, and quinoa. Eggs and milk have a receipt with an amount, a place, and a price. Quinoa has no receipt. The group "Known" has 2 items, and quinoa is a line in "Kitchen", with "no place yet".
56. **The receipt is a note in its final place from the first fact.** When the stage Put away opens with a cart, the plugin makes the note `Shopping/2026-10-17` with `status: active`, and one row for each item of the cart. Each correction goes into its row. The column "Done" has `yes` for each item that is in the pantry. The plugin reads the facts from the note, not from its memory. When each row is done, the note gets `status: complete`. The reason: a restart of Obsidian, or a different device, continues where you stopped. The note does not move, so a link to it stays correct. This decision changes decisions 16, 25, and 52 b.
   - a. The name is the day on which the receipt starts. A second receipt of one day gets a number, as before.
   - b. An item that you tick after the receipt starts gets a row at the end of the table. So the rows keep the order of the store.
   - c. A price that you type goes into the note when you stop typing. The note keeps the price as you typed it, and it gets 2 decimals when the receipt is complete.
   - d. "Not bought" and "Undo" take the row of the item out of the receipt, when the item is not done.
   - e. When the receipt is complete, the column "Done" goes, and the receipt gets the store of the trip. The note "Next trip" keeps only its tasks with no mark. Your own text of that note goes into the receipt, as before.
   - f. The history of the receipts, such as the last receipt of an item and "Store order", uses only receipts with no `status: active`.

## Choices that are not confirmed

You can change each of these after the first test.

1. **The time of "Sometimes" is 21 days.** The time of "Seldom" is 60 days: the 2 months are from the owner. A time is over when the purchase date is that number of days ago, or more.
2. **The time of a kind is a fixed value, not a setting.** It becomes a setting when it is wrong for your kitchen.
3. **A use-by date is near with the same number of days as "Use soon".** It starts as 5 days. A date that is past is near too.
4. **A staple with no purchase date needs a look.** The plugin cannot tell that its time is not over.
5. **The property of the purchase date has the name `bought`.** Its value is a date as year-month-day.
6. **The note of the open trip has the name "Next trip".** The folder of the shopping notes starts as `Shopping`.
7. **A second receipt of one day gets a number.** The first is `2026-10-18`, and the second is `2026-10-18 2`.
8. **The screen of put away can take an item out of the cart.** It is for a wrong tap in the store. A row of a meal goes back to the list, and a choice is "to buy" again.
9. **The folder for the items that are not in the pantry starts as `Shopping/Items`.**
10. **A trip to two stores is one receipt with one store.** For exact data, you put the cart away after each store.
11. **The plugin reads the day of a receipt from the property `date`.** So you can change the name of a receipt.
12. **The price of a row is what you paid for its full amount.** It is not the price of one unit, and it has no currency.
13. **A task with no link is an item of your own.** Its text is its name, and it is not in the pantry.
14. **The total of a receipt is on the screen, not in the note.** A total in the note is a copy, and it is wrong after you correct a price by hand.
15. **Put away proposes the amount of the last receipt of the item.** With no receipt, it proposes the larger of two amounts: what makes the food item full, and what the meals need. With none of the two, it proposes 1. Decision 39 changes this: the amount must be in the unit of the food item.
16. **Put away proposes the place of the last receipt of the item.** With no receipt, it proposes the place of the first row of the food item. With no row, it proposes the setting "Place for new food".
17. **Put away proposes a use-by date with the same number of days as the last time.** Eggs that had 3 weeks on the last receipt get 3 weeks from today. With no receipt, the date is empty.
18. **A suggestion that you skip is gone until the trip ends.** At the next trip, the plugin asks again, if the food item still needs a look.
19. **A staple that you accept has the amount that makes it full.** It is the rule of the low food of today. If a meal needs more, the larger amount stays.
20. **You label a staple in the form of the food item, in the Pantry.** The property is `staple`, and its value is `often`, `sometimes`, or `seldom`.
21. **Food that a recipe needs and that the pantry does not know has a link into the pantry folder.** Put away makes its note there, as it does today.
22. **The data file has no cart and no choice for the low food.** The values of today are not kept.
23. **The plugin keeps the suggestions that you skipped in the data file.** Put away takes them out.
24. **A suggestion shows one reason.** With more than one reason, the sequence is: "Out", "Low", "Past its date", the use-by date, the purchase date. A staple of the kind "Often" with no other reason shows "Often".
25. **A suggestion of food that a meal needs has the amount that the meals need.**
26. **An item of your own has no amount on the list.**
27. **The filter "Low food" of the Shop part gets the name "Your choices".** It shows each row of a choice.
28. **The texts of the new controls are in the stories.** They are "Suggestions", "Add", "Skip", "Remove", "Add an item", "Add as new", "Put away", "Not bought", "Put into the pantry", "Into the pantry", and "Store".
29. **The lines of put away are in groups by place.** The groups have the sequence of the places of the pantry, and the items that are not in the pantry are the last group. The reason: you put the food away one place at a time, such as the fridge first. A change of the place moves the line into its new group, with a motion.
30. **A closed line has only text and the chip "Sale".** The text is the name, the amount, the use-by date, and the price. A tap on the line opens the corrections as chips: the last amounts of the item, the use-by date ("No date", "3 days", "1 week", "2 weeks", "1 month" of 30 days, or a date), and the places. The open line also has the price field, "Not bought", and, for an item that is not in the pantry, "Into the pantry".
31. **An item with no receipt that has no sale mark starts with no price.** So an item that you only bought on sale counts as a missing price.
32. **A second tap on "Sale" puts the sale off.** If you typed no price, the regular price comes back. A price that you typed before the first tap stays.
33. **A line says "no place yet" when its place comes from the setting "Place for new food".** It is the only place that the plugin guesses, so it is the one that needs your look.
34. **No store is on when the screen opens.** The reason: you go to three stores in turn (decision 23), so the store of the last trip is often wrong.
35. **The field "Add an item" is only in the stage Extras.** In the store, you open the stage Extras to add an item.
36. **The field "Add an item" is above the suggestions.** The keyboard of a phone hides a field at the lower edge of the tab.
37. **The suggestions have no heading of their own.** The groups by reason of decision 40 a are the headings.
38. **The stage Extras with no suggestion says "No food needs a look."** The field "Add an item" stays.
39. **The button "Put away" of the stage Shop shows only when the cart has items.** Its text has the number of the items, such as "Put away 3".
40. **The stage Put away with an empty cart says "The cart is empty."** It has no button "Put into the pantry".
41. **The stage Shop with no row says "Each item is in the cart." or "Nothing to get."** The first text is for a cart with items, and the second for an empty cart.
42. **The Shop part keeps the stage that you opened when you go to a different part and back.** Decision 38 selects the stage when Obsidian starts, and after "Put into the pantry".
43. **A staple that a meal needs, and that is not low, keeps its other reasons, such as "Often".** It is a suggestion when the pantry has enough of it for the meals.
44. **Decision 36 holds for food that is past its date too.** A hard case: the curry needs 500 g of chicken thighs, and the pantry has 200 g that is past its date. The list asks for 300 g, and no suggestion tells that the 200 g is old.
45. **Each motion takes 0.2 s, and with less motion there is none.** The ink line of the strip slides to the stage that opens. "Add" slides the line of a suggestion out. A tick fills the box, and then the row slides into the line "In the cart".
46. **The group "Time to check" comes last.** A reason of time is a reminder, and an empty or low food item is a need.
47. **The line of a skip stays until your next action, or for 8 s.**
48. **"Add to the list" in the Pantry part adds the food item as an extra.** "On the list" is a fact, not a button: you take an item off the list in the Shop part.
49. **"Store order" ranks an item by its row in the newest receipt of that store, as a part of the length of the receipt.** So a short receipt and a long receipt have one scale.
50. **The totals of the stage Shop count only the rows with a price.** With no price at all, the line does not show.

## What this work does not include

1. **The first fill of the pantry.** How a new pantry gets its food items, with their amounts, their kinds, and their purchase dates, is a subject with its own discussion.
2. **A view of the prices over time.** A dashboard with the prices of all items is a subject with its own discussion. This work only records the data that the dashboard needs.
3. **Brands and photos.** Which brand you bought, a photo of an item, a package size, and a barcode have their own initiative.
4. **A comparison of stores.** The list has the order of a store (decision 51), but it does not tell which store is cheaper for an item.
5. **The setup of a vault.** The folders that the plugin makes for a new user, and the choice of your own folders, are a subject with its own discussion. Two facts for that discussion: today the plan note starts at the top of the vault, and with no recipes folder the plugin tries each note of the vault.

## Further reading

- [Workflow](../../standards/workflow.md): the step of the work that this page is in.
- [Put away](../../architecture/put-away.md): the action that this work changes.
