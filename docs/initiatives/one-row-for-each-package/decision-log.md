---
title: "Decision log: one row for each package"
summary: "The options and the decisions for a pantry row that is one package, with its own size, its own amount left, and its own use-by date."
parent: ../../README.md
updated: 2026-10-18
---

[Wiki](../../README.md) / Decision log: one row for each package

# Decision log: one row for each package

You have two gallons of milk with two dates, and two cartons of eggs with 2 eggs and 12 eggs. The pantry keeps each of them as one row with one amount and one date, and the bar cannot show what you see. This page records each decision that makes one row one [package](glossary.md), and the reason for it.

## The words of the owner

> The full line doesn't make sense. For example, I buy milk when I am halfway low. But since the full line is 1 gallon, it does not represent the correct amount of 1.5 gallons. Similar issue with eggs. I have two cartons one has 2 the other has 12. So I need to track that properly.
>
> In addition to that, if I have 2 separate gallons of milk, they have different expiration dates. So I think we need to track the expiration date of each item even if its the same item.
>
> Finally, the steps don't seem to make sense across the board. Milk again for example is only full half or empty. Why cannot I not make it a quarter gallon left? Other items are similarly weird. Eggs came up like I can only edit by 2 at a time? But I may have an odd number.

## The pantry today

| Part                   | The plugin today                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| A row                  | One food item in one place, with one amount and one use-by date.                                                           |
| Food that you add      | Put away adds it to the row of the same place and date. A row with no date takes the new food and its date.                |
| The length of the bar  | The full amount of the food item. The bar stops when all places together have the full amount.                             |
| The full amount        | The property `full`. The plugin raises it only when the pantry already has more.                                           |
| The step of the bar    | About 20 steps from empty to full, rounded. 24 eggs give a step of 2. A count below 4 gives a step of 1/2.                 |

## Why the three problems are one problem

The bar asks what you see, but you see packages, and the row has no packages. A half gallon and a full gallon are one row of 1.5 gal with one date. The bar of that row is as long as the full amount of the food item, not as long as one gallon. So the full line, the date, and the step are wrong for the same reason.

## Decisions

1. **One row is one package.** Each row has its own package size, its own amount left, and its own use-by date. The two gallons of milk are two rows: 1/2 gal until 22 October, and 1 gal until 29 October. The two cartons are two rows: 2 of 12, and 12 of 12. The reason: the row then is the thing in your hand, so the bar, the date, and the total agree with what you see. Two options were rejected: one row for each place, as today, and a list of dates on one row, which does not tell which amount has which date.
2. **Each package is its own row, also when packages are the same.** Eight cans of beans of 15 oz with one date are eight rows, and each row has its own use-by date. The reason: one rule for each row, and a package that you open needs no split. An option that was rejected: one row for sealed packages that are the same, such as "8 × 15 oz", because it gives two forms of row.
3. **The package size is a column `Size` of each row.** The row of the open carton is `Fridge | 2 | 12 | 2026-10-25`. The reason: a store sells more than one size of the same food, such as a carton of 12 and a carton of 18, and each row keeps its own size. Two options were rejected: one property `package` for the food item, which gives all packages one size, and a new form of amount, "2 of 12", which recipes would have to learn.

### The bar and the level

4. **A step of the bar is 1/8 of the package for a measure, and 1 for a count.** A gallon of milk moves by 1 pint, so each quarter is a stop. A carton of eggs moves by 1 egg, so 3 eggs is possible. The reason: the bar asks what you see, and you see quarters of a jug. Two options were rejected: quarters, which have no stop between them, and about 20 round steps, which give amounts such as 0.35 gal. *Replaced in version 0.6.0 by decision 7 of the [open choices](../open-choices-of-the-first-version/decision-log.md): in a metric vault, 1/8 of a jug of 3.79 l is 0.47 l.*
5. **The full amount stays, but only for the level.** The plugin learns it as it does today: two gallons in the fridge make `full: 2 gal`. No bar stops at it. The low line is `low`, or a percentage of the full amount. The reason, in the words of the owner: "we need to know what to compare low to." Two options were rejected: a low line that counts packages, and a level that compares the total with the sum of the package sizes.

### The rows

