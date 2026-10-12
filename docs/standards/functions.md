---
title: Functions
summary: "How to write a function that does one thing, that you understand at one look, and that has no hidden effect."
parent: code-standards.md
---

[Wiki](../README.md) / [Code standards](code-standards.md) / Functions

# Functions

A function is the piece of code that you read at one time. This page tells how to write one that you understand at one look, and that does nothing behind your back.

## The problem: one function that does three things

"Cooked" must find the food of the meal, take it out of the rows, and write the notes. One function can do all three. But then the reader must think of the vault, the rows, and the dates at the same time. And nobody can use "take it out of the rows" alone.

So that step is its own function: `takeOut(stocks, need)`. It gets rows and an amount, and it gives the new rows. It knows no note and no vault.

## The rules

1. **One thing.** If you can take a piece out and give it a good name, the function did two things.
2. **One level of detail.** A function that says "read the plan, then write the note" does not also divide a line of text.
3. **Three arguments or less.** With more, put the arguments that go together in one object with names.
4. **No flag.** An argument that selects between two behaviours makes two functions. A value that the function keeps, such as on or off, is not a flag.
5. **Answer or change.** A function that answers a question changes nothing. A function that changes a thing gives no answer about it.
6. **Leave early.** The case that ends the function comes first. Then the main path has no nesting.
7. **Top down.** The exported function comes first, and the functions that it calls are below it.

There is no rule for the number of lines. The test is rule 1.

## A rule of the kitchen is a pure function

A pure function gives the same answer for the same input, and it changes nothing. It gives a new value, and it does not change the value that it gets.

It also does not ask for the time. `isSoon(stock, today, soonDays)` gets the date of today as an argument. So it gives the same answer on each day, and you can try it with any date.

Some functions cannot be pure: they read or write the vault, they ask for the time, or they use the device. They are few, and they have no rule of the kitchen in them. For a rule, they call a pure function of the [domain](layers.md).

## Further reading

- [One file, one job](one-file-one-job.md): the same test, for a file.
- [Errors](errors.md): what a function gives when it cannot give an answer.
