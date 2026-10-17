---
name: grill-with-docs
description: Grill the owner about one feature before any story or code, and write the decision log and the glossary of the initiative during the discussion. Step 1 of the workflow.
argument-hint: '[initiative slug, or the idea in a few words]'
disable-model-invocation: true
---

# Grill with docs

This is step 1 of `docs/standards/workflow.md`: the discussion of one feature, before any story and any code. You ask, the owner decides, and you write each result in the turn in which it is made.

## Before the first question

1. Find the folder `docs/initiatives/<slug>/`, or make it. The slug is the idea in a few words: `one-bar-for-each-part`.
2. If the idea is a story with the status `needs-info`, read that story. The grill starts from it.
3. Read `docs/vision.md`, `docs/glossary.md`, and `docs/personas.md`.
4. Read the architecture pages and the code of each part that the feature touches.
5. Start `decision-log.md` with the state of today: what the plugin does now, as facts from the code.

The folder `docs/initiatives/one-bar-for-each-part/` is the model for the form of the pages.

## How to ask

Ask in rounds. A round has each question that you can ask now: its answer does not depend on a question that is open.

- Give each question a number, and continue the numbers through the grill. Then the owner can answer "4 yes, 5 b".
- Give your recommended answer and its reason with each question. Word the question so that "yes" accepts your answer.
- Give the options letters.
- A question that depends on an open question waits for a later round.
- After the answers, write the decisions. Then ask the next round.
- Do not ask for a fact. If the code, a page, or the test vault has the answer, find it there.
- Do not ask about a small choice, such as a text or the time of a motion. Make the choice, and put it in the section "Choices that are not confirmed" of the decision log.

A decision is the owner's. Do not make one for the owner, and do not continue past one that is open.

## Test each answer

| Against     | The test                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| The persona | The shopper has one hand and no keyboard. Does the answer ask the shopper to type?                                                         |
| An example  | Use a food and an amount of `test-vault/`. Then invent the hard case: no row, two places, an amount of 0.                                  |
| The code    | The owner tells how a part works, and the code does a different thing. Say so, with the place.                                             |
| The words   | The owner uses a word with a different meaning than `docs/glossary.md`, or two words for one thing. Agree on one word before you continue. |

## Write during the discussion, not after it

- A decision goes into `decision-log.md` when the owner makes it: the decision in bold, the reason, and each option that was rejected. A decision has a number, and a detail below it has a letter.
- A new word goes into `glossary.md` of the initiative when it gets its meaning. Make that page when the first word needs it.
- When a decision changes a story or an architecture page that exists, the decision names that page.
- A flow chart or the form of a note gets its own page in the folder, only when the decision log cannot hold it.
- Each page follows `docs/standards/documentation-standards.md`.

## When words cannot answer

Some questions need a look or a try: "which layout?", "does this state model hold?". Use the `prototype` skill for such a question, and write its result as a decision.

## The end

The grill is complete when no question that decides the form is open.

1. Show the decisions, one line for each, and the choices that are not confirmed.
2. Ask if the scope is agreed.
3. Stop. The next step is `to-spec`. Do not write a story, an architecture page, or code.
