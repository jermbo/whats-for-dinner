---
title: Open the camera at once
summary: "Where Obsidian gives no live view, such as on Android, the camera of the phone opens by itself for each package, so that a scan is the shutter and \"OK\"."
parent: pantry-scan-stories.md
updated: 2026-11-01
persona: Keeper
depends-on: [pantry-scan-check-and-add-a-package.md]
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Pantry scan stories](pantry-scan-stories.md) / Open the camera at once

# Open the camera at once

As the [keeper](../../personas.md), I want the camera to open by itself for each package, so that a scan costs only the shutter and "OK".

## Requirements

1. When the live view cannot open, the camera of the phone opens at once, with no tap
   - a. After the first time, the scan does not try the live view again until Obsidian starts again
   - b. "Take a photo of the barcode" stays on the scan, for a camera that you close with no photo, or that Android does not open
   - c. "Type barcode" and "Type name" stay under it
2. After an add, the camera opens again for the next package
3. A photo with no barcode tells "No barcode in the photo.", and the camera opens again
4. Where Obsidian gives the live view, such as on the Mac, the scan is the live view, as before

## Acceptance criteria

Each criterion starts with the test vault on the owner's Android phone, in the Pantry part, with a connection.

1. GIVEN the Pantry part WHEN the keeper taps + THEN the camera of the phone opens
2. GIVEN the camera WHEN the keeper takes a photo of the barcode of the beans and taps "OK" THEN the form shows the last step of "Black beans"
3. GIVEN the last step WHEN the keeper taps "2 years" and "Correct" THEN the camera opens again
4. GIVEN the camera WHEN the keeper closes it with no photo THEN the form shows "Take a photo of the barcode", "Type barcode", and "Type name"
5. GIVEN the camera WHEN the keeper takes a photo of a wall and taps "OK" THEN the form tells "No barcode in the photo."
   - a. AND the camera opens again
6. GIVEN "Add to pantry" on the Mac WHEN the keeper opens it THEN the form shows the live view of the webcam

## Depends on

- [Check and add a package](pantry-scan-check-and-add-a-package.md): "Correct", after which the camera opens again.

## Architecture

- [Pantry](../../architecture/pantry.md): the scan of "Add to pantry".
