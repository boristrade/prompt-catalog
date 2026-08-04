---
name: dead-code
description: Find code that nothing uses any more. Use when the user asks to clean up, mentions dead code, or after removing a feature.
---

# Finding dead code

Removing code is safe only when you have shown nothing reaches it.
Search before deleting, every time.

## Where to look

**Unused exports.** For each exported symbol, search the repository for
its name. One hit means only the definition — a candidate.

```bash
rg -n "export (function|const|class|type|interface) (\w+)" -o -r '$2' src | sort -u
```

Then check each name. Beware of symbols reached dynamically, by string
key or through a barrel file — grep will not see those.

**Files nothing imports.** A module whose path appears in no import
statement anywhere.

**Branches that cannot be taken.** A condition on a value that is now
always the same, a case for an enum member that no longer exists.

**Assets nothing references.** Images, fonts and data files whose names
appear nowhere in the source.

## Before deleting anything

- Check the tests. Code used only by tests is not dead — it is either
  still needed or the test is stale, and those are different fixes.
- Check for dynamic access: `obj[name]`, `import(path)`, string keys in
  a lookup table.
- Check the framework's conventions. Files can be entry points by
  location alone and be imported nowhere.

## How to report

List each finding with the path, what it is, and the evidence that
nothing uses it — the search you ran and how many hits it returned.

Delete in a separate commit from any behaviour change, so a revert is
cheap if you were wrong.
