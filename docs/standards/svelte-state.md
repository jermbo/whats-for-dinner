---
title: Svelte state
summary: "When a component uses $state, $derived, or $effect, and where state goes when it has rules of its own."
parent: code-standards.md
updated: 2026-11-01
---

[Wiki](../README.md) / [Code standards](code-standards.md) / Svelte state

# Svelte state

A component has values that change. Svelte has three tools for them: `$state`, `$derived`, and `$effect`. This page tells which tool fits each value, so that a reader finds the line that sets it.

## The problem: an effect that copies a value

A recipe card closes, and its edit form must close too. One way is an effect: "when the card is not open, editing is false". That works, but it runs after the change. For one moment the closed card still has its form. And the reader of `editing` must look through each effect to find what changes it.

So the value tells its own rule. `editing` is a `$derived` that starts again at false each time `open` changes. A tap on "Edit" sets it to true. The rule is in one place, next to the value.

## The rules

1. **A value from other values is `$derived`.** No effect sets it.
2. **A value that starts again is a `$derived` that you can set.** It reads the value that starts it again, and a tap can change it until then.
3. **A tap changes state in its handler.** The handler of the tap is where a reader looks first.
4. **An effect is for a thing outside Svelte.** A timer, a listener of the document, the wake lock, the device, or a write that new notes of the vault start. The effect returns the function that stops the thing.
5. **State with rules of its own is a class.** When the state has its own rules and no markup, it goes into a class in a `.svelte.ts` file next to the component. A class with an effect is made while the component starts.
6. **A transition reads a token.** Its time comes from `tokenTime` of `ui/motion.ts`, as the [motion](../architecture/motion.md) page tells.

## An example: the timers of Cook Mode

A timer of Cook Mode continues when you go to a different step, it rings once at its end, and the alarm is quiet when no timer waits for your "OK". These rules know the alarm, but no markup. So they are the class `CookTimers` in `ui/cook/cook-timers.svelte.ts`. It has one effect, the tick of the clock, because a clock is outside Svelte.

Cook Mode makes the class when it opens, and it shows `timers.all`. A tap on "Start" calls `timers.start` in its handler. The same form holds the moves of the Shop (`ShopMoves`) and the photos of the brands (`BrandPhotos`).

## Further reading

- [One file, one job](one-file-one-job.md): when a component gives a piece of its state to a class or a child.
- [Functions](functions.md): a rule of the kitchen is a pure function, not a class of a screen.
