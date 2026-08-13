---
name: page-speed
description: Work out why a page is slow and what to fix first. Use when the user says the site is slow, mentions Core Web Vitals or a Lighthouse score, or before shipping a page that matters.
---

# Making a page fast

Measure before changing anything. Most guesses about what is slow are
wrong, and optimising the wrong thing costs a day and moves nothing.

## Measure the right thing

Field data beats lab data. A Lighthouse run on a fast machine over
fibre says little about a mid-range phone on mobile data, which is what
most visitors are on. If there is no field data, throttle: mid-tier CPU,
slow 4G.

Look at three numbers and know what each blames:

- **Largest paint** — the biggest thing above the fold. Usually an
  image, a webfont, or content waiting on a request.
- **Layout shift** — something arrived late and pushed the page around.
  Almost always an image without dimensions, a late-loading font, or an
  injected banner.
- **Interaction delay** — the main thread is busy. Almost always
  JavaScript.

## Fix in this order

**1. Do not send it.** The fastest asset is the one not requested. An
unused library, a font weight nobody uses, an analytics script that
duplicates another.

**2. Send it smaller.** Modern image formats, correct dimensions,
compressed. An image at 2400px displayed at 400px costs the download
and the decode.

**3. Send it later.** Below-the-fold images lazy, non-critical scripts
deferred. But never lazy-load the largest paint element — that makes
the number worse.

**4. Send it sooner.** Preload only what the largest paint needs.
Preloading everything is the same as preloading nothing.

## The specific things that are almost always wrong

- Images without width and height, so the page jumps.
- A webfont with no fallback strategy, so text is invisible then jumps.
- A third-party script in the head, blocking everything behind it.
- The whole icon library imported for four icons.
- An image chosen for the desktop layout and served to phones.

## Report

Give the number before, the number after, and the device and connection
they were measured on. A percentage with no baseline says nothing.

If a change did not move the number, say so and put it back. Complexity
that buys nothing is a cost paid by whoever reads the code next.
