---
title: Transfer the cook sessions
summary: 'At the end of the week, the phone sends its new cook sessions to the desktop, with the ratings and the step notes.'
parent: transfer-by-qr-code.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Recipes](README.md) / [Data model](data-model.md) / [Share a recipe](share-a-recipe.md) / [Transfer by QR code](transfer-by-qr-code.md) / Transfer the cook sessions

# Transfer the cook sessions

You cook with the phone, so the phone makes each [cook session](cook-session.md). You correct a recipe at the desktop. There you want to see what the cooks told you: the ratings and the [step notes](step-notes.md). So the phone sends its cook sessions to the desktop.

## What you do

1. Phone: on the Data screen, you press "Send cook sessions". The screen shows the first code.
2. Desktop: on the Data screen, you press "Receive", and you hold the phone in front of the camera.
3. Phone: you tap "Next" after each sound of the desktop. A week of five cooks is [about five codes](how-a-recipe-fits-in-a-code.md).
4. Desktop: the app shows "5 cook sessions added".
5. Phone: you tap "Done".

## Which cook sessions go

Only the new ones go: each cook session that changed after the last transfer. An open session does not go, because the meal is not cooked yet.

"Done" is your signal that the desktop has them. The phone stores the time of that tap, and the next transfer starts there. If you close the codes with no "Done", the phone stores nothing, and the next transfer sends the same cook sessions again.

## What the desktop does

The desktop finds each cook session by its ID. It adds one that it does not have. For one that it has, the newer one wins, so a rating that you changed later arrives.

| Part of a cook session          | On the desktop                                                 |
| ------------------------------- | -------------------------------------------------------------- |
| The times, the rating, the note | It comes.                                                      |
| The step notes                  | They come.                                                     |
| The finished photo              | It does not come. The desktop shows a placeholder.             |
| The pantry amounts              | They come as facts. The pantry of the desktop does not change. |

The menu of the desktop does not change.

## An example

On Friday you cook the chicken curry. You write "Less salt." on step 5, and you give 4 stars. On Sunday you transfer. The desktop now shows the cook of Friday and the note on the page of the curry. You correct step 5, and you send the recipe to the phone.

## Further reading

- [The finished photo](finished-photo.md): the one part of a cook that needs a file to move.
