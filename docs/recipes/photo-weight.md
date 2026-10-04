---
title: How the photos stay light
summary: 'Three rules keep the photos light: each photo is small, a step keeps three, and a cook adds one finished photo.'
parent: data-model.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Recipes](README.md) / [Data model](data-model.md) / How the photos stay light

# How the photos stay light

Each cook can add photos. With no limit, a year of cooking makes the backup slow and a recipe slow to send. Three rules keep the photos light.

## Rule 1: each photo is small

The app [makes each photo small](../shopping/photo-capture.md) before it stores it: 600 points on the longest side, about 60 KB. A file from the camera is 50 times larger. Step photos and finished photos use the same size as product photos.

## Rule 2: a step keeps three photos

[Step photos](step-photos.md) do not grow with each cook. After the third photo, a new photo removes an old one. So a recipe has a largest possible size.

| Recipe   | Step photos, at the most | Size   |
| -------- | ------------------------ | ------ |
| 5 steps  | 15                       | 0.9 MB |
| 8 steps  | 24                       | 1.4 MB |
| 12 steps | 36                       | 2.2 MB |

Most steps have one photo or none, so a real recipe is much smaller.

## Rule 3: a cook adds one finished photo

[Finished photos](finished-photo.md) have no limit, but one cook adds one photo at the most. At 200 cooks in a year, that is 200 photos and about 12 MB.

## Which photos go in a file

| File                                          | Photos in it                                              | Reason                                                                  |
| --------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| [Recipe file](share-a-recipe.md)              | The step photos and the cover of the recipes in the file. | The file moves a recipe. The history of your cooks stays on the device. |
| [Full backup](../shopping/backup.md)          | All photos.                                               | The backup is the second copy of all data.                              |
| [Transfer by QR code](transfer-by-qr-code.md) | None.                                                     | A photo is too large for a code.                                        |

A file is text, and a photo as text is one third larger than its bytes. So a recipe with 24 step photos and a cover is a file of about 2 MB.

## Why 600 points is sufficient

A step photo fills the width of the phone in Cook mode. At 600 points, the photo is a little soft there. It still shows what it must show: how brown the chicken is. A fully sharp photo needs 1200 points and about four times the space.

## Further reading

- [Where a photo is stored](../shopping/photo-storage.md): how much space the browser gives to the app.
