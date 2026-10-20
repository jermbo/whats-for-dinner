---
title: Settings
summary: "Each setting of the plugin, with the value that it starts with and what it changes."
parent: ../README.md
---

[Wiki](../README.md) / Settings

# Settings

The plugin has a fixed value for most of its rules. A value is a setting only when it must be different for your vault or your kitchen. This page gives each setting.

## Where your notes are

Your vault has more than recipes. These settings keep the other notes out of the kitchen.

| Setting            | Starts as               | What it does                                                                           |
| ------------------ | ----------------------- | -------------------------------------------------------------------------------------- |
| Recipes folder     | Empty                   | Only the notes in this folder are recipes. With no folder, the plugin tries each note. |
| Pantry folder      | `Larder/Pantry`         | Each note in this folder is a food item.                                               |
| Meal plan note     | `Larder/Meal plan.md`   | The note with the meals of the week.                                                   |
| Shopping folder    | `Larder/Shopping`       | The note of each shopping trip is in this folder.                                      |
| Items folder       | `Larder/Shopping/Items` | An item of your own that no note has links to a note of this folder.                   |
| Place for new food | `Kitchen`               | The place that put away proposes for food that has no row in the pantry.               |

With no recipes folder, the plugin does not try a note of the pantry folder, of the shopping folder, or of the items folder.

## The plugin home

Each note of the plugin, but the recipes, is in one folder: the plugin home. Its name starts as `Larder`, and [setup](setup.md) can change it before it makes the folders. The four paths above start in it. The recipes folder is not in the home, because your recipes must stay when you remove the data of the plugin.

To remove the notes of the plugin, delete the home folder. The recipes stay. The plugin deletes no folder itself, also not when you put it off.

When you change a folder or the plan note, the kitchen reads the vault again.

## The places

A place needs a name before food is there: you name the garage freezer, and then you put food into it. So the data file keeps a list of place names. The place chips of add food, the place filters of the pantry, and the places of put away show each name of the list and each place that a row has. A name shows one time, and the names are sorted A to Z. The data file also keeps the last place that the [audit](audit.md) finished, so that the next audit starts at the place after it.

You add, rename, and remove a name in the plugin settings tab. The list keeps one name at the minimum. A change of the list does not change a note. So a rename changes only the list, and a row with the old name keeps it. The old name stays in the chips until no row has it.

An example: the list has "Kitchen pantry" and "Outside fridge", and no row has "Garage freezer". You add "Garage freezer" in the settings tab. The pantry shows a filter "Garage freezer" with no food in it, and add food shows its chip.

When the list is empty, the plugin fills it from the places of the rows, the first time that it reads the vault. Thus a vault from before the list starts with the places that it has.

## The look

| Setting                     | Starts as           | Other values                                    |
| --------------------------- | ------------------- | ----------------------------------------------- |
| Font for titles and numbers | Bricolage Grotesque | The font of Obsidian, or a font of your device. |
| Accent colour               | Larder olive        | The accent colour of Obsidian, from your theme. |

The accent colour is the colour of "ready", "done", and the current step. The accent of your theme replaces the [colour](colour.md) role `primary`, and its text colour replaces `on-primary`. All other text has the font of Obsidian.

## Cook Mode

| Setting            | Starts as | What it does                                                           |
| ------------------ | --------- | ---------------------------------------------------------------------- |
| Timer sound        | Beeps     | The sound of the alarm: beeps, a chime, or no sound.                   |
| Volume             | 7 of 10   | How loud the alarm is.                                                 |
| Vibrate            | On        | A phone vibrates when a timer ends.                                    |
| Keep the screen on | On        | The screen does not go dark while Cook Mode or the stage Shop is open. |

The button "Test" plays the sound, so that you can select it before you cook.

The setting "Keep the screen on" is in this group, but it is also for the store. On the stage Shop of [shopping](shopping.md), the phone does not lock between two shelves.

## The pantry

| Setting  | Starts as | What it does                                                                       |
| -------- | --------- | ---------------------------------------------------------------------------------- |
| Use soon | 5 days    | Food with a use-by date in this number of days, or less, is food to use soon.      |

## Where the settings are

The settings are in the data file of the plugin. They are not a note, because they tell about the plugin and not about your kitchen.

The data file also keeps the step of setup, and records when setup is complete. With no value, setup is not complete. In a vault that had notes of the kitchen before setup, the button "Use these notes" in the settings tab records that setup is complete.

## Further reading

- [Notes of the kitchen](notes-of-the-kitchen.md): what is in a note and what is in the data file.
- [Timers](timers.md): how the alarm uses the sound, the volume, and the vibration.
