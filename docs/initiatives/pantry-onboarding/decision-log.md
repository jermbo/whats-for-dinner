---
title: "Decision log: pantry onboarding"
summary: "The options and the decisions for the first run of the plugin: places, vault setup, and the first food in the pantry."
parent: ../../README.md
---

[Wiki](../../README.md) / Decision log: pantry onboarding

# Decision log: pantry onboarding

A new vault has no pantry notes and no places that the screens can show. The shopping-list initiative left **the first fill of the pantry** and **the setup of a vault** for a later discussion. This page is that discussion: how the plugin welcomes a new cook on a **greenfield vault**, how they name where food lives, and how they get the first items in with little work. Onboarding does not migrate notes from old paths; reworking the dev test vault to match the canonical layout is separate from this user flow.

## What the plugin does today

| Topic | Today |
| ----- | ----- |
| Places in the UI | The kitchen builds the list from every `Place` cell in every food item note. It is sorted A to Z. There is no list in the data file. |
| Place for new food | One setting, `Place for new food`, starts as `Kitchen`. Put away proposes it when an item has no row yet. The Obsidian settings tab suggests names from the derived list only. |
| Empty pantry | The Pantry part shows: "The pantry is empty. Add your first food with the plus button." |
| Add food | The form "Add to pantry" needs a name and a place. Place chips come from the derived list. With no rows yet, only the field "A new place" shows. Each new place is typed. |
| Settings | Folder paths, look, Cook Mode, use soon, and low line live in the Obsidian plugin settings tab. There is no in-kitchen settings screen. |
| Onboarding flag | The data file has no "onboarding complete" or similar field. |
| Test vault | Thirty-six food items. Six place names appear in notes: `Downstairs pantry`, `Freezer`, `Kitchen`, `Kitchen fridge`, `Kitchen pantry`, and `Outside fridge`. |
| Deferred work | [Shopping-list decision log](../shopping-list/decision-log.md) items under "What this work does not include": first fill (1) and vault setup (5). |

## Decisions

