---
title: Find a photo on the disk
summary: 'The Brave browser keeps each photo as one file in its data folder. The size of the blob tells which file is which photo.'
parent: photo-storage.md
updated: 2026-10-03
---

[Wiki](../README.md) / [Shopping](README.md) / [Ingredients and products](ingredient-and-product.md) / [Where a photo is stored](photo-storage.md) / Find a photo on the disk

# Find a photo on the disk

The tools of the browser show a photo row, but not the picture. This page tells where the picture is on the disk of a computer, and how to open it.

## The tools show the row, not the picture

In the tools of the browser, the photos table shows each row as an ID and a blob. The tools do not draw the blob. They show its size and its type: 61 204 bytes, "image/jpeg". Those bytes are the picture.

## Each blob is one file

Brave keeps the rows of the database in one folder, and each blob in a file of its own. On a Mac, the files are here:

```
~/Library/Application Support/BraveSoftware/Brave-Browser/Profile 1/IndexedDB/http_localhost_5123.indexeddb.blob/1/00
```

| Part of the path      | Meaning                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `Profile 1`           | The folder of your profile in Brave. A different profile has a different name.           |
| `http_localhost_5123` | The address of the app: here, the development server. Each address has its own database. |
| `.indexeddb.blob`     | The folder of the blobs.                                                                 |
| `1/00`                | Folders that Brave makes to group the files.                                             |

A file contains the same bytes as the blob, so it is a JPEG picture. Its name is a number that Brave gives, such as `3b`. The name is not the ID of the photo.

## The size tells which file is which photo

The row that uses a photo has its ID: a product, or a [step of a recipe](../recipes/data-model.md). Two photos almost never have the same number of bytes, so the size connects the row to its file.

1. In the tools, find the row with the ID of the photo. Read the size of its blob: 61 204.
2. In the folder, find the file with 61 204 bytes. That file is the photo.
3. Open the file with Preview. A double click does not open it, because the name has no ".jpg".

## Only look

The files are a part of the database. If you move a file, change its name, or delete it, the app loses that photo.

The folder has only the photos of one browser on one computer. On a phone, you cannot open the data folder of the browser.

## Further reading

- [Backup](backup.md): how all photos go out of the browser in one file.
