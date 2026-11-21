# Check list: cook day

This list tests the five cook day stories of version 0.12.0, on the phone and on the desktop. Each line has one action and what you must see. The text in brackets is the story and its criterion.

The stories are: 1 [Set the serve time and the times of the dishes](../docs/features/v0.12.0/cook-day-set-the-times.md), 2 [Cook the dishes at the same time](../docs/features/v0.12.0/cook-day-cook-the-dishes.md), 3 [Know when to start](../docs/features/v0.12.0/cook-day-know-when-to-start.md), 4 [See where the day is](../docs/features/v0.12.0/cook-day-see-where-the-day-is.md), 5 [See the day on a timeline, and get out the food](../docs/features/v0.12.0/cook-day-timeline-and-get-out.md).

## Before you start

- [ ] The build made `main.js` again. Put the plugin off and on, or restart Obsidian.
- [ ] `Larder/Occasions/Thanksgiving 2026.md` has the property `serve: "15:00"` and the lines of the [cook day stories](../docs/features/v0.12.0/cook-day-stories.md#the-test-data): Beef tacos with `3h`, Apple crumble with `start 13:30`, Gravy with `20 min`.
- [ ] The recipe "Honey glazed carrots" has no time in its steps. The recipe "Beef tacos" has a step with a time, such as "Cook for 8 minutes".
- [ ] The note `Cook day trial` is for 2026-11-21 only: serve 12:00, and the starts are from 10:45 to 11:55. Use it for parts C, E, F, and G on that day. On a later day, set its `date` to today, and change `serve` and the `start` of Cranberry sauce to a time near now.
- [ ] For the colours and the alarm (part C), set the `date` of the note to today, and set the starts a few minutes after the time of the device.

## A. The serve time and the times

Open Thanksgiving 2026.

- [ ] Below the ink card, a chip says "Serve at 15:00", and the olive pill "Cook day" is at its right. On a narrow phone they wrap, and nothing runs out of the screen. (1, AC 1)
- [ ] Tap the chip, set 17:30. The note has `serve: "17:30"` and its other lines are the same. (1, AC 2)
- [ ] Tap "Clear". The note has no `serve` line, and the chip says "Set serve time". (1, AC 3)
- [ ] Set the time again to 15:00. In "Who brings", under "You": Beef tacos says "Start 12:00". Gravy says "Start 14:40". Apple crumble says "Start 13:30". (1, AC 5 to 7)
- [ ] Set the serve time to 17:00. Apple crumble still says "Start 13:30". The others move. (1, AC 6)
- [ ] Honey glazed carrots shows "Set time". Pumpkin pie and Rolls show no start. (1, AC 9, 12, 13)
- [ ] A long dish name wraps to two lines and ends in "…". "Cook" stays in view. (the card fix)
- [ ] Tap Gravy. The sheet has a part with "−", "20 min", "+" and "Start at". Tap "+": the line in the note says `35 min`, and the chip says "Start 14:25". (1, AC 10)
- [ ] Set "Start at" of Gravy to 14:00. The note has `start 14:00`. Tap "Auto": the field is gone. (1, AC 11)

## B. Cook day

- [ ] Tap "Cook day". The frame turns dark with a circle. The chips are Schedule, Beef tacos, Apple crumble, Honey glazed carrots. Pumpkin pie and Gravy have no chip. (2, AC 2)
- [ ] "Schedule" has the rows in the sequence 12:00, 13:30, 14:40, and "–" for the carrots. Gravy has a check and no "Cook". (2, AC 3 and 4)
- [ ] Tap "Cook" on Beef tacos. Cook Mode shows "Get out". Go to step 2. (2, AC 5)
- [ ] Tap the chip "Apple crumble", and then "Beef tacos". Step 2 shows, and the counter keeps its ticks. (2, AC 6)
- [ ] Start a timer on a step of Beef tacos. Tap the chip "Apple crumble". The chip of Beef tacos and its row in "Schedule" show a badge with a pulsing dot and the time, and the time goes down. (2, AC 7; 3, AC 1)
- [ ] Tap the badge on the chip. Beef tacos shows, on its step. Cook day has no button that stops the timer. (3, AC 3 a and 4)
- [ ] Tap the check of Gravy in "Schedule": it is struck and goes to the foot of the list. (2, AC 3 c)
- [ ] In Apple crumble, tap "Exit". "Schedule" shows, and Beef tacos still has its page. (2, AC 8)
- [ ] Finish Apple crumble with "Update the pantry". It is struck in "Schedule", and its line has `[x]`. Beef tacos has no mark. (2, AC 9)
- [ ] With a timer running, tap "Exit" at the top. The occasion screen shows, with a notice about the timer. (2, AC 11)
- [ ] Without a timer, "Exit" goes back to the screen of the occasion. (2, AC 10)
- [ ] The occasion is 5 days away: "Cook day" opens, and no chip has a colour. (3, AC 10)

## C. Know when to start (the date is today)

- [ ] 20 minutes before the start of Beef tacos: its chip has no colour. (3, AC 6)
- [ ] 10 minutes before: the chip is amber. (3, AC 5)
- [ ] Open the dish early: the chip has no colour, and no alarm rings for it. (3, AC 8)
- [ ] Leave the dish closed at its start: the alarm rings, and the banner says "Time to start Beef tacos". The chip is tomato. (3, AC 7 and 9)
- [ ] "OK" stops the alarm and takes the banner away. The chip stays tomato. (3, AC 9 a)
- [ ] Again with another dish: "Open" shows the dish and stops the alarm. (3, AC 9 b)
- [ ] Open "Cook day" after a start has passed. The chip is tomato, and no alarm rings. (3 req 3)
- [ ] A timer that rang shows "Time is up" in red on its chip and its row. You stop it inside the dish, with "OK". (3, AC 3)
- [ ] The sound is "off" in the settings: the banner and the colour still show. (3, req 3 d)

## E. The place card and the states (use `Cook day trial`)

- [ ] The top is a paper card with an olive stripe: the date, an olive sticker "Serve 12:00", "Cook day trial" in large type, a dashed fold, "Serve in …", and "0 of 7 done" with a bar. (4, AC 1 to 3)
- [ ] The line below says "Cranberry sauce is N min late" in red, because its start 10:45 is past. Its chip is tomato. (4, AC 7)
- [ ] Open Cranberry sauce. The card shrinks to the name, the sticker, the bar, and the next line. The next line names a different dish. (4, AC 5 and 8)
- [ ] Go to step 2. Tap "Schedule" at the top of the chips: the row of Cranberry sauce has an olive edge, "Cooking · Step 2 of 4", and a bar. Its chip has an olive edge and a line of progress. (4, AC 4)
- [ ] Tap "Running late: serve 15 min later". The sticker says "Serve 12:15", and the note has `serve: "12:15"`. The starts of the dishes with no `start` field move 15 minutes. Cranberry sauce stays at 10:45. (4, AC 9)
- [ ] Tick the check of Gravy. The bar of the card says "1 of 7 done". (4, AC 3)

## F. The timeline

- [ ] Tap "Timeline". The axis has the hour marks, a dashed "Serve" line, and a red "Now" line. (5, AC 1 to 3)
- [ ] Each bar goes from the start to the end of the time. The bar of Cranberry sauce is tomato, and the bar of a dish that is open is olive. (5, AC 1)
- [ ] Gravy has a hatched bar. A tap does nothing. (5, AC 6)
- [ ] Tap the bar of Honey glazed carrots. Its Cook Mode shows. (5, AC 5)
- [ ] On the note `Thanksgiving Feast` (date in 5 days), the timeline has no "Now" line. (5, AC 4)
- [ ] On a phone, the bars, the names, and the hour marks fit. Nothing runs out of the card. The last hour mark is complete.

## G. Get out

- [ ] Tap "Get out". Each of your dishes with a recipe is a group, and Honey glazed carrots shows "×2". (5, AC 8)
- [ ] Tap a row: it is ticked, and "N of M on the counter" goes up. The pantry does not change. (5, AC 9)
- [ ] Gravy has no group, because it has no recipe. A dish with a mark has no group. (5, AC 10)

## H. Timer badge with a short timer (use `Timer test toast`)

- [ ] Open Timer test toast, go to step 1, and tap "Start" (1 minute). Tap "Schedule" at the top: the chip and the row show the badge with the time that goes down.
- [ ] Start a second timer on step 2. The badge says "2 timers".
- [ ] Let one timer end. The badge says "Time is up" in red, and the alarm rings. Go into the dish and tap "OK" to stop it.

## I. Nothing breaks out of its box (the rule of [space](../docs/architecture/space.md))

- [ ] Open "Thanksgiving Feast", and look at "Menu" and "Who brings" on a phone and on a wide window. Make the window narrow and wide. Each sticker ("You", a name, "Who brings?") stays inside its card, and the card keeps the width of its column. No row line goes past a card.
- [ ] Add a dish with a very long name, such as "Grandmother's famous slow roasted turkey with honey and herbs". The name ends in "…" after two lines, a tap on it shows the sheet, and the sticker and "Cook" stay in view.
- [ ] Give a guest a long name, such as "The Smith-Williamson family". Its sticker ends in "…" and stays in its card.
- [ ] In "Cook day", a chip with a long dish name ends in "…", and the start or the timer stays in view.
- [ ] A timer of 3 hours shows "2:59:46", and a timer of 8 minutes shows "8:00". The same clock shows in Cook Mode. (decision 47)

## J. The session stays (story 6)

- [ ] In "Cook day trial", open Roast turkey and go to step 2. Open Sage stuffing and tick 2 rows on "Get out" of the dish. Tick 2 rows on "Get out" of Cook day. Start a timer of 1 minute on a step. (6, AC 1)
- [ ] Tap "Exit". The notice says the timer keeps its time and rings only while Cook day is open. The occasion screen shows "Resume cook day", "2 open · 1 timer", and "Discard". (6, AC 3; 2, AC 11)
- [ ] Tap "Resume cook day". The same view shows. Roast turkey is on step 2, Sage stuffing has its 2 ticks, "Get out" has its ticks, and the timer shows the time that is left. (6, AC 1 and 4)
- [ ] Exit, and restart Obsidian. Open the occasion. "Resume cook day" is there, and the same state comes back. (6, AC 2)
- [ ] Start a timer of 1 minute. Exit, and wait 2 minutes. Resume: the timer says "Time is up", with no sound. (6, AC 5 a)
- [ ] Turn on "Sound for a timer that ended while you were away" in the settings, and repeat. The alarm rings. Turn it off again. (6, AC 5 b)
- [ ] In the note, move the line of Roast turkey above the other lines. Resume: Roast turkey still has step 2 and its timers. (6, AC 6)
- [ ] In the note, remove the line of Sage stuffing. Resume: Roast turkey is open, and Sage stuffing is not. (6, AC 7)
- [ ] In a dish, tap "Exit". "Schedule" shows, and the row of the dish says "Continue". The dish keeps its page. (2, AC 8)
- [ ] Tap "Discard". The button says "Cook day", and no dish is open. (6, AC 8)
- [ ] Finish a dish with "Update the pantry". It is struck, and it is not open in a new session. (6, AC 9)
- [ ] On a second device with the same vault, open the occasion. It has no "Resume cook day". (6, AC 10)

## D. Wide screen

- [ ] On the desktop, the chips, the schedule, and Cook Mode keep the same sequence. Cook Mode inside "Cook day" shows its title on the left and its work on the right. Nothing sticks out of the frame.
