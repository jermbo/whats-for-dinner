---
title: Run the tests
summary: "The maker runs one command that tests the rules of amounts and units, and a standard page tells how each later test is written."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Run the tests

# Run the tests

As the maker, I want one command that tests the rules of amounts and units, and one page that tells how a test is written, so that each change shows in seconds if it breaks how the plugin reads "1 1/2 cups".

## Requirements

1. `npm test` runs each test of the folder `tests/` one time, and tells which tests fail
   - a. The tests run in Node, with no browser page
   - b. The tool is Vitest, which `package.json` has
2. A test file is in `tests/`, in the folder of its source, and tests one file: `tests/recipemd/amount.test.ts` tests `src/recipemd/amount.ts`
3. No test imports a file that imports Obsidian
4. The tests of amounts check the four forms of a number and the unit after it
   - a. Text with no number gives no amount
   - b. A comma is a decimal mark
5. The tests of units check a conversion in one family, and the amounts that do not compare
   - a. A unit with a capital letter or a plural is the same unit
   - b. The text that the plugin writes for an amount: kilograms from 1000 g, and eighths of a gallon as a fraction
6. A test name is a sentence in the words of the glossary, and the test names the value that it expects. No snapshot
7. A fixture is text in the test, with the foods and amounts of `test-vault/`
8. A new standard page "Unit tests" tells how a test is written
   - a. Which code gets a test: the critical paths of the domain, their common edge cases, and the bad notes of each reader
   - b. A rule of a critical path that is in the state or in a screen moves to the domain first, as its own refactor step
   - c. Where a test file is, and what a fixture is
   - d. How a test is named, and that a test names its value
   - e. A test of a date sets the clock of the test, and the code does not change for it
   - f. The fix of a bug in the domain starts with a test that fails
   - g. After 1.0, each story with a rule of the domain has its tests in the same pull request
9. The [workflow](../../standards/workflow.md) page names `npm test` in step 5, with a link to the new page
10. The form of the [pull request](../../standards/pull-request.md) tells that the test run passes before you open it

## Acceptance criteria

1. GIVEN the text "1 1/2 cups" WHEN the plugin reads the amount THEN the number is 1.5 and the unit is "cups"
2. GIVEN the text "½ tsp" WHEN the plugin reads the amount THEN the number is 0.5 and the unit is "tsp"
3. GIVEN the text "1,5 kg" WHEN the plugin reads the amount THEN the number is 1.5
4. GIVEN the text "1,000 g" WHEN the plugin reads the amount THEN the number is 1
5. GIVEN the text "6" WHEN the plugin reads the amount THEN the number is 6 and the amount has no unit
6. GIVEN the text "a pinch" WHEN the plugin reads the amount THEN it gives no amount
7. GIVEN "2 kg" and "2000 g" WHEN the plugin measures them THEN they have the same value in grams
8. GIVEN "1 gal" and "4 qt" WHEN the plugin compares them THEN they compare
9. GIVEN "2 Cups" and "2 cup" WHEN the plugin measures them THEN they are the same amount
10. GIVEN "2 cans" and "1 jar" WHEN the plugin compares them THEN they do not compare
11. GIVEN the 12 eggs of a carton and "500 g" WHEN the plugin compares them THEN they do not compare
12. GIVEN 1500 g WHEN the plugin writes the amount THEN the text is "1.5 kg"
13. GIVEN 0.375 gal WHEN the plugin writes the amount THEN the text is "3/8 gal"
14. GIVEN 0.625 kg WHEN the plugin writes the amount THEN the text is "625 g"
15. GIVEN all tests of this story WHEN the maker runs `npm test` THEN each test passes
16. GIVEN the maker changes the parse so that "1 1/2 cups" gives 1 WHEN the maker runs `npm test` THEN the test of criterion 1 fails, and its name tells the rule

## Depends on

Nothing.

## Architecture

- [Amounts](../../architecture/amounts.md): the four forms of a number, the families of units, and how the plugin writes an amount.
- [Layers](../../standards/layers.md): why the domain runs with no Obsidian.
- [Spec: unit tests](../../initiatives/unit-tests/spec.md): the scope and the decisions of this work.
