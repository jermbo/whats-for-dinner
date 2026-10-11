---
title: Recipe note
summary: 'The exact form of a recipe note: the parts of the RecipeMD format, what the plugin permits more, and why a note is not a recipe.'
parent: recipes.md
updated: 2026-10-11
---

[Wiki](../README.md) / [Recipes](recipes.md) / Recipe note

# Recipe note

A recipe is a note in the [RecipeMD](https://recipemd.org/specification.html) format, version 2.4.0. This page gives the parts of that format in their sequence, and the few things that the plugin adds.

## A complete note

```markdown
# Chicken curry

A mild curry with coconut milk.

*dinner, chicken, one pot*

**4 servings**

---

- *500 g* chicken thighs
- *1 can* coconut milk
- salt

---

1. Cook the chicken thighs for 5 minutes.
2. Add the coconut milk. Cook for 15 minutes.
```

## The parts, in their sequence

| Part         | Form                                                                        | Necessary |
| ------------ | --------------------------------------------------------------------------- | --------- |
| Title        | A heading of level 1. It is the first block of the note.                    | Yes       |
| Description  | Text below the title.                                                       | No        |
| Tags         | One paragraph that is fully in italics, with commas between the tags.       | No        |
| Yield        | One paragraph that is fully in bold. Each yield has a number.               | No        |
| Rule         | A line `---`.                                                               | Yes       |
| Ingredients  | Lists. An item can start with its amount in italics.                        | No        |
| Instructions | All text after the ingredients. A second rule before this text is optional. | No        |

A heading between the ingredients starts a group, such as "Dry" and "Wet". So if your instructions start with a heading, write the second rule. Without it, the plugin reads that heading as a group.

## What the plugin permits more

- **Properties.** The note can have properties above the title. The plugin keeps your rating there.
- **A link as a name.** An ingredient can be a link to its food item: `*300 g* [[Pantry/Rice|rice]]`.
- **Preparation.** A callout of the type "prep" tells what you must do [before you cook](preparation.md).
- **The record.** The heading "Cooked" at the end of the note has one line for [each meal that you cooked](end-of-a-meal.md).

A link, a callout, and a heading are plain Markdown, so the note stays a correct recipe. The properties are the one exception: the RecipeMD format does not have them.

## Why a note is not a recipe

The recipe list shows each note that fails, with its reason:

- The first block is not a title.
- The note has no rule before the ingredients.
- The note has two paragraphs of tags, or two paragraphs of yields.
- A yield, or an amount in italics, has no number.
- An ingredient has no name.

## Further reading

- [Amounts](amounts.md): the forms of a number and the units that the plugin reads.
- [Steps](steps.md): how the plugin divides the instructions for Cook Mode.
