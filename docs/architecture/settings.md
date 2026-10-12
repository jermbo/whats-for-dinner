---
title: Settings
summary: 'Each setting of the plugin, with the value that it starts with and what it changes.'
parent: ../README.md
updated: 2026-10-11
---

[Wiki](../README.md) / Settings

# Settings

The plugin has a fixed value for most of its rules. A value is a setting only when it must be different for your vault or your kitchen. This page gives each setting.

## Where your notes are

Your vault has more than recipes. These settings keep the other notes out of the kitchen.

| Setting            | Starts as      | What it does                                                                           |
| ------------------ | -------------- | -------------------------------------------------------------------------------------- |
| Recipes folder     | Empty          | Only the notes in this folder are recipes. With no folder, the plugin tries each note. |
| Pantry folder      | `Pantry`       | Each note in this folder is a food item.                                               |
| Meal plan note     | `Meal plan.md` | The note with the meals of the week.                                                   |
| Place for new food | `Kitchen`      | The place of food from a shopping trip, if the pantry does not know the food.          |

When you change a folder or the plan note, the kitchen reads the vault again.

## The look

| Setting                     | Starts as           | Other values                                    |
| --------------------------- | ------------------- | ----------------------------------------------- |
| Font for titles and numbers | Bricolage Grotesque | The font of Obsidian, or a font of your device. |
| Accent colour               | Larder olive        | The accent colour of Obsidian, from your theme. |

The accent colour is the colour of "ready", "done", and the current step. All other text has the font of Obsidian.

## Cook Mode

| Setting            | Starts as | What it does                                         |
| ------------------ | --------- | ---------------------------------------------------- |
| Timer sound        | Beeps     | The sound of the alarm: beeps, a chime, or no sound. |
| Volume             | 7 of 10   | How loud the alarm is.                               |
| Vibrate            | On        | A phone vibrates when a timer ends.                  |
| Keep the screen on | On        | The screen does not go dark while Cook Mode is open. |

The button "Test" plays the sound, so that you can select it before you cook.

## The pantry

| Setting  | Starts as | What it does                                                                       |
| -------- | --------- | ---------------------------------------------------------------------------------- |
| Use soon | 5 days    | Food with a use-by date in this number of days, or less, is food to use soon.      |
| Low line | 25%       | A food item with no low line of its own is low below this part of its full amount. |

## Where the settings are

The settings are in the data file of the plugin, with your cart. They are not a note, because they tell about the plugin and not about your kitchen.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): what is in a note and what is in the data file.
- [Timers](timers.md): how the alarm uses the sound, the volume, and the vibration.
- [Level](level.md): how the plugin uses the percentage of the low line.
