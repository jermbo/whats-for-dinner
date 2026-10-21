---
title: Comments
summary: "When code needs a comment, what the comment says, and which comments must not be there."
parent: code-standards.md
---

[Wiki](../README.md) / [Code standards](code-standards.md) / Comments

# Comments

The code tells how. A comment tells why, and only when the code cannot tell it. This page tells when to write a comment, and when to change the code.

## The problem: a comment can lie

The code changes, and the comment above it stays. Nothing shows an error. The next reader trusts the comment, and is wrong. So each comment is a risk, and it must give something that the code cannot give.

## First, say it in the code

| Not this                                            | But this             |
| --------------------------------------------------- | -------------------- |
| `// The food is low` above `if (has < low)`         | `if (level.isLow)`   |
| `// Days until the use-by date` above `const d = …` | `const daysLeft = …` |

A better [name](names.md), or a small function with a name, makes most comments unnecessary.

## What a comment is for

A comment gives a reason that is not in the code: a rule of the kitchen, a limit of the device or of Obsidian, or a choice that looks wrong.

```ts
// The pantry can have more than it had before. Then that amount is the full amount.
const full = Math.max(fullSet?.value ?? 0, has);
```

The code says that `full` is the larger of two numbers. Only the comment says why a full amount can grow.

A file can start with one comment that tells its job, and why the job is as it is.

## The rules

1. No comment that says what the next line says.
2. No code in a comment. Git has the old code.
3. No history, no date, and no author. Git has them.
4. No "TODO". Work that is left is not in the code.
5. A `catch` that does nothing has a comment that tells why nothing is correct.
6. A comment changes in the same step as its code. A comment that is not true goes out.
7. A comment has short sentences, and the words of the glossary.

## Further reading

- [Errors](errors.md): the rule for a `catch`, in full.
