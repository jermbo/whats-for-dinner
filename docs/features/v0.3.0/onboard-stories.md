---
title: Onboard stories
summary: "The user stories of pantry onboarding in version 0.3.0: six pieces of work, with the sequence in which they depend on each other."
parent: ../README.md
---

[Wiki](../../README.md) / [Features](../README.md) / Onboard stories

# Onboard stories

The first time you open the **Kitchen** tab in a new vault, the plugin guides folder setup, **places**, and the first **food item**. This page lists its user stories for version 0.3.0. Each story is one piece of work that one agent or one person can complete.

## The goal of the feature

You pick where **recipes** live, confirm the **Larder** tree, name where food is stored, choose the default **place** for new food, and add at least one **food item**. Then the four **parts** of the kitchen work as they do today.

The [spec](../../initiatives/pantry-onboarding/spec.md) has the scope that is agreed, and each line of it names its decision. The [glossary of the initiative](../../initiatives/pantry-onboarding/glossary.md) has **plugin home** and **Larder**.

## The stories

| Story                                                                                                      | Persona | Depends on        |
| ---------------------------------------------------------------------------------------------------------- | ------- | ----------------- |
| 1. [Use the Larder layout by default](onboard-use-the-larder-layout-by-default.md)                         | Writer  | Nothing           |
| 2. [Keep a list of places in the data file](onboard-keep-places-in-the-data-file.md)                        | Keeper  | Nothing           |
| 3. [Start setup and pick the recipes folder](onboard-start-setup-and-pick-recipes-folder.md)               | Keeper  | Stories 1 and 2   |
| 4. [Create the plugin home in setup](onboard-create-the-plugin-home-in-setup.md)                           | Writer  | Story 3           |
| 5. [Name places and choose Place for new food in setup](onboard-name-places-in-setup.md)                     | Keeper  | Stories 2, 3, and 4 |
| 6. [Add the first food and finish setup](onboard-add-first-food-and-finish-setup.md)                       | Keeper  | Story 5           |

The [personas](../../personas.md) page tells who the keeper and the writer are.

## The sequence of the work

A story can start when the stories that it depends on are done. This gives five steps. The stories of one step can be built at the same time.

| Step | Stories   | What you have after the step                                              |
| ---- | --------- | ------------------------------------------------------------------------- |
| 1    | 1 and 2   | Larder paths by default, and a place list that works outside onboarding.  |
| 2    | 3         | Setup replaces the four parts; recipes step; block when notes exist.      |
| 3    | 4         | The plugin home folders and meal plan note exist in the vault.            |
| 4    | 5         | Places and Place for new food are saved.                                  |
| 5    | 6         | Onboarding completes; the pantry has at least one food item.              |

Story 2 changes how [Add food](../v0.1.0/pantry-add-food.md) and [Filter the pantry](../v0.1.0/pantry-filter-the-pantry.md) use **places**. Update those stories when this work ships, if their criteria no longer match.

## Architecture pages

Each story updates wiki pages **before** its code, in the **Elevate** step of [implement](../../standards/workflow.md). The owner reads the page diff; then the builder writes code. Do not leave architecture for a doc-only pass at the end.

| Page | Stories that update it |
| ---- | ---------------------- |
| [Settings](../../architecture/settings.md) | 1: Larder default paths. 2: place list in the data file. 3: onboarding-complete flag. 4: plugin home and teardown (delete the home folder; recipes stay). 6: flag set when setup finishes. |
| [Pantry](../../architecture/pantry.md) | 2: UI uses the place list before rows exist. 5: onboarding places step (no new mechanism). |
| [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md) | 2: place list in the data file. 3: onboarding flag. |
| [Setup](../../architecture/setup.md) | 3 to 6: the setup flow, its steps, and the screen for a vault with notes. |
| [Glossary](../../glossary.md) | 4: **Larder** and **plugin home**, with links to the [initiative glossary](../../initiatives/pantry-onboarding/glossary.md). |

Story 6 updates [Features](../README.md) when you add a short “first run” paragraph there.

## What the vault needs

| The vault needs                                                                 | For stories |
| ------------------------------------------------------------------------------- | ----------- |
| An empty vault: no food, plan, or shopping notes at the configured paths        | 3 to 6      |
| The test vault, with food under `Pantry/` at the paths in settings today        | 3           |

For an empty vault, use a copy of the vault with no `Pantry/`, `Meal plan.md`, or `Shopping/` notes, or reset plugin data and paths after story 1 defaults apply.

## The form of a story

Each story has the form that the [user story](../../standards/user-story.md) page gives.

## Further reading

- [Workflow](../../standards/workflow.md): where the stories come from, and what occurs after them.
- [Decision log: pantry onboarding](../../initiatives/pantry-onboarding/decision-log.md): the reasons behind the spec.