6. **Each row has a size, and the plugin fills it in.** A jar of rice gets the size of the jar. A row with no size gets its own amount as its size. A row with no number, such as "a full bag", has no bar, as today. The reason, in the words of the owner: "not every item will have packages, so that can be grouped together." An option that was rejected: a size that is optional, which gives a row with no size the full amount as the length of its bar, and so the old limit.
7. **Put away has one line for each package.** Two gallons of milk are two lines, each with its own date. Each line makes a new row, or takes the empty row of its place (decision 21). So put away no longer adds food to a row that has food, but loose food does (decision 11). The reason: each package has its own date, so each package gets its own line. The owner confirmed this reason with the spec. Two options were rejected: one line "2 × 1 gal" with one date, and one line "2 × 1 gal" with a date field for each package.
8. **A meal takes from the package with the first date.** When two packages have the same date, or no date, the open package gives first. A package is open when it has less than its size left. The reason: the rule of today stays, and the carton with 2 eggs is used before a new carton.

### The Pantry part

9. **The Pantry part has one line for each food item in each place.** "Beans · 8 cans" is one line in the group "Downstairs pantry". A tap on it shows each package with its own bar and its own date. The badge of the line shows the first date of its packages. The reason: the groups by place stay, and the list stays short. Two options were rejected: one line for each package, which gives 8 lines of beans, and one line for each food item for all places, which hides the places.
10. **The open line shows the sealed packages as one count, and a bar for each open package.** The beans show "7 sealed · − +" with the first date, and one bar for the open can. Sealed packages with different dates show as one count for each date. The reason: a sealed can has nothing to drag. You seldom need the date of each sealed can apart; the owner confirmed this with the spec. An option that was rejected: one bar for each can, which gives 8 bars.
11. **A chip "Loose" tells that a food item has no packages.** The chip is on the line of put away and in the form of the Pantry part. It writes `loose: true` into the note. Loose food has one row for each place. New food goes into that row, and the size of the row becomes its new amount: 2 apples and 6 more apples make 8, with size 8. The reason: put away cannot tell 6 loose apples from a carton of 6 eggs, and loose food is "grouped together". Two options were rejected: loose food that is always a new row, and a unit that tells it, which you must type.

### Put away and the Pantry part

12. **The number of lines at put away is the amount of the list divided by the last size.** "Milk, 2 gal" and a last row with `Size: 1 gal` give 2 lines. With no last size, it is 1 line. "+ package" copies a line for a package that the list did not know. The reason: the plugin fills it in, and you correct it with one tap. An option that was rejected: always 1 line, with one tap for each more package.
13. **"Add package" and "Used up" change the packages in the Pantry part.** "Add package" in the open line copies the size of the last package, with an empty date. "Used up" on a package sets it to nothing, and its row stays (decision 17). The reason: one tap for each package. An option that was rejected: the form only, as today.
14. **A new food item gets the amount of its line as its size.** New quinoa, 1 lb, gets `Size: 1 lb`. For 2 bags of 1 lb, you correct the line to 1 lb and tap "+ package". The reason: you bought the package, so its amount is its size. An option that was rejected: a field that asks for the size. *This stays for put away. Decision 9 of the [open choices](../open-choices-of-the-first-version/decision-log.md) adds the size to the form "Add to pantry", for food that is already open.*

### The receipt and the list

15. **The receipt has one row for each package.** Two gallons of milk are two rows, each with its amount, its price, its place, and its date. The price of a row is the price of one package. The reason: each line of put away is one package, and each row keeps its own "Done". The last size of decision 12 comes from the last row. An option that was rejected: one row for each item, which loses the two dates and the two places.
16. **The list asks for the amount that the meals need, and the pantry tells the packages.** The meals need 1.5 gal of milk, so the row is "Milk, 1.5 gal". The list does not count packages. At put away, you record the packages that you bought. The reason, in the words of the owner: "Ask for the amount necessary and move on for recipes. Let the pantry dictate how many packages something is." This decision replaces an earlier answer: a list that shows packages, such as "2 × 1 gal". That answer opened a question of how to round, and the owner saw no reason for it.

### Answers that decision 16 changed

These answers came when the list showed packages. After decision 16, the owner confirmed each change.

- a. **The list never asks for a size.** Decision 14 gives a new food item its size at put away. This replaces the answer "the list asks for a size when the vault has no record".
- b. **Put away divides the amount of the list by the last size, as decision 12 tells.** 1.5 gal and a last size of 1 gal give 2 lines, and you correct the number with one tap. This replaces the answer "put away takes the number of lines from the list".
- c. **A row of the list shows the price of the newest receipt row, as today.** That row is one package, and the total stays "about". This replaces the answer "a row shows the price of one package".

### Used-up packages and meals

