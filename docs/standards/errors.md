---
title: Errors
summary: "What a function gives when it cannot give an answer: a result with a reason, or a missing value that its type shows."
parent: code-standards.md
---

[Wiki](../README.md) / [Code standards](code-standards.md) / Errors

# Errors

A function cannot always give an answer. This page tells what it gives then, so that the plugin does not stop and does not guess.

## The problem: you type the notes by hand

A recipe with no title, an amount with no number, properties that are half typed: these are not rare. They are a usual day. If the plugin stops on a bad note, the kitchen is empty. If it guesses, the pantry is wrong, and you do not know it.

So a bad note is not an accident in the code. It is one of the answers.

## A bad note gives a reason

`readRecipe` gives one of two results: the recipe, or the reason why the note is not a recipe.

```ts
type RecipeResult =
	| { ok: true; recipe: Recipe }
	| { ok: false; reason: string };
```

The type makes each caller handle the two cases. The reason is a sentence for you, with the text that is wrong: `The amount "a pinch" has no number.`

## The rules

1. **A result, not a stop.** What can be wrong in a note is in the type of the answer.
2. **The reason is for the cook.** It is a full sentence in the words of the glossary, with the value that is wrong.
3. **A throw stays in its file.** Code that is deep in a file can throw its own kind of error to leave. The exported function catches that kind, and makes the result. An error of a different kind goes on: it is a bug, and a hidden bug is harder to find.
4. **A missing value is `null`, and the type says so.** `Level | null` makes each caller decide. A comment tells what `null` means. No number and no text with a secret meaning, such as `-1`.
5. **Check at the border, trust inside.** The text of a note, the properties, and the data file are checked where they come in. After that the types are true: no second check, and no `any`.
6. **A `catch` that does nothing tells why.** "The device can refuse, for example when the battery is low."

## An example: a food item that the plugin cannot count

The full amount of the flour is "2 kg", and its rows are "3 bags". The plugin cannot compare them. `levelOf` gives `null`. The row shows the amount with no bar. In the sequence "Low first", the food is in the group "Not counted". Nothing stops, and nothing is a guess.

## Further reading

- [Functions](functions.md): a function that answers changes nothing, also when the answer is "no".
