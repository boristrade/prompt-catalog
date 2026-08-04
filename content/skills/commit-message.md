---
name: commit-message
description: Write the commit message for the staged changes. Use when the user asks to commit, asks for a commit message, or says the work is ready to commit.
---

# Writing the commit message

Read the staged diff first — `git diff --cached`. Never write a message
from memory of what you did; write it from what is actually staged.

## The subject line

One line, imperative mood, no trailing full stop. Name the change, not
the files. "Fix the button that scrolled nowhere" beats "Update page.tsx".

Keep it under 72 characters so it doesn't wrap in `git log`.

## The body

Explain **why**, not what. The diff already says what changed; it cannot
say what was wrong before, or what would break if this were done
differently.

Answer these, in prose, only where they apply:

- What was broken or missing, described concretely enough that someone
  hitting the same problem would recognise it.
- Why this approach and not the obvious alternative.
- What is deliberately not covered, and why.

Wrap the body at 72 characters.

## What not to write

- Do not list the changed files. `git show --stat` does that better.
- Do not write "various fixes", "improvements", "refactoring" — these
  say nothing and make the history useless when someone bisects it.
- Do not restate the subject line in the body.
- Do not mention the tools or the model that produced the change.

## Before committing

Check that the staged diff contains only what belongs in this commit.
If it mixes two unrelated changes, say so and offer to split them.
