---
title: One-page marketing site
summary: "Requirements for a single-page explainer that shows off What's for Dinner: the goal, the audience, the story, the features to highlight, and the cool details."
parent: ../README.md
updated: 2026-11-07
---

[Wiki](../README.md) / Marketing / One-page site

# One-page marketing site

A single page that explains What's for Dinner and makes a visitor want to install it.
This page captures what the site must say and show. It does not design the site.

## Goal

A cook who already uses Obsidian lands here, understands the product in under a
minute, and installs it from Community plugins. One primary action: **install**.

## Audience

- Obsidian users who keep notes and want their recipes and food in the vault.
- Home cooks tired of wasted food, repeat buys, and the 6 pm takeout spiral.
- People who care that their data stays local, offline, and theirs.

Not for: teams, shared households with a server, or people who want a cloud service.

## The one message

**Plan dinner when you're calm. Eat well when you're not.**

The pantry is the center. Everything else flows from what you already have. Lead
with this; it is the whole pitch.

## The story to tell first (the hook)

Open with the 6:14 pm Wednesday scene from the README: tired cook, empty-looking
fridge, frozen chicken, takeout. Then the Saturday fridge clean-out: dead
rosemary, forgotten spinach, three boxes of the same pasta. Name the real cause:
a tired brain at 6 pm takes the easy choice. The product makes dinner the easy
choice.

## Hero feature: how connected everything is

This is the headline differentiator. Show it as a loop, not a list. The pantry is
the single source of truth, and every part reads from it and writes back to it.

```
Pantry  ──suggests──▶  Recipes & Plan
  ▲                          │
  │                          ▼
Put away                Shopping list   (plan minus pantry, only the gaps)
  ▲                          │
  │                          ▼
  └────────  Shop & Cook  ◀──┘   (cooking deducts from the pantry)
```

Four concrete claims to make the loop real:

- **Pantry suggests recipes.** Recipes sort by your pantry: each shows "7 of 9 in
  the pantry", and recipes using food about to turn float to the top.
- **Meal plan feeds the shopping list.** The list is your plan minus your pantry,
  so you buy only the gaps, plus staples when they run low.
- **The cart replenishes the pantry.** "Put away" turns the cart into pantry rows
  and a receipt. Check the lines, tap, done.
- **Cooking deducts from the pantry.** At the end of Cook Mode, ingredients come
  out of the pantry on their own, so it's correct when you finish with dirty hands.

## Features to highlight

Order them by what wins a visitor over, strongest first.

### 1. The connected loop (above)

The reason to choose this over a recipe app or a notes template.

### 2. The pantry that knows every package

- One note per food, one row per package, tracked **per place** (kitchen, fridge,
  freezer, downstairs). This is why you stop buying pasta you already own.
- One bar per food shows every package at a glance; it turns amber when low.
- Correct it by dragging the bar to what you see: half a jug, four eggs.

### 3. Fast pantry fill (the "easy" angle)

- **Scan to stock.** On Mac (live webcam) and Android (camera), scan a barcode and
  the form fills in food, brand, and size from Open Food Facts. You confirm only
  the use-by date, tap "Correct", and the camera reopens for the next can.
- **Scan the next can with no wait.** Writes happen in the background, so you keep
  scanning a whole shelf without pausing.
- **Staple suggestions.** The list proposes staples by how often you buy them
  (Often / Sometimes / Seldom), and surfaces what's out, low, or past its date.
  You accept, skip, or never ask.

### 4. The weekly audit

- A guided walk through each place to confirm or correct every food, so the pantry
  stays trustworthy. Items a meal couldn't deduct from are flagged "to check" and
  shown first. Position this as the trust-keeping feature: the loop only works if
  the pantry is right, and the audit keeps it right in minutes.

### 5. Plan calm, cook with a backup

- Pick the week's meals from pantry-sorted recipes on Sunday.
- Meals aren't pinned to days, so tired Wednesday you can swap to another ready
  meal instead of ordering out.
- Preparation reminders, like "take the beef out of the freezer this morning".

### 6. Shop

- Shopping list is the plan minus the pantry, plus low staples.
- Each row shows a photo of the brand you buy, to spot it on the shelf.
- Cart syncs between phone and computer; items sort in store order from your last
  receipt.

### 7. Cook Mode

- One step at a time in large type, big buttons for messy hands.
- Screen stays on; timers start from the step.
- On finish, the pantry updates itself; add a photo, a rating, a note for next time.

### 8. Recipes that last (the standard, plus extras)

- Plain Markdown in the open [RecipeMD](https://recipemd.org/specification.html)
  standard: readable in 20 years, with or without the plugin.
- **Extras on top of the standard:** step photos (mark your best with `|best`), a
  gallery of past cooks with date, rating, and notes, and a "more garlic next
  time" history that Cook Mode shows you at the right step.
- You don't have to write them by hand: **Add recipe** walks a cookbook page or
  family card line by line; **Convert** does it for notes you already have.

### 9. Occasions (Thanksgiving, birthdays)

- One note per occasion with dishes, who brings what, a guest list, and prep tasks.
- Scale a dish (×2), shop for the occasion from 7 days out, and start next year
  from this year's occasion.

### 10. Your kitchen, your notes (trust)

- Everything is plain Markdown in your vault. Offline-first, no account, no
  telemetry.
- One optional network call: a new barcode lookup sends only the number to Open
  Food Facts, and you can turn it off.

## What to call out as "cool"

Small delights worth a dedicated beat or caption:

- **Drag the bar to reality.** Correcting the pantry is physical: drag to half,
  snaps to a quarter or to one egg.
- **Scan a whole shelf without waiting.** Background writes + auto-reopening camera.
- **Brand photos in the aisle.** See the exact package you buy, not just a word.
- **Recipes that float up when food is about to turn.** The rosemary gets a second
  meal instead of the compost.
- **"7 of 9 in the pantry" on every recipe.** Readiness at a glance.
- **Cooking cleans up after itself.** The pantry is correct the moment you plate.
- **Cart syncs phone ↔ computer.** Plan on the laptop, check off in the store.
- **It's just files.** Delete `Larder/` to remove everything; your recipes stay.

## Content the site needs

- Hero line, the 6:14 pm story, and the "so I built a way out" turn.
- The connected-loop diagram as the centerpiece visual.
- Screenshots (placeholders already marked in the README): the four parts on a
  phone, the pantry card with an amber bar, the plan with prep, shop with brand
  photos, Cook Mode with a timer, and setup with places.
- A RecipeMD code sample to prove the "just Markdown" claim.
- Install steps (Community plugins → Browse → "What's for Dinner").
- Privacy note and a link to open an issue / contribute.

## Tone and voice

Match the project: plain words, one word for one thing, calm and concrete.
Short sentences. No hype adjectives; let the loop and the screenshots do the work.

## Out of scope

- Pricing, accounts, or sign-up (there are none).
- Comparisons to named competitors.
- Multi-user or household features.
- Building the site itself; this is requirements only.

## Open questions

- Where will the site be hosted (GitHub Pages, a separate repo, the docs site)?
- Do we have real screenshots yet, or do we need to capture them from the test
  vault first?
- Is there a logo / wordmark, or do we need one?
