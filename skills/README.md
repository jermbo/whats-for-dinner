# Skills

A skill is a set of instructions for an agent, for one step of the work. These six skills follow the [workflow](../docs/standards/workflow.md) of this repository. Each one tells what to read, what to write, and where to stop.

## The skills

| Step of the workflow | Skill                                       | What it writes                                     |
| -------------------- | ------------------------------------------- | -------------------------------------------------- |
| 1. Grill             | [grill-with-docs](grill-with-docs/SKILL.md) | The decision log and the glossary of an initiative |
| 1. Grill             | [prototype](prototype/SKILL.md)             | A throwaway answer to one design question          |
| 1. Grill, the end    | [to-spec](to-spec/SKILL.md)                 | The spec: the scope that is agreed                 |
| 2. Stories           | [to-stories](to-stories/SKILL.md)           | The user stories of a version                      |
| 3 to 5, and again    | [implement](implement/SKILL.md)             | The pages, the code, and the tests of one story    |
| After the last story | [pr](pr/SKILL.md)                           | The title and the body of a pull request           |

A skill does not repeat a rule of the wiki. It names the page of `docs/standards/` that has the rule.

## How an agent finds a skill

This folder is the source. The folder `.claude/skills/` has one link for each skill, to its folder here. For a new skill, make its folder here, and add one link there.

## Credit

The idea and the names of these skills come from the [skills of Matt Pocock](https://github.com/mattpocock/skills), which have the MIT licence. The text is written new for this repository. The views of a summary in `pr` come, through his skill, from the skill `show-me` of Dex Horthy.
