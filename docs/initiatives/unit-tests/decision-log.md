---
title: "Decision log: unit tests"
summary: "The state of today and each decision about the unit tests that the plugin needs before version 1.0, with its reason."
parent: ../../README.md
updated: 2026-10-20
---

[Wiki](../../README.md) / Decision log: unit tests

# Decision log: unit tests

Each rule of the kitchen has a check by hand on the phone, and no automatic check. A change to the parse of an amount can break the level of the rice, and nothing tells you until you see a wrong bar. This page records each decision about the [unit tests](glossary.md) of the plugin, and the reason for it.

The goal of the owner: proper unit tests before version 1.0. Each test must be useful. You do not make a test only to have a test.

## Why the tests come now

Version 1.0 tells that the plugin is stable. After 1.0, a change must not break a rule that worked. The phone checks find a bug on the screen, but they are slow, and you do them only for the stories of one version. A [test run](glossary.md) checks each rule in seconds, at each change.

## The code and the tests today

| Part                     | Today                                                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Unit tests               | None. No test file and no test command.                                                                                            |
| Vitest                   | `vitest` 5.0.5 is in `package.json` and `package-lock.json` as a staged change, with no commit. It is in `node_modules`.           |
| The domain               | About 4,400 lines in about 75 files. No file imports Obsidian, Svelte, or the state. Each reader of a note gets text, not a file.   |
| The state                | About 1,900 lines. Each group of actions gets a host object with the writes, such as `PlanActionsHost`.                            |
| Obsidian in the state    | Six files import only types. At run time, `read-properties.ts` calls `parseYaml`, `tried.ts` makes a `Notice`, and `intake-actions.ts` uses `TFile`. Seven of the eight groups of actions use `tried`. |
| The package `obsidian`   | It has only types and no code. So a test that imports a file with a run time import of Obsidian cannot run without a stand-in.     |
| The screens              | About 11,000 lines of Svelte in `ui/`.                                                                                             |
| The clock                | Only `dates.ts` reads the clock: `today` and `showDate`. The other files get the date as an argument.                              |
| The phone checks         | Six check lists at the root of `test-vault/`. They stay.                                                                           |
| Automatic checks         | `npm run check` checks the types. No folder `.github/`, so nothing runs on a pull request.                                         |

## What other pages give to this work

- The [workflow](../../standards/workflow.md) has the tests as step 5 of each story.
- The page [errors](../../standards/errors.md) tells that a [bad note](glossary.md) is one of the answers of a reader, not a stop. That is a rule that a test can check.
- The page [layers](../../standards/layers.md) tells that you can run a rule of the domain with no Obsidian and no screen.

## Decisions

Each decision has the same form: the decision in bold, the reason, the options that were rejected, and the words of the owner when the owner gave them.

### What gets a test

1. **A test is only for what matters: the critical paths, the major functions, and the small edge cases that are common.** A file with no such rule gets no test.
   - The reason: a test exists because a rule is at risk. When you add a function, the tests tell you that the old functions still work.
   - Rejected: a test file for each file of the domain, and a coverage number. Both measure the count of tests, not the risk.
   - The owner: "i want to focus only on what matters. the critical paths the major functionality the small but common edge cases". And: "enough to get me confidence that the major pieces work. essentially when i create new functikonality i want to make sure i am not breaking existing."

2. **The tests are for the domain only. No test imports a file that imports Obsidian.** So no test needs a stand-in for Obsidian.
   - The reason: each critical path ends in a rule of the domain, such as the new text of a food item note after put away. The state only reads that text from the vault and gives the new text back.
   - Rejected: tests of the state with a fake host, because the state uses `parseYaml`, `Notice`, and `TFile` at run time. Tests of the screens, because the phone checks see the screens.
   - The owner: "my advice is to not test obsidian only the plugin code. make the best decision from there".

3. **A rule of a critical path that is in the state or in a screen moves to the domain first. Then it gets its test.** Each move is its own refactor step, with no change that you can see. An example: at the start of put away, the state decides which lines of the receipt stay and which lines it adds.
   - The reason: decision 2 tests only the domain, and the [layers](../../standards/layers.md) put each rule there.
   - Rejected: a test of the rule where it is now.

4. **Each reader of a note gets tests with bad notes:** an empty note, a missing section, a half-typed amount, a broken row of a table, and extra text that you typed. The reader gives a reason or a missing value, and does not stop. Obsidian parses the properties, so a test starts from the parsed properties.
   - The reason: you edit the notes by hand, and the page [errors](../../standards/errors.md) makes a bad note one of the answers.
   - Rejected: only the cases that occurred in real notes.

5. **Each note that the plugin writes reads back with the same facts, and the text around the part that the plugin writes stays.** This includes the recipe note that intake saves.
   - The reason: after 1.0, the form of a note is hard to change, so a write that breaks a note is expensive. Intake is the only part that writes a full recipe note.
   - The owner: "once its 1.0 it will be hard to change schema and data."

### Where the tests are

6. **The tests are in one folder `tests/` at the root, with the folders of `src/`.** The file `tests/pantry/level.test.ts` tests `src/pantry/level.ts`.
   - The reason: `src/` keeps only the code of the plugin. The two forms are common practice.
   - Rejected: a test file next to its source.
   - The owner: "I think it should have a dedicated test folder in one place... but open to best practices".

7. **A fixture is text in the test.** A test does not read a note of `test-vault/`.
   - The reason: you change the notes of `test-vault/` for the phone checks, and that change must not make a unit test fail.
   - Rejected: the notes of `test-vault/`, and a folder of fixture notes.

### How a test is written

8. **Each test follows seven rules.**
   - a. A test file tests one file of the code, because one file has one job.
   - b. A test name is a sentence in the words of the glossary: "a jug of milk at 1/4 with a full jug is not low". A test that fails then tells the rule that broke.
   - c. The tests run in Node, with no browser page, because the domain needs no page.
   - d. The command is `npm test`, and it runs each test one time.
   - e. No snapshot tests: each test names the value that it expects. A snapshot accepts each change, also a wrong one.
   - f. A test of `today` or `showDate` sets the clock of Vitest, and the code does not change for it. Only these two functions read the clock.
   - g. The fixtures use the foods and amounts of `test-vault/`: rice, 1000 g, eggs. One example continues through all tests.

### When a test is written

9. **The fix of a bug in the domain starts with a test that fails.**
   - The reason: the test shows the bug, and the bug cannot come back with no sign.

10. **After 1.0, each story with a rule of the domain has its tests in the same pull request.**
    - The reason: this is step 5 of the [workflow](../../standards/workflow.md).

11. **You run the test run on the computer before you open a pull request. Nothing runs automatically.** The form of the [pull request](../../standards/pull-request.md) tells that the test run passes.
    - The reason: one person makes each change, and a workflow file is one more thing to keep.
    - Rejected: a workflow of GitHub Actions on each pull request, and a git hook before each commit.
    - The owner: "The only thing I dont care about is github tests ci... this is a small project for me."

### What "done" is for 1.0

12. **The spec names the rules of each critical path. Each named rule has a test, and the test run passes.**
    - The reason: decision 1 tests what matters, so "done" is a list of rules, not a count.

## Further reading

- [Code standards](../../standards/code-standards.md): the rules that make the domain easy to test.
- [Decision log: brands and photos](../brands-and-photos/decision-log.md): a decision log of a grill, as a model.
