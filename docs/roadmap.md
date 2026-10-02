# Roadmap

Date: 2026-10-02
Status: Draft for owner review.
Language: ASD-STE100 (Simplified Technical English).

This document divides the work into three stages. [vision.md](vision.md) is the reference for each decision.

All scope decisions in this document are proposals by the author (Claude), unless a line has the label **[Owner]**. The author did not test the technical items. [research.md](research.md) gives the sources.

| Stage | Purpose |
|---|---|
| **MVP** | The minimum that lets the owner start a real test of the core loop. |
| **v1** | Fast follows. They make the loop easier and smarter. |
| **v2** | The destination. Family use, more recipe sources, and more automation. |

## 1. MVP: the core loop works on one phone

### 1.1 Goal

The owner can plan a meal, shop, confirm that the meal was cooked, and see a correct pantry. All of this works with no connection.

### 1.2 Scope

| Area | Item | Note |
|---|---|---|
| Foundation | Astro with static output on Vercel. No adapter, no server routes, no login. | |
| Foundation | Installable PWA with an offline application shell. | The first task is a test of the PWA tooling. `@vite-pwa/astro` does not support Astro 7 (research, section 8.2). |
| Foundation | IndexedDB for all data. **[Owner]** | The proposal is Dexie as the wrapper. |
| Foundation | Request for persistent storage at the first start. | The browser can delete best-effort data (research, section 8.3). |
| Foundation | Each record has a unique ID and a "last changed" time. | Makes later sync possible with no data migration. |
| Ingredients | One list of ingredients. Each ingredient has a name, a store category, a default unit, and a "perishable" mark. | Recipes and the pantry point to this list. |
| Ingredients | One unit for each ingredient. Recipes and the pantry use that unit. There is no unit conversion. **[Owner]** | The proposed units are grams (the default), milliliters for liquids, and a count for items such as eggs. The owner prefers weight. |
| Ingredients | Two tracking modes: quantity (500 g, 6 eggs) or state (have, low, out). | State mode is for staples such as salt and oil. |
| Recipes | Manual entry: name, servings, steps as text, and structured ingredients (ingredient, quantity, unit). **[Owner]** for manual entry. | Structured ingredients are necessary for automatic deduction. |
| Recipes | "In rotation" mark. **[Owner]** | |
| Recipes | "To try" status. It is automatic: a recipe with no cook session is "to try". The week menu screen shows these recipes as a group. **[Owner]** | From the owner's problem: without a plan, the owner cooks the same five recipes. |
| Pantry | Search in the pantry, for use in the store: "Do I have this?" **[Owner]** accepted. | From the owner's problem: buys items that are already in stock. |
| Recipes | Source of the recipe: a URL, or a book name and a page. **[Owner]** | A text field on each recipe. |
| Recipes | Reference recipe: a recipe with a name and a source, but with no structured ingredients. **[Owner]** | The ingredients are optional on each recipe. A reference recipe can go on the plan. It cannot update the pantry automatically. The owner can add the ingredients later. |
| Pantry | List of items with quantity or state. | |
| Pantry | Add an item manually. | |
| Pantry | Fast edit: plus and minus buttons, a state switch, and a "ran out" action. **[Owner]** ("a couple clicks") | |
| Pantry | Barcode scan to add an item. **[Owner]** ("the barcode is key") | Uses the camera and the Barcode Detection API. A test on the owner's phone is necessary. A browser without this API needs a different library. |
| Pantry | Product lookup for a scanned barcode. | Uses Open Food Facts. Needs a connection for a new product. Fills in the product name and the package size when the data is available. |
| Pantry | Link from a scanned product to an ingredient ("Brand X spaghetti 500 g" is "spaghetti, 500 g"). | The owner confirms the link one time for each product. The tool remembers it. A second scan of the same product is one tap and works offline. |
| Pantry | Scan with no connection, or a product that the lookup does not find. | The owner enters the item manually one time. The tool saves the barcode with the item. |
| Plan | Week menu: a set of meals for the week. A meal has no fixed day. **[Owner]** | See [flows.md](flows.md), section 2. The week menu is one list. A meal stays on it until the owner cooks it or removes it. Each meal has the date when the owner added it. |
| Recipes | Each recipe has a meal type: breakfast, lunch, or dinner. The "Today" screen and the week menu can filter by the type. **[Owner]** | The owner sets the type one time on the recipe. |
| Plan | "Today" home screen: the meals that remain on the week menu, in two groups: "ready to cook now" and "needs preparation". Each meal has a "Cooked" button. | The owner selects the meal on the day. The two groups are a proposal. |
| Cook | "Cooked" confirmation subtracts the ingredients from the pantry automatically. **[Owner]** | A state-mode ingredient does not change. |
| Cook | Each confirmation makes a cook session record: recipe, date, optional rating from 1 to 5, optional note. **[Owner]** for rating and note. | The rating and the note are optional. The confirmation stays one tap. |
| Cook | Leftovers: the "Cooked" confirmation has an optional question, "Are there leftovers?" If yes, the tool adds a "leftover" meal to the week menu. **[Owner]** | A leftover meal is "ready to cook now". It uses no ingredients. "Cooked" on it makes a record but does not change the pantry. |
| Cook | Undo for "Cooked". It puts the quantities back and puts the meal back on the week menu. **[Owner]** | |
| Cook | If a recipe needs more than the pantry has, the quantity stops at zero. The tool shows no error. **[Owner]** | |
| Pantry | "Used" and "thrown away" actions on a pantry item. **[Owner]** for "thrown away". | "Thrown away" lets the tool measure waste. |
| Pantry | A record of each pantry change with its cause: bought, cooked, used, corrected, thrown away. **[Owner]** | Data for later insights. The undo also uses it. |
| Shop | Shopping list: ingredients of the meals on the week menu minus the pantry stock. | |
| Shop | Add an item to the list manually. | |
| Shop | Mark an item as bought. The item goes into the pantry. | |
| Data | A defined JSON format with a version number. It has one section for each data type: ingredients, recipes, pantry, plan, cook sessions. **[Owner]** ("focus on what is being exported and imported") | Design this format first. It is the contract between devices now and with a server later. |
| Data | Full backup: export all data to one file. An import of a full backup replaces all data on the device. **[Owner]** | |
| Data | Recipe export: export only the recipes, with the ingredients that they use. An import adds new recipes and updates changed recipes. It does not change the pantry, the plan, or the cook sessions. **[Owner]** | This lets the owner type recipes on the desktop and move them to the phone. The "add and update" rule is a proposal. |
| Data | Show the date of the last full backup. | The device has the only copy of the data. The owner accepts this risk for now. |
| Prepare | A recipe can have preparation steps with a lead time, for example "Move the chicken from the freezer to the refrigerator, 1 day before". **[Owner]** confirmed. | From the owner's problem: frozen chicken at 18:00. |
| Prepare | The "Today" screen shows the preparation step for each meal that needs one. The owner marks the step as done. The meal becomes "ready to cook now" after the lead time. **[Owner]** confirmed the preparation on the "Today" screen. | The owner opens the tool one time each day. The MVP sends no reminders. The "done" mark is a proposal. |
| Plan | No meal is ready, or the week menu is empty: the "Today" screen shows the recipes that the pantry can make now. **[Owner]** confirmed. | The "Can I make this?" status is in the MVP for this function. |
| Pantry | Pantry check: a fast check of each pantry item by location, with "correct", a quantity change, or "gone". **[Owner]** for the weekly refresh. | Part of the week session. See [flows.md](flows.md), Flow A. The steps of the check are a proposal. |
| Pantry | Each pantry item has a location: pantry, refrigerator, or freezer. | The pantry check and the preparation steps use it. **[Owner]** accepted. |
| Pantry | In the pantry check, a weight item has fast choices ("full", "half", "almost empty", "gone") in addition to an exact number. **[Owner]** accepted. | The owner cannot see the exact weight of an open package. |

