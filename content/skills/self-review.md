---
name: self-review
description: Review your own changes before pushing. Use when the user asks to review the diff, asks whether the change is ready, or before opening a pull request.
---

# Reviewing your own diff

Read the full diff against the base branch before saying anything:
`git diff origin/main...HEAD`.

Review it as if someone else wrote it and you are the one who will be
paged when it breaks.

## What to look for, in order

**1. Does it do what was asked?**
Compare against the original request, not against your own plan. Scope
that quietly grew is as much a defect as scope that was dropped.

**2. What happens on the unhappy path?**
For every new branch: what if the value is null, the list is empty, the
network call fails, the user is not signed in? Name the specific line
and the specific input that breaks it.

**3. Does anything fail open?**
A missing key, an empty allowlist, an unset environment variable —
does the code then let everyone through, or no one? Letting everyone
through silently is the worse default and the harder bug to notice.

**4. Is anything now unreachable or duplicated?**
New code that shadows old code, a second place that must be kept in
sync with the first, an export nobody imports any more.

**5. Would this be visible if it broke?**
Changes that only fail somewhere the author never looks — a social
preview, a scheduled job, an email — deserve a test or a log line.

## How to report

Lead with the most serious finding. For each one give the file, the
line, and a concrete failing input — not "this could be unsafe" but
"if `code` is empty this returns every row".

If nothing survives that bar, say the diff looks fine. Do not invent
findings to look thorough.
