# Usage Flows

Date: 2026-10-02
Status: Draft for owner review.
Language: ASD-STE100 (Simplified Technical English).

This document describes how the owner uses the tool. The design of the screens and the data model starts from these flows.

Labels:

- **[Owner]**: The owner said this.
- **[Proposed]**: The author (Claude) added this. The owner must confirm it.

## 1. The rhythm

The owner uses the tool at three moments. **[Owner]**

| Moment              | Frequency                                                                            | Purpose                                                                       |
| ------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **Week session**    | One time each week                                                                   | Refresh the pantry. Select the meals for the week.                            |
| **Day check**       | One time each day, at any time. The owner thinks it will be the morning before work. | See the meals that are possible today. See the preparation that is necessary. |
| **Cook and update** | One time each day                                                                    | Cook a meal. Confirm it. The pantry updates.                                  |

The store visit comes after the week session. The pantry check must occur before the store visit. **[Owner]**

## 2. The week menu

This is the central idea of the plan. **[Owner]**

- The owner does not put a meal on a specific day.
- The owner selects a set of meals for the week. This document calls the set the **week menu**.
- The owner buys the ingredients for the full week menu.
- On each day, the owner selects one meal from the week menu.
- If a meal is not possible today (for example, the chicken is still frozen), the owner selects a different meal from the week menu.
- The week menu continues. A meal stays on it until the owner cooks it or removes it. There is no "end of the week". Each meal has the date when the owner added it.

Reason: a plan with fixed days fails when one day goes wrong. A week menu does not fail. It always has a different meal that is ready. **[Owner]** for the idea. **[Proposed]** wording.

## 3. Flow A: Week session

**Trigger:** The plan day of the owner. **[Owner]**

### Part 1: Pantry check

The owner makes the pantry in the tool agree with the real pantry. **[Owner]** ("fresh scan and verification of what I have in stock")

| Step | Action of the owner                                                                             | Action of the tool                                                                                        | Label                |
| ---- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------- |
| 1    | Starts the pantry check.                                                                        | Shows the items that it has a doubt about, each with the reason. The other items are in a closed group.   | [Proposed]           |
| 2    | Looks at the real items. Slides a row to the real amount. Does not touch a row that is correct. | Saves each change with the cause "corrected". The "more" button of a row has "used up" and "thrown away". | [Proposed]           |
| 3    | Scans an item that is not in the list.                                                          | Adds the item. A known barcode needs one tap.                                                             | [Owner] for the scan |
| 4    | Taps "The rest is correct".                                                                     | Saves the date of the check.                                                                              | [Proposed]           |

The tool has a doubt about an item in these conditions (the rules are in `src/lib/domain/doubt.js`): **[Proposed]**

- A weight or a volume that a meal used since the last look.
- A "have, low, or out" item that is low, or that 3 or more meals used since the last look.
- A perishable item, not in the freezer, with no new stock for 7 days.

Effect on the design: the pantry is correct one time each week. Thus pantry drift between two checks is acceptable. **[Proposed]**

### Part 2: Week menu

| Step | Action of the owner                                | Action of the tool                                                                                     | Label                                     |
| ---- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| 5    | Opens the week menu.                               | Shows the meals that remain from the last week, if there are some.                                     | [Proposed]                                |
| 6    | Adds a recipe to the week menu.                    | Shows the recipes. Shows which recipes the pantry can make now. Shows the "to try" recipes as a group. | [Owner] confirmed the status and "to try" |
| 7    | Does step 6 again until the week menu is complete. | Shows the number of meals on the week menu.                                                            | [Proposed]                                |
| 8    | Completes the week menu.                           | Makes the shopping list: all ingredients of the week menu minus the pantry stock.                      | [Owner] for the sequence                  |

"To try" is automatic. A recipe is "to try" when it has no cook session. The owner does not set a mark. **[Owner]**

## 4. Flow B: Store visit

**Trigger:** The week session is complete, and the shopping list has items. **[Owner]**

The list is the reason to go to the store. **[Owner]** It has all ingredients of each meal on the week menu, minus the items that are in stock. This prevents two problems that the owner has now: a second purchase of items that are in stock, and missing ingredients that make the owner skip a part of a recipe.

The steps below are **[Proposed]**.

