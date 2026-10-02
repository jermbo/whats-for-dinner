# Meal Planner Research

Date: 2026-10-02
Status: Draft for owner review. A grill session follows this review.
Language: ASD-STE100 (Simplified Technical English).

## 1. Purpose

This document gives the facts that are necessary before the design of the meal planner starts.

It gives answers to three questions:

1. Which meal planner products exist today?
2. Which features are possibly worth a copy?
3. Which technical options are available for an offline-first PWA on Astro and Vercel?

This document does not make design decisions. Section 9 lists the decisions that stay open.

## 2. Confidence labels

Each fact has a label. The label tells you how much you can trust the fact.

| Label | Meaning |
|---|---|
| **[V]** | Verified today from a primary source (vendor page, official documentation, npm registry, or the repository). |
| **[S]** | From a secondary source. Many of these sources are blogs from companies that sell a competing product. Bias is possible. |
| **[M]** | From the memory of the author (Claude). Not verified today. |
| **[A]** | Assumption or proposal by the author. Not a fact. |

Limits of this research:

- The author did not install or operate the products. All product facts come from web pages.
- The product survey is not complete. Other products can exist.
- Prices and limits change. Each price is correct only for the date of this document.

## 3. Inputs from the owner

The owner gave these inputs before the research started.

Update, 2026-10-02: After the review, the owner changed the scope. The tool is for one user first, with IndexedDB and a manual import and export. A shared household and a server database come later. [vision.md](vision.md) and [roadmap.md](roadmap.md) replace the table below where they disagree.

| Topic | Input |
|---|---|
| Goal | Organize the pantry. Plan meals from available items. Make a shopping list. |
| Shopping rule | Plan meals around related items. Do not buy one small ingredient for one dish. |
| Architecture | Offline-first PWA. Astro is in the repository. |
| Sharing | One shared household. All family members see and change the same data. |
| Hosting | Vercel. The database comes through Vercel. |
| Devices | Android phones or tablets, and desktop or laptop computers. |
| Recipe sources | First: public recipe database and manual entry. Later: import from a web page. |

## 4. The problem in numbers

- Households wasted 631 million tonnes of food in 2022. This is 60 % of all food waste at the retail, food service, and household levels. **[S]** (UNEP Food Waste Index Report 2024, read through news summaries.)
- The average is 79 kg of wasted food for each person in one year. **[S]** (Same report.)
- One vendor gives an estimate of USD 85 to 100 for a week of dinners without ingredient overlap, and USD 55 to 65 with overlap. **[S]** The vendor gives no data source for this estimate. Do not use it as evidence.

## 5. Existing products

### 5.1 Commercial products