### 1.3 Not in the MVP

Ingredient overlap, recipe import, due dates, unit conversion, sync, and reminders.

### 1.4 The MVP is complete when

1. The owner installs the PWA on an Android phone.
2. The owner does the full loop one time with the phone in airplane mode.
3. The owner adds a packaged item with a barcode scan. A second scan of the same item needs one tap.
4. An export from the phone imports correctly on a desktop browser.

### 1.5 Build sequence

The owner wants to build fast, use the result, report back, and iterate. **[Owner]** In earlier attempts, the owner spent much time on a design and then did not like the result.

Thus the MVP is not one large delivery. It is a sequence of small slices. Each slice goes to the phone of the owner. The owner uses it and reports. The report can change all slices that follow. The sequence and the content of the slices are a proposal.

| Slice | Content | What the owner can feel |
|---|---|---|
| 0 | Astro static site on Vercel. Installable PWA. Works offline. IndexedDB. | The tool installs on the phone and opens with no connection. |
| 1 | Recipes (manual entry, source, meal type). Week menu. "Today" screen. "Cooked" with rating and note. Undo. | The daily loop: open, select, cook, confirm. No pantry yet. |
| 2 | Ingredients with one unit. Pantry with fast edits, locations, "used", and "thrown away". "Cooked" subtracts from the pantry. Full backup export and import. | "Cooked means deducted." |
| 3 | Pantry check. Shopping list from the week menu minus the pantry. "Bought" action. Pantry search. | The week session and the store visit. |
| 4 | Barcode scan with product lookup and the link to an ingredient. | A scan in the pantry check and in the store. |
| 5 | Preparation steps with a lead time. "Ready to cook now" and "needs preparation". The answer when no meal is ready. Leftovers. | The 18:00 problem. |
| 6 | Recipe export and import. "To try" group. "In rotation" mark. | Recipes typed on the desktop. New recipes on the menu. |

