---
title: Features
summary: "What the plugin does for you, from the pantry to the plate, and why each part is worth its place."
parent: ../README.md
---

[Wiki](../README.md) / Features

# Features

The plugin makes your vault a kitchen that knows what it has. This page tells what you can do with it, and why you would.

## The first open sets up the vault

The first time that you open the kitchen in a new vault, [setup](../architecture/setup.md) asks four things: where your recipes are, the name of the folder for the notes of the plugin, the places of your kitchen, and the first food. A checklist of staples adds food with a tap and an amount. Then the four parts open, and the pantry has your food.

## The pantry knows what you have, and where

You record your food one time, with its place and the size from the label: a full bag of rice in the downstairs pantry, 6 eggs in the outside fridge. From then on, the [pantry](../architecture/pantry.md) keeps the count for each place. You do not look into each cupboard before you plan, and you do not buy rice that is downstairs.

The plugin does not assume that a food is there. Water is a food item too: you record it one time, with an amount such as "tap".

Each package is one row, with its own size and its own use-by date, so the half jug and the new jug of milk each keep their date. The pantry shows one line for each food in each place, such as "Beans · 3.2 kg · 8 packages", with one bar that has a part for each package, in all places. Each package has a [level](../architecture/level.md), such as 1/4, or a count, such as 4 of 12 eggs. When one package is left and it is nearly empty, the bar is amber, so you see what gets low before it is out. To correct a package, you open the [card](../architecture/card.md) of the line and drag the package to what you see: a quarter of a jug, or 4 eggs. One tap adds a carton. Once a week, the [audit](../architecture/audit.md) walks each place with you, and the food that a meal could not count comes first.

On a wide screen, each place goes across the full width, and its lines fill columns under its name, so the whole pantry fits in a few screens and no column is empty.

In the store, you ask "do I have this?". You type a name, a brand, or a different name of the food, and the pantry shows it. One tap shows only the food that is low, the food to use soon, the food that is out, or one place.

## The recipes that use your food come first

The [recipe list](../architecture/recipes.md) sorts by your pantry, not by name. Each recipe shows how much of it you have: "7 of 9 in the pantry". A spoon of sugar counts against the grams in the bag. A line that the plugin cannot count, such as 1 onion against 500 g, shows "Check", so you look at the shelf. Food that spoils soon moves its recipes up, so you use the spinach before it is waste.

On a wide screen, the recipe cards flow down in columns, so an open recipe leaves no empty space next to it. A tap opens a recipe as a dark card that spreads from your finger and moves to the top of the screen. It shows what you lack first: the food that you have none of, then what is low, then what to check, and the food that you have as small chips. You find a recipe by its name or by an ingredient. A filter shows only the recipes that you can cook now, or the recipes of one type, such as dinner.

## The week has a plan before it starts

At a calm moment, you choose the meals of the [week](../architecture/plan.md). "Add a meal" opens your recipes, with the ones that use up your pantry first. The week is one list of options, with no groups to fill: you start with the dinners, and you add breakfasts, lunches, and snacks if you want them. A meal is a main dish with its sides, such as beef tacos with honey glazed carrots and a salad. A side is a recipe, or only a name.

## The day starts with a look at the meals

On the day, you flag the meal that you plan to cook, and it goes to the top, into "Tonight", as a large dark card. So you see at a glance what you selected. Some meals need preparation, such as beef that must come out of the freezer. The flagged meal shows the preparation, and you confirm it when it is done. The flag is optional: each meal has "Cook". If you forgot the preparation, you cook a different meal: the other meals are still options. When you finish a meal, it leaves the plan, and the meals that you did not cook stay for the next days.

You write the preparation in the recipe note, as a callout of the type "prep". A callout is a box with a colour and an icon, so the preparation stands out when you read the note.

```markdown
> [!prep] Take the ground beef out of the freezer in the morning.
```

## The shopping list has only the missing items

The [list](../architecture/shopping.md) is the plan minus the pantry. If two meals need onions, the list has one row with the total. In the store, the list is in bins, as the Pantry. One tap ticks an item: its name flies to the cart at the top right, and the row leaves. A wrong tap costs nothing: "Undo" is under your thumb for a few seconds, and later a tap on the item in the cart puts it back.

