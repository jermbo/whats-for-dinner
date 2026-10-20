---
title: Unit test stories
summary: "The user stories of the unit tests in version 0.8.0: ten pieces of work, one for each critical path, with the sequence in which they depend on each other."
parent: ../README.md
updated: 2026-10-20
---

[Wiki](../../README.md) / [Features](../README.md) / Unit test stories

# Unit test stories

The unit tests check the rules of the kitchen on the computer, in seconds, at each change. This page lists their user stories for version 0.8.0. Each story is one piece of work that one agent or one person can complete.

## The goal of the feature

When you add a function, the tests tell you that the old functions still work. After 1.0, the form of a note is hard to change, so the tests also check that each note that the plugin writes reads back the same. The [spec](../../initiatives/unit-tests/spec.md) has the scope, and its decision log has the reason for each choice.

## The stories

| Story                                                                                       | Persona | Depends on |
| ------------------------------------------------------------------------------------------- | ------- | ---------- |
| 1. [Run the tests](unit-tests-run-the-tests.md)                                             | Maker   | Nothing    |
| 2. [Test the level and the food item note](unit-tests-pantry-level-and-food-item-note.md)   | Maker   | Story 1    |
| 3. [Test the match of an ingredient](unit-tests-match-an-ingredient.md)                     | Maker   | Story 1    |
| 4. [Test the recipe note and intake](unit-tests-recipe-note-and-intake.md)                  | Maker   | Story 1    |
| 5. [Test the plan note](unit-tests-plan-note.md)                                            | Maker   | Story 1    |
| 6. [Test the shopping list](unit-tests-shopping-list.md)                                    | Maker   | Story 1    |
| 7. [Test the shopping note and the receipt](unit-tests-shopping-note-and-receipt.md)        | Maker   | Story 1    |
| 8. [Test put away](unit-tests-put-away.md)                                                  | Maker   | Story 1    |
| 9. [Test the end of a meal](unit-tests-end-of-a-meal.md)                                    | Maker   | Story 1    |
| 10. [Test the dates](unit-tests-dates.md)                                                   | Maker   | Story 1    |

The maker is you at the computer, when you change the code of the plugin. One change can break an old rule, with no sign on the screen.

## The sequence of the work

A story can start when the stories that it depends on are done. This gives two steps. The stories of one step can be built at the same time.

| Step | Stories   | What you have after the step                                                            |
| ---- | --------- | --------------------------------------------------------------------------------------- |
| 1    | 1         | The command `npm test`, the tests of amounts and units, and the page "Unit tests".      |
| 2    | 2 to 10   | A test of each critical path, and of the bad notes of each reader.                      |

Stories 6, 8, and 9 start with a refactor step: a rule moves from the state or a screen to the domain, with no change that you can see.

## How you check a story

These stories change nothing on the phone. You run `npm test`, and each test passes. Then you break one rule of the story on purpose, and the test with the name of that rule fails. After that check, the story is `done`. The check lists of `test-vault/` do not change.

## Further reading

- [Workflow](../../standards/workflow.md): where the stories come from, and what occurs after them.
- [User story](../../standards/user-story.md): the form of each story of this page.
