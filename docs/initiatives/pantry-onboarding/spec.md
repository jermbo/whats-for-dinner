---
title: "Spec: pantry onboarding"
summary: "The scope that is agreed for first-run onboarding: the Larder layout, places in the data file, and the first food in the pantry."
parent: decision-log.md
status: agreed
---

[Wiki](../../README.md) / [Decision log: pantry onboarding](decision-log.md) / Spec: pantry onboarding

# Spec: pantry onboarding

This page has the scope of the work, with no reasons. Each line names the decision of the [decision log](decision-log.md) that it comes from, and the reason is there.

## The problem

A new cook opens the **Kitchen** tab in a vault that has no plugin notes yet. The plugin needs folder paths, a **meal plan** note, and **place** names before **Plan**, **Shop**, and **Cook Mode** can work. Today the cook must guess paths in Obsidian settings and type every **place** on the first **food item**, with no guided first run.

## The solution

The first time the cook opens the **Kitchen** tab, the kitchen shows a setup flow instead of the four **parts**. The cook picks a **recipes folder** outside the **plugin home**, confirms the **Larder** tree, edits **places**, and adds at least one **food item** from a staple checklist or the add form. When that is done, the flag in the **data file** is set and the normal pantry, recipes, plan, and shop screens appear.

An example: the cook keeps `Recipes/` at the vault root, accepts **Larder**, renames `Fridge` to `Kitchen fridge`, removes `Freezer`, adds `Garage freezer`, taps rice on the checklist, and lands on the **Pantry** part with one note under `Larder/Pantry/`.

## In scope

1. The **Kitchen** tab starts onboarding the first time it opens, until onboarding is complete (decisions 3 and 12)
   - a. Until then, the kitchen shows the setup flow and not the four **parts** (decisions 3 and 12)
   - b. The cook cannot skip or defer setup (decision 12)
   - c. The **data file** has a flag that records when onboarding is complete (decision 3)
2. The sequence of onboarding is recipes folder, then the **plugin home** tree and settings, then **places**, then the first **food item** (decision 18)
   - a. The recipes step selects or creates a **recipes folder** beside the **plugin home**, not under it (decisions 7 and 18)
   - b. The folder step can change the default name **Larder** before anything is created (decision 9)
   - c. The folder step creates the canonical tree under the **plugin home**, writes the path settings, and creates an empty **meal plan** note (decisions 5, 10, 11, and 19)
   - d. The **places** step shows `Kitchen pantry`, `Fridge`, and `Freezer` as defaults and makes clear the list is editable (decision 16)
      - i. The cook can rename, remove, or add **places** with any name, and pick optional suggestions such as `Downstairs pantry`, `Secondary pantry`, or `Garage freezer` (decision 16)
      - ii. The cook continues only when at least one **place** remains; the list can be one **place** or many (decision 16)
   - e. On the **places** step, the cook chooses **Place for new food** from the list; the step explains the setting, pre-selects `Kitchen pantry` when that name is still present, and saves the choice to settings (decision 20)
   - f. The first **food item** step offers an optional checklist of common staples, with an amount or skip per item, and the existing add form for anything else (decisions 6 and 15)
      - i. Which staples appear and how that step is laid out (not confirmed)
3. Onboarding is complete when folder paths are set, the **place** list has at least one name, and the pantry has at least one **food item**; the checklist need not be finished (decisions 15 and 16)
4. The **data file** keeps a list of **place** names. Chips, filters, put away, and add food use that list even when no **row** uses a **place** yet (decision 2)
5. The default path settings in code match the canonical **Larder** tree before the wizard runs (decision 17)
6. **Places** and folder paths are editable in the in-kitchen setup flow and in the Obsidian plugin settings tab (decision 4)
7. Onboarding applies the canonical layout when the vault starts with no plugin notes: it creates the **plugin home** tree and does not move existing notes (decisions 11 and 14)
8. If the vault already has plugin notes (food, plan, or shopping at the configured paths) when the **Kitchen** tab opens, the greenfield wizard does not run (decision 21)
   - a. The screen the cook sees instead (not confirmed)

## Out of scope

