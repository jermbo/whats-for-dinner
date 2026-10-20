---
title: "Glossary: unit tests"
summary: 'The new words of the initiative "unit tests", each with one meaning, until the wiki glossary gets them.'
parent: decision-log.md
updated: 2026-10-20
---

[Wiki](../../README.md) / [Decision log: unit tests](decision-log.md) / Glossary: unit tests

# Glossary: unit tests

The [decision log](decision-log.md) uses words that the [glossary](../../glossary.md) of the wiki does not have. This page gives each of them one meaning. The page is temporary: a word goes to the wiki glossary when its decision is made.

## The words of a test

| Word         | Meaning                                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit test    | Code that calls one function of the plugin with a known input, and compares the answer with the answer that you expect. It needs no Obsidian. |
| Test file    | One file of unit tests for one file of the code: `level.test.ts` tests `level.ts`.                                                            |
| Test run     | One command that runs all unit tests and tells which ones fail. It runs on the computer, not on the phone.                                    |
| Fixture      | The input of a test: the text of a note, a list of rows, or an amount such as "1000 g" of rice.                                               |
| Bad note     | A note that a reader of the plugin cannot read completely: a half-typed amount, a missing section, a table with a broken row.                 |
| Risk area    | A group of rules where a bug gives a wrong pantry with no sign: amounts, units, the match of a food name, receipts, and the readers of notes. |
| Fake host    | A plain object that a test gives to an action of the state, in place of the vault. It records each write, and writes nothing.                 |
| Phone check  | One test of a check list at the root of `test-vault/`. You do it by hand, on the phone. A unit test does not replace it.                      |

## Further reading

- [Workflow](../../standards/workflow.md): step 5, where the tests of a story are written.
- [Errors](../../standards/errors.md): what a reader gives for a bad note.
