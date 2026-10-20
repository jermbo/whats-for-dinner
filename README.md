# What's for Dinner

A plugin for Obsidian that knows what is in your pantry, so that you plan, shop, and cook with the food that you have.

Your recipes and your pantry are plain notes in your vault. The plugin has no server and no account.

## Where to read

- [Wiki](docs/README.md): how the plugin works, from the full picture down to the exact rules.
- [Build plan](PLAN.md): the slices of the first version, and the choices that are open.
- [Roadmap](docs/features/roadmap.md): what is left.

## How to run it

The repository has a vault for tests, `test-vault/`. The build puts the plugin into that vault.

1. Install the packages: `npm install`.
2. Start the build: `npm run dev`. It builds the plugin again after each change of a file.
3. In Obsidian, select "Open folder as vault" and open `test-vault/`. If Obsidian asks, trust the vault, so that it loads the plugin.
4. Open the kitchen with the utensils icon in the ribbon, or with the command "Open the kitchen".

Obsidian does not load a new build by itself. After a change, use the command "Reload app without saving".

## The commands

| Command         | What it does                                                        |
| --------------- | ------------------------------------------------------------------- |
| `npm run dev`   | Builds the plugin with a source map, and again after each change.   |
| `npm run build` | Builds the plugin for use: small, with no source map.               |
| `npm run check` | Checks the types of the code.                                       |

Each set of stories has its check list at the root of `test-vault/`, such as `Pantry check list.md`. A check list tells the state that the notes need, and each test on the phone.
