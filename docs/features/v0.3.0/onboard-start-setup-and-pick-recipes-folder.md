---
title: Start setup and pick the recipes folder
summary: "The keeper sees setup instead of the four parts, picks where recipes live, and existing vaults get a block screen."
parent: onboard-stories.md
persona: Keeper
depends-on:
  - onboard-use-the-larder-layout-by-default.md
  - onboard-keep-places-in-the-data-file.md
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Onboard stories](onboard-stories.md) / Start setup and pick the recipes folder

# Start setup and pick the recipes folder

As the [keeper](../../personas.md), I want the Kitchen tab to start setup and to ask where recipes live, so that the vault is ready before I use Plan, Shop, or Cook Mode.

## Requirements

1. The data file has a flag that tells whether onboarding is complete
   - a. With no saved value, onboarding is not complete
2. When onboarding is not complete and the vault has no plugin notes at the configured paths, the Kitchen tab shows the setup flow and not the four parts
   - a. The setup flow has no control to skip or defer
   - b. Plan, Shop, Recipes, and Pantry parts are not reachable from the kitchen
3. When onboarding is not complete and the vault already has a food item note in the pantry folder, or the meal plan note, or a note in the shopping folder, the Kitchen tab shows a screen that tells you to open plugin settings
   - a. The greenfield setup flow does not run
4. The first step of setup is the recipes folder
   - a. The step selects an existing folder or creates a new folder path
   - b. The recipes folder is not under the plugin home folder (`Larder/` by default)
5. Tap "Continue" on the recipes step to save the recipes folder setting and go to the next step
   - a. "Continue" is active only when the recipes folder field has text

## Acceptance criteria

Criteria 1 to 4 start with an empty vault: no notes under `Larder/Pantry/`, no `Larder/Meal plan.md`, and no notes under `Larder/Shopping/`, with onboarding not complete and Larder defaults from [Use the Larder layout by default](onboard-use-the-larder-layout-by-default.md).

Criteria 5 and 6 start with the test vault and onboarding not complete.

1. GIVEN an empty vault and onboarding not complete WHEN the keeper opens the Kitchen tab THEN the screen shows the setup flow
   - a. AND the screen does not show the navigation of the four parts
2. GIVEN the setup flow is open WHEN the keeper looks for a way to skip setup THEN no control defers or skips setup
3. GIVEN the setup flow is open on the recipes step WHEN the keeper selects `Recipes` and taps "Continue" THEN the setting "Recipes folder" is `Recipes`
   - a. AND the setup flow shows the next step
4. GIVEN the keeper typed `Larder/Recipes` as the recipes folder WHEN the keeper taps "Continue" THEN "Continue" is not active
5. GIVEN the test vault and onboarding not complete WHEN the keeper opens the Kitchen tab THEN the screen tells the keeper to open plugin settings
   - a. AND the greenfield setup flow does not show
6. GIVEN the test vault and onboarding not complete WHEN the keeper opens the Kitchen tab THEN the screen does not show the navigation of the four parts

## Depends on

- [Use the Larder layout by default](onboard-use-the-larder-layout-by-default.md), so detection uses the Larder paths.
- [Keep a list of places in the data file](onboard-keep-places-in-the-data-file.md), so later steps can save places.

## Architecture

- [Settings](../../architecture/settings.md): the recipes folder and the onboarding flag in the data file.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): what is in the data file.
