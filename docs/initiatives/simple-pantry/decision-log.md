---
title: "Decision log: a simple pantry"
summary: "The options and the decisions for a pantry that is simple: a level or a count for each package, one bar for each food item, a short form, and a weekly audit."
parent: ../../README.md
updated: 2026-10-19
---

[Wiki](../../README.md) / Decision log: a simple pantry

# Decision log: a simple pantry

The pantry has many rules, and on the phone it is hard to use. The form of milk has eleven fields, and two gallons show as one. This page records each decision that makes the pantry simple again, and the reason for it. The new words are in the [glossary](glossary.md).

## The words of the owner

> I dont think we hit the mark on the pantry and the packages. There are a ton of issues that dont make this seem correct.
>
> The goal of the pantry portion it to be drop dead simple. I explained the concerns I was having and wanted to address... but I think this is way over engineered and not doing anything useful.
>
> So I want to take a huge step back and rethink the whole pantry thing all together.
>
> Here are the problems I want to solve, in no particular order.
>
> * Make it super easy to add a new item to the correct place.
> * Make it super easy to modify an existing entry with correct information.
> * Automatically link to recipes so I can prioritize recipes that use whats in the pantry.
> * After done cooking the pantry is automatically updated.
> * I might have multiple brands or multiple packages of the same item, so I need to prioritize using up the existing one and then taking from the fresher packages. For example, I have 2 gallons of milk. One is at a quarter gallon, the other is full. I should be able to use the quarter gallon first, then break into the whole gallon. Eggs work similar. I might have 2 cartons of a dozen eggs. But carton one has 4 left. Use those first before getting into the other one.
> * I need to store things based on location. Location can be configurable as not everyone will have the exact same locations as I have.

> One of the things I plan on doing is an inventory audit every week. When I do my meal planning, I will check what is actually in the pantry. This is the flow. So if something gets it "wrong" in the code, I will always double check weekly any ways.
>
> One of the main goals of this project is to do as much as possible automatically. That way when I start planning the meals or grocery shopping, that is a 15-30 minute activity tops. Right now I spend over an hour multiple times a week figuring things out. So in a calm day of focus, I plan out the meals, do the shopping, update the pantry, and have the week planned out. Each day I will check in and see if there is any prep for that days meal and do so. Or I can change. No one meal is tied to a day, its more a list of what is possible that week.
>
> I like how cook and recipes work. Shopping is good but I can see some enhancements I want to make to it. Right now the pantry is the weakest part of all of this. Help me make it as quality as the other parts of the application

> The style is off. I added a screen shot of the milk. Things are not properly contained in the borders. This is too much information on the screen at once. Using this on the phone is hard.
>
> There is not unit selection. We talked about having predefined units so I dont cause a typo, but I dont see where that is implemented.
>
> The packages leveling is confusing and easy to mess up. We need to simplify this.
>
> The package leveling doesnt make sense. When I had 2 gallons of milk it looked like the total was 1 gallon. SO we need to find a better solution for the way to handle it. One version we had early on was one large bar that was divided into where it was. Maybe this will work for packages instead. For example it had a black bar for the area you were focused on, ie kitchen pantry. And when you depleted that it took away everything from the kitchen pantry. But there was downstairs pantry, when focused on that, it turned from medium grey to black to show focus. That way you knew which section you were editing and how by how much. But overall the total was calculated. Does this make sense? Maybe we can bring that back for the packages.
>
> The list can go on for issues, but this illustrates my point and would solve the vast majority of the issues.

### The words of the owner on the prototype

> Ok. I dont hate this directly. The eggs was a really good example of this.
>
> A couple tweaks I would make. I still like the sliders, over the plus and minus buttons.
>
> I dont see an easy way to add another package. I want flexibility. I might get 3 cartons of eggs depending on the season. So we need to make it easy to add extras.

> Not sure what happened here. I refreshed and reloaded the plugin and see changes, but its not quite right. What can we do to make this better.
>
> Here is what we had before.

