---
title: Glossary
summary: 'The words of the code structure. Each word has one meaning.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Code](README.md) / Glossary

# Glossary

The code, the comments, and these pages use the same words. Each word has one meaning. A word that is a link has a page that explains it.

| Word                                | Meaning                                                                                     | Example                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------- |
| [Layer](layers.md)                  | A group of files with the same kind of job. A layer imports only from the layers below it.  | The domain                       |
| [Screen](screens-and-components.md) | The file of one page: its `+page.svelte`. It gathers the data and connects the actions.     | `routes/shop/+page.svelte`       |
| Component                           | A file that shows the data that it gets as properties.                                      | `ShoppingRow.svelte`             |
| State module                        | A file that keeps data live while a screen is open. Its name ends in `.svelte.js`.          | `state/kitchen.svelte.js`        |
| Live query                          | A database query that gives a new result when the data changes.                             | The list of the pantry           |
| Domain                              | The rules of the kitchen, with no database and no screen.                                   | `shoppingNeeds()`                |
| Pure function                       | A function that gives the same answer for the same input, and changes nothing.              | `tripCost(purchases)`            |
| Data layer                          | The functions that read and write the database, in transactions.                            | `putAway(lines)`                 |
| Action                              | A short function of a screen that calls the data layer after a tap.                         | `cooked(entry)`                  |
| [Kitchen](one-kitchen.md)           | The menu, the recipes, the ingredients, and the pantry, as one live object for all screens. | `useKitchen()`                   |
| Context                             | A place where a layout puts a value. Each component below the layout can read it by name.   |                                  |
| [Job](one-file-one-job.md)          | The one thing that a file does. You can say it in one sentence with no "and".               | "It moves the cards of the hand" |
| [Token](style-values.md)            | A style value with a name, in `tokens.css`.                                                 | `--ink`                          |

## Words that we do not use

| Not this         | But this                | Reason                                                              |
| ---------------- | ----------------------- | ------------------------------------------------------------------- |
| Page, for a file | Screen                  | "Page" is a page of this wiki.                                      |
| Store            | State module            | A store is where you shop. It is also an old mechanism of Svelte.   |
| DRY              | Share                   | The question is not "is it repeated?" but "is it one rule?".        |
| Refactor         | Move, divide, or rename | Each of the three is a different kind of change, with its own risk. |

## Further reading

- [Shopping glossary](../shopping/glossary.md): the words of the kitchen that the domain uses.
- [Repeat or share](repeat-or-share.md): the rule behind the word "share".
