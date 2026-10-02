# Vision

Date: 2026-10-02
Status: Draft. The owner must approve this document before it is locked.
Language: ASD-STE100 (Simplified Technical English).

This document is the reference for all product decisions. If a feature idea conflicts with this document, the idea changes or this document changes. The two must not disagree.

Labels in this document:

- **[Owner]**: The owner said this.
- **[Proposed]**: The author (Claude) wrote this from the owner's statements. The owner must confirm it.

## 1. Vision statement

A personal tool, on my phone, that helps me use my pantry well and cook good healthy meals consistently. **[Proposed]** wording, from **[Owner]** goals.

### The problem that this tool solves

The owner cooks most days of the week, but not each week. In some weeks the owner cooks each day. In other weeks the owner cooks one or two times. **[Owner]**

The cause of the bad weeks is that there is no plan. **[Owner]** This is the sequence:

1. The owner comes home after a stressful day at work.
2. The owner looks at the pantry and has no idea what to cook.
3. The chicken is still in the freezer, and the time is 18:00.
4. The owner orders pizza.

The tool must make the decision before that moment. At 18:00 the answer is ready, and the food is ready to cook. **[Owner]** ("take the mental load of decisions off me at the moment when I am probably going to make a bad decision")

There is a second sequence, at the store. **[Owner]**

1. The owner goes to the store with no plan.
2. The owner buys the same items that are already in the pantry.
3. The owner cooks the same five recipes, because there is no plan for new ones.
4. The owner takes shortcuts and skips ingredients, because the owner did not buy them. The owner bought too much of a different item.

The tool must give the owner a reason to go to the store. The pantry check and the meal plan come first. The store visit comes after them, with a list. **[Owner]** The results that the owner wants are less stress, less time, and less money spent. **[Owner]**

The tool does not push the owner to cook. It must be so useful that the owner wants to use it. **[Owner]**

## 2. Goals

1. Use the food in the pantry before it becomes waste. **[Owner]**
2. Cook consistently. **[Owner]**
3. Cook good healthy meals. **[Owner]**
4. Buy ingredients that more than one meal uses. Do not buy one small ingredient for one dish. **[Owner]**

## 3. The core loop

The tool has one loop. Each feature must make this loop easier or better.

1. **Plan** a meal from the recipes and the pantry.
2. **Shop** for the items that are missing.
3. **Cook** the meal and confirm it.
4. The tool **updates the pantry** automatically.
5. **Record** a rating and a note for the next time.

## 4. Principles

| # | Principle | Meaning | Label |
|---|---|---|---|
| 1 | **Cooked means deducted.** | When I confirm that I cooked a meal, the tool subtracts the ingredients from the pantry. I do not do this manually. | [Owner] |
| 2 | **Manual work is permitted, but it must be easy.** | A pantry edit takes a small number of taps. A new item can come from a barcode scan. | [Owner] |
| 3 | **Offline first.** | All functions of the core loop work with no connection. The data is on the device. | [Owner] |
| 4 | **Phone first.** | The design starts from a phone screen that I use with one hand in the kitchen or the store. Desktop is second. | [Owner] for phone. [Proposed] for "one hand". |
| 5 | **One user first.** | The tool is for me. Family features come after I use the tool regularly. | [Owner] |
| 6 | **Use before growth.** | A new feature comes only after real use shows that it is necessary. | [Owner] |
| 14 | **Build fast, use it, report, iterate.** | A design on paper does not show how the tool feels. Each small part goes to the phone quickly. If the tool is not pleasant, or I do not use it each day, something must change. | [Owner] |
| 7 | **My data is mine, and JSON connects things.** | I can export and import all data, or only a part of it such as the recipes. The JSON format is a defined contract. | [Owner] |
| 8 | **My recipes first.** | The tool starts with the recipes that I put in my rotation. More recipes can come from import or reference. | [Owner] |
| 9 | **Each cook teaches something.** | Each cook session can have a rating from 1 to 5 and a short note. | [Owner] |
| 10 | **Build for later sync, but do not build sync now.** | The data model permits sync later. The first versions have no server database and no login. A server database comes after the owner uses the tool regularly. | [Owner] |
| 11 | **Decide before, not at 18:00.** | The tool moves decisions and preparation to a calm moment. I select a set of meals for the week and buy for all of them. On the day, I select from this short list. A meal has no fixed day, so one bad day does not break the plan. | [Owner] |
| 12 | **Always have an answer.** | On a day with no plan, the tool shows what the pantry can make now. The alternative must be easier than a pizza order. | [Owner] confirmed the function. [Proposed] wording. |
| 13 | **The plan comes before the store.** | I go to the store with a list that comes from the pantry check and the meal plan. The list does not include items that I have. | [Owner] |

## 5. What the tool is not (for now)

| Not this | Label |
|---|---|
| Not a shared household application with real-time sync. | [Owner] ("we can grow into that") |
| Not a service with accounts and a server database. | [Owner] (IndexedDB first) |
| Not a nutrition calculator. | [Proposed] |
| Not an AI that makes the plan for me. | [Proposed] |
| Not a store or retailer integration. | [Proposed] |
| Not a general household manager (chores, equipment). | [Proposed] |

## 6. Decision test

Ask these questions about each new feature. **[Proposed]**

1. Does it make one step of the core loop faster or more reliable?
2. Does it work with no connection?
3. Can I do it on a phone in a small number of taps?
4. Does it add data entry work? If yes, is the result worth this work each week?
5. Did real use show that it is necessary?

If the answer to question 1 is "no", the feature does not go into the tool.

## 7. Signs of success

These signs are **[Proposed]**. The owner must set the real targets.

1. I use the tool each week for four weeks in sequence.
2. I trust the shopping list. I do not check the pantry with my eyes before I shop.
3. I confirm cooked meals because it is easy, not because I must.
4. I throw away fewer perishable items.
5. The number of cooked meals is almost the same each week. There are no weeks with only one or two cooked meals.
6. I order food because I want to, not because I have no plan.

## 8. Open definitions

1. "Healthy" has no definition in this document. The owner must give one, or the tool lets the owner mark recipes as healthy by personal judgment.
2. "A small number of taps" has no number. A possible target is three taps or fewer for a pantry edit. **[Proposed]**

## 9. Related documents

- [research.md](research.md): existing products and technical options.
- [roadmap.md](roadmap.md): the MVP, v1, and v2 scope.
