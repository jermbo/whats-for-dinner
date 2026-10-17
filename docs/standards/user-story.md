---
title: User story
summary: "The form of a user story: one sentence, numbered requirements, and acceptance criteria that are each true or false."
parent: workflow.md
---

[Wiki](../README.md) / [Workflow](workflow.md) / User story

# User story

A user story is one piece of work that an agent or a person can complete. This page gives its form, so that each story reads the same, and each line of a story has a name.

## Each line has a name

A review of a story must be exact: "requirement 1 a looks off", or "AC 4 d needs work". So each line has a number, and each line below it has a letter.

Markdown has no list with letters. So the letter is text after a bullet, and each viewer shows it.

## The parts, in their sequence

| Part                | Form                                                                             |
| ------------------- | -------------------------------------------------------------------------------- |
| Metadata            | The four fields of a page, and `persona`, `depends-on`, and `status`.            |
| The story           | One sentence: "As the keeper, I want …, so that …". It names one persona.        |
| Requirements        | A numbered list, with letters for the details.                                   |
| Acceptance criteria | A numbered list of checks, with letters for more results.                        |
| Depends on          | A link to each story that must be done first, with the reason.                   |
| Architecture        | A link to each page that tells why and how. The story does not repeat that page. |

The [personas](../personas.md) page has the personas that a story can name.

## Requirements

A requirement is one short line: what the persona does, or what the plugin shows. A limit or a detail of it is a line with a letter. Give exact values, and do not use a word such as "about".

```markdown
8. Tap "Done" to write the new amounts into the food item note
   - a. A changed row keeps its place and its use-by date
   - b. A row with an amount of 0 goes out of the table
```

## Acceptance criteria

A criterion is one check that is true or false. It is one line with three words in capitals: GIVEN a state, WHEN one action, THEN one result. A second result of the same action is a line with a letter, and it starts with AND.

```markdown
8. GIVEN the bar of rice is open on "Kitchen pantry" WHEN the keeper presses the bar at 3 kg THEN the amount of "Kitchen pantry" is "1000 g"
   - a. AND the amount of "Downstairs pantry" is "2 kg"
```

Use the names and the amounts of the test vault. A check with real values becomes a test later, with no change.

## The status tells who acts next

A story has one status at a time. The status does not tell how good the story is. It tells who must do the next thing.

| Status       | Meaning                                           | Who acts next                  |
| ------------ | ------------------------------------------------- | ------------------------------ |
| `needs-info` | The story is an idea, and its details are open.   | You, in a grill                |
| `ready`      | The story is complete, and you approved it.       | An agent or a person builds it |
| `built`      | The code is there. Nobody tested it on the phone. | You, with the phone            |
| `done`       | You tested it on the phone, and it works.         | Nobody                         |

You can write a story at any moment, with only its title and its sentence. It gets the status `needs-info`, so that nobody builds it before its grill. Only you make a story `done`.

## The file

A story is one file in `features/<version>/`. Its name is the feature and the title: `pantry-correct-an-amount.md`. Each feature has one page that lists its stories and shows which story needs which.

## The size and the groups

This page has no rule for the size of a story, or for how its lines are in groups. An example shows that better than a rule. Use [Correct an amount with the bar](../features/v0.1.0/pantry-correct-an-amount.md) as the model. With [Set an amount with the keyboard](../features/v0.1.0/pantry-set-an-amount-with-the-keyboard.md), it shows a clean cut between two stories: each story sentence covers each of its requirements.

## Further reading

- [Pantry stories](../features/v0.1.0/pantry-stories.md): the page that lists the stories of one feature.
