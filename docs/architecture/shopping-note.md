---
title: Shopping note
summary: "The exact form of the note of a shopping trip: one task for each item, what the plugin reads in a task, and what it changes."
parent: shopping.md
---

[Wiki](../README.md) / [Shopping](shopping.md) / Shopping note

# Shopping note

A shopping trip has one note. You can read it and change it with no plugin. This page gives the form of that note.

## A complete note

```markdown
Mum comes on Friday.

- [ ] Soap
- [ ] [[Shopping/Items/Batteries|Batteries]]
- [x] [[Pantry/Lime|Lime]]
- [x] [[Pantry/Avocados|Avocados]]
```

The note has the name "Next trip". It is in the shopping folder of the [settings](settings.md), which starts as `Shopping`. If the note is not there, the plugin makes it with your first action: a tap on a row of the list, a suggestion that you accept, or an item that you add.

## One task is one item

The plugin reads each line that is a task. All other lines are your own text.

| Part of the line  | Meaning                                                            |
| ----------------- | ------------------------------------------------------------------ |
| `[ ]`             | The item is to buy. It is an extra, and the list has a row for it. |
| `[x]`             | The item is in the cart.                                           |
| The link          | The note of the item, with the name that the list shows.           |
| Text with no link | An item with that text as its name. Thus you can type a line fast. |

A row that the plugin calculates from the meals is not in the note. It gets its task when you put it in the cart. If two tasks have the same item, the plugin reads the first.

## The link tells which item it is

A name can find the wrong food item, or no food item. A link is exact, and Obsidian keeps it correct when the note gets a new name.

An item is in the pantry when its link goes to a note of the pantry folder. Such an item goes into the pantry at [put away](put-away.md). The soap and the batteries change nothing there, unless you put "Into the pantry" on for them.

The plugin follows a link as Obsidian does. So `[[Lime]]`, with no folder, is the note `Pantry/Lime`.

The note of a link does not have to exist. A recipe needs quinoa, and the pantry has no note for it. The task is `- [x] [[Pantry/Quinoa|Quinoa]]`, and put away makes the note.

An item of your own that no note has, such as the batteries, links into the items folder of the settings. The plugin makes no note for it. If you click the link, Obsidian makes the note in that folder.

## What the plugin changes

The plugin changes only the lines of the tasks. It changes the mark of a line, and the other text of the line stays as you wrote it.

- **A tap on a row of the list** gives the task of the item a mark. An item with no task gets a new line, after the last task. With no task in the note, the line goes at the end.
- **"Undo"** takes the mark off, and the item is an extra. But if a meal puts the item on the list, the task goes out of the note.
- **"Add" on a suggestion, and the field "Add an item",** add a task with no mark. An item that has a task gets no second task.
- **"Remove"** takes the task of an extra out of the note.
- **Put away** changes the note into the [receipt](receipt.md) of the trip. Each task with no mark goes into a new note "Next trip".

Each change starts from the text that the note has at that moment. So two taps, one directly after the other, do not lose an item.

## Further reading

- [Plan note](plan-note.md): the other note of the plugin that is a list of tasks.
- [Notes of the kitchen](notes-of-the-kitchen.md): why the cart is in a note and not in the data file.
