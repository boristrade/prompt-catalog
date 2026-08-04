---
name: mobile-check
description: Check pages on a narrow screen before committing UI work. Use when the user changes layout, adds a component, or asks whether something works on mobile.
---

# Checking a narrow screen

Never claim a layout works on mobile without looking at it. Take a
screenshot at 360px wide and read it.

## Running the check

Start the app, then drive a browser at 360×800. With Playwright:

```js
const page = await browser.newPage({
  viewport: { width: 360, height: 800 },
  deviceScaleFactor: 2,
});
await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: "mobile.png" });
```

Check both colour schemes — pass `colorScheme: "dark"` and `"light"` —
if the project has a theme toggle.

## What to look for

**Horizontal scroll is always a bug.** Detect it, don't eyeball it:

```js
const overflows = await page.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth,
);
```

The usual causes are long unbroken strings (URLs, emails, codes) and
fixed widths. Fix with `break-all` or `truncate` inside a `min-w-0`
parent, not by hiding overflow.

**Rows of buttons** must wrap. Without wrapping they run off the edge
at 360px and the last one becomes unreachable.

**Headings** should not break into single-word lines. `text-wrap:
balance` fixes most of it; if a word still doesn't fit, the type size
is too large for the viewport.

**Anything behind a `lg:` breakpoint is invisible on a phone.** If a
link or control lives only in a desktop-only block, it does not exist
for mobile users. Check that every action is reachable from the narrow
layout too.

**Tap targets** need roughly 44px of height. Text links crammed into a
row are hard to hit.

## Reporting

Show the screenshot. If something is wrong, say which element and at
what width it breaks — not "looks a bit tight".
