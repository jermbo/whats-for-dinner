---
title: How a photo becomes small
summary: 'The camera gives a file of some megabytes. The app draws it into a small picture of about 60 KB.'
parent: ingredient-and-product.md
updated: 2026-10-03
---

[Wiki](../README.md) / [Shopping](README.md) / [Ingredients and products](ingredient-and-product.md) / How a photo becomes small

# How a photo becomes small

You take a photo when you make a [new product](choose-product.md). A photo from a phone camera is much larger than the app needs. The browser makes it small, on the phone, with no connection.

## Why the photo is too large

A camera photo has about 4000 × 3000 points. That is 12 million points, and a file of 2 to 5 MB. On the screen, the largest photo of a product is about 340 points wide. The app would store 40 times more than it shows.

## The four steps

```mermaid
flowchart LR
    A["The camera"] -->|"A file, 3 MB"| B["Read: the browser opens the file as an image"]
    B --> C["Draw: the image goes on a small canvas"]
    C --> D["Pack: the canvas becomes a JPEG"]
    D -->|"A blob, 60 KB"| E["Store"]
```

1. **Camera.** The page has a file field that asks for a photo from the rear camera. A tap opens the camera of the phone. You take the photo, and the phone gives the page that one file. The page cannot see your other photos.
2. **Read.** The browser opens the file as an image in memory. This is the full 12 million points.
3. **Draw.** A canvas is a drawing surface that the page can make in any size. The app makes one whose longest side is 600 points, and draws the image on it. The browser calculates each of the new points from the points around it. This step is where the photo becomes small: 600 × 450 is 270 000 points.
4. **Pack.** The app asks the canvas for a JPEG with quality 0.8. JPEG removes detail that the eye does not see. The result is a "blob": a block of bytes with a type. It is about 60 KB.

Then the app [stores the blob](photo-storage.md) in the database on the phone. The large file from the camera stays only in memory.

## Why 600 points

A phone screen has two or three real points for each point of the layout. A photo that is 300 wide on the screen thus needs 600 to look sharp. More than that uses space and gives nothing.

## Further reading

- [Backup](backup.md): how the small photos go into a backup file.
