# What's for Dinner

**Plan dinner when you're calm. Eat well when you're not.**

<!-- Screenshot: the four parts on a phone, side by side (Pantry, Recipes, Plan, Shop), and Cook Mode. -->

## 6:14 pm, Wednesday

You get home after a long day and open the fridge. Nothing looks like dinner. The chicken you meant to thaw is still a brick in the freezer.

You know how this ends. Forty minutes and $38 later, you're eating takeout you didn't really want.

Then Saturday comes and you clean out the fridge. The fresh rosemary you bought for one recipe is black. There's a bag of spinach you forgot you had. And at the back of the cupboard sit three boxes of the same pasta, because every time you were in the store, you weren't sure if you had any.

None of this happens because you don't care. It happens because a tired brain at 6 pm takes the easy choice, and the easy choice is rarely the good one.

## So I built a way out

I got tired of letting a bad day at work decide what I ate. So I built something that lets the calm version of me, Sunday morning with a coffee, set things up so that tired Wednesday me can't really fail.

It lives in Obsidian, next to the recipes I already had. Here's what changes.

**On Sunday, you plan in peace.** You pick the week's meals from what's already in your pantry. Every recipe tells you how close you are, like "7 of 9 in the pantry", and the ones that use food about to turn float to the top.

**On Wednesday, you have a backup.** Forgot the chicken? Meals aren't pinned to days, so you pick another one from the week. The black bean soup is ready to go, and everything for it is on the shelf. Takeout isn't the easy choice anymore. Dinner is.

**The rosemary gets a second meal.** Fresh food with a close date pushes its recipes up the list, so the rest of that bunch goes into Friday's chicken, not the compost.

**You stop buying pasta you already own.** The plugin knows every package in every cupboard, fridge, and freezer. Your shopping list is your plan minus your pantry: only the gaps. Standing in the aisle wondering "do I have this?" Search, and you know in a second.

**Your recipes start to tell a story.** Each time you cook, snap the steps and the finished dish, give it stars, and leave a note: "more garlic next time." The next time you make it, Cook Mode shows your best photo of each step, right when you need it.

## Your kitchen, your notes

Everything is plain Markdown in your vault: every recipe, every food, every receipt. It works offline, it stays on your devices, and you can still read it in 20 years, with or without the plugin.

## How it works

**Pantry.** One note per food, one row per package. A bar shows how much is left across all packages and turns amber when you're running low. To update it, drag the bar to what you see: half a jug, four eggs.

<!-- Screenshot: the Pantry, with an amber bar and the card of milk open. -->

**Recipes and Plan.** Pick the week's meals from recipes sorted by your pantry. On the day, choose tonight's meal and see its prep, like "take the beef out of the freezer this morning". Forgot? Pick another meal from the week.

<!-- Screenshot: the Plan, with "Dinner 3/7" and a meal with its preparation. -->

**Shop.** The list is your plan minus your pantry, plus staples like eggs and bread when they run low. Each row shows a photo of the brand you buy, so you can spot it on the shelf. The cart syncs between your phone and your computer.

<!-- Screenshot: Shop in the store, with brand photos and "In cart". -->

**Put away.** Back home, the cart turns into pantry rows and a receipt. Check the lines, tap put away, done.

**Cook Mode.** One step at a time in large type, with big buttons for messy hands. The screen stays on and timers start from the step. When you finish, the food comes out of the pantry on its own. Add a photo, a rating, or a note for next time.

<!-- Screenshot: Cook Mode, one step with a running timer. -->

## Recipes that last

Recipes are plain Markdown in the [RecipeMD](https://recipemd.org/specification.html) format:

```markdown
# Chicken curry

A mild curry with coconut milk.

_dinner, chicken, one pot_

**4 servings**

---

- _500 g_ chicken thighs
- _1 can_ coconut milk
- salt

---

1. Cook the chicken thighs for 5 minutes.
2. Add the coconut milk. Cook for 15 minutes.
```

You don't have to write this by hand. **Add recipe** walks you through a cookbook page or a family card line by line. **Convert** does the same for recipe notes you already have.

## Get started

1. In Obsidian, open **Settings → Community plugins → Browse** and search for "What's for Dinner".
2. Install and enable it.
3. Tap the utensils icon in the ribbon, or run **Open the kitchen**.

The first open walks you through setup: where your recipes live, where the plugin keeps its notes, the places in your kitchen, and your first food. A checklist of common staples gets you going fast.

<!-- Screenshot: the setup step with the places Kitchen pantry, Fridge, and Freezer. -->

### What it adds to your vault

```text
Recipes/              your recipes, where they already are
Larder/
  Pantry/             one note per food, such as Milk.md
  Pantry/Photos/      brand photos
  Shopping/           the next trip and past receipts
  Shopping/Items/     non-food items, such as batteries
  Meal plan.md        this week's meals
```

The plugin also writes to your recipes folder: new recipes, their photos, and a line each time you cook one. To remove its data, delete `Larder/`. Your recipes stay.

## Commands

| Command          | What it does                                     |
| ---------------- | ------------------------------------------------ |
| Open the kitchen | Opens Pantry, Recipes, Plan, and Shop.           |
| Add recipe       | Adds a new recipe, line by line.                 |
| Edit recipe      | Edits the recipe note you have open.             |
| Open the gallery | Shows past meals of the open recipe, with photos. |

## Privacy

No telemetry, no account. The plugin reads and writes notes in your vault, and it makes one kind of network call: when you scan a barcode it hasn't seen before, it asks [Open Food Facts](https://world.openfoodfacts.org), a free and open food database, for the product and its photo. Only the barcode number is sent. You can turn this off in the settings with "Look up barcodes online", and without a connection you just type the name. To use the plugin on more than one device, sync your vault with Obsidian Sync or any folder sync.

## Help and ideas

Found a bug or have an idea? [Open an issue](https://github.com/jermbo/whats-for-dinner/issues).

Want to build it yourself or see how it works? See [Contributing](CONTRIBUTING.md).