17. **The row of a package that is used up stays, with nothing left, and the next package takes its place.** The first gallon of milk is finished, so its row is "0 of 1 gal". Put away writes the next gallon over that row. The owner: "My first instinct is to say remove it, but I can see multiple arguments. Lets go with Option B and see if that is a bad choice in the future." So this decision gets a review after the first test. An option that was rejected for now: the row goes out of the table, and the next package is a new row.
18. **A meal takes from as many packages as it needs.** The omelette needs 3 eggs. The open carton gives 2, and is used up. The sealed carton gives 1, and is open with 11. The reason, in the words of the owner: "The recipe does not care about how many packages I have. It cares only about what it needs. The end of cook should take care of the pantry update." An option that was rejected: a meal that takes from one package only.

### The empty row

19. **A food item is out when each row has nothing left, or when the note has no row.** You finished the last gallon, so milk is out: it is on the list, and the filter "Out" shows it. The reason: an empty row must not hide food that you need. An option that was rejected: out only with no row.
20. **One empty row stays for each place.** You used up 8 cans of beans in the downstairs pantry. The first empty can stays as "0 of 15 oz", and the next empty cans of that place go out of the table. The reason: one empty row keeps the place and the size for the next put away, and more empty rows are noise. An option that was rejected: one empty row for each package.
21. **Put away writes over the empty row of the place of its line.** The new gallon goes to the kitchen fridge, so it takes the empty row there, with its new size and its new date. A place with no empty row gets a new row. The reason: the empty row is the slot of its place. An option that was rejected: the first empty row in any place.
22. **The Pantry part does not show an empty row.** With one full gallon and one empty row, the open line shows one bar. With only empty rows, the line shows "Out", as today. The reason: an empty bar has nothing to drag. An option that was rejected: a bar at 0 for each empty row.

### What stays out

23. **The first fill of the pantry in setup is not part of this work.** It gets its own discussion. The owner confirmed this with the spec.
24. **A row of the pantry has no brand.** Decision 14 of [brands and photos](../brands-and-photos/decision-log.md) stays. The owner confirmed this with the spec.

### The units and the gaps that the stories found

The stories found five gaps in the spec. The owner confirmed each of these answers: "Your choices look good."

25. **Gallons, quarts, pints, and fluid ounces are volumes, and the plugin converts them.** Before this work, the plugin read "1 gal" as a count of a thing with the name "gal", so a step of milk was 1/2, and 300 ml of milk for the pancakes did not compare with the milk of the pantry. The units are `gal` (3785.41 ml), `qt` (946.35 ml), `pt` (473.18 ml), and `fl oz` (29.57 ml). `oz` with no "fl" stays a mass. The reason, in the words of the owner: "place in what the package says, then do the conversion automatically. Like if I add gallon but the recipe calls for millileters, we should be able to get it converted. I am not looking for exact perfection, close is good."
26. **An eighth that is not round with 2 decimals shows as a fraction.** A step of milk is 1/8 gal, and 0.125 gal shows as 0.13 gal. So the bar and the note show "3/8 gal" and "1 1/2 gal". A metric unit keeps the rule of today: 0.625 kg is "625 g". The reason: you read a gallon, a cup, or a pint in fractions on the package.
27. **An empty row has no use-by date that counts.** An empty row gets no badge, is not "use soon", and is not past its date. Its date in the note stays until put away writes over the row. The reason: the empty slot of the eggs must not make a suggestion for food that you do not have. An option that was rejected: put away clears the date when the row becomes empty, which changes the slot.
28. **A tap on a sealed count opens one package of it.** You open a new can and use half. A tap on "5 sealed" shows a bar for one can, full, and the count becomes "4 sealed". With no change, the can stays sealed. The reason: a sealed package has no bar, and you can use half a can with no recipe. An option that was rejected: a package opens only through a meal. *Changed in version 0.6.0 by decision 6 of the [open choices](../open-choices-of-the-first-version/decision-log.md): a line with no open package shows the bar of its first sealed package with no tap.*
29. **"−" on a sealed count makes one package of that date an empty row, and "+" adds one sealed package with that size and date.** So "−" acts as "Used up" on one sealed package. The reason: "one package less" has one result, and "−" corrects a wrong "+". An option that was rejected: "−" takes the row out of the table.
30. **A fixed list of units is a later initiative.** The owner: "I want to make it easy to enter and be correct. I dont want to have a typo that throws the whole thing off." The proposal: a screen gives the unit as a chip, never as typed text, the plugin writes only the short name, and a unit that is not on the list shows a warning. The owner wants it later, for the recipes and the pantry together: "I think we need to make it a later initiative because I want to have things synced properly." In this work, a unit stays text, as before.

## Questions that are open

No question is open. The [spec](spec.md) has the scope.

## Further reading

- [Amount bar](../../architecture/amount-bar.md): the bar of an open row today.
- [Level](../../architecture/level.md): how the full amount and the low line make a food item low.
- [Workflow](../../standards/workflow.md): the step of the work that this page is in.
