# Logic prototype

One HTML file, complete in itself, in which the owner pushes a state model with buttons. Use it when the question is about a rule, a state, or the form of the data: a thing that looks correct on paper, and feels wrong with a real case.

If the question is "what must this look like?", use [UI.md](UI.md).

## Steps

1. **Write the question.** One short paragraph at the top of the page: the model, and what you want to know about it.
2. **Put the logic in one pure module.** It is one `<script>` block that knows nothing of the page: no `document`, and no handler of a button. The page calls the module, and the module never calls the page.
3. **Build the page around it.** Plain HTML, CSS, and JavaScript in the one file. No framework, no build, no server, and no package. A double click opens it.
4. **Give the file to the owner**, with its path.
5. **Change it** when the owner asks for a new action or a new scenario.

The file is `docs/initiatives/<slug>/prototype-<question>.html`. If there is no initiative, ask where it goes.

## The form of the module

Select the form that fits the question, not the form that is easy to connect to a page.

| The question is about                | The form                                             |
| ------------------------------------ | ---------------------------------------------------- |
| Events that change one value         | A reducer: a state and an action give the next state |
| Which action is permitted in a state | A state machine, with its states and its moves       |
| A calculation, with no state between | Some pure functions over plain data                  |

This module is the one piece that can go to the plugin when the question has its answer.

## The page, from top to bottom

1. **The question**, in one line.
2. **The state now**, as fields with labels, not as raw JSON. Mark what the last action changed.
3. **Free buttons**: one for each action, always there, in any sequence.
4. **Scenarios**: each has a short text and its buttons in their sequence. A scenario starts from a known state, so it runs the same each time.

Make a scenario for the usual case, for a hard case, and for an action that must not be possible.

Each label uses the words of `docs/glossary.md` and the foods of `test-vault/`, not the names of the code. Make the column narrow, so that the page reads like a phone. Use one accent colour and no motion.

## What to listen for

The owner says "that must not be possible", or "I thought that X was different". That is an error in the idea, and it is the reason for the prototype.

## Do not

- Do not add a test. A prototype that needs tests is not a prototype.
- Do not write for "what if we need X later". The prototype answers one question.
- Do not let the module touch the page. Then it cannot go to the plugin.
- Do not put the page into the plugin.
