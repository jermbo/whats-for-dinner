# Open Product Questions

Date: 2026-10-02
Status: Agenda for the grill session. No item has a decision.
Language: ASD-STE100 (Simplified Technical English).

These questions are about the product, not about the technology. Each one changes the data model or the chance that the owner continues to use the tool. The technical architecture starts after the owner gives the answers.

All items and all recommendations are from the author (Claude). They are analysis, not verified facts.

## Answers from the owner (2026-10-02)

The owner agrees that all items below are real gaps. The recommendations in Group 1 and the definitions in Group 3 have no decision yet.

| # | Topic | Answer |
|---|---|---|
| 1 | Units | One unit for each ingredient. Recipes and the pantry use that unit. The unit is the one that makes sense for the ingredient. The owner prefers grams, because the owner measures by weight and not by volume. |
| 2 | Deduction limits | Accepted. The quantity stops at zero. The tool shows no error. |
| 3 | Undo | Accepted. "Cooked" has an undo. It puts the quantities back and puts the meal back on the week menu. |
| 5 | Leftovers and batch cooking | Leftovers are a regular meal. The "Cooked" confirmation can add a "leftover" meal to the week menu. Batch cooking with portions in the pantry is not in the MVP. |
| 6 | Opened and partial items | Accepted. Quantities can be fractions and any number of grams. |
| 9 | Data for insights | Accepted. The tool records each pantry change with its cause: bought, cooked, used, corrected, thrown away. |
| 10 | Thrown-away food | Accepted. A "thrown away" action on a pantry item, different from "used". |
| 4 | Food that is not a recipe | Accepted. The "used" action on the pantry item. A simple meal can be a recipe with one or two ingredients. |
| 7 | Ingredient detail | Accepted. The owner decides for each ingredient. No ingredient groups in the MVP. |
| 8 | Storage location | Accepted. Each item has a location: pantry, refrigerator, or freezer. |
| 12 | Recipe entry on a phone | Accepted. The recipe form works on a desktop and on a phone. The recipe export moves recipes to the phone. |
| 16 | Shopping in real life | Accepted. The "bought" action lets the owner change the quantity. The scan and the pantry search are available in the store. |
| 11 | The first day | Not a concern. The tool is for the owner, and the owner accepts the setup work. The goal is that each action is as easy as possible. |
| 13 | Data loss | Not a concern now. A server database comes after the owner uses the tool regularly. |
| 14 | Two devices | Agreed. The export and import have more than one scope: all data, or only the recipes. The JSON format is the focus of the design. |
| 15 | The habit | The tool must be so useful that the owner wants to use it. The problem is the days with no plan: a stressful day, no idea what to cook, frozen chicken at 18:00, then pizza. The tool must make the decision and the preparation occur before that moment. See [vision.md](vision.md), section 1. |

All items in Group 1 and Group 2 have an answer. The definitions in Group 3 stay open. They do not stop the build. Real use gives the answers.

## Group 1: These change the data model

| # | Topic | The gap | Question | Recommendation |
|---|---|---|---|---|
| 1 | Units | The MVP has no unit conversion. Automatic deduction is correct only if the recipe and the pantry use the same unit for an ingredient. A recipe says "2 cups of rice". The pantry says "1 bag". | Which unit rule does the MVP use? | Each ingredient has one unit. Recipes and the pantry use that unit. The owner writes the recipe in that unit. |
| 2 | Deduction limits | A recipe needs 3 eggs. The pantry shows 2. | Does the quantity stop at zero? Does the tool show a message? | Stop at zero. Show no error. A too-low number is a sign of drift, not a fault of the owner. |
| 3 | Undo | A tap on "Cooked" by accident changes many pantry items. | Is an undo necessary? | Yes. The cook session record keeps what it subtracted, so an undo can put it back. |
| 4 | Food that is not a recipe | The plan has all meals. Breakfast is frequently cereal or toast. Snacks and drinks also use pantry items. None of this goes through "Cooked". | How does this food leave the pantry? | A fast "used" action on a pantry item. A simple meal can also be a recipe with one or two ingredients. |
| 5 | Leftovers and batch cooking | The owner cooks four servings and eats two. The remainder is lunch the next day. | Is cooked food a pantry item? Can one cook session supply more than one plan entry? | A decision is necessary. This changes how a plan entry and a cook session relate. |
| 6 | Opened and partial items | A can is half used. A bag of rice is "some". | How exact must a quantity be? | Permit fractions (0.5) in quantity mode. Use state mode for bulk items. |
| 7 | Ingredient detail | "Chicken", "chicken thighs", and "boneless chicken thighs" can be one ingredient or three. | How fine is the ingredient list? | Fine enough to shop from. The owner decides for each ingredient. |
| 8 | Storage location | The freezer changes how long food stays good. The "perishable" mark does not show this. | Does an item have a location: pantry, refrigerator, freezer? | A location field in the MVP data model. It costs little. The functions that use it can come later. |
| 9 | Data for insights | The owner wants insights later. Data that the tool does not record now cannot be recovered. | Which insights does the owner want? | Record these from the first day: planned and cooked dates, skipped meals, the rating, the note, and each pantry change with its cause (bought, cooked, used, corrected, thrown away). |
| 10 | Thrown-away food | Goal 1 is less waste. The tool cannot measure waste without a record. | Does the tool record food that is thrown away? | A "thrown away" action on a pantry item, different from "used". |

## Group 2: These change the chance of success

| # | Topic | The gap | Question | Recommendation |
|---|---|---|---|---|
| 11 | The first day | On the first day, the tool has no ingredients, no recipes, and no pantry items. Much data entry is necessary before the first loop. | How does the owner start? | A starter list of common ingredients in the tool. The pantry starts empty and fills from the shopping list and the scan. The owner needs only three to five recipes for the first week. |
| 12 | Recipe entry on a phone | A recipe with twelve structured ingredients is slow to type on a phone. | Where does the owner enter recipes? | Design the recipe form for the desktop also. This makes item 14 important. |
| 13 | Data loss | The phone has the only copy. A cleared browser, a lost phone, or a browser cleanup deletes all data. A manual export is easy to forget. | How much data loss is acceptable? | A reminder in the tool when the last export is older than a set number of days. Use the share function of the phone to save the file to a cloud drive. |
| 14 | Two devices with manual sync | Data on the phone and data on the desktop become different. | Does an import replace all data, or does it merge? | Replace all data in the MVP. A merge is a sync engine, and that is v2. The phone is the primary device. |
| 15 | The habit | The tool does not make the owner cook. The MVP has no reminders. | When does the owner plan? What makes the owner open the tool each day? | The owner sets a plan day. The "Today" screen shows meals that have no confirmation from earlier days. |
| 16 | Shopping in real life | The owner buys items that are not on the list, buys a different quantity, or buys a replacement. | How do these go into the pantry? | The "bought" action lets the owner change the quantity. The scan adds items that are not on the list. |

## Group 3: Definitions that are open

| # | Topic | Question |
|---|---|---|
| 17 | "Healthy" | What makes a meal healthy for the owner? A mark on a recipe, a balance across the week, or nutrition numbers? |
| 18 | "Consistently" | How many cooked meals in a week is the target? |
| 19 | Household size | For how many persons does the owner cook? This sets the default servings. |
| 20 | Snack | Is "snack" a fourth meal on the plan? |
| 21 | Stores | Does the owner shop at more than one store? Is a list for each store necessary? |

## Related documents

- [vision.md](vision.md)
- [roadmap.md](roadmap.md)
- [research.md](research.md)
