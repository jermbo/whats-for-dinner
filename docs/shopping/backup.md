---
title: Backup
summary: 'A backup is one text file with all tables. Each photo is in it as text.'
parent: data-model.md
updated: 2026-10-03
---

[Wiki](../README.md) / [Shopping](README.md) / [Data model](data-model.md) / Backup

# Backup

The app has [no server](offline.md), so the phone has the only copy of the data. A backup is the second copy: one file that you can keep in a different place and import on a new phone.

## What the file is

The file is JSON: text that a person and a program can read. It has a header and the rows of each table of the [data model](data-model.md).

```json
{
	"format": "meal-planner",
	"version": 3,
	"scope": "all",
	"exportedAt": "2026-10-03T18:20:00Z",
	"data": {
		"products": [
			{ "id": "p1", "ingredientId": "i7", "name": "Brand B", "quantity": 28, "photoId": "f1" }
		],
		"photos": [{ "id": "f1", "type": "image/jpeg", "data": "/9j/4AAQSkZJRg..." }],
		"purchases": [],
		"trips": []
	}
}
```

The example shows four of the tables. A real file has all tables of the app.

## How a photo goes into a text file

On the phone, [a photo is a blob](photo-storage.md): a block of bytes. JSON can contain only text. So the export changes each photo into text with a method that has the name base64. It writes each group of 3 bytes as 4 letters. The import does the reverse and makes the blob again.

The cost is size: the text is one third larger than the bytes. This is one more reason to [make each photo small](photo-capture.md) first.

| Photos on the phone | Their part of the file |
| ------------------- | ---------------------- |
| 100 photos, 6 MB    | 8 MB                   |
| 500 photos, 30 MB   | 40 MB                  |

## Import

An import of a full backup replaces all data on the phone with the data of the file. It does not merge.

The header has a version number. An app accepts a file with its own version or an older one. It does not accept a file from a newer app, because it cannot know what the new fields mean.

## Why the photos are in the backup

A backup with no photos would be small. But a new phone would then show products with no photos, and the photos are the reason for the products. The app has no other copy.

## Why not a ZIP file

A ZIP file with each photo as a file would be smaller. It needs an additional library, and one JSON file is simple to read and to check.

## Further reading

- [Prices and trips](prices-and-trips.md): the history that a backup keeps safe.
