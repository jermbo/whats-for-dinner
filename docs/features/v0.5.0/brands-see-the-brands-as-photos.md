---
title: See the brands of a food item as photos
summary: "The shopper sees the package of each brand on the row of the stage Shop and in the Pantry form, from the section Brands of the food item note."
parent: brands-stories.md
persona: Shopper
depends-on: []
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Brands stories](brands-stories.md) / See the brands of a food item as photos

# See the brands of a food item as photos

As the [shopper](../../personas.md), I want to see the photo of each brand of a food item, from the section "Brands" of its note, so that I find the package on the shelf with no name to read.

## Requirements

1. The plugin reads the brands of a food item from the [brands section](../../initiatives/brands-and-photos/glossary.md) of its note
   - a. The section is the heading "Brands", of any level, up to the next heading
   - b. One list item is one brand. Its text is the name of the brand
   - c. A line with an indent below the item, with a link to an image, is a photo of that brand
   - d. A list item with only a link to an image is a brand with that photo and no name
   - e. The plugin does not read the property `brands`
2. The row of the stage Shop shows the brands in place of the text "Any brand: …"
   - a. A brand with a photo shows its first photo, small and square
   - b. A brand with no photo shows its name as a chip
   - c. A brand with no name shows only its photo
   - d. The brands are in the order of the section
   - e. A tap on the row outside the brands ticks it as today
3. A tap on a photo shows it large, over the stage
   - a. The large photo grows from the small photo. With "Reduce motion", it shows with no motion
   - b. The large photo shows the name of the brand below it, when the brand has a name
   - c. A tap outside the photo, or on "Close", closes it, and the row is as before
   - d. A tap on a chip does the same as a tap on the row
4. The Pantry form of a food item shows the brands as the row of the stage Shop does, in place of the text "Brands: …"
   - a. A tap on a photo shows it large, with requirement 3
5. The find field of the Pantry part and of the stage Shop finds a food item by the name of a brand of its section
   - a. Capital letters and small letters are equal, and a part of a word is sufficient, as for the other names
6. The plugin writes no part of the section "Brands" in this story

## Acceptance criteria

Each criterion starts with the vault of the [list page](brands-stories.md#what-the-vault-needs).

1. GIVEN the stage Shop shows the row of taco seasoning WHEN the shopper looks at the row THEN the row shows the photo of Brand A, the photo of Brand B, and the chip "Brand C", in that order
   - a. AND the row does not show the text "Any brand"
2. GIVEN the stage Shop shows the row of taco seasoning WHEN the shopper taps the photo of Brand A THEN the photo of Brand A shows large, with the name "Brand A"
   - a. AND the row of taco seasoning is not ticked
3. GIVEN the photo of Brand A shows large WHEN the shopper taps "Close" THEN the stage Shop shows the row of taco seasoning, not ticked
4. GIVEN the stage Shop shows the row of taco seasoning WHEN the shopper taps the chip "Brand C" THEN the row of taco seasoning is ticked
5. GIVEN the section "Brands" of taco seasoning has the item `- ![[Taco seasoning - Brand A.jpg]]` in place of Brand A WHEN the stage Shop shows the row THEN the row shows the photo of Brand A with no name
   - a. AND the large photo of that brand shows no name
6. GIVEN the Pantry part is open WHEN the keeper opens the form of elbow pasta THEN the form shows the chips "Brand A" and "Store brand"
   - a. AND the form does not show the text "Brands:"
7. GIVEN the Pantry part is open WHEN the keeper opens the form of taco seasoning and taps the photo of Brand B THEN the photo of Brand B shows large
8. GIVEN the Pantry part is open WHEN the shopper types "brand c" in the field "Find food" THEN the pantry shows the line of taco seasoning
   - a. AND the pantry shows no other line
9. GIVEN `Elbow pasta.md` has the property `brands` with "Gold label" and no section "Brands" WHEN the shopper types "gold" THEN the pantry shows no line
10. GIVEN the stage Shop shows the row of taco seasoning WHEN the shopper types "brand b" in its find field THEN the stage shows the row of taco seasoning

## Depends on

Nothing. The vault of the list page has the section "Brands" and the photos.

## Architecture

- [Food item note](../../architecture/food-item-note.md): the form of the note, which gets the section "Brands" in place of the property `brands`.
- [Shopping](../../architecture/shopping.md): the row of the stage Shop.
- [Pantry](../../architecture/pantry.md): the find field and the form.
- [Steps](../../architecture/steps.md): the same form of a photo below a list item, for a step.
- [Spec: brands and photos](../../initiatives/brands-and-photos/spec.md): scope 1, 4, 5, 6, and 6 b.
