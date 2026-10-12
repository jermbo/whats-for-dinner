---
name: pr
description: The form of a pull request of this repository. Use when you write the title and the body of a pull request.
---

# PR

The body of a pull request shows the change, gives the evidence that it works, and tells the danger of the merge. You write the text. You open the pull request only when the owner tells you to.

## Before you write

1. Find what the branch changes: `git log main..HEAD --oneline` and `git diff main...HEAD --stat`.
2. Find the stories that the branch completes: the stories of `docs/features/<version>/` with the status `built` or `done`.
3. Find what somebody ran or saw: `npm run check`, a test, a check of the owner on the phone.

## The body

````markdown
## Summary

<the smallest view that shows the change>

## Stories

- [Title of the story](docs/features/<version>/<story>.md)

## Evidence

- **Before:** <what the plugin did>
  **After:** <what it does now, and how you know>

## Merge danger

**Door:** <one-way or two-way>

**Blast radius:** <what the change can touch that it did not intend>
````

## Summary

Select the smallest view that makes the main point clear. One view is the usual number. Put two or three sentences next to it, with no introduction.

| The change is in              | The view                                                          |
| ----------------------------- | ----------------------------------------------------------------- |
| A rule or a calculation       | Pseudocode                                                        |
| Who calls what                | A call tree                                                       |
| The pieces of a screen        | A component tree                                                  |
| The place of the files        | A file tree of one or two levels                                  |
| A flow between parts          | A Mermaid diagram, with the rules of `docs/standards/diagrams.md` |
| A thing that was there before | One of these views as a `diff`                                    |

Keep only the names that the point needs.

```diff
 <PantryPart>
   <PartHead>
+  <Bar>
+    <FindField>
+    <Chip>
   <StockLine>
```

## Stories

Give the link of each story that the branch completes. Do not copy its requirements.

## Evidence

- Evidence is what somebody ran or saw. Do not write that a check passed when nobody ran it.
- A story with the status `done` is evidence: the owner tested it on the phone. Tell which stories are `done`, and which are only `built`.
- For a change of the screen, a screenshot from the phone is the best evidence. The owner makes it: leave a place for it, and say so.
- For a rule, give the acceptance criterion and its result, before and after.
- Give the result of `npm run check` in one line.

## Merge danger

- Through a two-way door you can go back with no loss. Through a one-way door you cannot.
- In this plugin, a one-way door is a change in the form of a note or of the data file. The vault of the owner has real notes, and the plugin does not convert them. Tell what the owner must do with those notes.
- The blast radius is what can break outside the stories: a different part of the kitchen, a narrow phone, the vault on the second device.

## Rules for the text

- Use the words of `docs/glossary.md`.
- The title tells what the owner can do after the merge. If the branch is a version, the title ends with it: "One bar for each part - v0.2.0".
- No line that names a tool or an author.
