---
title: Glossary
summary: 'The words of recipes and cooking. Each word has one meaning.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Recipes](README.md) / Glossary

# Glossary

The screens, the code, and these pages use the same words. Each word has one meaning. A word that is a link has a page that explains it.

| Word                                   | Meaning                                                                                                | Example                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| Recipe                                 | One meal that you can cook: a name, steps, and ingredients.                                            | Chicken curry                      |
| [Step](data-model.md)                  | One action of a recipe. It has text, and an ID that never changes.                                     | "Brown the chicken for 5 minutes." |
| [Write mode](write-mode.md)            | The screen where you type a recipe.                                                                    |                                    |
| [Cook mode](cook-mode.md)              | The screen that shows a recipe one card at a time while you cook.                                      |                                    |
| Card                                   | One full screen of Cook mode: ingredients, one step, or finished.                                      |                                    |
| [Cook session](cook-session.md)        | The record of one time that you cooked one recipe.                                                     | Chicken curry, 3 October           |
| [Timer](timers.md)                     | A countdown that the app makes from a time in the text of a step.                                      | 12:00                              |
| [Step photo](step-photos.md)           | A photo of one step. A step keeps a maximum of three.                                                  | The browned chicken                |
| Selected photo                         | The one step photo that the step card shows.                                                           |                                    |
| [Finished photo](finished-photo.md)    | The photo of the meal at the end of one cook session.                                                  | The plate                          |
| Cover                                  | The one finished photo that a recipe shows in each list.                                               |                                    |
| [Step note](step-notes.md)             | Some words that you write on a step while you cook.                                                    | "Less salt."                       |
| [Recipe file](share-a-recipe.md)       | A JSON file with recipes, their ingredients, and their photos.                                         |                                    |
| [Merge](merge.md)                      | What an import does with a recipe that the device has.                                                 |                                    |
| [Transfer](transfer-by-qr-code.md)     | A move of recipe text or cook sessions from the screen of one device to the camera of a different one. |                                    |
| [Part](how-a-recipe-fits-in-a-code.md) | One QR code of a transfer.                                                                             | Part 2 of 3                        |

## Words that we do not use

| Not this                         | But this                    | Reason                                                     |
| -------------------------------- | --------------------------- | ---------------------------------------------------------- |
| Directions, instructions, method | Steps                       | One word for the list.                                     |
| Session                          | Cook session                | "Session" alone can be a visit to the app.                 |
| Hero, thumbnail                  | Cover                       | It is one photo. Only its size on the screen is different. |
| Sync                             | Share, import, and transfer | Nothing moves by itself. You send a file or show a code.   |

## Further reading

- [What the app reads in a step](step-text.md): how a step gets its timers and its ingredients with no setup.
- [Shopping glossary](../shopping/glossary.md): the words "ingredient", "photo", and "blob".
