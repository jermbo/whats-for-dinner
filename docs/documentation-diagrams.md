---
title: Diagrams
summary: 'When a diagram helps, which type to use, and how to write one that does not break.'
parent: documentation-standards.md
updated: 2026-10-03
---

[Wiki](README.md) / [Documentation standards](documentation-standards.md) / Diagrams

# Diagrams

The pages use Mermaid diagrams. A diagram is text in a code block, and the viewer draws it. So a diagram is in the same file as the page, and a change shows in a diff.

## When to use one

Use a diagram when the reader must see a shape: a path with branches, a cycle, or links between things. Do not use one for a list or a sequence with no branch. A numbered list is better for that.

The text must be complete without the diagram. An agent reads the code of the diagram, and some viewers do not draw it.

## Which type

| The question of the reader                           | Type              | Example                                                                      |
| ---------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------- |
| What occurs, and where does it branch?               | `flowchart`       | How the app proposes a quantity in [put away at home](shopping/put-away.md). |
| Which states are there, and what moves between them? | `stateDiagram-v2` | [The journey of an item](shopping/item-journey.md).                          |
| Who tells what to whom, in which sequence?           | `sequenceDiagram` | What one tap does, [in the store](shopping/in-the-store.md).                 |
| Which tables are there, and how do they connect?     | `erDiagram`       | The [data model](shopping/data-model.md).                                    |

## How to write one that does not break

- Put a label in double quotes when it has a colon, a comma, a period, or brackets: `A["File: 3 MB"]`.
- Do not start a label with a number and a period, such as "1. Store". The viewer reads it as a list and shows an error.
- Use short names of letters for the nodes: `A`, `B`, `cart`.
- Keep a label to 8 words or less. The detail goes in the text.
- Do not set colors or styles. The viewer selects them, also for a dark screen.

## Size

One diagram for one page is the usual number. If a diagram has more than 10 nodes, the page has more than one thought. Divide the page.

## Check it

Open the page in a Markdown preview before you commit. A diagram with an error shows as an error box, not as a diagram.

## Further reading

- [Writing style](documentation-writing-style.md): the text around a diagram.
