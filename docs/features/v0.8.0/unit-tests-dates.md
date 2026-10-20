---
title: Test the dates
summary: "The maker gets tests of use soon and of past its date, with the clock of the test set to one day."
parent: unit-test-stories.md
updated: 2026-10-20
persona: Maker
depends-on: [unit-tests-run-the-tests.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Unit test stories](unit-test-stories.md) / Test the dates

# Test the dates

As the maker, I want tests of the dates of the pantry, so that a change cannot hide the spinach that you must use today, or show the eggs as spoiled a day early.

## Requirements

1. The tests check the count of days between two dates, and the date that is a number of days after a date
   - a. Across the end of a month and the end of a year
2. The tests check "use soon": a use-by date in 5 days or less, and a date in the past
3. The tests check "past its date": a use-by date before today. The date of today is not past
4. The tests of "today" and of the text of a date set the clock of the test. The code does not change for it
   - a. The text of a date has the year only when it is not this year

## Acceptance criteria

The fixtures use the use-by dates of `test-vault/Larder/Pantry/`: the spinach 2026-10-21, and the eggs 2026-10-25 and 2026-11-16.

1. GIVEN the date 2026-10-20 WHEN the plugin counts the days to 2026-10-25 THEN the count is 5
2. GIVEN the date 2026-10-30 WHEN the plugin adds 3 days THEN the date is 2026-11-02
3. GIVEN the date 2026-12-30 WHEN the plugin adds 3 days THEN the date is 2027-01-02
4. GIVEN the date of today is 2026-10-20 WHEN the plugin checks the eggs of 2026-10-25 THEN they are to use soon
5. GIVEN the date of today is 2026-10-20 WHEN the plugin checks the eggs of 2026-11-16 THEN they are not to use soon
6. GIVEN the date of today is 2026-10-22 WHEN the plugin checks the spinach of 2026-10-21 THEN it is to use soon
   - a. AND it is past its date
7. GIVEN the date of today is 2026-10-21 WHEN the plugin checks the spinach of 2026-10-21 THEN it is not past its date
8. GIVEN the clock of the test is at 2026-10-20 WHEN the plugin asks for today THEN the date is 2026-10-20
9. GIVEN the clock of the test is at 2026-10-20 WHEN the plugin writes the date 2027-01-02 THEN the text has the year 2027
10. GIVEN the clock of the test is at 2026-10-20 WHEN the plugin writes the date 2026-10-25 THEN the text has no year

## Depends on

- [Run the tests](unit-tests-run-the-tests.md): the command, the folder, and the rules of a test.

## Architecture

- [Use soon](../../architecture/use-soon.md): the 5 days, and what each part shows.
- [Past its date](../../architecture/past-its-date.md): when food that a meal needs is a suggestion.
