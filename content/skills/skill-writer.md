---
name: skill-writer
description: Write a new skill for Claude Code, or fix one that never triggers. Use when the user wants to package a repeatable workflow, asks how to write a skill, or says their skill is being ignored.
---

# Writing a skill

A skill is instructions Claude loads when a particular kind of task
comes up. Two things decide whether it is any use: whether it triggers
at the right moment, and whether it says something the model would not
have done anyway.

## The front matter decides whether it ever runs

```
---
name: kebab-case-name
description: What it does. When to use it.
---
```

The `name` must match the filename. The `description` is the only part
read before the skill loads — it is the trigger, not a summary.

Write it in two halves: what the skill does, then the situations that
should invoke it, in the words a user would actually type. Include the
casual phrasings. Somebody says "make the mobile version work", not
"perform responsive verification".

If a skill never fires, the description is almost always the reason. The
second most common reason is that it overlaps another skill and the
other one wins.

## The body

Write it for someone competent who has not done this particular job
here before. That means:

- **Rules with reasons.** "Verify the signature over the raw bytes,
  because reserialising changes key order" survives contact with a
  situation you did not foresee. "Verify the signature" does not.
- **Order, when order matters.** Most skills are a procedure. Number
  the steps and say what to check before moving on.
- **The specific failures.** The three things that always go wrong here
  are worth more than a complete description of the happy path.
- **What not to do,** and why. Prohibitions without reasons get
  reasoned around.

## Length

Under about two hundred lines. A skill is loaded into a working
context — a long one crowds out the thing being worked on. If it
genuinely needs more, split the detail into a `references/` file beside
`SKILL.md` and point to it, so it is read only when needed.

## Test it honestly

Start a fresh session and type what a real user would type — not the
description. Check three things:

1. Did it trigger?
2. Did the answer differ from what you get without it? If not, the
   skill is describing what the model already does, and it is costing
   context for nothing.
3. Does it trigger when it should not? An over-broad description is
   worse than a narrow one: it hijacks unrelated work.

Fix triggering by editing the description. Fix quality by making the
body more specific, not longer.
