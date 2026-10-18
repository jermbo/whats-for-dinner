---
title: Take a photo of a brand at put away
summary: "On the open line of put away, the keeper takes a photo of the package in hand, and that new brand is selected for the line."
parent: brands-stories.md
persona: Keeper
depends-on: [brands-add-a-brand-with-the-camera.md, brands-check-the-brand-at-put-away.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Brands stories](brands-stories.md) / Take a photo of a brand at put away

# Take a photo of a brand at put away

As the [keeper](../../personas.md), I want to take a photo of the package in my hand on the open line of put away, so that a new brand gets its photo and is the brand of that line.

## Requirements

1. The open line has a small camera tile after the brands of its food item
   - a. A line with no brand shows only the tile
   - b. A line of an item with no food item note has no tile
2. A tap on the tile opens the camera
   - a. When you close the camera with no photo, nothing changes
3. The photo is a new brand with no name, with the rules of [Add a brand with the camera](brands-add-a-brand-with-the-camera.md)
   - a. The file and the section "Brands" are written at once
4. The new brand is selected for the line
   - a. The cell `Brand` of the active receipt gets the link to the photo
   - b. The new photo fades and grows in, with the ring of the selection. With "Reduce motion", it shows with no motion

## Acceptance criteria

Each criterion starts with the vault of the [list page](brands-stories.md#what-the-vault-needs) on 2026-10-18, and taco seasoning in the cart.

1. GIVEN the line of taco seasoning is open WHEN the keeper looks at the line THEN it shows a camera tile after the chip "Brand C"
2. GIVEN the line of taco seasoning is open WHEN the keeper taps the camera tile and takes a photo THEN `Larder/Pantry/Photos` has `Taco seasoning - brand 2026-10-18.jpg`
   - a. AND the section "Brands" of `Taco seasoning.md` ends with `- ![[Taco seasoning - brand 2026-10-18.jpg]]`
   - b. AND the new brand is selected
   - c. AND the cell `Brand` of the active receipt is `[[Taco seasoning - brand 2026-10-18.jpg]]`
3. GIVEN the cart has batteries WHEN the keeper opens the line of batteries THEN the line has no camera tile
4. GIVEN the keeper tapped the camera tile WHEN the keeper closes the camera with no photo THEN the selected brand is the same as before

## Depends on

- [Add a brand with the camera](brands-add-a-brand-with-the-camera.md): the file and the section of a new brand.
- [Check the brand at put away](brands-check-the-brand-at-put-away.md): the brands of the open line, and the selection.

## Architecture

- [Put away](../../architecture/put-away.md): the open line.
- [Food item note](../../architecture/food-item-note.md): the section "Brands".
- [Spec: brands and photos](../../initiatives/brands-and-photos/spec.md): scope 2 b.
