---
title: Transfer by QR code
summary: 'One device shows text as QR codes, and the camera of the other device reads them. No file is necessary.'
parent: share-a-recipe.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Recipes](README.md) / [Data model](data-model.md) / [Share a recipe](share-a-recipe.md) / Transfer by QR code

# Transfer by QR code

A recipe file needs a carrier: an email or a drive. That is slow for a correction of one step. The two devices are usually on the same table. So the screen of one device shows the text, and the camera of the other device reads it.

## Each device sends what it makes

| Direction        | What goes                                              | When                           |
| ---------------- | ------------------------------------------------------ | ------------------------------ |
| Desktop to phone | The text of one recipe                                 | After you write or correct it. |
| Phone to desktop | The new [cook sessions](transfer-the-cook-sessions.md) | At the end of the week.        |

A recipe can also go from the phone to the desktop. The steps are the same.

## What you do

You correct step 4 of the chicken curry on the desktop.

1. Desktop: on the page of the recipe, you press "Send". The screen shows a QR code: a pattern of squares that a camera reads as text.
2. Phone: on the Data screen, you press "Receive". The camera opens, and you point it at the desktop.
3. Phone: it makes a sound and shows "1 of 3". Desktop: you tap "Next" for the next code.
4. Phone: after the last code, the app shows "1 recipe changed".
5. Desktop: you tap "Done".

## What the codes of a recipe carry

The codes carry a recipe file with no photos: one recipe, and the ingredients that it uses. A photo is too large. See [how a recipe fits in a code](how-a-recipe-fits-in-a-code.md).

The receiver does [the merge of an import](merge.md). The newer text wins, and the photos of the receiver stay. So the phone gets the new step 4, and the photo that it has on step 3 stays.

## What a code is not for

- **A new device.** A [backup](../shopping/backup.md) brings all data in one step, with the photos.
- **Photos.** They go in a recipe file or in a backup.

## How you know that it arrived

A code goes one way. The sender cannot see what the receiver did. So the receiver tells you: it shows what changed. Then you tap "Done" on the sender.

A transfer that fails is safe.

- **You do it two times.** The second time, the two sides are equal, and nothing changes.
- **It stops in the middle.** The receiver changes its data only when it has all codes.

## Further reading

- [Offline](../shopping/offline.md): why the two devices cannot see each other.
