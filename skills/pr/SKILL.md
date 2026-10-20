---
name: pr
description: The form of a pull request of this repository. Use when you write the title and the body of a pull request.
---

# PR

The message of a pull request tells what changed, the choices that no story has, and the danger of the merge. You write the text. You open the pull request only when the owner tells you to.

`docs/standards/pull-request.md` has the form of the message, with an example. Read it first. This skill tells only where each part comes from.

## Before you write

1. Find what the branch changes: `git log main..HEAD --oneline` and `git diff main...HEAD --stat`.
2. Look at `git status`. Work that is not committed is not in the branch. If the message needs it, tell the owner.
3. Find the stories that the branch completes: the stories of `docs/features/<version>/` with the status `built` or `done`.
4. Find what somebody ran or saw: `npm run check`, `npm test`, a check of the owner on the phone.

## Where each part comes from

| Part                                  | Its source                                                                                    |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| Introduction                          | The story sentences, and the list page of the stories.                                        |
| Added, Changed                        | The requirements of the stories, and the diff of the screens.                                 |
| Removed                               | Each control, setting, text, and value of a note or of the data file that the diff takes out. |
| Choices that the stories did not have | The decisions of the build: the answers of the owner in `implement`, and your own choices.    |
| Door                                  | The diff of each file that reads or writes a note or the data file.                           |
| Blast radius                          | Each file that the diff changes and that no story names.                                      |
| Tested                                | Only what somebody ran or saw.                                                                |

## Rules for the text

- Look for "Removed" in the diff, not in the stories. A story seldom tells what it takes out.
- A requirement is not a line of the message. Write the thing that the owner sees, in fewer words.
- A story with the status `done` is a test on the phone. A story with the status `built` is not.

## What you give the owner

The title in one block, and the body in a second block, so that the owner can copy each of them. Then tell what is not committed, if step 2 found something.
