---
name: to-spec
description: Write the spec of an initiative from its decision log, with no new discussion. The end of step 1 of the workflow.
argument-hint: '[initiative slug]'
disable-model-invocation: true
---

# To spec

A grill ends with a spec: one page with the scope that is agreed. You write it from what is decided. You do not interview the owner again.

## Steps

1. Read `docs/standards/spec.md`. It gives the form of the page.
2. Read `decision-log.md` and `glossary.md` of the initiative. If the grill was in this conversation, use it too.
3. Read the architecture pages and the code of each part that the decisions touch.
4. Look for a hole: a decision that the stories need, and that nobody made. If you find one, stop and name it. The owner closes it in the grill, not you in the spec.
5. Write `docs/initiatives/<slug>/spec.md` with `status: draft`.
6. Show the owner the lines of "In scope", "Out of scope", and "How you test it". Ask if the scope is agreed.
7. When the owner agrees, set `status: agreed`.
8. Stop. The next step is `to-stories`.

## Rules for the scope

- Each line names the decision that it comes from. A line with no decision is your idea: remove it.
- A choice of the section "Choices that are not confirmed" can be a line. Mark it "(not confirmed)".
- Each option that was rejected, and that a reader could expect, is a line of "Out of scope".
- Use the words of `docs/glossary.md` and of the glossary of the initiative.

## Rules for "What changes in the system"

- Name each architecture page that must change, and each page that is new.
- Name each note and each part of the data file that gets a different form. The owner has real notes in a real vault.

## Rules for "How you test it"

- For each line of the scope, tell how you know that it works: a look on the phone, or a rule that code decides with no screen.
- For a rule that is worth an automatic test, name the place where a test sees the behaviour from outside: "a food item note goes in, a level comes out".
- Prefer a place that exists, and prefer few places. A test that knows the inside of a part breaks when the part changes.
