---
name: prototype
description: Build a throwaway prototype to answer one design question. Use when the owner wants to see options for a screen side by side, or to try a state model before it is built.
---

# Prototype

A prototype is code that you throw away. It answers one question, and the question decides its form.

## Select the form

| The question                                               | The form                                                                                                    |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| "Does this state model hold?" "What occurs when … then …?" | [LOGIC.md](LOGIC.md): one HTML file with buttons that push the model through the hard cases.                |
| "What must this look like?" "Which layout?"                | [UI.md](UI.md): some variants of one part of the kitchen, in the plugin, with a bar to change between them. |

The two forms are very different, and the wrong one is waste. If the question fits the two of them, ask the owner which one.

## Rules for the two forms

1. **The question comes first.** Write it in one sentence at the top of the prototype, where the owner sees it.
2. **It shows that it is a prototype.** Each file has the word `prototype` in its name or in the name of its folder.
3. **No polish.** No test, no error handling beyond what makes it run, and no shared abstraction.
4. **It does not write to the vault.** The state is in memory. A prototype can read the notes of `test-vault/`.
5. **It shows its state.** After each action, the owner sees what changed.
6. **It ends with a verdict.** Write the question, the options, the option that won, and the reason, as a decision in the decision log of the initiative. The files go away, so the verdict must be complete without them.
7. **Then it goes away.** When the verdict is written, remove the files, unless the owner wants to keep them. Do not commit, and do not make a branch.
8. **The real code is new.** A prototype has no tests and no care. Do not move its screens into the plugin as they are.
