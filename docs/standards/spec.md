---
title: Spec
summary: "The form of a spec: one page with the scope that a grill agreed, from which the user stories are made."
parent: workflow.md
---

[Wiki](../README.md) / [Workflow](workflow.md) / Spec

# Spec

A spec is the result of a grill: one page with the scope that is agreed. This page gives its form, so that each spec reads the same, and the user stories come from it with no second discussion.

## Why the decision log is not sufficient

A decision log grows in the sequence of the discussion. Decision 8 can change decision 2, and an option that was rejected is next to the option that you selected. That is correct for the question "why?". But to write the stories, you need the answer to "what?", and you must read the full log to find it.

The spec gives that answer on one page. It gives no reasons. Each line names the decision that it comes from, and the reason is there.

## The parts, in their sequence

| Part                       | Form                                                                             |
| -------------------------- | -------------------------------------------------------------------------------- |
| Metadata                   | The four fields of a page, and `status`: `draft`, and then `agreed`.             |
| The problem                | Two or three sentences: which persona, in which moment, and what is hard today.  |
| The solution               | What that persona can do when the work is done, with one example.                |
| In scope                   | A numbered list. Each line is one thing that a persona does or the plugin shows. |
| Out of scope               | A numbered list. Each line is one thing that the work does not include.          |
| What changes in the system | The architecture pages that change, and each note that gets a different form.    |
| How you test it            | The checks that need the phone, and the rules that are worth an automatic test.  |

The [personas](../personas.md) page has the personas that the problem can name.

## Each line has a name

A review of a spec must be exact: "scope 2 a is too much". So each line has a number, and each line below it has a letter, as in a [user story](user-story.md).

```markdown
## In scope

1. Each of the four parts has the same bar (decision 1)
2. A tap opens and closes the bar (decisions 2 and 3)
   - a. The find field stays in view when the bar is closed

## Out of scope

1. The bar does not keep its states after a restart of Obsidian (decision 6)
```

A line of the scope with no decision is not agreed. It goes back to the grill.

## What a spec does not have

- No reason. The decision log has it.
- No user story. Each story is its own file.
- No file name and no function name. The code changes, and then the spec is wrong.

## The file

A spec is the file `spec.md` in `initiatives/<slug>/`, and its parent is the decision log. An initiative has one spec. When a decision changes after the agreement, the log changes first, and then the spec.

## Further reading

- [One bar for each part](../initiatives/one-bar-for-each-part/decision-log.md): a decision log, as the source of a spec.
