---
name: debug-root-cause
description: Find the actual cause of a bug instead of guessing at fixes. Use when something is broken, a test fails intermittently, behaviour differs between environments, or the user says it worked yesterday.
---

# Finding the cause, not a fix that happens to work

Before changing a single line, be able to state the bug as: given this
input, in this state, the code does X where it should do Y.

If you cannot state it that way, you do not understand it yet, and any
edit you make is a guess. Guesses that appear to work are worse than
guesses that fail — they move the bug somewhere quieter.

## The order

**1. Reproduce it.**
Find the shortest sequence that triggers it every time. "Sometimes" is
not a reproduction. If it only happens sometimes, the missing variable
is part of the bug: time, order, cached state, a second request, an
empty list on the first run.

**2. Find the last version that worked.**
`git log` on the touched files, or bisect. Knowing which commit
introduced it usually names the cause outright and costs less than
reading the code.

**3. Write down what you believe is happening.**
One sentence, before you look. This is what makes the next step honest.

**4. Test that belief with one change.**
A log line, a breakpoint, a value printed. One change, then look. Two
changes at once and you cannot tell which one told you the truth.

**5. When the belief is wrong, say so and form the next one.**
Wrong beliefs are progress; keeping a wrong belief because you already
started fixing it is not.

## Where the cause usually hides

- **A value is not what you assume.** Print it. Not its type, its actual
  contents, at the moment it is used.
- **Two things share state.** A module-level variable, a cache, a
  connection reused between requests.
- **Order.** Something runs before the thing it depends on, and only
  when the machine is fast, or slow, or cold.
- **The environment differs.** A variable set locally and not in
  production, a different version, a different timezone, a different
  locale that formats a number with a comma.
- **The error is caught and swallowed.** Search for empty catch blocks
  on the path. The real error may have happened three layers down.

## Before you call it fixed

State the cause in one sentence. If the sentence is "I changed X and it
stopped happening", you have not found the cause — you have found a
change that moves it.

Then write the test that would have caught it. If the bug cannot be
expressed as a test, say why; that answer is usually the more important
finding.
