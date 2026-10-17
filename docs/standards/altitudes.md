---
title: Altitudes
summary: "The four heights of a page, from the full picture down to the exact rule, and how a reader goes from one to the next."
parent: documentation-standards.md
---

[Wiki](../README.md) / [Documentation standards](documentation-standards.md) / Altitudes

# Altitudes

Each page of the wiki is at one altitude. A high page shows much of the system with little detail. A low page shows one small thing exactly. This page tells which altitudes there are and how to select one.

## Two readers want different pages

One reader wants the full picture in a minute. The format of a table is in the way. A different reader changes a rule and wants that format exactly. One page cannot help the two of them. So the wiki has a page for each, and a link between them.

## The four altitudes

| Altitude    | The question of the reader                         | Example                                             |
| ----------- | -------------------------------------------------- | --------------------------------------------------- |
| 30,000 feet | What is this, and why is it there?                 | The [wiki home](../README.md)                       |
| 15,000 feet | What does this part do, and how do its pieces fit? | [Pantry](../architecture/pantry.md)                 |
| 5,000 feet  | How does this one mechanism work?                  | [Level](../architecture/level.md)                   |
| Ground      | What is the exact form, or the exact rule?         | [Food item note](../architecture/food-item-note.md) |

The pages at 15,000 feet and lower are in the folder `architecture/`. A user story has no altitude: it is a piece of work, not an explanation.

## A reader goes down by a link

A page does not explain what a lower page explains. It gives one sentence, with a link on the words that name the thing. The reader who wants more follows the link. The reader who does not want more reads on.

Thus the page "Pantry" says that a food item has a level. It does not say how the plugin calculates the level. The page "Level" does that.

## The wiki tells the system, not the code

A page tells what the system does and why. It does not name a function, and it does not copy code. The code already tells how.

But a page must agree with the code. When a rule changes in the code, its page changes in the same step.

## How to select the altitude of a new page

- A page that tells what one part of the kitchen does is at 15,000 feet.
- A page that answers "how does it decide?" is at 5,000 feet.
- A page that a person reads to write a note by hand, or to check a rule, is on the ground.

If a page needs two altitudes, it has two thoughts. Divide it.

## Further reading

- [Writing style](writing-style.md): how to write the explanation at each altitude.