1. **This initiative is first-run only.** Ongoing upkeep stays on the keeper flows that v0.1 already has: the bar, "used up", cook, and put away. The reason: onboarding has one arc; maintenance is already specified. An option that was rejected: new "keep the pantry active" features in the same initiative.
2. **The data file keeps a list of place names.** The UI uses that list for chips, filters, put away, and add food, even when a place has no row yet. Rows in food item notes still hold where each amount lives. The reason: the cook names storage before any food exists. An option that was rejected: places derived only from rows, as today.
3. **Onboarding starts the first time the user opens the Kitchen tab**, until the user finishes it. A flag in the data file records when onboarding is done. Until then, the kitchen guides setup instead of the four parts. The reason: wrong folders or note shapes break the plugin; setup is not optional. Options that were rejected: start in Obsidian settings only, and skip onboarding to use the kitchen first.
4. **Places and folders are editable in two places.** An in-kitchen first-run flow sets them up; the Obsidian plugin settings tab edits them later at the desk. The reason: the wizard fits the phone; power users already use settings. Options that were rejected: in-kitchen only, or settings only with no wizard.
5. **Onboarding includes vault setup, not only places.** Plugin-owned notes are grouped under a [plugin home](glossary.md#plugin-home) so an existing vault is not littered at the root. Recipes stay outside that group. A parent named `What's for Dinner` with Recipes inside is rejected. Today defaults are root-level `Pantry`, `Shopping`, and `Meal plan.md`, as in the test vault. This decision changes the page [Settings](../../architecture/settings.md) when the spec is written.
6. **After places, first fill offers an optional checklist of common staples.** The user taps items to add and can set an amount or skip. The reason: a calm moment at the desk can batch-add food; add food still handles anything else. An option that was rejected: only the empty message and the plus button.
7. **Recipes never live under the plugin home.** Onboarding selects or creates a recipes folder beside the home, such as an existing `Recipes/` folder. The reason: recipe notes must stay if the user deletes plugin-owned data. An option that was rejected: recipes as a child of the plugin home.
8. **The plugin home holds only food items, shopping, items of your own, and the meal plan note.** Receipts stay in the shopping folder. The reason: one folder is the unit of removal. An option that was rejected: mixing other vault content into the home.
9. **The default name of the plugin home is `Larder`.** Onboarding can change it before the folders are created. The reason: the word fits stored food, it matches the accent name in settings today, and it is not the same word as **Kitchen** (the tab) or **Pantry folder** (food notes). Options that were rejected: `What's for Dinner`, `Meal planner`, and using **Pantry** as the top-level folder name. A short **branding** note that tells users what “Larder” means in the vault is not part of this initiative; it is near-future work.
10. **The canonical folder tree under `Larder` is** `Larder/Pantry/` for food items, `Larder/Shopping/` for trips and receipts, `Larder/Shopping/Items/` for items of your own, and `Larder/Meal plan.md` for the week, with the recipes folder outside (for example `Recipes/`). Onboarding writes these paths into the settings. The reason: one known layout before 1.0. An option that was rejected: food notes loose in the home folder with no `Pantry/` child.
11. **Onboarding applies the canonical layout for a vault that starts with no plugin notes.** It creates the `Larder/` tree and writes the settings paths. The reason: one schema before 1.0; post-1.0 work reads the same paths. Options that were rejected: keeping legacy root-level paths as a supported layout, and moving existing notes during onboarding (migration is out of scope).
12. **The user cannot skip onboarding.** The kitchen stays in the setup flow until onboarding is complete. The reason: folders, places, and structure must be correct before Plan, Shop, and Cook Mode run. An option that was rejected: “Set up later” with a banner and the four parts usable.
13. **Removing plugin-owned notes means deleting the `Larder/` folder** (or the plugin home if the user renamed it). Recipe notes in the recipes folder stay. The plugin does not delete folders on disable. The reason: recipes outlive pantry data. An option that was rejected: no documented teardown story.
14. **Onboarding does not migrate notes.** The flow assumes the user creates plugin data from scratch. Moving food or shopping notes from old folders is not part of onboarding. The reason: first-run is greenfield; the dev test vault is not the model user journey. An option that was rejected: a confirm step that moves notes into `Larder/`.
15. **Onboarding is complete when folder paths are set, the place list has at least one name, and the pantry has at least one food item.** The staple checklist can add that item but need not be fully filled. The reason: an empty pantry gives a false “done”; one row proves the note shape works. An option that was rejected: complete after folders and places only, with no food yet.
16. **The places step shows three built-in defaults:** `Kitchen pantry`, `Fridge`, and `Freezer`. The screen makes clear that each name can change and that the list can grow or shrink. The user can rename, remove, or add **places** with any name. The step can offer optional suggestions for extras, such as `Downstairs pantry`, `Secondary pantry`, or `Garage freezer`. The user continues only when at least one **place** remains; there is no upper limit. The reason: most kitchens start from pantry, fridge, and freezer, but some homes need one spot and others need many. An option that was rejected: a blank list on first open. An option that was rejected: a long fixed starter list from the test vault that the user must trim down. An option that was rejected: requiring exactly three **places**, or more than one.
17. **The default values in code for folder paths match the canonical `Larder/` tree**, so a new install and the settings page agree with onboarding before the wizard runs. The reason: one schema in code and in the vault. An option that was rejected: root-level defaults until onboarding runs.
18. **The sequence of onboarding is** recipes folder, then creation of the `Larder/` tree and settings, then places, then the first food (checklist or add form). The reason: recipes stay outside the home; paths must exist before notes are written. An option that was rejected: places before folders, and `Larder/` before the recipes path.
19. **The folder step creates the empty `Larder/` folders and an empty `Meal plan.md`.** The reason: the vault matches the schema before the user adds food. An option that was rejected: only change settings and create folders on first use.
20. **The places step sets “Place for new food”.** The cook chooses one name from the place list on that step. The screen states what the setting is for: put away and add food propose it when a food item has no row yet. When `Kitchen pantry` is still in the list, it is pre-selected; otherwise the cook must pick before they continue. The Obsidian plugin settings tab can change it later. The reason: the usual spot differs by home, and a hidden default fails when the cook renames or removes `Kitchen pantry`. An option that was rejected: setting `Kitchen pantry` with no choice on the step. An option that was rejected: `Kitchen`, and the first name in the list with no choice.
21. **If the vault already has plugin notes** (food, plan, or shopping at the configured paths) when the kitchen opens, the greenfield wizard does not run. The screen tells the user to open settings instead. The reason: onboarding is for scratch; there is no migration flow. An option that was rejected: always run onboarding and overwrite settings.

## Choices that are not confirmed

1. **The list of staples on the checklist** and the layout of that step (prototype if needed).
2. **Branding copy** that explains **Larder** in the product and in the vault tree.
3. **The exact screen when plugin notes already exist** (wording and whether onboarding can resume if the flag is unset).

## Further reading

- [Workflow](../../standards/workflow.md): the step of the work that this page is in.
- [Settings](../../architecture/settings.md): what is in the data file today.
- [Pantry](../../architecture/pantry.md): a place is a row in a food item note.
