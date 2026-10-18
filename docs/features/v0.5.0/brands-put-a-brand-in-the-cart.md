---
title: Put a brand in the cart
summary: "In the stage Shop, the shopper taps the photo of a brand and then In cart, and the task of the item keeps that brand."
parent: brands-stories.md
persona: Shopper
depends-on: [brands-see-the-brands-as-photos.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Brands stories](brands-stories.md) / Put a brand in the cart

# Put a brand in the cart

As the [shopper](../../personas.md), I want to tap the photo of the package that I take, and then "In cart", so that the cart keeps the brand that I bought with no typing.

## Requirements

1. The large photo of a brand in the stage Shop has the button "In cart"
   - a. The button is large, at the lower edge of the large photo, in reach of the thumb
   - b. The Pantry form shows the large photo with no such button
2. "In cart" ticks the row, and the task of the item keeps the brand
   - a. The task gets its mark and moves after the last task, as a tap on the row does
   - b. The brand is after the link of the task, with ` · ` before it: `- [x] [[Larder/Pantry/Taco seasoning|Taco seasoning]] · [[Taco seasoning - Brand A.jpg]]`
   - c. The brand is the link to the first photo of the brand
   - d. The large photo closes, and the box of the row gets its tick as today
3. A ticked row shows the photo of its brand in the cart, in place of the other brands
4. "In cart" on a row that has a brand replaces the brand of the task
5. A tap on the row ticks it with no brand, as today
6. "Undo" takes the mark and the brand off the task

## Acceptance criteria

Each criterion starts with the vault of the [list page](brands-stories.md#what-the-vault-needs).

1. GIVEN the stage Shop shows the row of taco seasoning WHEN the shopper taps the photo of Brand A THEN the large photo has the button "In cart"
2. GIVEN the photo of Brand A shows large WHEN the shopper taps "In cart" THEN `Next trip.md` has the task `- [x] [[Larder/Pantry/Taco seasoning|Taco seasoning]] · [[Taco seasoning - Brand A.jpg]]`
   - a. AND the row of taco seasoning is ticked
   - b. AND the row shows only the photo of Brand A
3. GIVEN the row of taco seasoning is ticked with Brand A WHEN the shopper taps the photo of Brand A, then the photo of Brand B, and "In cart" THEN the task ends with `· [[Taco seasoning - Brand B.jpg]]`
4. GIVEN the stage Shop shows the row of taco seasoning WHEN the shopper taps the row THEN the task is `- [x] [[Larder/Pantry/Taco seasoning|Taco seasoning]]`
5. GIVEN the row of taco seasoning is ticked with Brand A WHEN the shopper taps "Undo" THEN the task is `- [ ] [[Larder/Pantry/Taco seasoning|Taco seasoning]]`
6. GIVEN the Pantry form of taco seasoning is open WHEN the keeper taps the photo of Brand A THEN the large photo has no button "In cart"
7. GIVEN the shopper put Brand A in the cart on the phone WHEN Obsidian Sync moved the note to the computer THEN the stage Shop of the computer shows taco seasoning ticked, with the photo of Brand A

## Depends on

- [See the brands of a food item as photos](brands-see-the-brands-as-photos.md): the photos of the row, and the large photo that gets the button.

## Architecture

- [Shopping note](../../architecture/shopping-note.md): the task, and what the plugin changes in it.
- [Shopping](../../architecture/shopping.md): the stage Shop and the cart.
- [Spec: brands and photos](../../initiatives/brands-and-photos/spec.md): scope 12 and 13.