Some food you want always, plan or no plan: bread, eggs, salt. You label such food as a [staple](../architecture/staples.md), and you tell how often you buy it. The plugin then suggests it when it needs a look: it is low, its date is near, or its time is over. One tap puts it on the list, and one tap skips it. Food that a meal needs gets a suggestion too, when the pantry has it [past its date](../architecture/past-its-date.md).

In the store, each row shows the [photo of each package](../architecture/brands.md) that you buy, so you find it on the shelf with no name to read. A tap shows the photo large, and "In cart" records the brand that you took. A new package gets its photo from the row, with one hand. In the Pantry, you give a brand a name and a new photo later.

You add an item of your own on any day, such as batteries. The cart is a note of your vault, so your phone and your computer show the same cart.

## The trip goes into the pantry, with its prices

At home, [put away](../architecture/put-away.md) shows one line for each package of the cart, filled in with its amount, its place, its use-by date, and its regular price, in groups by place. Each jug of milk gets its own row and its own date in the pantry, and 6 apples are a package of 6 next to the apples that you have. You check the lines, and one tap corrects a fact, marks a sale, or selects the brand in your hand. Each brand has its own price. The items that the plugin knows are in one closed group with one button. You see only the other items as lines, and "Put away" in an open line puts that package into the pantry. The receipt note keeps each fact from the start, so you can stop and continue on a different device.

The note of the trip becomes its [receipt](../architecture/receipt.md): what you bought, in which store, and what you paid. Thus the vault has the price of each item over time.

## Cook Mode shows one step at a time

Before the first step, [Cook Mode](../architecture/cook-mode.md) lists what to get out, in the groups of the recipe, such as "Dry" and "Wet". When a line such as "pasta" fits two food items, it selects the one to use first, and you only check it. Then it shows one step in large type, with the ingredients of that step, and the best photo of that step from an earlier meal. A camera button keeps a new one. The buttons are large, because your hands are dirty. The screen stays on, and a step with a time has its timer. When the time is up, the alarm rings until you tap "OK", or for one minute. When you finish, the plugin takes the food out of the pantry. You can add a photo, a rating, and a note for the next time.

## The settings fit the plugin to your vault

You tell the plugin which folder has your recipes and which folder is your pantry, so the other notes of your vault stay out of the kitchen. You also select the font, the accent colour, and the sound of the timer. The accent colour can come from your theme.

## Each part has one look

The name of an item has the same size in each list, and each action is the same button in each part. Each button answers your finger the same way, with a small circle where you press, and each motion lands softly, with no bounce. An action that moves you forward, such as "Cook" or "Done", is the same round button in the accent colour, and a screen of its own, such as Cook Mode, grows from the button that you tapped. So you find the name and the number of an item at the same place, with a quick look. The text follows the zoom of Obsidian: when you make the text larger, the kitchen gets larger too. The [look](../architecture/look.md) follows the light and the dark scheme of Obsidian.

## Your recipes are notes that last

A recipe is a plain [note](../architecture/notes-of-the-kitchen.md): a title, the ingredients, and the steps. Any text editor can open the file, with or without the plugin.

You do not type the format yourself. ["Add recipe"](../architecture/intake.md) takes a recipe from a cookbook or a family card one line at a time, and each line shows the food item that it found. "Save" writes a correct note, with a link to each food item, and a new food item for each food that the pantry does not know. The source and a photo of the card stay below the title. An old note that is not a recipe gets the button ["Convert"](../architecture/convert.md), which takes it through the same flow. ["Edit"](../architecture/edit.md) on an open recipe opens it in intake again, right in its card, and "Save" keeps its groups, its step photos, and its records.

Each photo of a recipe goes into the folder `Photos` next to your recipes, sharp and small enough for Obsidian Sync. A recipe card shows the photo of your last meal, and a tap opens the [gallery](../architecture/gallery.md) of each meal, with its rating and its note.

## Your phone and your computer, with no account

The plugin works on the two devices and with no connection. Obsidian moves the vault between them. The plugin sends your data to no server.

## Further reading

- [Vision](../vision.md): the problem that these features solve.
