---
title: Repeat or share
summary: "When two blocks of code that look the same stay as two, and when they become one shared function."
parent: code-standards.md
---

[Wiki](../README.md) / [Code standards](code-standards.md) / Repeat or share

# Repeat or share

Code that is written two times is not a fault. Shared code has a cost, and it must earn its place.

## The cost of shared code

A shared function joins all the files that call it. A change for one caller is a risk for each other caller. Then the function gets an option for each caller, and nobody can read it.

## The two reasons to share

**One rule.** The two blocks say the same fact about the kitchen. If the fact changes, each copy must change at the same moment, and a copy that you forget is a bug. This is a reason at the second copy.

**Three copies.** The blocks have the same form, and you wrote the form three times. Now you know which pieces are the same and which pieces change.

If you have neither reason, repeat the code.

## The question to ask

"If I change this block, must I change the other one?"

| The answer  | What it means                  | What you do              |
| ----------- | ------------------------------ | ------------------------ |
| Yes, always | It is one rule.                | Share it now.            |
| Possibly    | You do not know yet.           | Wait for the third copy. |
| No          | The blocks only look the same. | Keep the two.            |

## An example of each

**Share.** "A food item is low when it is at or below its low line." The pantry screen, the bar of a row, and the shopping list need this fact. It is one function, `levelOf`, and each of them calls it.

**Repeat.** Each part has its own function `isFound`, for the text that you type in the find field. The four functions look the same. But the pantry finds a food by its name, its other names, and its brands, and the recipes find by title and ingredient. Each one changes for its own part, so they stay four.

**Count.** Each of the four parts has controls above its list: a find field, a sequence, and filters. That is one form, four times. So it is one component, the bar, in `ui/parts`. What a part finds and filters stays in the part.

A shared rule goes to the folder of its part in the [domain](layers.md). A shared piece of a screen goes to `ui/parts` only when it knows nothing of the kitchen.

## Further reading

- [One file, one job](one-file-one-job.md): the rule that divides a file, before this rule joins two.
