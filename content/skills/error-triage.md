---
name: error-triage
description: Turn a pile of production errors into a short list of things worth fixing. Use when the user shares logs or a Sentry issue list, asks what to fix first, or says the error tracker is full of noise.
---

# Sorting production errors

An error tracker with four hundred open issues is the same as one with
zero: nobody reads either. The job is to get to a list of three.

## Group before you read

Errors come in duplicates. Group by the message with the variable parts
removed, then sort by two numbers together, never one:

- **How many people** hit it — not how many events. One user in a retry
  loop can generate ten thousand events and matter less than an error
  that hit forty people once.
- **What it cost them.** A failed payment, a lost draft, a blocked
  login are different in kind from a broken image.

The top of that list is usually four or five issues. Everything below
is noise until those are gone.

## Classify each one

**A real defect.** Reproduce it, then hand it to root-cause debugging.

**A hostile or malformed request.** A bad path, a malformed token, a
bot. Not a defect — the defect is that it is logged as an error. Answer
it correctly and log it at a level nobody is paged for.

**Someone else's outage.** A dependency timing out. The question is not
how to stop it but what your code does when it happens: does it retry,
does it fail closed, does the user see something honest.

**Noise you created.** An exception used for flow control, a caught
error re-thrown one layer up and logged twice, a health check hitting a
route that does not exist.

## Read one real event fully

Not the aggregate — one actual occurrence, with its input, its user's
state and its timestamp. Aggregates hide the thing that made this
request different from the ten thousand that worked.

Check what happened just before, too. The exception is often the second
event; the first one was a warning nobody grouped it with.

## What to do with the rest

Say plainly which issues you are choosing not to fix and why. Then make
them stop being errors — downgrade the level, handle the case, or
filter it — so the list stays readable. An issue left open and ignored
trains everyone to ignore the list.

## Report

Three issues, in order, each with: how many people, what it costs them,
the suspected cause, and the next concrete step. Then one line on what
was noise and what you did about it.

Never paste tokens, emails or request bodies from the logs into the
report. Report the ids.