1. New ongoing “keep the pantry active” features beyond v0.1 keeper flows (decision 1)
2. **Places** derived only from **rows** in **food item** notes, with no list in the **data file** (decision 2)
3. Onboarding that starts only in Obsidian settings, or a **Kitchen** tab that works before setup (decision 3)
4. Folder paths and **places** editable in only one of the wizard or settings (decision 4)
5. Vault setup that is only **places**, with no **plugin home** layout (decision 5)
6. First fill that is only the empty message and the plus button (decision 6)
7. **Recipes** under the **plugin home**, or a parent folder named `What's for Dinner` with **recipes** inside (decisions 5 and 7)
8. **Food item** notes loose in the **plugin home** with no `Pantry/` child (decision 10)
9. Legacy root-level `Pantry`, `Shopping`, and `Meal plan.md` as a supported layout after 1.0 (decision 11)
10. “Set up later” with a banner while the four **parts** stay usable (decision 12)
11. The plugin deleting folders when it is disabled (decision 13)
12. Moving or migrating notes from old folders into **Larder** during onboarding (decisions 11 and 14)
13. Onboarding complete after folders and **places** only, with no **food item** yet (decision 15)
14. A blank **places** list when the step first opens, a long fixed starter list the cook must trim, requiring exactly three **places**, or requiring more than one **place** (decision 16)
15. Root-level default paths in code until the wizard runs (decision 17)
16. **Places** before folders, or creating **Larder** before the **recipes folder** step (decision 18)
17. Folder step that only changes settings and creates folders on first use (decision 19)
18. **Place for new food** set with no choice on the **places** step, fixed to `Kitchen pantry`, fixed to `Kitchen`, or taken as the first name in the list with no choice (decision 20)
19. Always running onboarding and overwriting settings when plugin notes already exist (decision 21)
20. A **branding** note in the vault that explains **Larder** (decision 9)
21. Reworking the dev test vault to match the canonical layout (decision log introduction)

## What changes in the system

Architecture pages that change:

- [Settings](../../architecture/settings.md): default folder paths under **Larder**, **Place for new food**, the **place** list in the **data file**, the onboarding-complete flag, and how teardown works (delete the **plugin home** folder; **recipes** stay).
- [Pantry](../../architecture/pantry.md): **places** come from the **data file** list as well as from **rows**.
- [Notes of the kitchen](../../architecture/notes-of-the-kitchen.md): what lives in the **data file** besides settings and skipped suggestions.
- The wiki [glossary](../../glossary.md) and [Glossary: pantry onboarding](glossary.md).

Notes and data that get a different form:

- **The data file** gets a list of **place** names and a field for onboarding complete.
- **The meal plan note** is created empty at `Larder/Meal plan.md` (or the chosen **plugin home** name) during the folder step.
- **Food item notes** are created under `Larder/Pantry/` during first fill.

## How you test it

Checks that need the phone:

1. A vault with no plugin notes: the first open of the **Kitchen** tab shows the setup flow, not the four **parts**, and there is no way to reach **Plan** or **Shop** until onboarding finishes.
2. After onboarding completes, the **Kitchen** tab shows the four **parts**, and at least one **food item** appears in the **Pantry** part.
3. After the folder step, Obsidian shows the **plugin home** folders and an empty **meal plan** note at the paths in settings.
4. Before any **row** exists, add food and put away show **place** chips from the list set in the **places** step; continuing with a single **place** works, and **Place for new food** matches what the cook chose on that step.
5. A vault that already has plugin notes at the configured paths: opening the **Kitchen** tab does not run the greenfield wizard (wording not confirmed).
6. The staple checklist: tap items, set or skip amounts, and see matching notes under the pantry folder.

Rules that are worth an automatic test, each with the place where a test sees the behaviour from outside:

1. **The place list.** Settings with **places** and no **food item** notes go in. Chips and filters for add food and put away use those names.
2. **Onboarding complete.** Settings, paths, **places**, and pantry notes go in. The onboarding-complete flag and the rule “at least one **food item**” come out.
3. **Default paths.** A fresh settings object from code goes in. Paths match the canonical **Larder** tree (decision 17).

## Further reading

- [Glossary: pantry onboarding](glossary.md): **plugin home** and **Larder**.
- [Decision log: pantry onboarding](decision-log.md): the reasons for each line of this page.
