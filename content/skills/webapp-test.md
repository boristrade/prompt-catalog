---
name: webapp-test
description: Drive the running app in a real browser and check what a person actually sees. Use when the user asks whether a change works, asks for a screenshot, or when a UI change needs verifying beyond reading the markup.
---

# Checking the app in a browser

Reading the markup is not verification. The class can be present and the
rule still lose to a more specific selector; the element can exist and
sit behind another one. Open the page.

## Getting a browser

Try, in order:

1. A Playwright already in the project (`node_modules/playwright` or
   `@playwright/test`).
2. A browser already on the machine — check `PLAYWRIGHT_BROWSERS_PATH`
   and pass its binary as `executablePath`.

Do not run `playwright install` before checking both. It downloads
hundreds of megabytes to get what is usually already there.

## Serve the real thing

Test the production build, not the dev server, whenever the change
touches layout, caching or data fetching. The dev server hides
hydration errors and serves unminified CSS with different specificity
resolution timing.

## What to check, every time

**Take the screenshot.** At the width the user actually browses. Not a
desktop screenshot with a promise that mobile is fine.

**Check for sideways scroll:**
`document.documentElement.scrollWidth` against `window.innerWidth`. If
they differ, find the offending element — the one whose
`getBoundingClientRect().right` exceeds the viewport and whose
ancestors have no `overflow-x: auto`.

**Click the thing.** Elements that overlap steal clicks in ways no
screenshot reveals. If the change added a transform or a negative
margin, verify the target is still hittable.

**Check both themes** if the project has them, and check the state
where the OS preference is set but no explicit choice is stored — that
is the state most viewers are in and the one most often broken.

## Reporting

Attach the screenshot. State the width and the theme it was taken at.
If something is off, name the element and the measured number, not
"looks slightly wrong".

If you could not run a browser, say so plainly and say what you checked
instead. Do not describe markup as though you had looked at the page.