Rules for each slice:

1. The slice is usable on the phone when it is complete.
2. The owner uses it before the next slice starts, when this is possible.
3. The documents change after each report. A decision in this document is not final until the owner used the function.

### 1.6 If the MVP is too large

Remove items in this sequence: the "in rotation" mark, then manual items on the shopping list. Do not remove an item of the core loop. Do not remove the barcode scan, the rating, or the note. The owner said that these are necessary.

## 2. v1: fast follows

### 2.1 Goal

The loop needs less work, and the plan uses the pantry and shared ingredients.

### 2.2 Scope

The sequence in the table is the proposed build sequence.

| # | Area | Item | Note |
|---|---|---|---|
| 1 | Cook | Adjust on confirmation: change servings, remove an ingredient that was not used, replace an ingredient. | The default stays one tap. |
| 2 | Plan | "Cook first" sequence: the week menu shows first the meals with ingredients that spoil soonest. | Needs a shelf life for each ingredient. |
| 3 | Plan | A meal that stays on the week menu at the end of the week: its perishable ingredients get a "use soon" mark. | |
| 4 | Recipes | Cook history on each recipe: all notes, average rating, date of the last cook. **[Owner]** for notes and rating. | |
| 5 | Recipes | More session data: "cook again?" mark and changes made. | Options that the owner asked for. Not confirmed. |
| 6 | Plan | Sort recipes by pantry match. | The "Can I make this?" status is in the MVP. |
| 7 | Plan | Overlap sort: show the recipes that share perishable ingredients with the plan and the pantry. **[Owner]** for the overlap goal. | |
| 8 | Plan | "Lonely ingredient" warning: only one planned meal uses a perishable ingredient that you must buy. | |
| 9 | Plan | Rotation suggestions: recipes in rotation that were not cooked recently, with good ratings first. | |
| 10 | Shop | Sort the list by store category. Combine equal items. | |
| 11 | Shop | Staples in the "low" or "out" state go on the list automatically. | |
| 12 | Recipes | Scale a recipe by servings. | |

