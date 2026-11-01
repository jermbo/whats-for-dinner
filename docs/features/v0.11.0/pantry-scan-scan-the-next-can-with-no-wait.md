---
title: Scan the next can with no wait
summary: "After a tap on \"Correct\", the camera opens for the next can at once. The note gets its packages and its brand behind the camera, and a second scan of the same can needs no lookup."
parent: pantry-scan-stories.md
updated: 2026-11-01
persona: Keeper
depends-on: [pantry-scan-check-and-add-a-package.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry scan stories](pantry-scan-stories.md) / Scan the next can with no wait

# Scan the next can with no wait

As the [keeper](../../personas.md), I want the camera back at once after each can, so that I keep the rhythm of the shelf and never wait for the note.

## Requirements

1. A tap on "Correct" starts the scan of the next can at once
   - a. The form tells "Added 1 × Black beans" with the date, as before
2. The writes go on behind the scan, one add after the other, in the sequence of the taps
   - a. The packages of one add are one write of the note: 4 cans are one write
   - b. Then the brand gets the barcode, and a new brand gets the photo of the product
   - c. A write that fails tells it in a notice
3. The form keeps each barcode that it added until Obsidian starts again, with its food item and its product
   - a. A second scan of that barcode goes to the last step with no lookup, also before its brand is in the note

## Acceptance criteria

Each criterion starts with the test vault on the owner's Android phone, in the Pantry part, with a connection.

1. GIVEN the last step of a new can WHEN the keeper taps "2 years" and "Correct" THEN the camera opens again in less than 1 second
   - a. AND a few seconds later, the note "Black beans" has the new row, and the brand line has the barcode and a photo
2. GIVEN the last step of the beans WHEN the keeper taps the count 4, "1 year", and "Correct" THEN the note "Black beans" gets 4 rows in one write
3. GIVEN an add of the beans WHEN the keeper scans the same can in flight mode THEN the form goes to the last step of "Black beans" with "425 g", with no lookup

## Depends on

- [Check and add a package](pantry-scan-check-and-add-a-package.md): "Correct", which adds.

## Architecture

- [Pantry](../../architecture/pantry.md): the writes of "Add to pantry".
