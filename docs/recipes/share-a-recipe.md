---
title: Share a recipe
summary: 'A recipe file carries recipes, their ingredients, and their photos from one device to a different one.'
parent: data-model.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Recipes](README.md) / [Data model](data-model.md) / Share a recipe

# Share a recipe

You type a recipe on the desktop, because it has a keyboard. You cook with the phone, because it is in the kitchen. The app has [no server](../shopping/offline.md), so the two devices do not see each other. A recipe file carries the recipe between them.

## What is in the file

A recipe file is JSON: text that a person and a program can read. It has the same header as a [backup](../shopping/backup.md), with the scope "recipes".

```json
{
	"format": "meal-planner",
	"version": 3,
	"scope": "recipes",
	"exportedAt": "2026-10-03T18:20:00Z",
	"data": {
		"recipes": [
			{
				"id": "r1",
				"name": "Chicken curry",
				"coverPhotoId": "f9",
				"ingredients": [{ "ingredientId": "i7", "quantity": 300 }],
				"steps": [
					{
						"id": "s3",
						"text": "Brown the chicken for 5 minutes.",
						"photoIds": ["f1"],
						"selectedPhotoId": "f1"
					}
				]
			}
		],
		"ingredients": [{ "id": "i7", "name": "Rice", "unit": "g" }],
		"photos": [
			{
				"id": "f1",
				"type": "image/jpeg",
				"takenAt": "2026-10-03T18:14:00Z",
				"data": "/9j/4AAQSkZJRg..."
			}
		]
	}
}
```

| Part        | What it has                                                                      |
| ----------- | -------------------------------------------------------------------------------- |
| Recipes     | The name, the ingredient rows, and the steps with their IDs.                     |
| Ingredients | Only those that the recipes use. The other device must know what "i7" is.        |
| Photos      | The step photos and the cover. See [how the photos stay light](photo-weight.md). |

The file has no cook sessions, no pantry, and no menu. Those belong to the device where you cook. The cook sessions have [their own transfer](transfer-the-cook-sessions.md).

## Two ways to make a file

- **One recipe.** The page of a recipe has a "Share" button. On a phone, it opens the share function of the phone, and you send the file to your desktop or save it to a drive. On a desktop, the file is a download.
- **All recipes.** The Data screen makes one file with each recipe.

## A way with no file

For the text only, you can [transfer by QR code](transfer-by-qr-code.md). One device shows the recipe on its screen, and the camera of the other device reads it. The photos stay where they are.

## How you import it

On the other device, you open the file on the Data screen. The import does not replace your recipes. It [merges](merge.md): it adds a recipe that is new, and it brings a recipe that the device has up to date.

## A round trip

1. Desktop: you type "Chicken curry" and share it. The file has no photos and is very small.
2. Phone: you import it and cook it two times. Step 3 now has two photos, and the recipe has a cover.
3. Phone: you share it. The file is about 250 KB.
4. Desktop: you import it. The recipe has the three photos.

## Further reading

- [Data model](data-model.md): the tables that the parts of the file come from.
