---
name: implement
description: Build one user story. Make the architecture pages agree with it, write the code, add the useful tests, and check each acceptance criterion. Steps 3 to 5 of the workflow.
argument-hint: '[story file or title]'
disable-model-invocation: true
---

# Implement

You build one user story. These are steps 3 to 5 of `docs/standards/workflow.md`: elevate, code, and tests. The pages change before the code, and the owner approves them before the code starts.

## Before you start

1. Read the story, and tell the owner its title. If the owner gave no story, show each story that can start, and ask which one.
2. A story can start when its status is `ready`, and each story that it depends on is `built` or `done`. If not, stop and say so. A story with `needs-info` needs a grill first. `docs/standards/user-story.md` gives each status.
3. Read the pages that "Architecture" links to.
4. Read the spec and the decision log of the initiative. The list page of the feature links to them.
5. Read the code of each part that the story touches.

## Elevate: the pages first

The story tells what the persona does. The architecture pages tell how the system works. After this step, they agree.

1. For each requirement, find the architecture page that tells it.
2. Change a page that tells it differently. Add a page for a mechanism that has no page.
3. Move each word that the story uses from the glossary of the initiative to `docs/glossary.md`.
4. Add each new page to "Architecture" of the story.
5. Change `docs/features/README.md` when the story changes what the plugin does, and `docs/features/roadmap.md` when it changes what is left.

A page tells the system as it is when the story is done. Each page follows `docs/standards/documentation-standards.md`.

## The owner reads the pages

Stop here, before any code. This is the last moment in which a change is only words.

Show the owner:

- each page that you changed or added, with one line that tells what is different
- each place where the story, a page, and the code did not agree, and what you did about it
- each decision that a page needs, and that the story and the spec do not have. Do not make that decision yourself.

Start the code when the owner approves the pages.

## Code

- Build what the story has, and nothing more. If you see other work, tell the owner. Do not do it.
- Follow `docs/standards/code-standards.md`, and the page of each rule that your change touches.
- Run `npm run check` after each piece of the work, not only at the end.
- Do not add, remove, or change a package. Ask the owner first, with the reason.

## Tests

A test must be useful. You do not make a test only to have a test.

- A criterion about a rule that code decides with no screen is worth an automatic test: an amount, a level, the parse of a note. Its GIVEN, WHEN, and THEN are the test.
- A criterion about the screen or about the feel is a check on the phone. It gets no automatic test.
- If `package.json` has no test command, do not add one. Give the owner the list of the criteria that are worth a test.

## Check each criterion

Go through the acceptance criteria, one at a time. Each one gets one of three answers.

| Answer | Meaning                                                    |
| ------ | ---------------------------------------------------------- |
| True   | A test shows it, or you read the code that does it.        |
| False  | Correct the code, and check again.                         |
| Phone  | Only the owner can see it, in the test vault on the phone. |

Then read your changes as the owner will. Each file has one job, and nothing is outside the story.

## The end

1. Set the status of the story to `built`, and set `updated`. Do not set `done`: the owner does that after the test on the phone.
2. Do not commit, and do not make a branch. The owner reads the changes first.
3. Tell the owner, in a short list:
   - the pages that changed
   - what you built
   - the criteria to check on the phone, by their names: "AC 3 and AC 5 a"
   - the criteria that are worth a test
   - the next story that can start
