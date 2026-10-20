---
title: Unit tests
summary: "Which code gets a unit test, where a test file is, what a fixture is, and how a test is named."
parent: code-standards.md
updated: 2026-10-20
---

[Wiki](../README.md) / [Code standards](code-standards.md) / Unit tests

# Unit tests

A unit test calls one function of the domain with a known input, and compares the answer with the value that you expect. `npm test` runs each test one time, in Node, in seconds. When you add a function, the test run tells you that the old rules still work.

## Which code gets a test

A test exists because a rule is at risk. So only three kinds of code get tests:

- The critical paths of the domain, such as the level of a food item or the lines of a receipt.
- Their common edge cases, such as a comma as a decimal mark.
- The bad notes of each reader: an empty note, a missing section, a half-typed amount, a broken row, and extra text. The reader gives a reason or a missing value, and does not stop.

No test imports a file that imports Obsidian. A rule of a critical path that is in the state or in a screen moves to the domain first, as its own refactor step. The [layers](layers.md) put it there.

## Where a test is

A test file tests one file. It is in `tests/`, in the folder of its source: `tests/pantry/level.test.ts` tests `src/pantry/level.ts`.

A fixture is the input of a test, as text in the test. It uses the foods and amounts of `test-vault/`, such as the rice of 2 kg at 3/4. A test does not read a note of `test-vault/`, because a change for a phone check must not make a test fail.

## How a test is written

The name of a test is a sentence in the words of the [glossary](../glossary.md), and it names the value: "1 1/2 cups is 1.5 cups". When the test fails, its name tells the rule that broke. No snapshot: a snapshot accepts each change, also a wrong one.

A test of a date sets the clock of the test with `vi.setSystemTime`. The code does not change for it.

## When a test is written

- The fix of a bug in the domain starts with a test that fails. Then the bug cannot come back with no sign.
- After 1.0, each story with a rule of the domain has its tests in the same pull request.

## Further reading

- [Errors](errors.md): what a reader gives for a bad note.
- [Workflow](workflow.md): the step in which the tests of a story are written.
