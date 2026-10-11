---
title: End of a meal
summary: 'What the last page of Cook Mode writes: the food that goes out of the pantry, the rating, and the record in the recipe note.'
parent: cook-mode.md
updated: 2026-10-11
---

[Wiki](../README.md) / [Cook Mode](cook-mode.md) / End of a meal

# End of a meal

A pantry that is correct on Sunday is wrong on Monday, after one meal. Nobody corrects 9 rows after dinner. So the last page of Cook Mode does it, with one button. This page tells what that button writes.

## You confirm, and the plugin counts

The last page lists each ingredient that the plugin can count, with its amount and a check box. An ingredient is counted when it has an amount and the pantry has the food in a unit that compares. The others are in one line, "Not counted".

You take the mark off an ingredient that you did not use. Two food items can have the name of the ingredient, such as elbow pasta and shell pasta for "pasta". Then you select the one that you used.

The page uses the pantry as it was when the page opened.

## Food goes out of the pantry

For each ingredient with a mark, the plugin takes the amount out of its food item. The row with the first [use-by date](use-soon.md) gives first. A row with nothing left goes out of the table.

The chicken curry takes 500 g of chicken thighs, and the outside fridge has 500 g. The row goes out, and chicken thighs are out.

A row keeps its unit, as the [amounts](amounts.md) page tells.

## The recipe note gets a record

You can give a rating of 1 to 5 stars, a note for the next time, and a photo. The plugin writes them in the [recipe note](recipe-note.md):

```markdown
## Cooked

- 2026-10-11 · ★★★★☆ · Less curry paste for the children
  ![[Chicken curry 2026-10-11.jpg]]
```

Each meal adds one line below the heading "Cooked", at the end of the note. The rating is also the property `rating` of the note, so that the recipe list can use it.

A photo from a phone is some megabytes. The plugin makes it small before it goes into the vault, with your other attachments.

## The plan and the next time

If the recipe is a meal of the week, its task in the [plan note](plan-note.md) is done.

The next time that you cook the recipe, each page of Cook Mode shows the newest note of the record. Thus you see "Less curry paste" before you add the curry paste.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): why each of these changes is a change of a note.
