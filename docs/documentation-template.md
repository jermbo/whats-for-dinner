---
title: Page template
summary: 'The five parts of a page, with a block that you can copy.'
parent: documentation-standards.md
updated: 2026-10-03
---

[Wiki](README.md) / [Documentation standards](documentation-standards.md) / Page template

# Page template

Each page has the same five parts, so that a reader always knows where to look. Copy this block to start a page.

```markdown
---
title: In the store
summary: 'The shopping list screen: what it shows, and what one tap does.'
parent: item-journey.md
updated: 2026-10-03
---

[Wiki](../README.md) / [Shopping](README.md) / [The journey of an item](item-journey.md) / In the store

# In the store

One or two sentences: what this page explains, and why it is important.

## A heading that tells what the section says

The explanation, with [a link](other-page.md) in the sentence where the reader needs it.

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

- A topic of the system is one folder in `docs/`. Its start page is `README.md`.
- All pages of a topic are in that folder. The hierarchy is in `parent` and in the breadcrumb, not in more folders.
- A file name is the title in small letters, with hyphens between the words: `in-the-store.md`.

## Further reading

- [Writing style](documentation-writing-style.md): how to write the description.
- [Diagrams](documentation-diagrams.md): how to add a diagram to the description.
