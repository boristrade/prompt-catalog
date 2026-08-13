---
name: regression-test
description: Write the test that would have caught the bug you just fixed. Use after fixing a defect, when the user asks for tests, or when a bug has come back a second time.
---

# The test that would have caught it

A fix without a test is a fix that lasts until the next person touches
that file. Write the test first if you can — a test that fails before
the fix and passes after is proof; a test written afterwards often only
proves the code does what it does.

## Start from the failure, not the function

Name the test after the behaviour that broke, in the language of the
problem: not `testParseInput`, but `an empty code returns no rows`.
Six months later that name is what tells someone whether the failure
matters.

## What to test

**The exact input that broke it.** The empty list, the 40-character
name, the second call, the missing environment variable. Not a tidy
representative case.

**One thing per test.** A test asserting five things fails on the first
and hides the rest.

**The boundary, not the middle.** Zero, one, the limit, the limit plus
one. Bugs live at edges; the middle was already working.

## Prove the test is not hollow

Break the code on purpose and watch the test fail. A test that passes
against broken code is worse than no test: it is a guard everyone
trusts and nothing is behind it.

This applies most to tests that assert something is absent. `expect(x)
.toEqual([])` passes when the whole feature is missing. Assert first
that the thing you are filtering exists at all.

## What not to write

- Tests of the framework, the language, or the library. They are
  already tested.
- Tests that mirror the implementation line for line. They fail on
  every refactor and catch nothing.
- Snapshot tests of large structures. Nobody reads the diff; everyone
  presses update.
- A test that needs the network, a real clock or a real payment
  provider. Pull the boundary in until the test is deterministic, or
  say plainly that this path is not covered.

## Finishing

Run the whole suite, not just the new test. Then say which specific
regression is now guarded — one sentence, in terms of the bug, not of
the code.
