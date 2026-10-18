# Check list: units of the vault

This list tests the three units stories of version 0.6.0, on the phone. Do the parts in sequence. Each line has one action and what you must see. The text in brackets is the story and its criterion, from [Units stories](../docs/features/v0.6.0/units-stories.md).

## Before you start

- [ ] The setting "Units" in the plugin settings is "Metric".
- [ ] `Larder/Pantry/Sugar.md` has one row `250 g`. `Onions.md` has one row `500 g`. `Water.md` has one row `tap`.
- [ ] `Recipes/Boiled eggs.md` has the line `*1 l* water`.

## A. A spoon against grams

- [ ] Open Recipes, and open the pancakes. The line of sugar ("1 tablespoon") has the tick of "in the pantry", and no sticker. (Story 1: AC 1 and 1 a)
- [ ] Set `Sugar.md` to `10 g`. The line of sugar has "Low". (Story 1: AC 2)
- [ ] Put the pancakes in the plan, and open Shop. The list has sugar with "5 ml". (Story 1: AC 3)
- [ ] Set `Sugar.md` to `250 g`. Cook the pancakes to the end, with sugar used. `Sugar.md` has `235 g`. (Story 1: AC 4)

## B. Food to check

- [ ] Open Recipes, and open "Pasta with tomato sauce". The line of onion has the sticker "Check". The count of the recipe has the onion in the pantry. (Story 2: AC 1 and 1 a)
- [ ] Open "Boiled eggs" in Cook Mode. Get out shows "Check" on the line of water. (Story 2: AC 2)
- [ ] Put the pasta in the plan, and open the Plan. Its meal card says "· 1 to check". (Story 2: AC 3)
- [ ] Open Shop. The list has no row of onions. (Story 2: AC 4)

## C. One unit system

- [ ] Open "Add to pantry". Type "Salt", the amount "26 oz", and tap "Save". `Salt.md` has a new row `737 g`. (Story 3: AC 1)
- [ ] Open the form of sugar. Type the amount "1 jar", and tap "Save". The form says "Give the weight or the volume from the label, such as 250 g, or a plain count, such as 6." `Sugar.md` does not change. (Story 3: AC 2 and 2 a)
- [ ] Open the form of a package of milk. Type the size "1 gal", and tap "Save". The row has the size `3.79 l`. (Story 3: AC 3)
- [ ] Open "Add to pantry". Type "Water", the amount "tap", and tap "Save". `Water.md` has a second row `tap`. (Story 3: AC 4)
- [ ] At put away, open a line of eggs. Select "Another amount", type "12", and tap "Put away". The new row of eggs has `12`. Type "1 carton" on a second line: the line shows the message, and "Put away" does nothing. (Story 3: AC 5)
- [ ] Set "Units" to "Imperial". Add "Rice" with "500 g". `Rice.md` has a row `17.64 oz`. Set "Units" back to "Metric". (Story 3: AC 6)
- [ ] Run "Start setup again" in a copy of the vault. The first step has the chips "Metric" and "Imperial", with "Metric" on. (Story 3: AC 7)
