---
title: One file, one job
summary: "The test that tells when a file must be divided, and where each piece goes."
parent: code-standards.md
---

[Wiki](../README.md) / [Code standards](code-standards.md) / One file, one job

# One file, one job

A file has one job, and thus one reason to change. This page gives the test, and tells where the pieces go when a file fails it.

## The test is the job, not the length

Say the job of the file in one sentence. If the sentence needs "and", the file has two jobs.

A long file can pass: the steps of the RecipeMD specification are one job. A short file can fail: 60 lines that read a note, sort the result, and draw a list have three jobs.

At about 600 lines, look for the second job. But the number is a sign, not the test.

## The signs of a second job

- A function in a component does not use the state of the component. It is a rule or a tool, and it can live without the component.
- The file changes for two different reasons in one week: a new rule, and a new look.
- A mode is in each function of the file. The file is two files in one.
- You cannot give the file a name without "and" or a word such as "utils".

## Where each piece goes

| The piece                                       | Its home                                      |
| ----------------------------------------------- | --------------------------------------------- |
| A rule of the kitchen                           | A pure function in the folder of its part     |
| The text of a note to values, or values to text | A pure function in the folder of its part     |
| A read or a write of the vault                  | The kitchen state                             |
| A thing that only Obsidian can start            | The shell: the plugin, the view, the settings |
| A piece of the markup with its own state        | A child component, in the same folder         |
| A piece of the screen that knows no kitchen     | `ui/parts`: a chip, a button, the bar         |

The [layers](layers.md) page tells which of these can import which.

The component that stays is short. It reads as a list of what occurs: it gets the data, it calls the action, and it shows its children.

## An example: the pantry

The rules of the pantry are some small files, and each has a sentence with no "and". These are six of them.

| File              | Its job                                          |
| ----------------- | ------------------------------------------------ |
| `food-item.ts`    | Reads a food item from the text of its note.     |
| `write.ts`        | Writes the rows of a food item into that text.   |
| `table.ts`        | Finds the table in the lines of a note.          |
| `level.ts`        | Tells how full a food item is.                   |
| `stock-amount.ts` | Gives a row its new amount, in a unit that fits. |
| `views.ts`        | Puts the rows in groups, for each sequence.      |

A new sequence changes `views.ts`. A new rule for "low" changes `level.ts`. Neither change opens the file of the other.

## Further reading

- [Repeat or share](repeat-or-share.md): a divided file must not become a shared file too early.
