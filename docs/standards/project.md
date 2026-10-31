---
title: Project facts
summary: "The facts of this project that the workflow skills read: the pages, the commands, and where the owner tests."
parent: workflow.md
updated: 2026-10-31
---

[Wiki](../README.md) / [Workflow](workflow.md) / Project facts

# Project facts

The workflow skills hold the method, and they are the same in each project. This page holds the facts of this project. Each skill reads it before its first step.

## The product

| Fact            | Value                                                    |
| --------------- | -------------------------------------------------------- |
| Name            | What's for Dinner                                        |
| What it is      | A plugin for Obsidian that makes your vault a kitchen.   |
| The word for it | "the plugin". Its screen is "the kitchen".               |

## Pages

| Page                  | Path                                      |
| --------------------- | ----------------------------------------- |
| Vision                | `docs/vision.md`                          |
| Glossary              | `docs/glossary.md`                        |
| Personas              | `docs/personas.md`                        |
| Initiatives           | `docs/initiatives/<slug>/`                |
| Stories               | `docs/features/<version>/`                |
| What the product does | `docs/features/README.md`                 |
| Architecture          | `docs/architecture/`                      |
| Page rules            | `docs/standards/documentation-standards.md` |
| Code rules            | `docs/standards/code-standards.md`        |
| Test rules            | `docs/standards/unit-tests.md`            |

## Forms

| Form         | Path                              |
| ------------ | --------------------------------- |
| Decision log | Skill                             |
| Spec         | `docs/standards/spec.md`          |
| User story   | `docs/standards/user-story.md`    |
| Pull request | `docs/standards/pull-request.md`  |

## Models

| Model      | Path                                                |
| ---------- | --------------------------------------------------- |
| Initiative | `docs/initiatives/one-bar-for-each-part/`           |
| Story      | `docs/features/v0.1.0/pantry-correct-an-amount.md`  |
| Story list | `docs/features/v0.1.0/pantry-stories.md`            |

## Commands

| Command | Value           |
| ------- | --------------- |
| Check   | `npm run check` |
| Test    | `npm test`      |
| Dev     | `npm run dev`   |

## Versions

| Fact           | Value                                                            |
| -------------- | ---------------------------------------------------------------- |
| Branch form    | `feature/v<version>`                                             |
| Version folder | The version in the branch name: `feature/v0.2.0` gives `v0.2.0`. |

## Where the owner tests

| Fact        | Value                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------- |
| Device      | The phone, in Obsidian. The plugin goes to the phone with Obsidian Sync.                       |
| Test data   | The notes of `test-vault/`: the foods, their amounts, and their places.                        |
| Check lists | One check list for each set of stories, at the root of `test-vault/`. Old lists go to `test-vault/_old/`. |

## The persona test

- The shopper has one hand and no keyboard. Does the design ask the shopper to type?
- The keeper counts food at a shelf. Is each entry one tap?
- The cook has dirty hands and eyes on the pan. Does the design ask the cook to read a paragraph?

## Merge danger

| Fact         | Value                                                                                                     |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| One-way door | A change in the form of a note or of the data file. The vault has real notes, and the plugin does not convert them. |
| Blast radius | A different part of the kitchen, a narrow phone, and the vault on the second device.                       |

## UI prototypes

| Fact           | Value                                                                        |
| -------------- | ---------------------------------------------------------------------------- |
| Design tokens  | The `--wfd-*` variables of the [look](../architecture/look.md).              |
| Shared parts   | `src/ui/parts/`                                                              |
| Variant folder | A folder `prototype/` next to the component that the variant replaces.       |
| Dev-only flag  | `import.meta.env.MODE === 'development'`. That is the mode of `npm run dev`.  |

## Packages

| Fact          | Value                                          |
| ------------- | ---------------------------------------------- |
| A new package | Ask the owner first, with the reason.          |

## Further reading

- [Personas](../personas.md): the five moments of the cook, from which the persona test comes.