The owner showed a screen shot of the first design: a light card with the name, a large total, one thick bar with a dark part for this place and a grey part for other places, an olive handle, a scale "0 · low at 500 g · 2 kg", and the buttons "Used up" and "Done".

> This looks better, but the beans has a glitch. Trying to move the first item in black beans, when I move it to the full the green bar jumps around.

> I like the option e the most. Lets lock it in.

## The pantry today

| Part            | The plugin today                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------- |
| A package       | One row with an exact amount, a size, a place, and a date. You type the unit.                      |
| The level       | All packages against the learned `full`, with a low line `low`.                                    |
| The units       | One unit system for each vault. "26 oz" becomes "737 g".                                           |
| The bar         | A drag on each open package, in steps of about 1/40. A count of the sealed packages.               |
| The form        | Place, amount, size, date, low line, five staple chips, "Loose", and brands, on one screen.        |
| Kinds of row    | Sealed, open, empty, and loose, each with its own rules.                                           |

## Why the pantry is hard

The model is correct: a food item has packages, and each package has a place. The weight is in the rules around it. An exact amount needs a unit system, a step of a drag, and a learned full amount. Each of them adds a field or a rule, and each field is on the one form. A weekly audit makes this exactness unnecessary: a small error lives for a week at most.

## Decisions

1. **Start over from the model.** The food item and the package stay. The rules around them start new, and the code of today is a source of parts. The reason: the owner's answer 4, "start over". The data is disposable, so no note needs a migration.
2. **Two kinds of food item: counted and measured.** Eggs are counted. Milk and rice are measured. The package size tells the kind: a plain number, such as `12`, is a count, and a number with a unit, such as `1 gal`, is a measure. The reason: the owner's answer 2. A property for the kind was rejected, because the size already tells it.
3. **A measured package has a level, not an amount.** The level is full, 3/4, 1/2, 1/4, or empty. The reason: the owner's answer 1, "levels only". You see a quarter of a jug, not 0.95 l. An exact amount was rejected, and a hidden exact amount behind a level was rejected too.
4. **A counted package has a count.** The open carton is 4 of 12. The reason: you think of eggs as a count.
5. **The unit of a package size comes from a fixed list.** You select it with a chip, and you do not type it. The list: tsp, tbsp, cup, fl oz, pt, qt, gal, ml, l for a volume, and oz, lb, g, kg for a weight. The reason, in the words of the owner: "predefined units so I dont cause a typo".
6. **No unit system.** Each package keeps the unit of its label. The plugin converts between units only to take food out after a meal. The reason: the owner's answer 3. With levels, the unit shows only in the package size.

### Meals

7. **A meal takes food out as a part of a package, and the level rounds.** The pancakes need 1 cup of milk. A jug of 1 gal at 1/2 has 8 cups, so 7 are left: 7/16 gal, which rounds to the level 1/2. The reason: the owner's answer 1 a. The plugin knows the size of each package, so it can subtract.
8. **An open package is never full.** When a meal takes food from a full package and the level rounds to full, the level becomes 3/4. The reason: without this rule, a cup at a time never changes a full jug. This is a choice of Claude: the audit corrects the error.
9. **A meal takes from the open package first.** Then from the package with the first use-by date. Then from the package that is higher in the table. The 4 eggs of the open carton go before the new carton. The reason, in the words of the owner: "use the quarter gallon first, then break into the whole gallon". This changes the rule of today, which takes the first date first.
10. **Food that the plugin cannot convert is "to check".** A recipe asks for 2 cups of flour, and the bag is 2 lb. The plugin changes nothing, and it marks flour "to check". The audit shows it first. The reason: a volume against a weight needs a density, and a guess is worse than a question. A table of densities was rejected: it is much work for a weekly error. *Changed by decision 33: the rough rule of version 0.6.0 stays, so only a count against a measure is "to check".*

### Packages and the level

