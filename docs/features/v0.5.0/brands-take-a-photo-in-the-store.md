---
title: Take a photo of a new brand in the store
summary: "On a row of the stage Shop, the shopper taps the camera tile, takes a photo of a new package, and puts that brand in the cart."
parent: brands-stories.md
persona: Shopper
depends-on: [brands-add-a-brand-with-the-camera.md, brands-put-a-brand-in-the-cart.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Brands stories](brands-stories.md) / Take a photo of a new brand in the store

# Take a photo of a new brand in the store

As the [shopper](../../personas.md), I want to take a photo of a new package from the row of the item, with one hand, so that the new brand is in the cart and in the note with no typing.

## Requirements

1. Each row of the stage Shop for a food item has a small camera tile after the photos of its brands
   - a. The tile has the size of a small photo
   - b. A row with no brand shows only the tile
   - c. A row of an item that is not in the pantry, such as batteries, has no tile
   - d. A tap on the tile does not tick the row
2. A tap on the tile opens the camera
   - a. When you close the camera with no photo, nothing changes
3. The photo is a new brand with no name, with the rules of [Add a brand with the camera](brands-add-a-brand-with-the-camera.md)
   - a. The file and the section "Brands" are written at once
   - b. The row shows the photo after the other brands
4. The photo then shows large with "In cart", as a tap on a photo does
   - a. The large photo grows from the tile. With "Reduce motion", it shows with no motion
   - b. "Close" keeps the new brand, and the row is not ticked

## Acceptance criteria

Each criterion starts with the vault of the [list page](brands-stories.md#what-the-vault-needs) on 2026-10-18.

1. GIVEN the stage Shop shows the row of taco seasoning WHEN the shopper looks at the row THEN the row shows a camera tile after the chip "Brand C"
2. GIVEN the stage Shop shows the row of onions, which has no brand WHEN the shopper looks at the row THEN the row shows only the camera tile
3. GIVEN the stage Shop shows the row of taco seasoning WHEN the shopper taps the camera tile and takes a photo THEN `Larder/Pantry/Photos` has `Taco seasoning - brand 2026-10-18.jpg`
   - a. AND the section "Brands" of `Taco seasoning.md` ends with `- ![[Taco seasoning - brand 2026-10-18.jpg]]`
   - b. AND the new photo shows large with "In cart"
4. GIVEN the new photo shows large WHEN the shopper taps "In cart" THEN the task ends with `· [[Taco seasoning - brand 2026-10-18.jpg]]`
   - a. AND the row of taco seasoning is ticked
5. GIVEN the new photo shows large WHEN the shopper taps "Close" THEN the row shows the new photo after the chip "Brand C"
   - a. AND the row is not ticked
6. GIVEN the shopper tapped the camera tile WHEN the shopper closes the camera with no photo THEN `Taco seasoning.md` is the same as before

## Depends on

- [Add a brand with the camera](brands-add-a-brand-with-the-camera.md): the file and the section of a new brand.
- [Put a brand in the cart](brands-put-a-brand-in-the-cart.md): the large photo with "In cart".

## Architecture

- [Shopping](../../architecture/shopping.md): the row of the stage Shop.
- [Food item note](../../architecture/food-item-note.md): the section "Brands".
- [Spec: brands and photos](../../initiatives/brands-and-photos/spec.md): scope 2 c and 2 d.
