---
title: Gallery
summary: "How the photos of your meals come back: the photo on a recipe card, and the gallery of each meal with its date, rating, and note."
parent: recipes.md
---

[Wiki](../README.md) / [Recipes](recipes.md) / Gallery

# Gallery

Each meal that you cook can get a photo on the [last page](end-of-a-meal.md) of Cook Mode. A photo in a folder tells you nothing when you plan the week. The gallery shows each photo with what you wrote that day, so you see how the meal was before you cook it again.

## The record already has all of it

The plugin keeps no list of photos. The record of a meal in the recipe note has the date, the rating, the note, and the photo in two lines:

```markdown
- 2026-10-18 · ★★★★★ · Less sugar for the children
  ![[Pancakes 2026-10-18.jpg]]
```

So the gallery reads the record. A record with no photo is not in the gallery. The date has no time of day, because you do not cook one recipe two times on one day.

## The card shows the newest meal

A recipe card in the Recipes part shows the photo of the newest record with a photo, as a small square. A recipe with no such record shows no photo. A photo of the cookbook page is not on the card: the gallery shows only your own meals, so the photo that opens it is your own meal too.

## One meal at a time

A tap on the photo of a card opens the gallery. The command "Open the gallery" of Obsidian opens it for the recipe note that is open in the editor.

The gallery fills the tab. It shows one record at a time: the photo, the date, the stars, and the note. The newest record is first. A swipe to the left goes to the older record, and a swipe to the right goes back. The photo keeps each swipe that starts on it, so Obsidian does not open a side panel. On the computer, the arrow keys do the same while the gallery has the focus, and Escape closes it. The gallery takes the focus when it opens, so an arrow key in the editor of a different pane does not move it. "Close" goes back to the Recipes part.

## An example

The pancakes have three records, and two of them have a photo. The card shows the photo of 18 October. The gallery shows 18 October with five stars and "Less sugar for the children", and a swipe shows 4 October with "Too thin".

## Further reading

- [Recipe note](recipe-note.md): the heading "Cooked" at the end of the note.
