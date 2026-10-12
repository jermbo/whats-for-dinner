---
title: Documentation standards
summary: "The rules for each page of this wiki: what a page is, how it is built, and where its links go."
parent: ../README.md
---

[Wiki](../README.md) / Documentation standards

# Documentation standards

Each page of this wiki follows these rules. Read this page before you write or change a page.

## The goal

A reader who is new must be able to learn how the system works from the pages, by a click from one page to the next.

The test of a page is one question: after 90 seconds, can a new reader tell what is going on?

## What a page is

| Rule                | Meaning                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| One thought         | A page explains one thing completely. A part that needs more words gets its own page.               |
| One altitude        | A page is at one of four [altitudes](altitudes.md), from the full picture to the exact rule.        |
| 60 to 90 seconds    | About 270 to 350 words of text.                                                                     |
| It teaches          | It gives the problem, the mechanism, and an example. A list of rules does not teach.                |
| It is not a copy    | It tells something that no other page tells.                                                        |
| It tells the system | It tells what the system does, and why. It must agree with the code, but it does not copy the code. |
| It has no status    | It does not tell what is planned or what is done. Only the roadmap does that.                       |
| It comes first      | A new feature or a new rule gets its page first. The code comes after the page.                     |

## How a page is built

Each page has five parts, in this sequence: metadata, breadcrumb, title, description, and further reading. The [page template](page-template.md) shows each part and has a block that you can copy.

## Where the links go

- A link is in the sentence where the reader needs it, on the words that name the thing.
- A page links to a different page one time only, at the first use.
- "Further reading" is short: one to three related pages that the text does not link to, each with a reason.

## Words and diagrams

The language is Simplified Technical English. See the [writing style](writing-style.md).

A diagram is there only when it tells more than the text. See [diagrams](diagrams.md).

## Before you commit

1. Read the page as a new reader. Does it pass the test?
2. Compare it with its parent and its neighbors. Does it repeat one of them?
3. Open it in a preview. Do the links and the diagram work?

## Further reading

- [Pantry](../architecture/pantry.md): a page that follows these rules. Use it as a model.