11. **A package that is empty goes out of the note.** A food item with no package is out. The reason: the owner's answer 3. The empty row of today has its own rules, and only the shopping list needs to know "out".
12. **A food item is low when only one package is left, and it is at 1/4 or less.** For a count, 1/4 of the package size: 3 eggs of 12. The milk with one jug at 1/4 is low. The milk with a jug at 1/4 and a full jug is not low. The reason: the owner's answer 3 took out `full` and `low`. This rule needs no property. This is a choice of Claude.
13. **Loose food goes out.** Six apples are a counted package of 6. The reason: the owner's answer 3.
14. **Staples stay.** The kind of staple moves to the form of the food item. The reason: the Shop part uses it for its suggestions, and the owner did not ask for a change there.

### Brands

15. **Brands with photos stay.** The reason, in the words of the owner: "having that photo in the store will help me identify quickly which is which."
16. **A brand has a verdict: "Buy again" or "Avoid".** The verdict shows on the photo of the brand in the store. A brand with no verdict shows no mark. The reason, in the words of the owner: "some things that I want to build again and some things I want to avoid". Stars from 1 to 5 were rejected: the question in the store is yes or no. This is a choice of Claude.

### The pantry bar

17. **One pantry bar for each food item, with one part for each package.** Each part is as long as its package size, and its fill is its level or its count. Milk with a jug at 1/4 and a full jug is a bar of 2 gal, with 1 1/4 gal filled. The total shows below: "1 1/4 gal · 2 packages". The reason, in the words of the owner: "one large bar that was divided into where it was. Maybe this will work for packages instead."
18. **The focus makes the packages of one place dark.** The pantry part has a group for each place, as today. On the line of milk in "Fridge", the packages in the fridge are dark, and the packages in "Garage fridge" are grey. The reason, in the words of the owner: "That way you knew which section you were editing and how by how much. But overall the total was calculated."
19. **You change a package with a tap, not with a drag.** A tap on a part of the bar selects that package. A measured package shows five chips: Full, 3/4, 1/2, 1/4, Empty. A counted package shows "−" and "+". The part of the bar moves to the new fill. The reason, in the words of the owner: "The packages leveling is confusing and easy to mess up." A tap cannot land between two stops. A drag was rejected. *Replaced by decision 27 after the prototype: the owner selected a drag that snaps to a stop.*

### The forms

20. **Two forms: a package and a food item.** The package form has the place, the level or the count, and the use-by date. It fits the screen of a phone, with no scroll. The form of the food item has the package size, the other names, the staple, and the brands. A link on the package form opens it. The reason, in the words of the owner: "This is too much information on the screen at once." *Changed by decisions 27 and 32: the package form is the card.*
21. **Each part of a form stays in its border at the width of a phone.** The check is a screen of 375 pixels. The reason: the screen shot of the owner shows a date field out of its form, and a tooltip on a label.
22. **Add to pantry is a name and then a package form.** You type "milk". The plugin finds the food item by its name, its other names, or a brand, or it makes a new one. The package form opens with the place and the package size of the last package. For a new food item, it asks for the package size first: a count, or a number and a unit chip. The reason: the owner's goal "super easy to add a new item to the correct place". *Changed by decision 27: the card of the food item opens.*

### The audit

23. **The audit walks the places, one at a time.** For each place, it shows each food item with its pantry bar, with that place in focus. "Right" confirms a food item. A tap on a food item opens its card (decision 27), where you drag or empty a package. The food items that are "to check" come first. The reason, in the words of the owner: "an inventory audit every week ... This is the flow." The places are where you walk, so the audit follows them.
24. **The audit remembers where you stopped.** You can stop after the fridge and continue later. A new audit starts after you finish the last place. The reason: the audit is part of a session of 15 to 30 minutes, and a call or a child can stop it. This is a choice of Claude.

### What stays

25. **Recipes find food items as today.** A recipe finds a food item by its name and its other names, and the recipe list sorts by what the pantry has. The reason: the owner likes how recipes work, and this part of the goal is already built.
26. **Put away makes packages in the new form.** Each line of put away is one package, with the level full, or the count of its size. The reason: put away must write the form that the pantry reads.

