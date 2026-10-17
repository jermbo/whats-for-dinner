---
title: Use the Larder layout by default
summary: "The writer sees Larder paths in settings before onboarding runs."
parent: onboard-stories.md
persona: Writer
depends-on: []
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Onboard stories](onboard-stories.md) / Use the Larder layout by default

# Use the Larder layout by default

As the [writer](../../personas.md), I want the plugin to start with the Larder folder layout, so that a new vault and the settings screen agree on where notes live before setup runs.

## Requirements

1. The default values for folder paths in code are the canonical tree under `Larder`
   - a. Pantry folder: `Larder/Pantry`
   - b. Shopping folder: `Larder/Shopping`
   - c. Items folder: `Larder/Shopping/Items`
   - d. Meal plan note: `Larder/Meal plan.md`
   - e. Recipes folder stays empty until onboarding or you set it
2. A new install loads these defaults into the data file when no saved settings exist
3. The Obsidian plugin settings tab shows these paths for a new install
4. The page [Settings](../../architecture/settings.md) tells the starts-as values for each path setting

## Acceptance criteria

Each criterion starts with a vault that has no saved plugin data, after you install or reload the plugin.

1. GIVEN no saved plugin data WHEN Obsidian starts THEN the data file has pantry folder `Larder/Pantry`
   - a. AND shopping folder `Larder/Shopping`
   - b. AND items folder `Larder/Shopping/Items`
   - c. AND meal plan note `Larder/Meal plan.md`
   - d. AND recipes folder empty
2. GIVEN no saved plugin data WHEN the writer opens the plugin settings tab THEN the field "Pantry folder" shows `Larder/Pantry`
   - a. AND "Shopping folder" shows `Larder/Shopping`
   - b. AND "Items folder" shows `Larder/Shopping/Items`
   - c. AND "Meal plan note" shows `Larder/Meal plan.md`

## Depends on

Nothing of this version.

## Architecture

- [Settings](../../architecture/settings.md): where each note lives, and the value that each setting starts with.