| Step | Action of the owner                                               | Action of the tool                                   |
| ---- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| 1    | Opens the shopping list in the store.                             | Shows the items. Works with no connection.           |
| 2    | Marks an item as bought. Changes the quantity if it is different. | Adds the item to the pantry with the cause "bought". |
| 3    | Buys an item that is not on the list.                             | Lets the owner add it manually or with a scan.       |
| 4    | Wants an item that is not on the list. Searches the pantry.       | Shows if the item is in stock, and how much.         |

## 5. Flow C: Day check

**Trigger:** The owner opens the tool one time each day, at any time. **[Owner]**

| Step | Action of the owner                                                                                                       | Action of the tool                                                          | Label                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------- |
| 1    | Opens the tool.                                                                                                           | Shows the "Today" screen with the meals that remain on the week menu.       | [Owner]                 |
| 2    | Reads the list.                                                                                                           | Shows the meals in two groups: "ready to cook now" and "needs preparation". | [Proposed]              |
| 3    | Selects a meal for a later day and does its preparation. Example: moves the chicken from the freezer to the refrigerator. | Shows the preparation step and its lead time.                               | [Owner] for preparation |
| 4    | Marks the preparation step as done.                                                                                       | Saves the time. Moves the meal to "ready to cook now" after the lead time.  | [Proposed]              |

If the week menu is empty, or no meal is ready, the "Today" screen shows the recipes that the pantry can make now. **[Owner]** confirmed.

## 6. Flow D: Cook and update

**Trigger:** The owner cooks a meal. **[Owner]**

| Step | Action of the owner                                | Action of the tool                                                                                                           | Label   |
| ---- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1    | Selects a meal from "ready to cook now".           | Shows the recipe: ingredients, steps, source.                                                                                | [Owner] |
| 2    | Cooks.                                             |                                                                                                                              |         |
| 3    | Taps "Cooked".                                     | Subtracts the ingredients from the pantry. Makes the cook session record with the date. Removes the meal from the week menu. | [Owner] |
| 4    | Optional: gives a rating from 1 to 5 and a note.   | Saves them in the cook session record.                                                                                       | [Owner] |
| 5    | Optional: answers "Are there leftovers?" with yes. | Adds a "leftover" meal to the week menu. It is "ready to cook now" and uses no ingredients.                                  | [Owner] |
| 6    | Optional: taps "Undo".                             | Puts the quantities back. Puts the meal back on the week menu.                                                               | [Owner] |

For a reference recipe (no structured ingredients), step 3 makes the cook session record but does not change the pantry. The pantry check repairs the pantry. **[Proposed]**

## 7. Screens that these flows need

This list is **[Proposed]**.

| Screen        | Flows | Purpose                                                                                                             |
| ------------- | ----- | ------------------------------------------------------------------------------------------------------------------- |
| Today         | C, D  | Home screen. The meals that remain on the week menu: ready, or needs preparation. The answer when no meal is ready. |
| Pantry check  | A     | Check of the items that the tool has a doubt about. Scan.                                                           |
| Pantry        | A, B  | Full list, search, and fast edits between checks.                                                                   |
| Week menu     | A     | Add and remove the meals for the week.                                                                              |
| Recipes       | A, D  | List, detail, add, and edit.                                                                                        |
| Shopping list | A, B  | Items to buy. "Bought" action.                                                                                      |
| Data          | —     | Export and import.                                                                                                  |

## 8. Open points from the flows

1. Answered (2026-10-02): The store visit comes after the pantry check and the week menu. The two can occur on the same day. This is not important for the design.
2. Answered (2026-10-02): The day check can occur at any time. The owner thinks it will be the morning. The week menu removes the need for a fixed time.
3. Proposed (2026-10-02): The pantry check shows the items with a doubt first. The other items are in a closed group. The owner must test this.
4. Answered (2026-10-02): The week menu is one list. Each recipe has a meal type (breakfast, lunch, dinner). The "Today" screen and the week menu can filter by the type.
5. Answered (2026-10-02): The meal stays on the week menu until the owner cooks it or removes it. The week session shows the meals that remain.
6. Which meals must the owner cook first? Some ingredients (fresh fish) spoil before others (dry pasta).

## Related documents

- [vision.md](vision.md)
- [roadmap.md](roadmap.md)
- [open-questions.md](open-questions.md)