### The verdict of the prototype

The question: which way to set a package on the new pantry bar works on the phone? Five variants ran in the Pantry part, with the notes of the test vault.

| Variant | How you set a package                                                                    |
| ------- | ---------------------------------------------------------------------------------------- |
| A       | A tap on a part of the bar selects a package. Level chips, or "−" and "+", show below.    |
| B       | The open line has one row for each package, each with its own level chips.                |
| C       | The bar is cut into stops, a quarter or one egg. A tap on a stop sets what is left.       |
| D       | The bar of C is a slider: a drag snaps to a stop.                                         |
| E       | The card of the first design, with one thick bar for all packages and an olive handle.    |

27. **The open line is the card of the first design, and you drag its bar (variant E).** A tap on a line opens a card: the name, the place, the count of packages here and the count of places, and a large total of all places. The card has one bar of 44 pixels, with one part for each package, as long as its size. The packages of this place are dark, the packages of other places are grey, and a thin line of the card is between two packages. A drag on a package puts the olive handle on it, and the fill snaps to a stop: a quarter for a measure, one for a count. Below the bar, the scale shows 0, the package under the handle ("1/4 of 1 gal"), and the size of all packages. The buttons are "+ Add package" and "Done", and the links are "Empty" and "Place and date". The reason, in the words of the owner: "I still like the sliders, over the plus and minus buttons" and "I like the option e the most." Variants A, B, C, and D were rejected. The eggs of C, one stop for each egg, stay in E.
28. **"+ Add package" adds a full package next to the others.** It copies the size of the newest package of this place, and the new package gets the handle, so that you can set its date at once. Three taps make three cartons of eggs. The reason, in the words of the owner: "I might get 3 cartons of eggs depending on the season. So we need to make it easy to add extras."
29. **The sequence of the packages stays fixed while the card is open.** The card sorts the packages in the sequence of use when it opens. A package that you add goes at the end. The reason: in the prototype, a can of beans that you dragged to full stopped being open, and it moved behind the other cans under the thumb. In the words of the owner: "the green bar jumps around."
30. **A drag stops at one stop, and "Empty" takes the package away.** The reason: a drag that goes a little too far must not remove a package. This is a choice of Claude.
31. **A metric amount shows as on its label, and other units show in quarters.** 425 g, 2.7 kg, and 58 ml, but 1 1/4 gal. The reason: the prototype showed "2656 1/4 g", which no label has. This is a choice of Claude.
32. **The place and the date open inside the card.** The place is a group of chips that wrap, so that each chip stays inside the card, and the date is one field. The reason: decision 21, and in the prototype a row of chips that scrolled was cut at the border.

### The stories

33. **The rough rule 1 ml = 1 g stays.** A meal compares a volume with a weight by this rule, as in version 0.6.0. So 2 cups of flour take 473 g from the bag. Only an amount that compares with nothing is "to check": 1 onion against a bag of 1 kg. The reason: the owner agreed to this rule in version 0.6.0, and the audit corrects the error each week. Decision 10 asked for "to check" in its place, but it did not know of the rule. This is a choice of Claude, made when the stories were written.
34. **The note keeps a verdict in the list item of the brand, after a middle dot.** `- Brand A · buy again` and `- Brand B · avoid`. The reason: the section "Brands" is the place of each fact of a brand, and the line stays easy to read and to type. A property for each brand was rejected. This is a choice of Claude.
35. **"To check" is the property `check: true` of the food item note.** A meal writes it, and "Right" in the audit, or a change in the card, removes it. The reason: each fact of the kitchen is in a note, so the phone and the computer show the same list. This is a choice of Claude.
36. **The audit keeps the last place that it finished in the data of the plugin.** The reason: it is a fact of the plugin, not of the food. This is a choice of Claude.

## Further reading

- [Spec: a simple pantry](spec.md): the scope of this log, with no reasons.
- [Decision log: one row for each package](../one-row-for-each-package/decision-log.md): the decisions that this log replaces.
