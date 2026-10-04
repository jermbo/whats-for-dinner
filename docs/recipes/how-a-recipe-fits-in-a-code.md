---
title: How a recipe fits in a code
summary: 'The app compresses the text, cuts it into parts, and shows each part as one QR code. You tap for the next part.'
parent: transfer-by-qr-code.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Recipes](README.md) / [Data model](data-model.md) / [Share a recipe](share-a-recipe.md) / [Transfer by QR code](transfer-by-qr-code.md) / How a recipe fits in a code

# How a recipe fits in a code

One QR code holds a maximum of about 2,900 letters. A code that full has very small squares, and the camera of a laptop cannot read them. The text of the chicken curry is 2,100 letters. So the app makes the text small and uses more than one code.

## Three steps make the codes

1. **Compress.** The browser has a function that removes the repeats from a text. The 2,100 bytes become 780 bytes.
2. **Write the bytes as letters.** The camera function of the browser gives text, not bytes. A code holds the most text when the text has only 45 letters: the digits, the capital letters, and nine symbols. So the app writes each group of 2 bytes as 3 of these letters. The 780 bytes become 1,170 letters.
3. **Cut into parts.** A part has a maximum of 500 letters, and each part is one code. The chicken curry is 3 codes.

A code of 500 letters has squares that are large enough for a weak camera.

## You tap for the next part

The sender shows part 1. The receiver reads it, makes a sound, and shows the progress: "1 of 3". On a phone, it also vibrates. Then you tap "Next" on the sender, and it shows part 2.

You set the speed, so the app does not guess how fast the camera is. A recipe that fits in one part shows one code and no "Next" button.

Each part starts with a label.

```
MP/2/3/K7QD/6BFOXN*TS0BI$ZD.OE8...
```

| Piece  | Meaning                                                       |
| ------ | ------------------------------------------------------------- |
| `MP`   | The code is from this app. The receiver ignores other codes.  |
| `2/3`  | This is part 2 of 3.                                          |
| `K7QD` | The check value: 4 letters that the app makes from all parts. |

The label tells the receiver where a part goes, so the sequence is not important. If you tap too early, the receiver tells you: "Part 2 is missing". After the last part, "Next" shows part 1 again, so a part that the camera did not get comes back.

## The check before the merge

When the receiver has all parts, it joins them and makes the check value again. If the result is equal to the value in the label, the text is complete, and the [merge](merge.md) starts. If not, the receiver changes nothing and tells you to scan again.

## How many codes

| What you send                 | Codes, and taps |
| ----------------------------- | --------------- |
| One recipe                    | 3               |
| The cook sessions of one week | 5               |
| One photo                     | 160             |

A recipe with six photos would be 1,000 codes. This is why the codes carry only text.

## Further reading

- [Backup](../shopping/backup.md): a method that writes bytes as letters also, there for photos.
- [How the photos stay light](photo-weight.md): why one photo is about 60 KB.
