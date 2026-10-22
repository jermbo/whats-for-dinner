---
title: Pull request
summary: "The form of the message of a pull request: what changed, the choices that no story has, and the danger of the merge."
parent: workflow.md
updated: 2026-10-20
---

[Wiki](../README.md) / [Workflow](workflow.md) / Pull request

# Pull request

A pull request puts the work of a branch into the plugin. You read its message before you merge, and you find it again months later. This page gives the form of that message.

## The message must tell what changed

You know a change when you can answer three questions: what is new, what works differently, and what is gone. A list of links to the stories does not answer them. So the main section of the message has the three answers, and each line is one thing that you can see in the plugin.

The last answer is the most important. A thing that is gone is what surprises you after the merge.

## The parts, in their sequence

| Part                                  | Form                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------- |
| Title                                 | What you can do after the merge. For the branch of a version, it ends with the version. |
| Introduction                          | Two or three sentences with no heading, with a link to the list page of the stories.    |
| What changed                          | Three sections: "Added", "Changed", and "Removed".                                      |
| Choices that the stories did not have | Each decision that the build made, and that no story and no spec has.                   |
| Merge danger                          | Two sections: "Door", with its kind in the heading, and "Blast radius".                 |
| Tested                                | What somebody ran or saw, and what nobody tested. `npm test` passes before you open it. |

The names of the parts are headings of level 2, and the sections in a part are headings of level 3. A section with no line is not in the message.

## Each line has a name

The lists have the form of a [user story](user-story.md): a number for the thing, and a letter for each detail. So a review is exact: "Added 3 b", or "Door 1 a".

A line with a number is a thing, not a sentence. It is a short name with no period, in the words of the [glossary](../glossary.md) and of the screen. Its details are the lines with a letter.

## The danger of the merge

Through a two-way door you can go back with no loss. Through a one-way door you cannot. In this plugin, a one-way door is a change in the form of a note or of the data file. Your vault has real notes, and the plugin does not convert them. So "Door" tells what you lose, and what you must do with your notes.

The blast radius is what can break outside the stories: a different part of the kitchen, a narrow phone, or the vault on the second device.

## What the message does not have

- No list of the stories. The introduction links to their list page.
- No diagram and no tree of files. The lines of "What changed" tell the change.
- No check that nobody ran. "Tested" tells what nobody tested.
- No line that names a tool or an author.

## An example

```markdown
The shopping list has more than the food of the meals now. You accept the staples that need a look, you add items of your own, and each trip leaves a receipt. The [stories of the shopping list](docs/features/v0.2.0/shop-stories.md) have each requirement.

## What changed

### Added

1. Suggestions for staples
   - a. A staple that needs a look shows above the list, with its reason
   - b. "Add" puts it on the list
   - c. "Skip" hides it until put away
2. A receipt for each trip
   - a. The note has the name of the day

### Changed

1. The cart is in the note "Next trip"
   - a. An item of the cart is a task with a mark
   - b. It was in the data file

### Removed

1. The check box "Low food on the list"

## Choices that the stories did not have

1. A staple on the list fills, with a task or with no task

## Merge danger

### Door: one-way

1. The data file loses the cart
   - a. An item that is in the cart at the merge is not in the cart after it

### Blast radius

1. The height of the Shop part on a phone

## Tested

1. `npm run check`: 0 errors
2. `npm test`: each test passes
3. Not tested: the screens, in Obsidian and on the phone
```

The title of this example is "Accept staples, add your own items, and get a receipt - v0.2.0".

## Further reading

- [Unit tests](unit-tests.md): what a useful test is, for the section "Tested".
