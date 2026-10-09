# Meal Planner

A personal tool, on a phone, that helps you use your pantry well and cook good meals each week. It makes the decision before 18:00: the menu is planned, the food is in the pantry, and the next meal is one tap away.

All data is on the device. The app has no server and no account, and it works with no connection.

## What it does

- **Today**: the meals of the menu as a hand of cards. The meal with the oldest food is first.
- **Menu**: the app proposes one recipe at a time, ranked by the food that you must use first.
- **Shop**: a list of what the menu needs and the pantry does not have. One tap in the store, then "Put away" at home.
- **Pantry**: the level of each item, with a weekly check.
- **Recipes**: write a recipe, cook it one step at a time, and keep the photos and notes of each cook.

## How it is built

| Part    | Tool                                                           |
| ------- | -------------------------------------------------------------- |
| App     | SvelteKit and Svelte 5, as a single-page app of static files   |
| Data    | IndexedDB, with Dexie                                          |
| Motion  | GSAP for gestures and physics, CSS for simple changes of state |
| Types   | JSDoc, checked by TypeScript in strict mode                    |
| Offline | A service worker caches the app                                |

The code has five layers: screens, components, state modules, the domain, and the data layer. The [Code topic](docs/code/README.md) of the wiki tells where each line goes, and why.

## Run it

```sh
npm install
npm run dev
```

The app opens at `http://localhost:5123`. The "More" screen can load sample data.

| Command          | What it does                                   |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Starts the development server                  |
| `npm run build`  | Makes the static files in `build/`             |
| `npm run check`  | Checks the types                               |
| `npm run lint`   | Checks the format and the lint rules           |
| `npm run format` | Formats all files                              |
| `npm run verify` | Runs `check`, `lint`, and `build`, in sequence |

## Documentation

The [project wiki](docs/README.md) is the memory of the project. It explains how the system works, one short page for each idea, so that you do not have to learn it from the code.
