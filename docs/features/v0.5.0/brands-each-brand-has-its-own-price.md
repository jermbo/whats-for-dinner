---
title: Each brand has its own price
summary: "At put away, the price of a line starts from the last regular price of the selected brand, and it changes with the brand."
parent: brands-stories.md
persona: Keeper
depends-on: [brands-check-the-brand-at-put-away.md]
status: ready
---

[Wiki](../../README.md) / [Features](../README.md) / [Brands stories](brands-stories.md) / Each brand has its own price

# Each brand has its own price

As the [keeper](../../personas.md), I want the price of a line to start from the last regular price of the brand that I selected, so that a different brand gives its own price with no typing.

## Requirements

1. The price of a line starts from the regular price of the selected brand
   - a. The regular price is the price of the newest complete receipt row of the item with that brand and no sale mark
   - b. A row has the brand with the rule of [Check the brand at put away](brands-check-the-brand-at-put-away.md)
2. With no such row, the price starts from the regular price of any brand, as today
3. A tap on a different brand changes the price of the line
   - a. A price that you typed on the line stays
   - b. The new price fades in. With "Reduce motion", it shows with no motion
4. The hint of the price field, after a tap on "Sale", is the regular price of the selected brand
5. An item is known when its last receipt has an amount, a place, and a price, as today. The brand does not change this

## Acceptance criteria

Each criterion starts with the vault of the [list page](brands-stories.md#what-the-vault-needs), and taco seasoning in the cart.

1. GIVEN Brand A is selected on the line of taco seasoning WHEN the keeper looks at the price THEN the price is 2.49, from `2026-10-11`, and not the sale price 1.79 of `2026-10-14`
2. GIVEN Brand A is selected WHEN the keeper taps Brand B THEN the price is 1.99
3. GIVEN Brand A is selected WHEN the keeper taps the chip "Brand C" THEN the price is 2.49, the regular price of any brand
4. GIVEN no brand is selected WHEN the keeper looks at the price THEN the price is 2.49
5. GIVEN the keeper typed 2.29 on the line WHEN the keeper taps Brand B THEN the price is 2.29
6. GIVEN Brand B is selected WHEN the keeper taps "Sale" THEN the price field shows the hint 1.99
7. GIVEN Brand B is selected WHEN the keeper taps "Put away" THEN the row of the receipt has the price 1.99 and the brand `[[Taco seasoning - Brand B.jpg]]`

## Depends on

- [Check the brand at put away](brands-check-the-brand-at-put-away.md): the selected brand, and the rule that finds a brand in a receipt.

## Architecture

- [Facts of an item](../../architecture/put-away-facts.md): the regular price, which is now a price for each brand.
- [Receipt](../../architecture/receipt.md): the history of the prices.
- [Spec: brands and photos](../../initiatives/brands-and-photos/spec.md): scope 11.