### 2.3 v1 is complete when

1. The plan screen shows which recipes use the items that are in the pantry.
2. The plan screen shows a warning for a perishable ingredient that only one meal uses.
3. The owner used the tool for four weeks in sequence (vision, section 7).

## 3. v2: the destination

### 3.1 Goal

The family uses the tool together. Recipes come from more sources. The tool does more of the plan work.

### 3.2 Scope

There is no sequence in this table. Real use in v1 gives the sequence (vision, principle 6).

| Area | Item | Note |
|---|---|---|
| Family | One shared household: login, a server database, and sync between devices. **[Owner]** ("we can grow into that") | Research, section 8.4, gives the options. This is the first item that needs a server. |
| Family | Rules for changes that two persons make to the same item while offline. | |
| Recipes | Import from a web page. **[Owner]** | Needs a server route and an ingredient parser (research, section 8.6). This item can move to v1 if the owner wants it sooner. It needs only one server function, not a database. |
| Recipes | Search in a public recipe database. **[Owner]** | License terms are a limit (research, section 8.6). |
| Recipes | Photos for recipes and cook sessions. | |
| Plan | Remainder list: the unused part of each purchase, with recipes that use it. | Needs purchase sizes for each ingredient. |
| Plan | Automatic week: the tool proposes a full week with the smallest waste. | |
| Plan | Reusable menus (a saved week). | |
| Cook | Batch cooking: cooked food is a pantry item with portions and a location. A frozen portion needs a preparation step. | The MVP has only leftovers as a meal on the week menu. |
| Pantry | Due dates and a "use first" sort. | |
| Pantry | Minimum stock amounts. | |
| Pantry | Unit conversion between recipe units and purchase units. | |
| Health | Support for the "healthy" goal. | The definition is open (vision, section 8). |
| Reminders | A reminder to cook or to confirm a meal. | Web push needs a server. Not verified. |
| Devices | iPhone and iPad support. | Safari has storage limits (research, section 8.3). |

## 4. Decisions

### 4.1 Confirmed by the owner (2026-10-02)

1. The barcode scan is in the MVP.
2. The rating and the note are in the MVP. They give data for later insights.
3. The MVP plans all meals, not only dinner. The week menu is one list. Each recipe has a meal type (breakfast, lunch, dinner), and the screens can filter by it.
4. Recipe import from a web page is in v2.
5. The recipe source (URL, or book and page) and reference recipes are in the MVP.
6. Preparation steps with a lead time, preparation on the "Today" screen, and the "no plan" answer are in the MVP.
7. The MVP follows the rhythm in [flows.md](flows.md): a week session, a day check, and cook and update.
8. The plan is a week menu. A meal has no fixed day. The owner selects the meal on the day.
9. The pantry check and the week menu come before the store visit.
10. "To try" is automatic for a recipe with no cook session.
11. Each ingredient has one unit. Grams are the default.
12. The five defaults: stop at zero, undo, fractions, a record of pantry changes with the cause, and a "thrown away" action.
13. Leftovers are a meal on the week menu. Batch cooking is in v2.
14. The week menu continues. A meal stays until the owner cooks it or removes it.
15. The seven defaults: the "used" action for food that is not a recipe, the owner decides the detail of each ingredient, a location for each pantry item, the pantry check shows all items by location, fast choices for weights, the pantry search, and a recipe form for desktop and phone.
16. Build in small slices. Use each slice. Report. Iterate.

### 4.2 Open

1. Can a recipe have more than one meal type? Is "snack" a type?
2. The proposal for the IndexedDB wrapper is Dexie.
3. The UI framework for the interactive screens is not selected.
4. Fresh produce usually has no barcode. The owner adds these items manually or from the shopping list.
5. The definitions in [open-questions.md](open-questions.md), Group 3: "healthy", the target number of cooked meals, the household size, "snack", and the number of stores. They do not stop the build. Real use gives the answers.

### 4.3 Rejected

1. A calendar file of the week plan. The owner said to skip it (2026-10-02).
