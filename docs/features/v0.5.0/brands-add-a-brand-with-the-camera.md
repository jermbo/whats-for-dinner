---
title: Add a brand with the camera
summary: "In the Pantry form and in setup, the keeper takes a photo of a package, and it becomes a brand in the section Brands of the food item note."
parent: brands-stories.md
persona: Keeper
depends-on: [brands-see-the-brands-as-photos.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Brands stories](brands-stories.md) / Add a brand with the camera

# Add a brand with the camera

As the [keeper](../../personas.md), I want to take a photo of a package in the form of a food item, and to give it a name now or later, so that each brand has its photo with no typing.

## Requirements

1. The form "Add to pantry" and the form of a food item in the Pantry part have the button "Add brand", after the brands
   - a. The form "Add to pantry" of the setup step "First food" is the same form, with the same button
   - b. On the phone, the button opens the camera
2. A photo from the camera is a new brand of the form, with no name
   - a. The new brand shows its photo after the other brands. It fades and grows in. With "Reduce motion", it shows with no motion
   - b. The field "Name" of the brand is below the photo, optional and empty
   - c. When you close the camera with no photo, the form has no new brand
3. A tap on a brand of the form opens its field "Name", the button "New photo", and the button "Remove"
   - a. "New photo" opens the camera. The new photo replaces the first photo of the brand
   - b. "Remove" takes the brand out of the form
4. "Save" writes the brands into the section "Brands" of the food item note
   - a. A note with no section gets the heading `## Brands` at its end
   - b. Each new brand is a list item at the end of the section, with its photo on the line below it, with an indent of 2 spaces
   - c. A brand with no name is a list item with only the link of its photo
   - d. A name that you give later goes before the link, on the line of the item. The photo stays on its line
   - e. A brand that you removed goes out of the section, with its lines
   - f. The other text of the note, and the text of the section that is not a list item, stays as it is
5. "Save" writes each new photo as a file
   - a. The folder is `Photos` of the pantry folder: `Larder/Pantry/Photos`. The plugin makes it with the first photo
   - b. The name is the food item and the brand: `Taco seasoning - Brand D.jpg`
   - c. A brand with no name gives the date: `Taco seasoning - brand 2026-10-18.jpg`
   - d. A name in use gets a number: `Taco seasoning - Brand D 2.jpg`
   - e. The size is the size of a recipe photo: a JPEG with its longest side 1600 pixels or less, with no location
6. The plugin renames no file and deletes no file
   - a. A new name of a brand does not rename its photo
   - b. A new name of the food item does not rename the photos of its brands
   - c. A brand that goes, and a photo that "New photo" replaces, stay in the folder
7. "Cancel" writes no brand and no file

## Acceptance criteria

Each criterion starts with the vault of the [list page](brands-stories.md#what-the-vault-needs) on 2026-10-18.

1. GIVEN the form of taco seasoning is open WHEN the keeper taps "Add brand" and takes a photo THEN the form shows a fourth brand, with that photo, after the chip "Brand C"
   - a. AND its field "Name" is empty
2. GIVEN the keeper took a photo in the form of taco seasoning WHEN the keeper types "Brand D" and taps "Save" THEN `Larder/Pantry/Photos` has `Taco seasoning - Brand D.jpg`
   - a. AND the section "Brands" of `Taco seasoning.md` ends with:

      ```markdown
      - Brand D
        ![[Taco seasoning - Brand D.jpg]]
      ```

   - b. AND the table of the note is the same as before
3. GIVEN the keeper took a photo in the form of taco seasoning WHEN the keeper taps "Save" with no name THEN `Larder/Pantry/Photos` has `Taco seasoning - brand 2026-10-18.jpg`
   - a. AND the section ends with `- ![[Taco seasoning - brand 2026-10-18.jpg]]`
4. GIVEN the brand of criterion 3 WHEN the keeper opens the form, taps the brand, types "Brand E", and taps "Save" THEN the section ends with:

   ```markdown
   - Brand E
     ![[Taco seasoning - brand 2026-10-18.jpg]]
   ```

   - a. AND the file `Taco seasoning - brand 2026-10-18.jpg` has the same name
5. GIVEN `Larder/Pantry/Photos` has `Taco seasoning - Brand D.jpg` WHEN the keeper adds a brand "Brand D" with a photo again THEN the new file is `Taco seasoning - Brand D 2.jpg`
6. GIVEN `Elbow pasta.md` has no section "Brands" WHEN the keeper adds a brand with the name "Store brand" and a photo, and taps "Save" THEN the note ends with:

   ```markdown
   ## Brands

   - Store brand
     ![[Elbow pasta - Store brand.jpg]]
   ```

7. GIVEN the form of taco seasoning is open WHEN the keeper taps the photo of Brand B, taps "Remove", and taps "Save" THEN the section has no item "Brand B"
   - a. AND `Larder/Pantry/Photos` still has `Taco seasoning - Brand B.jpg`
8. GIVEN the form of taco seasoning is open WHEN the keeper taps Brand A, taps "New photo", takes a photo, and taps "Save" THEN the line below "Brand A" is `![[Taco seasoning - Brand A 2.jpg]]`
   - a. AND `Taco seasoning - Brand A.jpg` is still in the folder
9. GIVEN the keeper took a photo in the form of taco seasoning WHEN the keeper taps "Cancel" THEN the note is the same as before
   - a. AND `Larder/Pantry/Photos` has no new file
10. GIVEN setup is on the step "First food" WHEN the keeper opens "Add to pantry", types "Cumin", takes a photo with "Add brand", types "Brand A", and taps "Save" THEN `Larder/Pantry/Cumin.md` has a section "Brands" with "Brand A" and `![[Cumin - Brand A.jpg]]`
11. GIVEN the stage Shop shows the row of taco seasoning WHEN the keeper added Brand D in the form THEN the row shows the photo of Brand D after the chip "Brand C"

## Depends on

- [See the brands of a food item as photos](brands-see-the-brands-as-photos.md): the section "Brands" that this story writes, and the photos in the form.

## Architecture

- [Food item note](../../architecture/food-item-note.md): what the plugin writes, which now includes the section "Brands".
- [End of a meal](../../architecture/end-of-a-meal.md): the folder, the name, and the size of a photo.
- [Pantry](../../architecture/pantry.md): the form of a food item.
- [Setup](../../architecture/setup.md): the step "First food" and its form "Add to pantry".
- [Spec: brands and photos](../../initiatives/brands-and-photos/spec.md): scope 1 b, 2 a, 2 e, 3, 6 a, and 7.
