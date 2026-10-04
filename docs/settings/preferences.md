---
title: Preferences
summary: 'A preference is a rule of the app that you can change. Three questions decide which rules get one.'
parent: README.md
updated: 2026-10-04
---

[Wiki](../README.md) / [Settings](README.md) / Preferences

# Preferences

A preference is a rule of the app that has a value, and you can change the value. This page tells which rules become a preference, and which kinds the app has.

## The problem

The app is full of numbers. A week has five meals. A perishable food gets a doubt after seven days. Each number is correct for one kitchen and wrong for a different one. A person who cooks three times in a week sees two empty slots, each week.

But a switch has a cost. You must read it and understand it, and you can set it wrong. A screen with forty switches is a worse app than a screen with ten.

## The test: three questions

A rule becomes a preference only when the answer to each question is "yes".

1. **Do two kitchens need a different value?** The number of meals in a week: yes. The size of a photo: no.
2. **Can you give the value with no knowledge of the app?** "Four meals" is a fact about your life. "The speed of a swipe" is not.
3. **Is the app unable to learn the value?** The phone knows your language and how you write a date. So the app asks the phone, and not you.

The rules that do not pass are on the page of [what stays fixed](what-stays-fixed.md).

## Two kinds

| Kind                                           | It changes                  | Example         |
| ---------------------------------------------- | --------------------------- | --------------- |
| [Planning preference](planning-preferences.md) | What the app proposes.      | Meals in a week |
| [Device preference](device-preferences.md)     | How this one phone behaves. | Timer sound     |

The kind is important, because a planning preference is a fact about your kitchen, and a device preference is a fact about one phone. This decides [where the value is kept](how-a-preference-works.md).

## Each preference has a default

The default is the value that the app uses until you change it. It is the value that is correct for most kitchens. So the app works with no visit to Settings, and a preference is never a question that you must answer first.

## An example

"Meals in a week" passes the test: kitchens differ, you know your number, and the app cannot know it. Its kind is planning, and its default is 5.

## Further reading

- [Settings](README.md): the screen that shows the preferences.
