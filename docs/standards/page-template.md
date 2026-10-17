---
title: Page template
summary: "The five parts of a page, with a block that you can copy."
parent: documentation-standards.md
---

[Wiki](../README.md) / [Documentation standards](documentation-standards.md) / Page template

# Page template

Each page has the same five parts, so that a reader always knows where to look. Copy this block to start a page.

```markdown
---
title: Level
summary: "How the plugin decides that a food item is low: the amount that you have, the full amount, and the low line."
parent: pantry.md
---

[Wiki](../README.md) / [Pantry](pantry.md) / Level

# Level

One or two sentences: what this page explains, and why it is important.

## A heading that tells what the section says

The explanation, with [a link](food-item-note.md) in the sentence where the reader needs it.

## Further reading

- [Page title](page.md): the reason to go there.
```

## The five parts

| Part            | Rules                                                                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Metadata        | Four fields, see below. It is for tools and agents, so keep it exact.                                                                                                 |
| Breadcrumb      | The path from the wiki home to this page, with `/` between the parts. Each part is a link, but the last part is not. It must agree with the chain of `parent` fields. |
| Title           | The same text as `title`. It is the only heading of level 1.                                                                                                          |
| Description     | The explanation. Each heading of level 2 names one part of the thought.                                                                                               |
| Further reading | One to three links, each with a reason.                                                                                                                               |

## The metadata fields

| Field     | Value                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------- |
| `title`   | The name of the page. A short noun phrase.                                                     |
| `summary` | One sentence that tells what the reader learns. Put it in quotes, because it can have a colon. |
| `parent`  | The file of the page above this one, as a relative path. The wiki home has no parent.          |
| `updated` | The date of the last change of the content, as year-month-day.                                 |

## The file

The folder tells the kind of a page. The links tell how the pages connect.

| Folder                | Its pages                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `docs/`               | The wiki home, the vision, the glossary, and the personas.                                       |
| `architecture/`       | The system as it is: what each part does, how a mechanism decides, and the exact form of a note. |
| `features/<version>/` | The user stories of that version.                                                                |
| `initiatives/<slug>/` | The discussion of one piece of work: a glossary, a decision log, detail, and a spec at its end.  |
| `standards/`          | The rules for the pages of the wiki, for the flow of the work, and for the code.                 |

The [workflow](workflow.md) tells how a piece of work goes through these folders.

- A page is one file. A subject does not get a folder of its own.
- The hierarchy is in `parent` and in the breadcrumb, not in the folders. A parent can be in a different folder.
- A file name is the title in small letters, with hyphens between the words: `food-item-note.md`.

## Further reading

- [Writing style](writing-style.md): how to write the description.
- [Diagrams](diagrams.md): how to add a diagram to the description.
