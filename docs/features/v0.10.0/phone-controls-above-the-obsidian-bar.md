---
title: Controls above the bar of Obsidian
summary: "On a phone, the end of each screen and each control at the bottom stay above the bar that Obsidian shows at the bottom of the screen."
parent: phone-stories.md
updated: 2026-10-27
persona: Keeper
depends-on: []
status: built
---

[Wiki](../../README.md) / [Features](../README.md) / [Phone stories](phone-stories.md) / Controls above the bar of Obsidian

# Controls above the bar of Obsidian

As the [keeper](../../personas.md), I want each control of the kitchen above the bar of Obsidian, so that I can see and tap it on my phone.

## Requirements

1. On a phone, the end of each screen of the kitchen has room for the bar of Obsidian
   - a. Each screen: the four parts, setup, intake, Cook Mode, and the gallery
   - b. The room is the height that the bar covers, as the phone shows it, and not a fixed number
   - c. The room stays when Obsidian hides its bar during a scroll, so that the screen does not jump
2. A control that stays at the bottom of the screen sits above the bar
   - a. The foot of each stage of the Shop: "Go shopping", "Put away", the totals, and "Undo"
   - b. The background of the foot fills the room behind the bar, so that no line shows through below the foot
3. On a computer, and on a device with no bar at the bottom, the end of each screen is as before

## Acceptance criteria

Each criterion starts on the owner's Android phone, with the test vault.

1. GIVEN the Pantry part WHEN the keeper scrolls to the end THEN the last bin is fully above the bar of Obsidian
2. GIVEN the stage "Extras" of the Shop WHEN the keeper looks at the bottom THEN "Go shopping" is fully above the bar of Obsidian
3. GIVEN the cart with 2 items WHEN the keeper looks at the bottom THEN "Put away 2" is fully above the bar of Obsidian
   - a. AND no line of the cart shows between the foot and the bar
4. GIVEN put away WHEN the keeper looks at the bottom THEN the total is fully above the bar of Obsidian
5. GIVEN Cook Mode on the last step WHEN the cook scrolls to the end THEN the last control is fully above the bar of Obsidian
6. GIVEN setup at the step "First food" WHEN the keeper scrolls to the end THEN "Finish setup" is fully above the bar of Obsidian
7. GIVEN the Pantry part at the end WHEN Obsidian hides its bar during a scroll THEN the last bin does not move
8. GIVEN the Pantry part on the computer WHEN the keeper scrolls to the end THEN the space below the last bin is 16 px, as before

## Depends on

Nothing.

## Architecture

- [Space](../../architecture/space.md): the room for the bar of Obsidian.
