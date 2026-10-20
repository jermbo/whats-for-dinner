---
title: Code standards
summary: "The rules for the code of the plugin: what clean code is here, and the page of each rule."
parent: ../README.md
---

[Wiki](../README.md) / Code standards

# Code standards

Each file of the plugin follows these rules. Read this page before you write or change code. Each rule has its own page.

## The goal

You read code more often than you write it. So the code is for its reader: a person who opens one file, with no knowledge of the others, to change one thing.

The test of a file is one question: can that reader find the line to change, and change it with no fear for a different file?

## What clean code is here

| Rule                                            | Meaning                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| [A name tells the intent](names.md)             | A name tells what a thing is for, in the words of the glossary.                 |
| [A function does one thing](functions.md)       | It has few arguments, and it does nothing that its name does not tell.          |
| [One file has one job](one-file-one-job.md)     | A file has one reason to change. The test is the job, not the length.           |
| [The rules do not know the screen](layers.md)   | A rule of the kitchen imports nothing of Obsidian, and nothing of a screen.     |
| [A comment gives the reason](comments.md)       | The code tells how. A comment tells why, and only when the code cannot.         |
| [Repeat first, share later](repeat-or-share.md) | Shared code must earn its place: it is one rule, or it is the third copy.       |
| [An error is a part of the design](errors.md)   | A bad note gives a reason that you can read. A missing value shows in its type. |
| Simple first                                    | No code for a need that no story has: no option and no layer "for later".       |
| One kind of change                              | A step is a move, a new name, or a new behaviour. It is not two of them.        |
| [Use a token, not a value](../architecture/look.md) | A style block names a token for each colour, size, space, line, corner, and motion. The only number is 0. |

## An example: "is the rice low?"

One function answers this question: `levelOf`, in the file `level.ts` of the pantry.

- Its name is the word of the glossary, "level".
- The file has one job: the level of a food item.
- It imports nothing of Obsidian. It gets a food item, and it gives numbers.
- The pantry screen, the bar of a row, and the shopping list call it. None of them has a copy.
- For a food item that the plugin cannot count, it gives `null`, and each caller must decide what to show.

So a new rule for "low" changes one file, and each screen follows.

## Further reading

- [Workflow](workflow.md): the step of the work in which the code is written.
- [Documentation standards](documentation-standards.md): the rules with the same goal, for the pages.
