---
title: "Spec: unit tests"
summary: "The scope of the unit tests before version 1.0: the critical paths of the domain, the bad notes, the folder of the tests, and the test run before a pull request."
parent: decision-log.md
updated: 2026-10-20
status: agreed
---

[Wiki](../../README.md) / [Decision log: unit tests](decision-log.md) / Spec: unit tests

# Spec: unit tests

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

The owner adds a function to the plugin, and an old rule breaks with no sign. The level of the rice is wrong, or a receipt loses a line, and only a phone check finds it, days later. After 1.0, the form of the notes is hard to change, so a write that breaks a note is expensive.

## The solution

One command runs a test of each rule of the critical paths in seconds, on the computer. You run it before each pull request. When a rule breaks, the name of the failed test tells which rule.

An example: a change to the parse of an amount makes "1 1/2 cups" into 1 cup. The test "1 1/2 cups is one and a half cups" fails before the pull request is merged.

## In scope

1. The tests check only the rules of the domain. No test imports a file that imports Obsidian (decision 2)
2. A rule of a critical path that is in the state or in a screen moves to the domain first, as its own refactor step (decision 3)
3. Each critical path below has tests of its main case and of its common edge cases (decisions 1 and 12)
   - a. Amounts: the four forms of a number, such as 2, 1.5, 1 1/2, and ½, and the unit after it. Text with no number gives no amount
   - b. Units: a conversion in one kind, such as 1000 g and 1 kg. A count and a weight do not compare
   - c. Level: low and out of a food item. A full amount and rows that do not compare give no level
   - d. Food item note: the rows of the table read back as they were written, and the text around the table stays (decision 5)
   - e. Match: an ingredient finds its food item by name, and gets enough, short, missing, or not known
   - f. Recipe note: the title, the groups, the ingredients, and their amounts. The record of a meal keeps the text of the note (decision 5)
   - g. Plan note: a meal is added, changed, and removed, and the plan reads back the same (decision 5)
   - h. Shopping list: low, out, and past-date food, and the needs of the planned meals, become rows with the amount to buy
   - i. Shopping note and receipt: a line reads back as it was written, and a complete receipt keeps the text that you typed (decision 5)
   - j. Put away: which lines of the receipt stay and which are added, and the package that goes into the pantry
   - k. End of a meal: the food that goes out of the pantry
   - l. Intake: one ingredient line becomes a food item and an amount. The recipe note that intake saves reads back as the same recipe (decision 5)
   - m. Dates: past its date, and use soon
4. Each reader of a note gets tests with bad notes: an empty note, a missing section, a half-typed amount, a broken row of a table, and extra text. The reader gives a reason or a missing value, and does not stop (decision 4)
5. The tests are in one folder `tests/` at the root, with the folders of `src/` (decision 6)
6. A fixture is text in the test, not a note of the test vault (decision 7)
7. You run the test run on the computer before you open a pull request (decision 11)
8. The fix of a bug in the domain starts with a test that fails (decision 9)
9. After 1.0, each story with a rule of the domain has its tests in the same pull request (decision 10)
10. A test tests one file. Its name is a sentence in the words of the glossary, and it names the value that it expects, with no snapshot (decisions 8 a, 8 b, and 8 e)
11. A test of a date sets the clock of the test, and the code does not change for it (decision 8 f)

## Out of scope

1. Tests of the state and of the screens (decision 2)
2. A test file for each file of the domain, and a coverage number (decisions 1 and 12)
3. Tests of what Obsidian does, such as the parse of the properties (decisions 2 and 4)
4. An automatic run on a pull request, and a git hook before each commit (decision 11)
5. A change of the phone checks. They stay as they are (decision 2)

## What changes in the system

- A new standard page for the unit tests: where a test is, what a fixture is, and how a test is named.
- The [workflow](../../standards/workflow.md): step 5 names the tool and the rule of decision 9.
- The [pull request](../../standards/pull-request.md) form: the test run passes.
- No note gets a different form.

## How you test it

- On the computer: the test run passes, and each line of scope 3 has at least one test.
- On the computer: a rule that you break on purpose makes its test fail, and the name of the test tells the rule.
- On the phone: nothing new. The check lists of `test-vault/` stay.

## Further reading

- [Glossary: unit tests](glossary.md): the words of this page.
