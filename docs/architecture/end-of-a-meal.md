---
title: End of a meal
summary: "What the last page of Cook Mode writes: the food that goes out of the pantry, the rating, and the record in the recipe note."
parent: cook-mode.md
---

[Wiki](../README.md) / [Cook Mode](cook-mode.md) / End of a meal

# End of a meal

A pantry that is correct on Sunday is wrong on Monday, after one meal. Nobody corrects 9 rows after dinner. So the last page of Cook Mode does it, with one button. This page tells what that button writes.

## You confirm, and the plugin counts

The last page lists each ingredient that the plugin can count, with its amount and a check box. An ingredient is counted when it has an amount and the pantry has the food in a unit that compares. The others are in one line, "Not counted".

You take the mark off an ingredient that you did not use. Two food items can have the name of the ingredient, such as elbow pasta and shell pasta for "pasta". Then the page shows the one that [Get out](cook-mode.md) selected, and it takes the food out of that one. It does not ask again.

The page uses the pantry as it was when the page opened.

## Food goes out of the pantry

For each ingredient with a mark, the plugin takes the amount out of its food item, from as many packages as it needs. A recipe asks for an amount, not for packages. The packages give in this sequence:

1. An open package before a full one. You finish the carton with 4 eggs before you open a new one.
2. Then the package with the first [use-by date](use-soon.md). A package with no date gives after each package with a date.
3. Then the row that is higher in the table.

The omelette needs 3 eggs. The open carton with 4 eggs gives 3 and has 1 left. The new carton stays at 12.

A package that gives all that it has is [empty](food-item-note.md#an-empty-package-goes-out), and its row goes out of the note. With less food than the meal needs, each package gives all that it has, and the food item is out.

A measured package gets the nearest [level](level.md) of what is left, and the middle of two levels goes up: a jug of 1 gal at 1/2 less 1 cup is 7/16 gal, which is the level 1/2. A package with food left is 1/4 or more. A package that was full and gave food is 3/4 or less: a cup at a time must change a full jug. A counted package loses its count: 4 eggs less 2 are 2.

## Food that compares with nothing is to check

The pasta asks for 1 onion, and the pantry has a bag of onions of 1 kg. A count does not compare with a weight, so the plugin does not change the bag. It writes `check: true` into the [food item note](food-item-note.md) of the onions, and the weekly audit shows them first. A row with a text such as `tap` gets no mark: water is never to check.

## The recipe note gets a record

You can give a rating of 1 to 5 stars, a note for the next time, and a photo. The plugin writes them in the [recipe note](recipe-note.md):

```markdown
## Cooked

- 2026-10-11 · ★★★★☆ · Less curry paste for the children
  ![[Chicken curry 2026-10-11.jpg]]
```

Each meal adds one line below the heading "Cooked", at the end of the note. The rating of the recipe is the stars of the newest line that has stars. The recipe list sorts by it. The plugin does not write a property, so the note stays a correct RecipeMD recipe.

A photo from a phone is 2 to 15 MB, and Obsidian Sync takes a file of 5 MB or less on the Standard plan. So the plugin draws the photo again as a JPEG with the quality 100%, with the longest side 1600 pixels or less. That is sharp on a phone, also full screen, and it is about 1 MB. A smaller photo keeps its size. The GPS location of the photo does not stay.

The photo goes into the folder `Photos` of the recipes folder, with a name that the plugin gives: the recipe and the date, such as `Chicken curry 2026-10-11.jpg`. A step photo and a source photo use the same folder and the same size, with the part in the name: `Chicken curry - step 3 2026-10-11.jpg` and `Chicken curry - source 2026-10-11.jpg`. When a name is in use, the plugin adds a number: `Chicken curry 2026-10-11 1.jpg`. The photo of a [brand](brands.md) has the same size, in the pantry folder.

## The plan and the next time

If the recipe is the main dish of a meal of the plan, the meal leaves the [plan note](plan-note.md): its task and its sides go out. A side that you cook alone does not change the plan note.

The next time that you cook the recipe, each page of Cook Mode shows the newest note of the record. Thus you see "Less curry paste" before you add the curry paste.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): why each of these changes is a change of a note.
