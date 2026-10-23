# Contributing

This page is for you if you want to build What's for Dinner from its source, or to learn how it works inside.

## Where to read

- [Wiki](docs/README.md): how the plugin works, from the full picture down to the exact rules.
- [Workflow](docs/standards/workflow.md): how a change goes from a discussion to code.

## How to run it

The repository has a vault for tests, `test-vault/`. The development build puts the plugin into that vault.

1. Install the packages: `npm install`.
2. Start the build: `npm run dev`. It builds the plugin again after each change of a file.
3. In Obsidian, select "Open folder as vault" and open `test-vault/`. If Obsidian asks, trust the vault, so that it loads the plugin.
4. Open the kitchen with the utensils icon in the ribbon, or with the command "Open the kitchen".

Obsidian does not load a new build by itself. After a change, use the command "Reload app without saving".

## The commands

| Command         | What it does                                                      |
| --------------- | ----------------------------------------------------------------- |
| `npm run dev`   | Builds the plugin into `test-vault/` with a source map, and again after each change. |
| `npm run build` | Builds the plugin for a release into `dist/`: small, with no source map. |
| `npm run check` | Checks the types of the code.                                     |
| `npm test`      | Runs the unit tests.                                              |

Each set of stories has its check list at the root of `test-vault/`, such as `Pantry check list.md`. A check list tells the state that the notes need, and each test on the phone.
