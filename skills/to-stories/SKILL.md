---
name: to-stories
description: Divide the agreed spec of an initiative into user stories. Each story is a thin complete slice, with the stories that it depends on. Step 2 of the workflow.
argument-hint: '[initiative slug]'
disable-model-invocation: true
---

# To stories

You divide the spec into user stories. A story is one piece of work that one agent or one person can complete. The owner approves the cut, and then you write the files.

## Steps

1. Read `spec.md` of the initiative. If its status is not `agreed`, stop and say so.
2. Read `docs/standards/user-story.md`, and the model story that it names.
3. Read `docs/personas.md`, and the architecture pages and the code of each part, to know what is there today.
4. Draft the cut, with the rules below.
5. Show the cut to the owner as a list. Do not write a file yet.
6. Change the cut until the owner approves it.
7. Write the stories and the list page.
8. Stop. The next step is `implement`, with one story. Do not write code.

## Rules for the cut

- A story is a thin slice through all layers: the note, the state, the screen, and its motion. "All the state first, then all the screens" is not a cut.
- When a story is done, the owner can test it on the phone with no other new story.
- One session of an agent can complete it.
- The story sentence covers each requirement of the story. Where a requirement is not in the sentence, cut: it is a different story.
- A behaviour is in one story only.
- A story depends only on a story that stops it. A story with no such story can start now.
- Each line of "In scope" is in a story. No line of "Out of scope" is in a story, and no story has a thing that the spec does not have.

If the cut shows a hole in the spec, stop and name it. Do not close it in a story.

## The list that you show

For each story, one numbered line with:

- the title
- the persona
- the stories that it depends on
- what the owner can do when it is done

When a story changes a story that exists, say which one. The owner decides if the old story changes or a new story replaces it.

Then ask one question: is the cut right, in the size of each story and in what depends on what?

## Rules for the files

- The folder is `docs/features/<version>/`. The version is in the name of the branch: `feature/v0.2.0` gives `v0.2.0`. If the branch has no version, ask.
- A story that you write has `status: ready`. `docs/standards/user-story.md` gives each status.
- A story with the status `needs-info` that the spec covers is not a second story. Write it in full, in its file, and set it to `ready`.
- An acceptance criterion uses a food and an amount that `test-vault/` has. Look it up. If the vault has no note for a case, name the note that it needs.
- "Architecture" links only to a page that exists.
- The feature has one list page, such as `pantry-stories.md`: the stories with their persona and what they depend on, and the steps of the work. The stories of one step can be built at the same time.
- The list page links to the spec of the initiative, so that the builder of a story finds the decisions.