| Product | Pantry | Meal plan | Shopping list | Offline | Sharing | Price | Label |
|---|---|---|---|---|---|---|---|
| **Paprika 3** | Yes. Sources disagree on the detail (see note 1). | Week and month. Reusable menus. | Combines equal ingredients ("1 egg + 2 eggs = 3 eggs"). Sorts by aisle. | Yes (local storage). | Cloud sync between the devices of one account. | One-time purchase for each platform. USD 4.99 on iOS, USD 29.99 on Windows. | [V] features, [S] price and offline |
| **AnyList** | No pantry feature found. | Calendar. | Shared list. Combines ingredients. Sorts by category. | Yes. | Real-time shared lists and shared meal plan. | Free core. Complete: USD 9.99 for each year (one person) or USD 14.99 (household). | [V] |
| **Mealime** | No. Each plan assumes an empty pantry. | The app selects recipes from its own catalog. More than 200 personal options. | Automatic. Sorted by category. | Not found. | Not found. | Free. Pro: USD 2.99 for each month. | [V] features, [S] pantry and price |
| **Plan to Eat** | Removed (one source). | Calendar. | Automatic from the calendar. | Not found. | Not found. | USD 5.95 for each month or USD 49 for each year. | [S] |
| **KitchenPal** | Quantities, expiry alerts, barcode scan, automatic deduction. | Yes. One source calls it "lighter". | Adds used items automatically. | Not found. | Family sharing. | Free. Premium approximately USD 3.99 for each month. | [S] (includes the vendor's own page) |
| **SuperCook** | Checklist only. "Have it or do not have it." No quantities. No expiry. | No. | No. | No (web only). | No. | Free. | [S] |
| **Cooklist** | Yes. Imports from store receipts and loyalty accounts. | Yes. | Connects to more than 80 retailers. | Not found. | Yes. | USD 5.99 to 9.99 for each month. | [S] |
| **Samsung Food** | "Thin". No quantities. | Yes. | Automatic from the plan. | Not found. | Not found. | Free. Food+: USD 6.99 for each month. | [S] |
| **SummitPlate** | Not found. | AI makes the plan. The AI reuses proteins, produce, grains, and sauces across meals. | Made together with the plan. | Not found. | Not found. | Not found. | [S] (vendor page) |
| **NoWaste** | Quantities, expiry (core feature), barcode. | Basic. | Basic. | Not found. | Not found. | Free, or USD 7 for each year. | [S] |
| **MealBoard** | Quantities, expiry, barcode. | Yes. | Moves empty items to the list. | Not found. | Not found. | USD 4 one-time. | [S] |

Note 1: The Paprika website shows a pantry feature: "keep track of your groceries and what you have on hand". **[V]** One blog says that Paprika has no pantry awareness. A different blog says that Paprika tracks quantities and expiry but does not deduct after you cook. **[S]** The author did not find which statement is correct.

### 5.2 Open-source, self-hosted products

| Product | Strong points | Weak points | Stack | Label |
|---|---|---|---|---|
| **Grocy** | Stock with quantities and due dates. Barcode scan with the camera. Product lookup through Open Food Facts. Minimum stock amounts. Each recipe shows if the stock can make it. One click adds missing items to the shopping list. A "Due Score" shows recipes that use items near their due date. | PWA with no offline function. The scope is large (chores, batteries, equipment). | Web application, self-hosted. | [V] |
| **Mealie** | Good recipe import from URLs. Calendar meal plan. Automatic shopping list. Households and groups. Documented API. | No pantry found. No offline found. | Python (FastAPI), Vue, SQLite or PostgreSQL. | [S] |
| **Tandoor** | Most features. Shopping list sorted by aisle with real-time sync. Nutrition. Meal cost. iCal export. Fine permissions. | Needs PostgreSQL. More configuration. | Django, Vue, PostgreSQL. | [S] |
| **KitchenOwl** | Made for a household. Shared lists work partially offline in a store. Native mobile apps. Expense tracking. | Limited recipe import. Basic meal plan. | Flutter, Python, SQLite. | [S] |

### 5.3 Findings from the survey

1. **No product in this survey has all four of these properties:** offline-first, pantry with quantities, shared household, and a plan that uses ingredient overlap. **[A]** This is a conclusion by the author from the tables above. The survey is not complete.
2. **Grocy is the nearest product for "plan from the pantry".** It has no offline function. **[V]**
3. **KitchenOwl and AnyList are the nearest products for "shared and offline".** They have no pantry with quantities. **[S]** for KitchenOwl, **[V]** for AnyList.
4. **SummitPlate is the only product found that names ingredient overlap as its main feature.** It uses AI to make the plan. **[S]**
5. **Pantry tracking fails often.** One source gives these causes **[S]**:
   - Users do not update the pantry after they eat or cook.
   - The app records only "have" or "do not have", with no quantity.
   - The pantry screen is separate from the screens that the user opens each day.
   - There is no method to remove a part of a quantity.
6. **Shopping list functions that most products share** **[V]/[S]**: combine equal ingredients, sort by store aisle or category, add recipe ingredients with one action.

## 6. Features that are possibly worth a copy

The groups below are a proposal by the author. **[A]** The owner makes the decision in the grill session.

### 6.1 Group A: Necessary for the stated goal

| Feature | Seen in | Reason |
|---|---|---|
| Pantry with quantity and unit for each item | Grocy, KitchenPal, MealBoard | The planner cannot calculate what remains without quantities. |
| "Can I make this?" status on each recipe | Grocy, SuperCook | This is the core of "plan with what is available". |
| Sort recipes by pantry match | SuperCook, Grocy | Shows the meals that need the fewest purchases. |
| Week calendar for the meal plan | All planners | Standard function. |
| Shopping list from the plan, minus the pantry stock | Grocy, KitchenPal | Prevents a second purchase of an item that is in stock. |
| Combine equal ingredients on the list | Paprika, AnyList | Standard function. |
| Sort the list by store category | Paprika, AnyList, Mealime, Tandoor | Makes the store visit faster. |
| Shared list that works with no connection | KitchenOwl, AnyList | Stores frequently have a weak signal. |
| Deduct ingredients from the pantry when a meal is cooked | KitchenPal, NoWaste | Decreases the upkeep work. This is the primary cause of failure (finding 5). |
| Move bought items from the list into the pantry | KitchenPal, MealBoard | Decreases the upkeep work. |
| Ingredient overlap in the plan (see section 7) | SummitPlate | The owner asked for this function. |

### 6.2 Group B: Useful, but not necessary for a first version

| Feature | Seen in | Note |
|---|---|---|
| Due dates and a "use first" sort | Grocy (Due Score), NoWaste, KitchenPal | Adds data entry work for each item. |
| Barcode scan to add pantry items | Grocy, KitchenPal, Pantry Check | Android Chrome has a browser API for this (section 8.5). |
| Minimum stock amounts for staples | Grocy | Adds staples to the list automatically. |
| Recipe scale by servings | Paprika, AnyList | Changes ingredient quantities. |
| Unit conversion (metric and imperial) | Paprika | Necessary if recipes and pantry use different units. |
| Reusable menus (a saved week) | Paprika | Fast planning for a regular week. |
| Diet rules, allergies, dislikes | Mealime | Filters the recipe list. |

### 6.3 Group C: Later, or possibly out of scope

| Feature | Seen in | Note |
|---|---|---|
| Recipe import from a URL | Paprika, Mealie, Tandoor, AnyList | The owner put this in a later phase. |
| Receipt scan or retailer account import | Cooklist | Needs retailer integrations. |
| Nutrition data and meal cost | Tandoor | Needs more data for each ingredient. |
| AI-made plans | SummitPlate, Mealime (partially) | Needs a network connection and a paid API. |
| Cook mode (step by step, hands-free) | Mealime | Not related to the plan or the pantry. |

## 7. Ingredient overlap

### 7.1 What the sources say

- The method: select a small set of core ingredients, then select meals that share them. The categories are proteins, produce, grains, flavor bases, and staples. **[S]**
- The products do this with one of two methods: an AI makes the full week (SummitPlate), or the user does it manually. **[S]**
- The author found no product that shows the quantity that remains after the plan (for example: "the plan uses 1/4 of the cilantro that you must buy"). **[A]** The survey is not complete.

### 7.2 Data that this function needs

These points are an analysis by the author. **[A]**

1. **One identity for each ingredient.** "Scallion", "green onion", and "spring onion" must point to the same record. Recipe data usually gives ingredients as free text.
2. **Quantity and unit that a program can read.** "3 or 4 ripe bananas, smashed" is not sufficient. The text needs a parser, or the user must enter structured data.
3. **Unit conversion for each ingredient.** A recipe uses "1 cup of flour". The store sells "1 kg". The conversion from volume to mass is different for each ingredient.
4. **Purchase size.** The planner must know that cilantro is sold as one bunch. Without this, it cannot calculate the remainder.
5. **Shelf life class.** A remainder of rice is not a problem. A remainder of fresh herbs is a problem. The planner needs at least two classes: perishable and staple.

### 7.3 Possible methods

These are proposals. **[A]** The author did not test them.

| Method | Description | Needs |
|---|---|---|
| **Overlap score** | When the user adds a recipe to the week, sort the other recipes by the number of perishable ingredients that they share with the plan and the pantry. | Items 1 and 5 of section 7.2. |
| **Remainder list** | After the plan is made, show each purchase with its unused part. Suggest recipes that use this part. | Items 1 to 5. |
| **"Lonely ingredient" warning** | Show a warning when a perishable ingredient on the list is used by only one planned meal. | Items 1 and 5. |
| **Automatic week** | The program selects the full week to get the smallest waste. | Items 1 to 5, plus an optimization algorithm. |

The first and third methods need the least data. They do not need quantities.

## 8. Technical options

### 8.1 Current state of the repository

- `astro` 7.3.5 is the only dependency. Vite 8.3.1 is installed with it. **[V]**
- `astro.config.mjs` has an empty configuration. There is no adapter, no UI framework, and no PWA integration. **[V]**
- There is one page: `src/pages/index.astro`. **[V]**

### 8.2 PWA tooling for Astro 7

| Option | Fact | Label |
|---|---|---|
| `@vite-pwa/astro` 1.2.0 | The peer dependency range stops at Astro 5. An open issue (number 72, opened 2026-03-11) reports that the range blocks installation on Astro 6. | [V] range, [S] issue |
| `vite-plugin-pwa` 1.3.0 | Supports Vite 3 to 8. Uses Workbox 7.4. It is possible to add it directly as a Vite plugin in the Astro configuration. The author did not test this with Astro 7. | [V] range, [A] method |
| `@serwist/vite` 9.5.12 | Supports Vite 5 and later. | [V] |
| Hand-written service worker | No dependency. The developer writes the cache logic and the precache list. | [M] |
| `@astrojs/vercel` 11.0.11 | Supports Astro 7. Necessary only if the application has server routes (API endpoints) on Vercel. | [V] |

A small prototype is necessary to find which option works with Astro 7. **[A]**

### 8.3 Storage on the device

- Chrome gives each origin a quota of up to 60 % of the disk size. **[V]** (MDN)
- The default storage mode is "best-effort". The browser can delete all data of an origin when disk space is low. It deletes the least recently used origin first. **[V]**
- `navigator.storage.persist()` asks for persistent storage. Then only the user can delete the data. Chrome approves or denies the request automatically from the interaction history of the user. **[V]**
- Safari deletes script-made data after 7 days with no user interaction. This applies when cross-site tracking prevention is on. **[V]** iOS is out of scope today. This fact is important if a family member uses an iPhone later. **[A]**
- IndexedDB is the standard browser database for structured data. `dexie` 4.4.6 (Apache-2.0) is a common wrapper for it. **[V]** version and license, **[M]** "common".

Result: the data on one device is not a safe single copy. A server copy is necessary. **[A]**

### 8.4 Sync between family devices

Facts about Vercel:

- Vercel does not sell its own SQL database. Databases come from Marketplace providers. The documentation names Neon, Upstash, and Supabase. Vercel puts the credentials in environment variables. **[V]**
- Vercel has two storage products of its own: Blob (files) and Global Config (configuration that changes rarely). **[V]**
- Vercel Functions support WebSocket connections in public beta, announced 2026-06-22. One connection stays on one function instance. The default maximum duration is 300 seconds. There is no built-in broadcast to connections on other instances. **[S]** (search summary of Vercel documentation)
- Neon free plan: 1 GB of storage for each project and 100 CU-hours for each project. The compute stops after 5 minutes with no activity. You cannot turn this off on the free plan. **[V]**

Sync options:

| Option | How it works | Fit with Vercel and a Marketplace database | Cost and license | Label |
|---|---|---|---|---|
| **Custom push and pull over HTTP** | The device keeps a local database and a queue of changes. It sends the queue to an API route and pulls changes from other devices. The developer writes the conflict rules. | Good. Uses standard Vercel Functions and Postgres (Neon). The database can sleep between requests. | No library cost. The most development work. | [A] |
| **CRDT library: Yjs 13.6 or Automerge 3.5** | Each device keeps a document that merges automatically with no conflicts. The server stores and relays updates. | Possible. The updates can go through HTTP routes. Live updates need WebSocket (beta on Vercel) or a regular poll. | MIT. Free. | [V] license, [A] fit |
| **PowerSync** | A sync service reads the Postgres replication log and keeps a SQLite database on each device. | Partial. The sync service does not run on Vercel. It needs PowerSync Cloud or a self-hosted container. | Cloud free plan: 50 concurrent clients, 2 GB synced for each month. Free projects are deactivated after 1 week with no activity. Pro starts at USD 49 for each month. Client SDK: Apache-2.0. | [V] |
| **Zero** (Rocicorp) | A server process (`zero-cache`) keeps a replica and syncs queries to clients. Version 1.0 in June 2026. | No. `zero-cache` needs a server that runs continuously, and Postgres with logical replication. | Apache-2.0. | [V] deployment and license, [S] version date |
| **ElectricSQL** | Streams Postgres data to clients. Writes go through your own API. | Partial. Needs the Electric sync service outside Vercel. | Not verified. | [S] |
| **Dexie Cloud** | An add-on for Dexie. It gives sync, login, and shared "realms". | No. It uses the Dexie Cloud backend, not a Vercel database. | Free: 3 production users, 100 MB. Pro: EUR 0.12 for each user for each month. | [V] |

Important interaction: PowerSync, Zero, and ElectricSQL use Postgres logical replication. While a replication subscriber is connected, a Neon compute does not scale to zero. **[V]** A compute that runs for a full month possibly uses more than the 100 free CU-hours. **[A]** (The author did not verify the minimum compute size.)

### 8.5 Browser APIs on Android and desktop

| API | Use | Support | Label |
|---|---|---|---|
| Service Worker and Cache API | Offline application shell. | All current browsers. | [M] |
| Background Sync API | Sends queued changes when the connection returns, also when the application is closed. | MDN marks it "limited availability". Chromium browsers (Chrome, Edge, Chrome on Android) support it. Firefox and Safari do not. | [V] status, [M] browser list |
| Barcode Detection API | Reads EAN-13 and UPC-A barcodes from the camera. | MDN marks it "experimental". Chrome on Android supports it. Desktop support is different for each operating system. | [V] status and formats, [M] browser list |
| Web App Manifest | Makes the PWA installable. | Chrome on Android and desktop Chromium browsers. | [M] |

### 8.6 Recipe and product data

| Source | Content | Terms | Fit with offline-first | Label |
|---|---|---|---|---|
| **TheMealDB** | Recipe database with a JSON API. Filter by one ingredient is free. | Test key "1" is for development or education. A public release on an app store needs a paid supporter account. The filter by many ingredients is a paid function. | No cache limit found. It is not clear if a family PWA is a "public release". | [V] |
| **Spoonacular** | Large recipe API. | Free: 50 points for each day, backlink necessary. Paid plans start at USD 29 for each month. Cached data must be deleted after 1 hour. | Poor. The 1-hour cache limit conflicts with local storage of recipes. | [V] |
| **Edamam** | Recipe search and nutrition APIs. | Free tier exists. Recipe Search goes up to USD 999 for each month. Cache terms not verified. | Not known. | [S] |
| **Open Recipes dataset** | Bulk recipe data from 2017 or before. | CC BY 3.0. Commercial use is permitted with attribution. | Good (bulk file). The content quality is not verified. | [S] |
| **RecipeNLG** | More than 2 million recipes. | CC BY-NC-SA 4.0. No commercial use. | Good (bulk file) for a private, non-commercial application. | [S] |
| **Open Food Facts** | Packaged products by barcode. It is not a recipe source. | Open Database License. No key for read access. A custom User-Agent is necessary. Limit: 15 product requests for each minute for each IP address. Bulk download is available. | Good for the barcode scan. Needs a connection for each new product. | [V] |

Facts for recipe import (later phase):

- Many recipe websites publish schema.org `Recipe` data. The `recipeIngredient` property is usually free text, for example "3 or 4 ripe bananas, smashed". **[V]** A parser is necessary to get quantity, unit, and ingredient name. **[A]**
- A browser cannot read a page from a different website because of the same-origin policy. The import must go through a server route. **[M]**

## 9. Risks

| Risk | Basis |
|---|---|
| The family stops pantry updates after a short time. | Section 5.3, finding 5. **[S]** |
| Public recipe data does not have structured ingredients. The overlap function then needs manual work for each recipe. | Sections 7.2 and 8.6. **[A]** |
| The license terms of a recipe API do not permit local storage. | Spoonacular, section 8.6. **[V]** |
| The standard Astro PWA integration does not install on Astro 7. | Section 8.2. **[V]** |
| A browser deletes local data before the sync is complete. | Section 8.3. **[V]** |
| Two family members change the same item while offline. | Conflict rules are necessary for each data type. **[A]** |
| A sync engine needs a server that Vercel cannot run. | Section 8.4. **[V]** for Zero. |

## 10. Open questions for the grill session

1. Pantry detail: quantities for all items, or quantities for some items and "have / do not have" for staples?
2. Do you want due dates? If yes, for which item types?
3. Which overlap method from section 7.3 is the target for the first version?
4. Who enters the purchase size and shelf life class for each ingredient?
5. Is a login necessary? How does a family member join the household?
6. How fast must a change show on other devices: in seconds, or at the next time the application opens?
7. What must occur when two persons change the same item while offline?
8. Is a paid service acceptable for sync or recipe data? What is the monthly limit?
9. Is the application for one household only, or can other households use it later? This changes the license terms that apply (TheMealDB, RecipeNLG).
10. Which unit system do you use: metric, US customary, or the two together?
11. Is a barcode scan in the first version?
12. Which UI framework, if any, do you want inside Astro for the interactive screens?
13. Do you want diet rules or allergy filters?

## 11. Sources

Primary sources (label [V]):

- Paprika: https://www.paprikaapp.com/
- AnyList: https://www.anylist.com/features
- Mealime: https://www.mealime.com/
- Grocy: https://grocy.info/
- TheMealDB API: https://www.themealdb.com/api.php
- Spoonacular pricing: https://spoonacular.com/food-api/pricing
- Open Food Facts API: https://openfoodfacts.github.io/openfoodfacts-server/api/
- schema.org Recipe: https://schema.org/Recipe
- Vercel storage: https://vercel.com/docs/storage
- Neon pricing: https://neon.com/pricing
- Neon logical replication: https://neon.com/docs/guides/logical-replication-neon
- Zero deployment: https://zero.rocicorp.dev/docs/deployment
- PowerSync pricing: https://www.powersync.com/pricing
- Dexie Cloud pricing: https://dexie.org/cloud/pricing
- MDN, storage quotas and eviction: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- MDN, Background Synchronization API: https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API
- MDN, Barcode Detection API: https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API
- `@vite-pwa/astro` package data: https://github.com/vite-pwa/astro
- npm registry (`npm view`, 2026-10-02) for package versions, licenses, and peer dependencies.

Secondary sources (label [S]):

- Cooklang, Tandoor vs Mealie vs KitchenOwl: https://cooklang.org/blog/42-tandoor-vs-mealie-vs-kitchenowl/ (Cooklang makes a competing recipe tool.)
- Pantry Persona, meal-planning tools 2026: https://www.pantrypersona.com/blog/best-meal-planning-tools-2026 (Sells a competing product.)
- MealThinker, pantry tracking: https://mealthinker.com/blog/meal-planning-app-pantry-tracking (Sells a competing product.)
- KitchenPal comparison: https://kitchenpalapp.com/en/guides/best-meal-planning-apps-2026.html (Vendor page.)
- SummitPlate, ingredient overlap: https://www.summitplate.com/content/ingredient-overlap-save-money (Vendor page.)
- Vercel WebSockets documentation: https://vercel.com/docs/functions/websockets (Read through a search summary.)
- UN News on the UNEP Food Waste Index Report 2024: https://news.un.org/en/story/2024/03/1148036
- BioCycle on the same report: https://www.biocycle.net/2024-food-waste-index/
- Sync engine comparisons: https://kanopylabs.com/blog/electric-sql-vs-powersync-vs-livestore-local-first and https://queryplane.com/blog/electricsql-vs-powersync-vs-replicache/
- Open Recipes dataset: https://huggingface.co/datasets/napsternxg/openrecipes-20170107-061401-recipeitems
- RecipeNLG dataset: https://www.kaggle.com/datasets/saldenisov/recipenlg
