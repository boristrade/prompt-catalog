import type { PromptText } from "@/lib/prompts";

/*
  Английские тексты промтов. Русский каталог остаётся источником: id,
  категория и тариф живут только в prompts.ts, здесь — одни переводы.
  Ключ — id промта; за полнотой следит проверка в prompts.ts, которая
  ломает сборку, если для промта перевода нет.

  Переменные в {фигурных скобках} тоже переведены: их подставляет
  человек, и русское слово в английском промте выглядело бы опечаткой.
*/
export const PROMPTS_EN: Record<string, PromptText> = {
  // ─────────────────────────── Designers ───────────────────────────
  "brand-identity-system": {
    title: "Brand identity in a single request",
    summary:
      "A complete brand system: palette, font pairing, visual tone and moodboard direction.",
    bestFor: "ChatGPT / Claude",
    tags: ["branding", "identity", "palette"],
    prompt: `You are the art director of a branding agency. Develop a visual identity for a brand.

Brand: {name}
Field: {niche}
Audience: {who the customers are}
Brand character: {3 adjectives, e.g. "bold, minimal, warm"}

Deliver it structured:
1. The core idea of the identity (1–2 sentences).
2. Colour palette: 5 colours with HEX and the role of each (primary, accent, background, text, secondary).
3. Font pairing (heading + body) with the reasoning.
4. Graphic and photographic style (what to use, what to avoid).
5. 5 keywords for the moodboard.
Write to the point, no filler.`,
    example: `Idea: "Quiet confidence" — minimalism with a single warm accent…
Palette: #0E0F12 background · #F4F1EA text · #C8794B accent · #6B6E78 secondary · #FFFFFF contrast
Fonts: Playfair Display (headings) + Inter (body) — character against neutrality…`,
  },
  "midjourney-ui-concept": {
    title: "UI concept for Midjourney",
    summary:
      "A ready prompt for generating a clean app interface mockup in Midjourney/Firefly.",
    bestFor: "Midjourney v6",
    tags: ["ui", "midjourney", "mockup"],
    prompt: `clean modern {app type} app UI design, {screen: dashboard / onboarding / profile}, {light / dark} theme, {accent colour} accent, generous whitespace, soft shadows, rounded cards, crisp typography, realistic mockup on device, dribbble shot, high detail --ar 3:2 --style raw --v 6`,
    example: `The prompt for a dark fintech dashboard with a copper accent returns a Dribbble-grade shot: cards, charts, clean typography — ready to drop into Figma as a reference.`,
  },
  "figma-critique": {
    title: "AI review of your design",
    summary:
      "Upload a screen and get specific criticism on hierarchy, contrast and UX.",
    bestFor: "ChatGPT-4o / Claude (vision)",
    tags: ["ux", "review", "audit"],
    prompt: `You are a senior product designer. Critique the attached design of the "{screen name}" screen.

Give the critique point by point:
1. Visual hierarchy — what is seen first, where the eye gets lost.
2. Contrast and accessibility (WCAG) — the problem spots.
3. Spacing and grid — where the rhythm breaks.
4. UX logic — whether the action is clear to the user.
5. The top 3 fixes with the largest effect, in priority order.
Be specific: name the elements, not general advice.`,
    example: `1. Hierarchy: the heading and the price compete — both bold 24px. Make the price the accent and the heading quieter.
2. Contrast: grey text #9A9A9A on white = 2.9:1, below the AA threshold…
3. Top fix: enlarge the CTA and drop the second one — two equal actions split attention.`,
  },
  "moodboard-directions": {
    title: "Three moodboard directions",
    summary:
      "One brief, three different visual directions — so the client has a real choice.",
    bestFor: "ChatGPT / Claude",
    tags: ["moodboard", "concept", "brief"],
    prompt: `Based on the brief, propose 3 DIFFERENT visual directions for the project.

Brief: {what the project is, who it is for, what mood}

For each direction give:
— A name (a metaphor, e.g. "Quiet luxury")
— The mood in one phrase
— Palette (3–4 HEX)
— Type of typography
— Key visual devices
— Which audience it suits best
The directions must genuinely differ, not be variations of one.`,
    example: `1. "Quiet luxury" — beige and graphite range, serif headings, plenty of air…
2. "Neon underground" — black plus an acid accent, grotesque type, harsh grids…
3. "Warm craft" — earthy tones, handwritten details, paper textures…`,
  },
  "icon-set-brief": {
    title: "A consistent icon set",
    summary:
      "Single set of rules for an icon family: grid, stroke, corners — so everything matches.",
    bestFor: "Claude / ChatGPT",
    tags: ["icons", "system", "guide"],
    prompt: `Write a specification for a set of {N} icons in one style.

Product: {description}
Style: {line / filled / duotone}

Describe the shared rules:
— Grid size and safe area
— Stroke weight (px at 24px)
— Corner radius and line cap rounding
— Padding rules inside the icon
— Metaphors for each of the {N} icons (list: purpose → what we draw)
Format it as a clear spec any designer could draw from.`,
    example: `Grid 24×24, safe area 2px. Stroke 1.75px, round caps, corners r=2…
· Profile → outline of head and shoulders
· Settings → cog with 8 teeth
· Notifications → bell with an indicator dot…`,
  },
  "product-photo-prompt": {
    title: "Studio product shot (generated)",
    summary:
      "A prompt for photorealistic studio product photography — no photographer, no studio.",
    bestFor: "Midjourney / Flux",
    tags: ["product", "photo", "generation"],
    prompt: `professional studio product photography of {product}, on {surface: marble / concrete / silk}, {lighting: soft diffused / dramatic side} lighting, subtle reflection, minimal {colour} background, shallow depth of field, commercial advertising shot, ultra detailed, 8k --ar 4:5 --style raw --v 6`,
    example: `A perfume bottle on marble with soft side light and a faint reflection — a frame at ad-campaign level, ready for a listing or a banner.`,
  },
  "prompt-optimizer": {
    title: "Improve any prompt",
    summary:
      "Turns a raw wording into a worked-out prompt: role, context, criteria, answer format.",
    bestFor: "ChatGPT / Claude",
    tags: ["meta", "prompt engineering", "quality"],
    prompt: `You are an expert in prompt engineering. Do not perform the task — rewrite my prompt so the model gives the most useful answer possible.

My prompt: {paste your prompt}
What I need the result for: {context}

Do this:
1. Analysis: what the prompt is missing (role, context, constraints, format, quality criteria).
2. The improved version — ready to copy.
3. Three clarifying questions whose answers would make the result sharper still.
4. What to put in the variables — example values.
Write the improved prompt in full, without abbreviating.`,
    example: `Analysis: no role, output format undefined, no criteria for a "good" result…
Improved version: "You are an editor with 10 years of experience. Rewrite the text below for an audience of {who}…"
Questions: 1) What length? 2) What tone? 3) Any examples of texts that worked?`,
  },
  "logo-concepts": {
    title: "10 logo concepts",
    summary:
      "Different marks for one brand: metaphor, shape, lettering — each with reasoning.",
    bestFor: "ChatGPT / Claude",
    tags: ["logo", "mark", "branding"],
    prompt: `You are a graphic designer specialising in marks and logos. Propose 10 DIFFERENT logo concepts.

Brand: {name}
What it does: {description}
Audience: {who}
What matters to convey: {2–3 qualities}
What to avoid: {the clichés of the niche}

For each concept:
— Type (lettering / monogram / abstract mark / pictorial symbol / combination)
— The idea in one sentence: what is encoded
— How it looks: describe the shape in words precisely enough to draw
— Why it fits this brand specifically
— The risk of the concept (how it might fail)
The concepts must differ in type, not be variations of one idea.`,
    example: `3. Monogram: the letters "P" and "T" grow into the shape of a bookmark — a hint at "save what matters".
Risk: at small sizes the bookmark reads as an exclamation mark.`,
  },
  "image-to-prompt": {
    title: "Prompt from a reference image",
    summary:
      "Upload an image you like and get a ready prompt to reproduce the style.",
    bestFor: "ChatGPT-4o / Claude (vision)",
    tags: ["reference", "reverse", "midjourney"],
    prompt: `Analyse the attached image and write a prompt that would make a model generate something similar.

Where I will paste it: {Midjourney / Flux / DALL-E}
What to reproduce: {the whole style / lighting only / composition only}
What to replace: {the new object or scene}

Give me:
1. Analysis of the frame: genre, composition, angle, light, palette, texture, mood, likely optics.
2. The ready prompt in English — one line, with all parameters.
3. A negative prompt: what to exclude so it does not slide into another style.
4. Three variations of the prompt with different strengths of stylisation.`,
    example: `Analysis: studio frame, light from the side at 45°, soft shadow, palette of three warm tones…
Prompt: editorial product shot of {object}, warm side lighting, soft shadow, muted terracotta palette, 85mm, shallow depth of field --ar 4:5 --style raw`,
  },
  "deck-structure": {
    title: "Presentation structure",
    summary:
      "Slide by slide: what to show, what to say and what visual each one needs.",
    bestFor: "ChatGPT / Claude",
    tags: ["presentation", "pitch", "slides"],
    prompt: `Draft the structure of a presentation.

Topic: {what about}
Who I am showing it to: {investors / client / team / students}
Goal: {what decision they should make afterwards}
Length of the talk in minutes: {N}
What I already have: {facts, numbers, cases}

For each slide give:
— Number and the slide's role in the logic
— Heading (a claim, not a topic label)
— What is on the slide: text (briefly) and which visual
— What to say out loud (2–3 sentences)
Rule: one slide, one thought. The heading must carry the meaning even when the slide is read without the speaker.`,
    example: `Slide 3 · "Customers drop off at checkout — we lose 40% of revenue"
On the slide: a funnel collapsing at the second-to-last step.
Out loud: 1,000 people reach this step, 600 pay…`,
  },
  "palette-from-brief": {
    title: "Palette with a contrast check",
    summary:
      "A ready interface palette: roles, HEX and text pairs verified against WCAG.",
    bestFor: "Claude / ChatGPT",
    tags: ["palette", "contrast", "accessibility"],
    prompt: `Assemble a colour palette for an interface with an accessibility check.

Product: {what it is}
Mood: {3 adjectives}
Theme: {light / dark / both}
Existing brand colour: {HEX or "none"}

Deliver:
1. The palette by role: background, card surface, borders, primary text, secondary text, accent, states (success / warning / error). HEX for each role.
2. A contrast table: pair "text on background" → ratio → whether it passes AA (4.5:1) and AAA (7:1).
3. If the theme is dual — a second set of HEX with the same roles.
4. Rules: where the accent may be used and where it may not.
Calculate contrast honestly and do not propose pairs below 4.5:1 for body text.`,
    example: `Primary text #101114 on #FFFFFF → 18.1:1 · AAA
Secondary #63656F on #FFFFFF → 5.9:1 · AA
Accent #4A5BD4 — links, labels and icons only; never fill large blocks with it.`,
  },
  "avatar-portrait": {
    title: "Avatar and styled portrait",
    summary:
      "A prompt for a stylised portrait: careful likeness without the plastic look.",
    bestFor: "Midjourney / Flux",
    tags: ["portrait", "avatar", "style"],
    prompt: `professional {style: editorial photo / oil painting / 3d render / line illustration} portrait of {who: description of the person}, {framing: head and shoulders / half body}, {expression: calm confident / warm smile}, {light: soft window light / rembrandt lighting}, {background: neutral studio backdrop / blurred interior}, natural skin texture, detailed eyes, {palette} color palette, sharp focus on face --ar 4:5 --style raw --v 6

Negative prompt: plastic skin, over-smoothed, distorted hands, extra fingers, heavy makeup, oversaturated`,
    example: `A profile portrait: soft window light, neutral background, natural skin texture — it reads as a photographer's shoot, not an AI picture.`,
  },

  "landing-wireframe": {
    title: "Landing wireframe before you draw",
    summary: "Block order and what goes in each — before you open Figma.",
    bestFor: "ChatGPT / Claude",
    tags: ["landing", "structure", "ux"],
    prompt: `You are a product designer. Build the wireframe for a landing page.

Product: {what it is}
For whom: {audience}
Target action: {what the visitor should do}
Main objection: {what the person fears or doubts}

Deliver:
1. Block order top to bottom, each with its job in one line.
2. For the first screen: headline, subheadline, button label.
3. Where the main objection is answered and with what exactly.
4. Three blocks that are not needed in this case, and why.

No vague labels like "benefits block" — write what will actually be in it.`,
    example: `1. First screen — name the problem in the customer's own words. 2. How it works, 3 steps. 3. Proof: a number or a teardown. 4. The "too expensive" objection → compared with the cost of the mistake…
Not needed: unnamed "trusted by" logos, an "about us" block, a testimonial slider.`,
  },
  "design-system-tokens": {
    title: "Design tokens from an existing mockup",
    summary:
      "Turns colours, spacing and type into named variables a developer can use.",
    bestFor: "Claude / ChatGPT",
    tags: ["design system", "tokens", "figma"],
    prompt: `You are a design engineer. Build a token set from a description of a mockup.

What is in the mockup: {list colours, font sizes, spacing, radii}
Theme: {light / dark / both}

Deliver:
1. Colours with semantic names (background, surface, text primary, text muted, border, accent), not "blue-500". For each: HEX and where it is used.
2. A spacing scale: the base step and the series built from it.
3. Typography: size, line height and weight for headings, body and captions.
4. Radii and shadows, by role.
5. What in the mockup falls outside the system and what to replace it with.

Name things by meaning, not by looks: a colour gets changed one day, the name stays.`,
    example: `--surface: #14151A — card background · --text-muted: #8A8F9C — captions…
4px step: 4 · 8 · 12 · 16 · 24 · 32 · 48
Outlier: three greys within 2% of each other, collapse to one.`,
  },
  "packaging-concept": {
    title: "Product packaging concept",
    summary:
      "The idea, the front-panel composition, and what the law requires on it.",
    bestFor: "ChatGPT / Midjourney",
    tags: ["packaging", "print", "brand"],
    prompt: `You are a packaging designer. Propose a concept.

Product: {what is inside}
Shelf: {where it sells — marketplace, shop, showroom}
Neighbours on the shelf: {what competitors look like}
Print run: {roughly}

Deliver:
1. The idea in one line — what makes this pack stand out on the shelf.
2. Front-panel composition: what is large, what is small, where the eye goes.
3. Palette and material, with this print run in mind.
4. Mandatory elements: contents, weight, barcode, expiry — where to place them.
5. What most often ruins packaging for this kind of product, and how to avoid it.`,
    example: `Idea: white space where every competitor screams with busy print — on the shelf it reads as a pause.
Flavour large, brand small: on a marketplace people decide from the thumbnail, not the logo…`,
  },
  "motion-brief": {
    title: "Interface motion brief",
    summary:
      "What moves, for how many milliseconds and on what curve — precise enough to rebuild.",
    bestFor: "Claude / ChatGPT",
    tags: ["motion", "interface", "brief"],
    prompt: `You are an interface motion designer. Describe the animation so a developer can build it without guessing.

Screen: {which screen}
Event: {what happens — opening, form submit, transition}
Feel: {fast and businesslike / soft / playful}

For every movement give a table row: element, what changes, start and end value, duration in ms, curve, delay.

Then:
1. What moves first and why that is what leads the eye.
2. What must not move at all.
3. How this looks with "reduce motion" enabled in the system.

Keep durations in the 120–400 ms range: longer reads as interface lag.`,
    example: `Card · opacity 0→1 · 200 ms · ease-out · 0 ms
Card · shift up 12px→0 · 240 ms · cubic-bezier(0.16,1,0.3,1) · 0 ms
Does not move: the text inside the card — otherwise it reads as jitter…`,
  },
  "accessibility-audit": {
    title: "Accessibility check for a mockup",
    summary: "Contrast, tap sizes, focus order — the things most often missed.",
    bestFor: "Claude / ChatGPT",
    tags: ["accessibility", "contrast", "review"],
    prompt: `You are an interface accessibility specialist. Review a screen from its description.

Screen: {what is on it}
Colours: {text and background in pairs, HEX}
Sizes: {font sizes, button sizes}
What is interactive: {list them}

Check and deliver as a list:
1. Contrast of every text-on-background pair: compute the ratio and say whether it passes 4.5:1 for body text and 3:1 for large text.
2. Tap target sizes: name anything below 44×44 points.
3. Keyboard tab order: is it logical, where are the traps.
4. Where meaning is carried by colour alone, and what to add alongside it.
5. What needs a label for a screen reader.

For each point say exactly what to change, not "improve contrast".`,
    example: `#8A8F9C on #14151A → 4.8:1, passes. #6B6E78 on #14151A → 3.1:1, fails at 14px, raise to #8A8F9C.
The "More" button is 32×32 — too small, bring it to 44 with padding without enlarging the icon…`,
  },
  "client-presentation": {
    title: "Defending a design to the client",
    summary:
      "How to explain decisions so feedback lands on the goal, not on taste.",
    bestFor: "ChatGPT / Claude",
    tags: ["client", "presentation", "negotiation"],
    prompt: `You are an art director presenting work to a client.

What we are showing: {describe the design}
The problem it solves: {from the brief}
Client: {who decides and what matters to them}
Expected pushback: {what they will most likely say}

Deliver:
1. Presentation order: where to start so the conversation is about the goal, not the button colour.
2. For each key decision, one line of "why this way", tied to the client's goal rather than to beauty.
3. Answers to the expected pushback: what to concede immediately, where to hold and in what words.
4. One question to the client that moves the talk from "like it / don't like it" to "works / doesn't work".

Never argue with taste — move the conversation back to the goal.`,
    example: `Open not with the design but with: "The job was to remove fear on the first screen." Then show it as the answer to that.
"Why so little text" → "People read the first seven words; the rest moved lower, where they are already interested"…`,
  },
  "typography-scale": {
    title: "Type scale and grid",
    summary:
      "Sizes, leading and columns derived from one step instead of picked by eye.",
    bestFor: "ChatGPT / Claude",
    tags: ["typography", "grid", "layout"],
    prompt: `You are a typographer. Build a scale and grid for a project.

What we are setting: {website / app / document}
Base body size: {e.g. 16px}
Fonts: {display and text}
Content width: {e.g. 1120px}

Deliver:
1. A size scale from the base — the ratio and the resulting values for h1–h4, body, caption.
2. Leading for each level, plus the rule: the larger the size, the tighter the lines.
3. The grid: column count, gutter, margins — separately for wide screens and for 360px.
4. Line length in characters for body text and how to hold it.
5. Three combinations that will turn to mush in this particular font pairing.`,
    example: `Ratio 1.25: 16 · 20 · 25 · 31 · 39 · 49
h1 49/1.05 · h2 31/1.15 · body 16/1.6 · caption 13/1.5
Line of 60–75 characters → max-width 34rem…`,
  },
  "retouch-brief": {
    title: "Photo retouching brief",
    summary:
      "What to fix, what not to touch, and how to tell good work from bad.",
    bestFor: "ChatGPT / Claude",
    tags: ["retouching", "photo", "brief"],
    prompt: `You are a photo editor. Write a brief for a retoucher.

Shoot: {what was photographed}
Where the shots go: {marketplace / website / advertising / print}
Number of frames: {how many}
What is wrong in the originals: {list it}

Deliver:
1. Edits in priority order: first what makes the frame unusable, then improvements.
2. What must not be changed, and why — for example the product's shape, or the colour people choose it by.
3. Technical requirements: size, aspect ratio, colour profile, format, file weight.
4. How to accept the work: three signs that it was done badly.
5. What to do with frames that cannot be saved.

Product colour is not a matter of taste: it is what returns are made of.`,
    example: `Required: level the horizon, remove dust from the background, set white balance against the reference.
Do not touch: the saturation of the product itself — on a marketplace that is the first cause of returns…
Acceptance: cut-out edges with no halo, shadows intact, product not mushy at 100%.`,
  },
  "color-system-extend": {
    title: "Palette: states and dark mode",
    summary:
      "Two or three brand colours turned into a working set: success, error, hover, dark mode.",
    bestFor: "Claude / ChatGPT",
    tags: ["palette", "design system", "dark mode"],
    prompt: `You are a product designer. Expand a set of brand colours into a working palette.

Brand colours: {hex codes}
Product: {what it is}
Primary theme: {light or dark}

Deliver:
1. A neutral ramp: background, surface, sunken surface, two border weights, three text levels. The neutral is not grey — bias it toward the accent hue, or the interface looks assembled from other people's parts.
2. Semantic colours: success, warning, error, info — and why these rather than their neighbours on the wheel.
3. Accent states: hover, pressed, disabled, focus.
4. The same roles again for the opposite theme. Not an inversion: the same colours read brighter on a dark ground, so saturation has to come down.
5. Text-to-background contrast for every pair, as a number.

Name each colour by its role, not its look: violet-500 will be blue in six months and the name will start lying.`,
    example: `Background #09090F is not pure black: it carries 4% of the accent's violet.
Error #F0616D rather than pure red: next to violet, pure red vibrates.
Dark theme: the accent lightens from #6D28D9 to #A78BFA — dark violet on black reads as grey.
Text on background: 14.8:1. Muted text: 5.2:1 — never go below 4.5.`,
  },
  "dark-mode-mapping": {
    title: "Porting a screen to dark mode",
    summary:
      "What cannot simply be inverted: shadows, images, illustrations, borders.",
    bestFor: "Claude / ChatGPT",
    tags: ["dark mode", "interface", "porting"],
    prompt: `You are a product designer. Port a light screen to dark mode.

Screen: {what is on it}
Light palette: {hex codes by role}
Where it lives: {web, app, both}

Work through it layer by layer:
1. Backgrounds: how many levels are needed and how they differ. A 3% step is invisible on dark, so the step has to grow.
2. Shadows: they do not work on dark at all. What lifts a card off the background instead.
3. Borders: where they become mandatory in place of shadows.
4. Text: pure white on black cuts the eye — how far to bring it down.
5. Images and illustrations: what to do about white backgrounds inside PNGs and screenshots of the light interface.
6. What cannot be ported and has to be redrawn — as a list.

Point 6 is mandatory: dark mode falls apart not on colour but on the three images nobody redid.`,
    example: `Three backgrounds, 6-8% apart: #09090F to #101019 to #16162A. At 3% the card vanishes into the ground.
Shadows become a 1px #1C1C2B border plus a faint glow under the primary button.
Text #F5F5FA, not #FFFFFF: pure white on black haloes around the letterforms.
Redraw: the hero illustration (white background baked in), three screenshots in the guide, the partner logo PNG.`,
  },
  "brand-prompt-prefix": {
    title: "A brand prefix for image prompts",
    summary:
      "One paragraph appended to every prompt — and the images stop drifting apart.",
    bestFor: "Midjourney / ChatGPT (vision)",
    tags: ["generation", "brand", "consistency"],
    prompt: `You are an art director. Build a standing prefix for image-generation prompts.

Brand: {name and what it does}
Mood: {three or four words}
Brand colours: {hex or names}
Examples you like: {links or descriptions}
What must never appear: {what grates}

Deliver:
1. A 40-60 word prefix: light, materials, palette, optics, composition. It gets appended to any request.
2. A "never" list of explicit exclusions. Without one the model folds in stock cliches — lens flare, perfect smiles, glass spheres.
3. Three complete example prompts: a cover, a product, a background.
4. What changes from image to image and what is never touched.

The prefix must work without the brand name inside it: the generator does not know the brand and will start guessing from the sound of it.`,
    example: `Prefix: soft diffused daylight, matte surfaces, deep violet and near-black palette, 50mm lens, shallow depth, generous negative space, calm composition, no text.
Never: lens flare, glossy 3D spheres, stock smiles, neon grid, cluttered background.
Never touch: light and palette. Change: subject and angle.`,
  },
  "ui-screens-brief": {
    title: "Screen brief for a UI generator",
    summary:
      "The text Figma Make or Stitch needs to build a coherent flow, not a pile of pictures.",
    bestFor: "Claude / ChatGPT",
    tags: ["interface", "figma", "flow"],
    prompt: `You are a product designer. Describe a screen flow so a generator builds it as one connected thing.

Product: {what it is}
User's goal: {what they came to do}
Platform: {web, iOS, Android}
Style: {two or three words}

For every screen give:
1. A name and a one-line job: what the person does right here.
2. The blocks top to bottom with real content — not "heading" and "text".
3. Exactly one primary action. Secondary ones sit apart and quieter.
4. States: empty, loading, error. Generators draw the happy path only; the rest has to be asked for outright.
5. What carries over to the next screen.

Finish with the shared parts: header, spacing, radii, type. Without them the screens come out of different products.`,
    example: `Screen 2, "Choose a plan". Job: see the difference and pick.
Blocks: heading "Two plans, no asterisks" then two cards (Free / PRO $6 a month) then a line reading "Cancel any time".
Primary action: "Get PRO". Secondary: "Stay on Free", as a text link.
No empty state exists here. Error: payment declined — the card stays, a bar above it gives the reason.`,
  },
  "empty-states": {
    title: "Empty screens and errors",
    summary:
      "What to show when there is nothing to show — and how to explain a failure without apologising.",
    bestFor: "ChatGPT / Claude",
    tags: ["interface", "copy", "states"],
    prompt: `You are a product designer. Write the empty states and errors.

Product: {what it is}
Screen: {where it is empty}
Why it is empty: {not started yet / deleted everything / search found nothing}
What the person can do next: {available actions}

For each case give:
1. A heading under six words: what is happening, with no "oops".
2. One line of explanation — why it is empty right now.
3. One action with the exact button text.
4. Whether an illustration is needed. Usually not: a drawing on an empty screen substitutes mood for an answer.
5. Separately, the error: what happened, what to do, whose fault it is. Own faults are stated plainly.

A newcomer's empty screen and a post-deletion empty screen are different screens. The first teaches; the second confirms it worked.`,
    example: `First run: "Your prompts will live here" / "Save the ones you like and they collect here" / button "Open the catalogue".
After search: "Nothing for 'carousel'" / "There are 4 prompts containing 'card'" / button "Show those".
Error: "Could not save" / "This is on our side and we are fixing it. Your text is still in the field" / button "Try again".`,
  },
  "microcopy-ui": {
    title: "Interface microcopy",
    summary:
      "Buttons, hints, confirmations — the short lines a product is actually felt through.",
    bestFor: "Claude / ChatGPT",
    tags: ["copy", "interface", "buttons"],
    prompt: `You are a UX writer. Rewrite the microcopy on a screen.

Screen: {what is on it}
Current text: {as it stands}
Who reads it: {these people}
Tone: {how you speak}

For each line deliver:
1. The new version and one line on what changed and why.
2. Buttons: a verb and an object, not "OK" and "Done". A button must answer the heading's question.
3. Delete confirmation: exactly what disappears and whether it comes back.
4. Field hints: an example of input, not a restatement of the label.
5. The message after the action, in the same word the button used. Press "Publish", read "Published".

Count length in characters: German runs about a third longer than English, and a button that only just fits will break there.`,
    example: `Was "Save changes" then "Save". The second word adds nothing and costs width.
Delete: was "Are you sure?" then "Delete the prompt 'SEO card'? It leaves your saved list. This cannot be undone."
Field: was "Enter your email" then "ivan@example.com".
After: button "Copy" then message "Copied", not "Success".`,
  },
  "research-synthesis": {
    title: "Interview notes into conclusions",
    summary:
      "Eight conversations turned into decisions you can make tomorrow, not a retelling.",
    bestFor: "Claude",
    tags: ["research", "interviews", "synthesis"],
    prompt: `You are a researcher. Turn interview notes into conclusions.

What you studied: {research question}
How many people and who: {the sample}
Notes: {paste them, raw is fine}

Deliver:
1. Five to seven observations. Each with a number: how many people out of how many. "Many found it awkward" is not an observation.
2. A direct quote for each. A paraphrase loses exactly the phrasing the interview existed to capture.
3. What contradicts what, and why. Do not smooth it over: a split usually means two different segments.
4. Three decisions these data can carry.
5. Three questions the data cannot answer, and how to collect what is missing.
6. What is absent from the notes although it should have come up. Silence is a finding too.

Do not bend the conclusions toward the hypothesis you walked in with. If it failed, say so — that is the most valuable outcome available.`,
    example: `6 of 8 could not find search: they looked in the header, where it is not. Quote: "I assumed the magnifier is always up top."
Contradiction: two asked for more filters, four for fewer. Two segments: people hunting something specific, and people browsing.
Missing: whether the people who reach pricing actually pay. Nobody raised money unprompted — it has to be asked directly.`,
  },
  "stakeholder-rebuttal": {
    title: "Answering client feedback",
    summary:
      "How to push back on the bigger-logo note and be heard rather than filed as difficult.",
    bestFor: "Claude / ChatGPT",
    tags: ["negotiation", "feedback", "clients"],
    prompt: `You are an art director. Help answer a client's note.

The note: {their exact words}
The work: {context}
What the work is for: {the business goal}
The relationship: {first project or years in}

Deliver:
1. What is actually behind the note. "Make the logo bigger" almost always means "I do not stand out against competitors" — and size is not the fix.
2. A five to seven line reply: agree with the goal first, then offer another way to reach it.
3. What to show instead of arguing: two versions side by side where both outcomes are visible.
4. When to simply accept the note. If it is taste on a small thing, arguing costs more than doing it.
5. The red line: what must not change, explained through the client's money rather than your taste.

Do not defend the layout. Defend the goal it was made for — that, the client will not argue with.`,
    example: `Behind the note: fear the brand will not be remembered. Size will not fix it — the logo is already the second thing the eye lands on.
Reply: "Agreed, recognition is thin. Size will not lift it: the eye goes to the face first either way. Let me put the brand colour behind the block — same logo, but the brand reads from two metres away."
Show: two banners side by side, photographed from that distance.
Red line: no non-proportional stretching. That is not taste, it breaks your own brand book.`,
  },
  "handoff-spec": {
    title: "Design handoff spec",
    summary:
      "Everything a developer will ask later, written down before they start.",
    bestFor: "Claude / ChatGPT",
    tags: ["handoff", "engineering", "spec"],
    prompt: `You are a product designer. Write the handoff spec for a screen.

Screen: {what is on it}
What already exists in code: {components, tokens, if any}
Platform: {web, mobile}

Cover:
1. What comes from existing components and what is genuinely new. Justify the new: somebody maintains every new component forever.
2. Behaviour as width changes: what compresses, what wraps, what hides. Not "responsive" — block by block.
3. Edge data: a 40-character name, an empty list, a seven-digit number, a missing image.
4. States for every interactive element: rest, hover, pressed, keyboard focus, disabled, loading.
5. What the keyboard does: tab order, what Esc closes, what Enter submits.
6. Animation: what moves, how many milliseconds, what happens under reduced motion.
7. Open questions for product, as a list, before work starts.

Point 3 matters most: layouts are drawn on convenient data and break on inconvenient data.`,
    example: `New: only the cover card. Button, chip and field already exist.
Width: below 640 the cards go single-column, the counter moves under the heading, filters collapse into a scrolling row.
Edge: a 40-character title truncates on line two; a 7-digit price does not wrap — drop one type step instead.
Keyboard: Esc closes the filter, Enter in the field runs the search, focus is always visible.`,
  },
  "illustration-style": {
    title: "A consistent illustration style",
    summary:
      "Rules that make ten drawings read as one set rather than ten discoveries.",
    bestFor: "Midjourney / ChatGPT (vision)",
    tags: ["illustration", "style", "set"],
    prompt: `You are an art director. Define an illustration style for a product.

Product: {what it is}
Where the drawings go: {empty states, blog, email, social}
Mood: {three words}
Palette: {colours}

Set the rules:
1. Stroke weight, whether there is an outline, fill — flat or textured.
2. People: present or not. If present, how abstracted. Realistic faces age fastest and date the work first.
3. Perspective: front-on, isometric, top-down. One for the whole set.
4. How many colours per drawing — as a ceiling, not a preference.
5. What the drawing does: explains, decorates, or leads the eye. Detail level follows from that.
6. Three ready prompts showing the range: simple, medium, complex scene.
7. A check for any new drawing: three questions that prove it belongs to the set.

Another person must be able to apply these rules. "Friendly and modern" cannot be applied.`,
    example: `2px stroke, no outline, flat fill with 6% grain.
People abstracted: the head is a circle with no features. Realistic faces look like clip art within a year.
Isometric, 30 degrees, one angle for the set. No more than four colours plus the ground.
Check: one stroke weight? Same angle? Four colours or fewer?`,
  },
  "social-templates": {
    title: "Branded post templates",
    summary:
      "Five layouts that make posts assemble in minutes and stay recognisable.",
    bestFor: "ChatGPT / Claude",
    tags: ["social", "templates", "brand"],
    prompt: `You are a designer. Build a set of post templates for a brand.

Brand: {name and subject}
Platforms: {where you publish}
What you post most: {post types}
Brand assets: {colours, type, mark}

For each of five templates describe:
1. Its job: quote, number, list, announcement, before-after.
2. The layout: what sits where, how many lines of text fit, where the mark goes.
3. A character limit. A template that fits "as much as needed" becomes small type within a month.
4. What changes post to post and what is fixed forever.
5. How it reads in a feed beside its neighbours — at thumbnail size only the large thing survives.

Five is the ceiling. More will not be remembered, and people start laying out every post from scratch.`,
    example: `"Number" template: the figure fills the frame, a line under it up to 40 characters, mark bottom right.
Limit: 40 characters, not "whatever fits". At 60 the type halves and dies in the feed.
Fixed: mark position and 48px margin. Variable: the figure, the caption, one of three prepared grounds.
In feed: only the figure reads — that is enough; the rest gets read by whoever opened it.`,
  },
  "email-design-brief": {
    title: "Email structure and build",
    summary:
      "An email layout that accounts for mail clients ignoring half your CSS.",
    bestFor: "Claude / ChatGPT",
    tags: ["email", "build", "newsletter"],
    prompt: `You are an email designer. Describe the structure of an email.

Type: {welcome, digest, product news, win-back}
Audience: {who}
Primary action: {what they should do}
Brand: {colours, type, mark}

Deliver:
1. Blocks top to bottom with real content.
2. What is visible in the first screen of a phone mail app — roughly 300 pixels — and the primary action either lands there or is clearly promised there.
3. Build constraints: one column, 600 wide, system fonts only, background images fail in Outlook, buttons are filled tables rather than divs.
4. Dark mode in mail: what inverts on its own, and how not to lose a logo on a transparent background.
5. Copy: subject line under 40 characters, preheader, button as a verb.
6. What the reader sees if images do not load. Check the email still makes sense — plenty of people have images off.

Point 6 is not a formality. An email that is one big image is an empty rectangle for half its recipients.`,
    example: `First screen: logo, heading "Your access is open", button. Everything else sits below.
Button as a filled table, #7C3AED with white text; Outlook will not paint a background div.
Dark mode: ship the logo as a PNG with an opaque ground, or the violet mark merges into black.
Images off: heading, two lines and the button survive — enough to click.`,
  },
  "design-self-check": {
    title: "Self-check before you present",
    summary:
      "Twenty minutes down a list, and half the client's notes never happen.",
    bestFor: "ChatGPT (vision) / Claude",
    tags: ["review", "layout", "quality"],
    prompt: `You are an art director. Review a layout the way you would before showing a client.

Layout: {describe or attach}
What it is for: {the goal}
Who sees it: {client, team, public}

Walk the list and say where it does not hold:
1. What is seen first. Whether that matches what should be primary.
2. Alignment: what is almost on the grid — almost is worse than plainly off.
3. Spacing: how many distinct values are in use. More than five means some are accidental.
4. Type sizes: how many. More than six means there is no scale.
5. Legibility: where text sits on an image with no plate, where contrast drops under 4.5.
6. What happens to the longest name, the biggest number, the missing image.
7. The one place where you chose pretty over clear. There always is one.

Do not compliment. The job is to find what the client will catch, before they do.`,
    example: `The image is seen first, but the price is the point. The eye goes the wrong way.
Nine spacing values: 12, 14, 16, 20, 24, 28, 32, 40, 48. Fourteen and twenty-eight are accidents — fold them into the scale.
Text over the photo at the bottom: contrast 3.1. On a light frame it will not read at all.
Pretty over clear: the caption is letter-spaced and reads as a heading.`,
  },
  "pitch-deck-visual": {
    title: "The visual half of a pitch deck",
    summary:
      "What to show on each slide so an investor gets the business without your voice.",
    bestFor: "Claude / ChatGPT",
    tags: ["deck", "investors", "slides"],
    prompt: `You are a presentation designer. Describe the visual half of a pitch deck.

Product: {what it is}
Stage: {idea, first revenue, growing}
Audience: {investor, partner, competition}
Slide count: {number}

For every slide give:
1. The single idea of the slide in one line. If there are two ideas, that is two slides.
2. What to show: chart, screenshot, diagram, photo, text alone. And why that.
3. A headline that asserts rather than labels. "Market" says nothing; "700,000 sellers, no tools built for them" says something.
4. How many numbers are on the slide. Nobody holds more than three.
5. What to cut: "trusted by" logo walls, stock handshakes, five-slice pie charts.

The deck is read without you: half of investors open the file in email and never take the meeting. The slide has to work in silence.`,
    example: `Slide 3, idea: "A seller spends 4 hours on a listing, 3 of them on text."
Show: two time bars side by side, before and after. A chart, not a list.
Headline: "Three of the four hours go to text."
Numbers: two — 4 hours and 3 hours. Cut the third, it pulls focus.`,
  },
  "landing-hero-variants": {
    title: "Five hero screens to choose from",
    summary:
      "One product, five different promises — to find out which one lands.",
    bestFor: "Claude / ChatGPT",
    tags: ["landing", "hero", "testing"],
    prompt: `You are a landing page designer and writer. Build five versions of the hero screen.

Product: {what it is}
Audience: {who}
Main benefit: {what they get}
What sets you apart: {versus the nearest alternative}

Each version takes a different run-up:
1. From the pain: what they are struggling with.
2. From the result: where they are in a week.
3. From a number: a specific figure in the headline.
4. From the objection: "this is not for me, because…".
5. From the mechanism: how it works, in one line.

For each give a headline, subhead, button, what the visual is, and one line on who the version is aimed at. Finish by saying which to test first and how you will know it won.

Do not write the same thing five times in different words. If the versions differ only in verbs, there is nothing to test.`,
    example: `From the pain: "Rewritten the prompt twenty times, still the wrong answer" / "117 ready ones, tested on real work" / "Open the catalogue".
From a number: "117 prompts, 61 of them free" / "One-click copy, example output beside each" / "See the free ones".
Test first: the pain version — it asks for no trust in a figure. It won if the share reaching the catalogue is a quarter higher.`,
  },
  "designer-automation-audit": {
    title: "What to automate in your own work",
    summary:
      "An audit of a designer's routine: what goes to a script, what to a model, what stays manual.",
    bestFor: "Claude",
    tags: ["automation", "routine", "process"],
    prompt: `You lead a design team. Audit a routine and say what to automate.

What I do: {types of task in a week}
Where the time seems to go: {your sense of it}
Tools: {what you use}
Team size: {solo or how many}

Deliver:
1. The tasks with estimates: how many times a week and how many minutes each. Count in weeks, not instances — a two-minute task ten times a day costs more than an hour once a month.
2. What becomes a template or a component — decided once, by hand.
3. What goes to a model: where mistakes are cheap and immediately visible.
4. What does not go to a model: where a mistake surfaces a month later and costs a lot.
5. Where to start: the one task with the best ratio of time saved to time spent setting it up.
6. When it pays back, in weeks.

Do not propose automating something done once a quarter: the setup will eat more than the task.`,
    example: `Exporting covers at three sizes: 12 times a week, 6 minutes each — 72 minutes. First candidate.
Give to a model: microcopy drafts. Mistakes are visible on reading.
Do not: choosing the type pairing. A miss surfaces a month later and everything gets relaid out.
Start with covers: about two hours to set up, pays back in week two.`,
  },
  // ─────────────────────────── Marketers ───────────────────────────
  "ad-angles-10": {
    title: "10 ad angles in one go",
    summary:
      "One product, ten different angles to test your creatives against.",
    bestFor: "ChatGPT / Claude",
    tags: ["creatives", "offers", "testing"],
    prompt: `You are a performance marketer. Come up with 10 DIFFERENT advertising angles for a product.

Product: {what we sell}
Audience: {who buys}
The customer's main pain: {pain}

For each angle:
— Type (pain / benefit / fear of missing out / social proof / before-after / comparison …)
— Hook (the first line of the ad)
— The core thought in 1 sentence
No two angles may repeat in meaning. Write in the language of the audience.`,
    example: `1. Pain: "Tired of customers leaving to 'think about it' and never coming back?"
2. Before-after: "3 enquiries a day became 17. Here is what changed."
3. FOMO: "The price goes up on the 1st — get in on the old terms."…`,
  },
  "landing-copy-framework": {
    title: "Structure of a converting landing page",
    summary:
      "A full copy skeleton for a landing page on a proven formula — from offer to FAQ.",
    bestFor: "Claude / ChatGPT",
    tags: ["landing page", "copywriting", "conversion"],
    prompt: `Write the copy for a converting landing page, following the structure.

Product: {description}
Audience: {who}
Offer: {what we propose}
Price / terms: {details}

Structure (fill every block with finished copy):
1. Headline (the main benefit, concrete)
2. Subheading (for whom and why now)
3. The "pain" block — 3 recognisable problems
4. The solution — how the product closes the pain
5. Benefits — 5 bullets (a benefit, not a feature)
6. How it works — 3 steps
7. Social proof — what to show
8. Offer + CTA
9. FAQ — 5 common objections and the answers
Tone: {expert / friendly / premium}.`,
    example: `1. "Enquiries on autopilot: a site that sells while you work"
2. For service owners who have no time to run marketing…
5. · First enquiries by day 3 · No developer needed · Pay for results…`,
  },
  "email-sequence": {
    title: "Warm-up email sequence",
    summary:
      "Five emails: from first contact to the sale, with subject lines and the core idea of each.",
    bestFor: "ChatGPT / Claude",
    tags: ["email", "funnel", "nurture"],
    prompt: `Build a 5-email warm-up sequence for {product}.

Audience: {who subscribed and why}
Goal of the sequence: bring them to buy {what we sell}.

For each email give:
— The day it goes out
— Subject line (2 variants for A/B)
— The purpose of the email
— The key idea / story
— The call to action
Logic: email 1 — introduction and value, 2 — the pain and its cost, 3 — the solution and a case, 4 — handling objections, 5 — the offer with a deadline.`,
    example: `Email 1 · Day 0 · Subject A: "The guide I promised is inside 👀" / B: "How to {result} in {timeframe}"
Purpose: deliver value, establish trust…
Email 5 · Day 6 · Offer: the discount expires at midnight, CTA "Claim the discount".`,
  },
  "content-plan-month": {
    title: "A month of content",
    summary:
      "30 post ideas with themes and formats — no more daily «what do I post today».",
    bestFor: "ChatGPT / Claude",
    tags: ["smm", "content plan", "rubrics"],
    prompt: `Build a 30-day content plan for {brand / expert}.

Niche: {niche}
Audience: {who}
Goal: {sales / reach / loyalty}
Platform: {Instagram / TikTok / LinkedIn}

First propose 5 recurring rubrics (value / cases / personal / selling / engagement).
Then a 30-day table: Day | Rubric | Format (post/reel/carousel/story) | Topic | Goal.
Keep the balance: no more than 20% direct selling.`,
    example: `Rubrics: "Mistakes unpacked", "Client case", "Behind the scenes", "Offer of the week", "Q&A"
Day 1 | Mistakes unpacked | Carousel | "5 mistakes in packaging a service" | Value
Day 4 | Case | Reel | "How a client doubled revenue" | Trust…`,
  },
  "audience-avatar": {
    title: "Target audience profile",
    summary:
      "A detailed customer avatar: pains, desires, objections and where to find them.",
    bestFor: "Claude / ChatGPT",
    tags: ["audience", "avatar", "research"],
    prompt: `Build a detailed target audience profile for {product}.

What is known: {what you know about your customers}

Describe:
1. Demographics (age, income, role, geography).
2. The "before" state: what life looks like before buying, what infuriates them.
3. The desired "after": how they want things to be.
4. Top 5 pains (as quotes, in the customer's own words).
5. Top 5 objections to buying + what closes each one.
6. Where they hang out: platforms, creators, communities.
7. The triggers that push them to buy.`,
    example: `"Before" state: does everything alone, burning out, income hit a ceiling…
Pain (quote): "I feel like I work a lot, but the money doesn't grow."
Objection: "Too expensive" → show the cost of doing nothing and offer instalments…`,
  },
  "reels-hooks-marketing": {
    title: "20 hooks for the first 3 seconds",
    summary:
      "Opening lines that catch — the main lever on watch time and reach.",
    bestFor: "ChatGPT / Claude",
    tags: ["hooks", "reels", "reach"],
    prompt: `Come up with 20 hooks (the first line of a video, 3 seconds) for the topic "{topic}".

Audience: {who}
The hook's job is to stop the scroll and make them watch to the end.

Use different mechanics: intrigue, a mistake, a number, a contrarian opinion, "don't do this", a promise of a result, a blunt question. Write short, conversational, no clichés like "in this video I'll tell you".`,
    example: `· "You are losing customers on this screen — and you don't even know it."
· "90% do this wrong. Check yourself in 15 seconds."
· "Delete this from your profile right now."…`,
  },
  "positioning-usp": {
    title: "Positioning and USP",
    summary:
      "A statement of how you differ — in the customer's language, not the company's.",
    bestFor: "Claude / ChatGPT",
    tags: ["positioning", "usp", "strategy"],
    prompt: `Help me formulate positioning and a USP.

What we sell: {product or service}
For whom: {audience}
Competitors: {2–3 names or descriptions}
How we genuinely differ: {facts, not wishes}
Price relative to the market: {above / level / below}

Deliver:
1. Positioning in one sentence on the template: for {who}, who {situation}, {product} is a {category} that {key benefit}, unlike {alternative}.
2. Three USP variants of increasing boldness — from cautious to daring.
3. A test for each USP: could a competitor say the same about themselves? If yes — rewrite it.
4. Five wordings for the site: headline, subheading, button.
No "high quality, fast, reliable" — only differences that can be verified.`,
    example: `Positioning: for solo practitioners with no time for marketing…
USP (bold): "Bookings in your calendar or your money back" — a competitor cannot say this, they offer no guarantee.`,
  },
  "sales-script": {
    title: "Sales script and objections",
    summary:
      "The conversation from hello to close, plus answers to «too expensive», «I'll think about it» and «your competitor is cheaper».",
    bestFor: "ChatGPT / Claude",
    tags: ["sales", "objections", "script"],
    prompt: `Write a sales script.

Product: {what we sell}
Price: {amount}
Channel: {phone / chat / meeting}
Who the customer is: {description}
Common reasons for refusal: {what you hear}

Structure:
1. Opening — how to start so they don't hang up.
2. Qualification — 5 questions that establish need and budget.
3. Presentation — how to tie the customer's answers to the product's benefits.
4. Naming the price — the exact wording.
5. Handling objections: "too expensive", "I'll think about it", "I need to consult someone", "your competitor is cheaper", "now is not the time". For each — a clarifying question, an argument and a soft close.
6. Closing — three variants of the final question.
Write in living speech, short phrases. No pressure, no manipulation.`,
    example: `"Too expensive" → "I understand. Compared to what — another quote, or the budget you had in mind?"
If it's the budget: show the cost of doing nothing and offer instalments.`,
  },
  "seo-article": {
    title: "SEO article: outline and text",
    summary:
      "A structure built around a search query: H2/H3 headings, keywords, what each block must cover.",
    bestFor: "Claude / ChatGPT",
    tags: ["seo", "article", "traffic"],
    prompt: `Produce an outline and the text of an SEO article.

Primary query: {key phrase}
Secondary queries: {list}
Who the reader is and what they want to learn: {description}
Length: {N} characters
What we promote in the article: {product or service}

Do this:
1. Three title options (up to 60 characters) and descriptions (up to 155).
2. The outline: H2 and H3 with a note on which query each block covers.
3. Introduction (up to 600 characters) — answers the query immediately, no run-up.
4. The text following the outline: specifics, lists, tables where they fit.
5. An FAQ block of 5 questions — targeting "how", "how much", "which is better".
6. Where to weave in the product mention so it does not read as an ad.
Place keywords naturally. Cut filler, throat-clearing and "in today's world".`,
    example: `Title: "How to choose a travel mug: 7 criteria and common mistakes"
H2 "How long it holds heat" — covers the query "travel mug how long holds heat"…`,
  },
  "context-ads": {
    title: "Search ads for Google Ads",
    summary:
      "Headlines and descriptions within Google's character limits, a batch at a time for testing.",
    bestFor: "ChatGPT / Claude",
    tags: ["google ads", "ppc", "ad copy"],
    prompt: `Write search ads for Google Ads.

Product: {what we advertise}
Keywords: {list}
Location: {city or region}
Advantages: {list of facts}
Promotion: {if any}
Landing page: {page}

Limits: headline — up to 30 characters (3 of them), description — up to 90 characters (2 of them), sitelinks — up to 25.

Give 8 ad variants as a table: Headline 1 | Headline 2 | Headline 3 | Description 1 | Description 2.
Rules: the main keyword at the start of the first headline, specifics and numbers in the description, the call to action at the end. Different variants hit different motives: price, speed, guarantee, range.
Separately: 4 sitelinks and 4 callouts.`,
    example: `Travel Mugs from $12 | Next-Day Delivery | 200 Models In Stock — 2-year guarantee. Order today!`,
  },
  "competitor-teardown": {
    title: "Competitor teardown, shelf by shelf",
    summary:
      "What works for your competitor, where the holes are and what to take for yourself.",
    bestFor: "Claude / ChatGPT",
    tags: ["competitors", "audit", "strategy"],
    prompt: `Tear down a competitor and help me find where they can be beaten.

My product: {description, price}
Competitor: {name, what is known, links or screenshots}
Our goal: {take share / enter the niche / retain customers}

Analyse block by block:
1. Offer and positioning — what they promise, to whom.
2. Pricing and what the price includes.
3. Acquisition channels — where they are visible.
4. Site and funnel: what is done well, where they lose people.
5. Reviews: what they are praised for and what people complain about (the complaints are your opening).
6. Blind spots: which segments or jobs they ignore.
7. Five actions for me, sorted by "effect / effort".
Rely only on what is visible. Where there is no data, say so — do not invent it.`,
    example: `Complaints in reviews: slow support (7 of 20 reviews) → our opening: a 15-minute response guarantee, put it above the fold.
Blind spot: they don't serve beginners — all their communication is aimed at professionals.`,
  },
  "ads-analytics": {
    title: "Ad performance teardown",
    summary:
      "Paste your campaign numbers and get a diagnosis: what to kill and what to scale.",
    bestFor: "ChatGPT / Claude",
    tags: ["analytics", "metrics", "optimisation"],
    prompt: `You are a performance analyst. Analyse these ad statistics and tell me what to do.

Data (I will paste a table): {campaign, impressions, clicks, CTR, spend, leads, sales}
Target: {target cost per lead or ROMI}
Average order value: {amount}
Margin: {percent}

Do this:
1. Calculate for each campaign: CTR, CPC, CR to lead, CPL, CPO, ROMI.
2. Split the campaigns into three groups: scale, fix, kill — justified by the numbers.
3. For the "fix" group — where exactly we lose people: impressions, click, landing page or the sales team. Determine it from the metrics.
4. Top 5 actions for the coming week in priority order.
5. Which data is missing for a firm conclusion.
Give no generic advice — only what follows from these numbers.`,
    example: `Campaign "Search-Brand": CTR 12%, CR 8%, CPO $8 against a $12 target → scale, raise the budget by 50%.
"Display-Broad": CTR 0.4%, zero leads on $240 spend → kill it today.`,
  },
  "sales-funnel": {
    title: "Sales funnel step by step",
    summary:
      "From first touch to repeat purchase: stages, content and metrics at each one.",
    bestFor: "Claude / ChatGPT",
    tags: ["funnel", "strategy", "conversion"],
    prompt: `Design a sales funnel.

Product and price: {what and how much}
Audience: {who}
What already exists: {site, social accounts, mailing list, ads}
Launch budget: {amount or "minimal"}
Deal cycle: {days or weeks}

Describe the funnel stage by stage: awareness → interest → consideration → purchase → repeat.
For each stage:
— What the customer does and what they are thinking at that moment
— Which content or tool moves them onward
— The channel
— The stage metric and a benchmark for it
— The typical reason people drop out at exactly this point

At the end: which stage to start with when resources are limited, and why.`,
    example: `Consideration: they compare you against two competitors → you need a "how we differ" breakdown and a case with numbers.
Metric: share reaching an enquiry, benchmark 20–30%. They drop out because the price is unclear.`,
  },

  "lead-magnet-ideas": {
    title: "Five lead magnets for your niche",
    summary: "What to give away so people leave a contact — and later buy.",
    bestFor: "ChatGPT / Claude",
    tags: ["lead magnet", "funnel", "email"],
    prompt: `You are a marketer who builds funnels. Propose five lead magnets.

Product: {what you sell}
Audience: {who buys}
Main pain: {what they come with}
Paid product: {what we lead to}

For each option:
1. A name that promises a result, not "a useful guide".
2. Format: checklist / template / teardown / mini-course / calculator.
3. Which pain it closes and in how many minutes.
4. How it connects to the paid product: what the person realises after using it.
5. How long it takes to make.

The options must differ in depth: one for five minutes, one for an evening, one that requires effort.`,
    example: `"Moving budget in 10 minutes" — a spreadsheet with formulas. Pain: they cannot size the budget. Using it, they hit the contractor question — which is the paid service.
Not "A guide to renovation": the promise is vague, they download it and never open it.`,
  },
  "webinar-script": {
    title: "Webinar script with a pitch at the end",
    summary:
      "A minute-by-minute plan: where to hold attention and where to name the price.",
    bestFor: "Claude / ChatGPT",
    tags: ["webinar", "sales", "script"],
    prompt: `You are a webinar producer. Build a minute-by-minute script.

Topic: {what about}
Length: {minutes}
Audience: {who comes and what they already know}
What we sell at the end: {product and price}

Deliver a table: minute, what happens, what the host says in one line, what is on screen.

Mark explicitly:
1. The first three minutes — how we hold those who wandered in.
2. The moment we give value usable immediately, even if the person never buys.
3. The move to the pitch: how it sounds so it does not read as bait and switch.
4. Two points where people usually leave, and what to do there.
5. Answers to three price objections.

The value must stand on its own: a webinar you take nothing from without buying will not fill a room twice.`,
    example: `0–3 min: not a greeting but a mirror question: "You open your stats and cannot tell why it dropped?"
18 min: a teardown on a live example — this is the value, this is what they came for.
42 min: the move: "Next you need the same thing on your own data — that is what the product is"…`,
  },
  "case-study-writeup": {
    title: "A case study people believe",
    summary:
      "A result story with numbers and an honest account of what failed.",
    bestFor: "ChatGPT / Claude",
    tags: ["case study", "content", "trust"],
    prompt: `You are an editor who writes case studies. Build one from the facts.

Client: {who, the name can be withheld}
Before: {situation and numbers}
What was done: {list the steps}
After: {numbers and over what period}
What did not work: {honestly}

Structure:
1. A headline with the result and the timeframe, no superlatives.
2. The starting point: why it was that way, not "the client did no marketing".
3. What was done, step by step, with the decisions that had to be made.
4. Numbers: before, after, over what period, and what else influenced them.
5. What did not work and what would be done differently.
6. Who this case does not apply to.

Points 5 and 6 are mandatory: a case study without a single failure reads as an ad and does not work.`,
    example: `"From 4 to 11 enquiries a week in two months" — not "explosive growth".
Did not work: a blast to the old list, 6% open rate. We dropped contacts older than a year…
Does not apply if your enquiry flow is limited by production capacity rather than by advertising.`,
  },
  "pricing-page-copy": {
    title: "Pricing page copy",
    summary:
      "Plan names, feature order, and answers to the question of why it costs that.",
    bestFor: "Claude / ChatGPT",
    tags: ["pricing", "copywriting", "conversion"],
    prompt: `You are a copywriter who writes pricing pages.

Product: {what it is}
Plans and prices: {list them}
Who buys each: {one sentence each}
The main doubt at checkout: {what stops them}

Deliver:
1. Plan names based on who they are for, not "Basic / Advanced".
2. For each: one line of "who it is for", three points people buy it for, and what it does not include.
3. The order of points inside a plan: what people choose by goes on top, not what is easiest to describe.
4. Which plan to highlight and with what label.
5. Five questions under the table, with answers that remove the main doubt.
6. What to remove from the page if the doubt is about price.

What we never write: "unlimited" when there is a limit; "from" next to a price when there is only one price.`,
    example: `"For one" / "For a team" / "For an agency" instead of Basic — Pro — Business.
Not included: team access. Say it in the card — otherwise they find out after paying and ask for a refund…
Question: "What happens if I stop paying" — the most common and the most frightening.`,
  },
  "newsletter-subject-lines": {
    title: "Twenty subject lines for one email",
    summary: "Options of different kinds, each with its preheader.",
    bestFor: "ChatGPT / Claude",
    tags: ["email", "headlines", "newsletter"],
    prompt: `You are an email marketer. Write subject lines.

What the email is about: {content in two sentences}
To whom: {segment and what they know about you}
Action: {what the reader should do}

Give 20 subjects in four groups of five: a question, a number, intrigue without deceit, plain usefulness.

For each:
1. The subject itself — under 45 characters so it is not cut off on a phone.
2. A preheader that continues the subject rather than repeating it.
3. A note on who this subject suits less well.

Separately: three subjects that will certainly land in spam, and exactly what is wrong with them.`,
    example: `Question: "Why aren't your emails opened?" · preheader: "It isn't the subject — check this"
Spam: "URGENT! Today only −70%" — capitals, exclamation mark, urgency with no reason…`,
  },
  "crm-segments": {
    title: "List segments and what to send each",
    summary: "Contacts split by behaviour, with a message for every segment.",
    bestFor: "Claude / ChatGPT",
    tags: ["crm", "segmentation", "email"],
    prompt: `You are a database marketer. Split the contacts into segments.

What we sell: {product and sales cycle}
What is known about contacts: {what data exists — purchases, opens, site behaviour}
List size: {roughly}
Goal for the coming month: {what we want}

Deliver:
1. Five to seven segments by behaviour, not by gender and age. For each, a selection rule in words that can be turned into a filter.
2. The expected share of the list in each.
3. One message per segment: the reason to write and what to offer.
4. Who must not be written to, and why — as a separate list.
5. The order: which segment to start with so results show sooner.

An "everyone else" segment is mandatory: without it part of the list quietly falls out of the work.`,
    example: `Bought once more than 90 days ago and opens emails — the warmest, start here.
Do not write to: complained about the mailing, unsubscribed, asked for a refund…
"Everyone else" — 40% of the list: nobody looks there, and that is where the growth is.`,
  },
  "press-release": {
    title: "A press release that gets read",
    summary:
      "The news in the first paragraph, facts instead of adjectives, a usable quote.",
    bestFor: "ChatGPT / Claude",
    tags: ["pr", "press release", "media"],
    prompt: `You are a news editor, not a press office. Write the release so it gets picked up.

Event: {what happened}
Why it matters outside the company: {who the news is for}
Facts and numbers: {list them}
Who can give a quote: {job title}
Date: {when}

Structure:
1. A headline stating what happened, with no "innovative" and no "unique".
2. First paragraph: what, who, when, where, why it matters. Written so it could be printed whole and be enough.
3. Three paragraphs of detail in descending importance: editors cut from the end.
4. One quote that carries content, not "we are delighted to present".
5. A three-sentence note about the company.
6. A press contact.

Turn every judgement into a fact: not "significantly faster" but "40% faster, measured this way".`,
    example: `Headline: "Catalogue opened without registration" — not "A revolution in the world of prompts".
Quote: "Registration was cutting off half of them — we decided browsing should not need it," said…`,
  },
  "budget-plan": {
    title: "Advertising budget split",
    summary:
      "How much per channel, what to expect, and when to switch off what fails.",
    bestFor: "Claude / ChatGPT",
    tags: ["budget", "channels", "planning"],
    prompt: `You are a media planner. Split the budget across channels.

Budget: {amount per month}
Product and average order value: {data}
What has been tried: {channels and results}
Goal: {enquiries / sales / reach, and how many}

Deliver:
1. The split by channel in percentages and money, with the reasoning for each share.
2. For each channel: what to expect at this budget — a range, not a single number.
3. The share reserved for testing hypotheses, and why it cannot be spent on what already works.
4. A stop threshold: at what numbers, after how many days, a channel gets switched off.
5. What happens to the plan if the budget is halved: what goes first.
6. Three costs people usually forget to include.

The range is mandatory: a single number in a forecast reads as a promise.`,
    example: `55% — the channel already producing enquiries. 25% — the second most reliable. 20% — testing.
Threshold: if after 14 days cost per enquiry exceeds the average order value, switch off — not "give it another week"…
Forgotten: creative production, platform fees, advertising tax.`,
  },
  "geo-ai-citations": {
    title: "Getting cited by AI assistants",
    summary:
      "How to make ChatGPT and Perplexity point at you instead of a competitor.",
    bestFor: "Claude / ChatGPT",
    tags: ["geo", "visibility", "ai search"],
    prompt: `You work on visibility inside AI assistants. Work out how to get into their answers.

Product: {what it is}
Questions you want to appear for: {three to five in plain speech}
What the site already has: {pages, articles, docs}
Who appears now: {competitors, if known}

Deliver:
1. How those questions sound when typed at an assistant. People do not phrase them like search queries: not "buy prompts" but "where do I get ready-made prompts for a marketplace listing".
2. Which pages are missing so there is something to cite. Assistants cite an answer to a question, not marketing copy.
3. How to rewrite existing pages: the direct answer in the first paragraph, detail after. An answer buried mid-page is not found.
4. What earns citation: numbers, dates, names, comparison tables. Generalities are not cited — there is nothing to stand behind.
5. Where else you must be mentioned: directories, reviews, forums. Assistants do not pull from your site alone.
6. How to check: three questions and exactly what to look for in the answer.

Do not confuse this with Google SEO: there you fight for the click, here for the mention. There may be no clicks at all and still be sales.`,
    example: `Plain-speech question: "are there ready prompts for marketplace listings or do I write my own".
Missing page: a comparison of your prompts against writing your own, with time figures.
Rewrite: the section page answers outright in paragraph one — "20 marketplace prompts, 9 of them free" — instead of "Welcome to the section".
Check: ask three assistants and see whether you are in the list, and which page they cite.`,
  },
  "winback-sequence": {
    title: "A win-back sequence",
    summary: "Three emails to people who drifted away — no guilt, no begging.",
    bestFor: "ChatGPT / Claude",
    tags: ["email", "win-back", "retention"],
    prompt: `You are an email marketer. Write a win-back sequence.

Product: {what it is}
Who left: {stopped visiting, did not renew, dropped off mid-way}
How long ago: {timeframe}
What changed since: {new in the product}
What you can offer: {discount, extension, nothing}

Three emails:
1. The first carries no offer. Only a reminder of what they came for and one honest line: we noticed you are gone.
2. The second is what changed. Specifically, not "we got better": two or three changes that touch this person.
3. The third is the offer and a direct question: come back or unsubscribe. Keeping someone on the list in silence is worse than losing them.

For each give a subject under 40 characters, a preheader, under 120 words of body, and one button. Plus how many days apart to send.

Do not apologise for their leaving. They owe you nothing, and an apology makes the email cling.`,
    example: `Email 1, subject "You were after listing prompts". Body: "Three weeks ago you took two Wildberries prompts. Nothing since — maybe they did not fit. If so, tell me how and I will answer personally." Button "Write back".
Email 3, subject "Stay or unsubscribe". A direct question, two buttons, no discount on the third email — it would cheapen the first two.`,
  },
  "story-post-social": {
    title: "A story post with a soft ask",
    summary: "A real case told so the sale does not stick out.",
    bestFor: "ChatGPT / Claude",
    tags: ["social", "storytelling", "linkedin"],
    prompt: `You are an editor. Build a story post around a real piece of work.

What happened: {the case, in your words}
Who was involved: {you, client, team}
How it ended: {result, better with a number}
What you sell: {service or product}
Platform: {LinkedIn, Facebook, Telegram}

Build:
1. A first line that is a moment, not a conclusion. "At 7:40pm on Friday the client wrote that launch was tomorrow" works; "I want to share a case study" does not.
2. The middle: what went wrong, what you tried, where you were wrong. Without the mistake there is no story, only a report.
3. The result, with a number and a timeframe.
4. A one-line lesson that applies beyond your case.
5. A soft ask on the last line: a question to the reader or an invitation to write. A hard sell kills both halves of a story post.

Length: under 200 words. Paragraphs of one or two lines. No bullet lists — they break the narrative.`,
    example: `First line: "At 7:40pm on Friday the client wrote: launch is Monday, there is no copy."
Middle: wrote it over the weekend, realised on Sunday it was aimed at the wrong audience, rewrote half.
Result: launch held, 34 enquiries in week one.
Lesson: urgency is rarely about the deadline; it is about the task being set late.
Ask: "Had one of these? Tell me how you got out of it.`,
  },
  "brand-voice-guide": {
    title: "Brand voice: rules and bans",
    summary:
      "A guide everyone writes by, models included — and the copy stops sounding like strangers.",
    bestFor: "Claude",
    tags: ["brand voice", "copy", "guidelines"],
    prompt: `You are an editor-in-chief. Write a brand voice guide.

Company: {what it does}
Who you write for: {audience}
How you want to sound: {three or four words}
Samples of your writing: {paste two or three}
Writing you admire elsewhere: {examples}

Deliver:
1. Three rules and three bans. Each with a before-and-after pair.
2. How you address people, and what to do in the awkward cases.
3. Sentence and paragraph length, as numbers. "Write simply" is not a rule; it cannot be applied.
4. Words you never use: officialese, jargon, cliches like "unique offering".
5. How an apology, a refusal and bad news sound. That is where voice is tested — everyone sounds the same on good days.
6. A ready block for a model: a paragraph appended to any copy request.

Point 6 matters most. A guide sitting in a document does not work; the one pasted into a prompt does.`,
    example: `Rule: write from the reader. Was "We have launched a new section" then "You can now download the guide on your phone."
Never: "in the shortest possible time", "team of professionals", exclamation marks.
Sentences under 15 words, paragraphs under 3 lines.
Refusal: "That will not work: we have no access to your reports. Here is what I can do instead."
Model block: "Write to the reader, sentences under 15 words, no officialese, no exclamation marks.`,
  },
  "landing-teardown": {
    title: "Tearing down a competitor's landing page",
    summary:
      "What works on their page and what you can take without copying it.",
    bestFor: "ChatGPT (vision) / Claude",
    tags: ["competitors", "landing", "teardown"],
    prompt: `You are a marketer. Tear down someone else's landing page.

Link or screenshots: {what we are looking at}
Your product: {what you do}
What you want to learn: {why people buy / how they explain price / something else}

Work through it:
1. Who it sells to. Not "everyone": the words in the hero almost always reveal the segment.
2. The hero's promise in one line. If you cannot phrase it, that is already a finding.
3. The block order and the job of each. Look for where a specific objection gets answered.
4. How price is explained and what is done to stop it frightening people.
5. Proof: numbers, testimonials, logos. Which of it is checkable and which is decoration.
6. Three things worth taking — and how to rework them for you rather than copy them.
7. Two mistakes they make. Do not repeat those.

Do not judge the looks. Judge what was done here in service of the sale, and which of it would work on your audience.`,
    example: `Not for everyone: "for teams of 5+" in the hero cuts out solo users.
Promise: "set up in a day, no developer".
Objection handled in block 4: "what if it does not fit" — refund terms, not testimonials.
Take: the refund block. Rework: we have no refund, but half the catalogue is free — same reassurance.
Mistake: 11 "trusted by" logos and not one person's name.`,
  },
  "offer-builder": {
    title: "Building the offer",
    summary: "Turning a list of what you do into a proposition people answer.",
    bestFor: "ChatGPT / Claude",
    tags: ["offer", "sales", "proposition"],
    prompt: `You are a marketer. Build the offer.

What you do: {service or product}
For whom: {segment}
What they end up with: {the result}
Price: {amount}
What they fear: {the main doubt}

Build:
1. The offer in one sentence: for whom, what they get, in what time, for how much. No adjectives.
2. Three versions for different segments — they fear different things.
3. What strengthens it: a deadline, a guarantee, a limit, a bonus. Take one, not all — four amplifiers read as a clearance sale.
4. What to cut from the current description: anything the buyer cannot verify before paying.
5. A test: retell the offer in the customer's words. If it runs longer than one sentence, it will not be remembered or repeated to a friend.

Do not promise what you do not control. "We will get you to the top" promises someone else's decision; "we will build the keyword set and rewrite your listings in 5 days" promises yours.`,
    example: `Offer: "For marketplace sellers — 20 listing prompts, 9 free, one-click copy."
For a beginner: "Your first listing done in an evening, without a copywriter."
One amplifier: half the catalogue is free — you can check before paying.
Cut: "professional approach" and "individual attention" — neither can be verified.`,
  },
  "behaviour-emails": {
    title: "Behaviour-triggered emails",
    summary:
      "Not a schedule, but an email answering what the person did or failed to do.",
    bestFor: "Claude / ChatGPT",
    tags: ["email", "automation", "retention"],
    prompt: `You work on lifecycle. Build a set of behaviour-triggered emails.

Product: {what it is}
The key action: {what they must do to get value}
What analytics shows: {events you track}
Typical time to first value: {duration}

Deliver:
1. Five moments that need an email: signed up and did nothing, took the first step and stalled, reached value, came back after a gap, about to leave.
2. For each, the trigger condition and the delay. An email a minute after the action reads as surveillance; a week later, as coincidence.
3. The copy: subject, one idea, one button. Under 90 words.
4. What must not be in it: product news, if they have not taken the first step yet.
5. Which email cancels which. Without that, people get three in an hour and unsubscribe.
6. How to tell the sequence works: one metric per email.

Rule: the email only sends if the person did not take the next step on their own. Congratulating someone for what they already did spends attention for nothing.`,
    example: `Moment 2: opened a prompt, did not copy it. Delay 2 hours.
Subject "You left a prompt open". Body: one line that copying is one click, button "Back to the prompt".
Cancelled by: copying it — then the email never sends.
Metric: share who copy among those who opened, before and after.`,
  },
  "referral-program": {
    title: "A referral mechanic",
    summary: "What to pay referrers and how much, without eating the revenue.",
    bestFor: "Claude / ChatGPT",
    tags: ["referrals", "growth", "partners"],
    prompt: `You work on growth. Design a referral mechanic.

Product: {what it is}
Price and cadence: {one-off, subscription}
Margin: {what is left}
Who can refer: {customers, creators, partners}
What you tried before: {if anything}

Deliver:
1. What to pay for: signup, first payment, renewal. Paying for signups always brings bots — budget for that up front.
2. How much: a share or a sum, and how it sits on the margin. Work out the refund rate at which the mechanic goes negative.
3. What the referred person gets. One-sided rewards work worse: inviting is awkward when the friend gets nothing.
4. How to track: link, code, both. And what happens when someone arrives by link and buys a week later on another device.
5. What stops abuse: self-referral, second accounts, refunds after payout.
6. How people learn about it: where in the product and at what moment. The best moment is right after they got value, not at signup.
7. When to switch it off: three signs it is bringing the wrong people.

Count in money, not in referrals: a hundred referrals who never pay is an expense.`,
    example: `Pay on first payment, not signup. Signups would bring half of Telegram.
25% of the first payment. At 70% margin and 8% refunds it stays positive up to 35%.
The referred person gets a week of PRO. Without that the link is awkward to post.
Shown on the fifth copied prompt, not at signup: before first value there is nothing to recommend.`,
  },
  "weekly-marketing-report": {
    title: "A weekly marketing report",
    summary: "Half a page that shows what to do next, not how much happened.",
    bestFor: "Claude / ChatGPT",
    tags: ["reporting", "analytics", "weekly"],
    prompt: `You are a marketer. Write the weekly report.

This week's numbers: {paste}
Last week's: {for comparison}
What you did: {launches, posts, ads}
Who reads it: {yourself, your boss, a client}

Build:
1. A first line naming the week's main change and its cause. Not a metric list: those get read later, if at all.
2. Three numbers that moved and why. If the cause is unknown, say so — a guess is worse than a gap.
3. What worked and what did not, with timeframes: an article's effect is not visible in a week, and writing it off is premature.
4. One decision for next week. One, not six: six produces none.
5. What stopped making sense: where sources disagree.

Do not compare week to week blindly: holidays, a competitor's launch and plain weekends move numbers more than your work does. Mark those weeks in the report itself.`,
    example: `Main thing: visits up a third, cause was a mention in someone else's newsletter on Tuesday. Not our doing, not repeatable.
Did not work: ads for the new section, 40 clicks, 0 payments. Stopping them.
Too early: the article went up Thursday, search has not seen it yet.
Decision: rewrite the skills section hero, 70% leave there.`,
  },
  "objection-bank": {
    title: "An objection bank",
    summary:
      "What you say to too expensive, let me think, and we already have one — written once.",
    bestFor: "ChatGPT / Claude",
    tags: ["sales", "objections", "scripts"],
    prompt: `You lead sales. Build an objection bank.

What you sell: {product}
To whom: {segment}
Price: {amount}
What you hear most: {objections in your words}

For each objection give:
1. What is actually behind it. "Too expensive" means either "I do not see the value", or "no money right now", or "I found it cheaper" — three different answers.
2. The clarifying question that tells those apart. Answering before asking is firing blind.
3. An answer for each case, under five lines.
4. What not to say: how bad the competitors are, "but we have", "it is only twenty cents a day".
5. When to agree and let go. Not every objection dissolves, and trying to dissolve them all costs you your reputation.

Add the objection nobody says out loud but everyone thinks. Usually it is "will you still exist next year".`,
    example: `"Let me think" usually means "it is not my call". Question: "Who else looks at this decision?"
If it is not their call: give them something forwardable — one page with price and outcome.
Do not say: "what is there to think about".
Let go: if the quarter's budget is closed, agree on a reminder date instead of pushing.
Unspoken: "you are new". Answer: half the catalogue is free, checkable without paying.`,
  },
  "partner-outreach": {
    title: "A partnership outreach email",
    summary:
      "A first message to a stranger's project that gets answered instead of deleted.",
    bestFor: "ChatGPT / Claude",
    tags: ["partnerships", "outreach", "email"],
    prompt: `You handle partnerships. Write the first email.

Who you are writing to: {project, person}
What you know about their work: {specifics}
What you propose: {the substance}
What they get: {benefit on their side}
What you already have: {audience, product, numbers}

The email:
1. A first line about them, and not a compliment. "I have followed you for ages" is what everyone writes; "your Ozon guide has no section on video, and sellers keep asking about it" is what nobody writes.
2. The proposal in two lines: what you do and what they do.
3. Their benefit, as a number or a timeframe. Without one it reads as a favour request.
4. The smallest possible first step. Not "let us jump on a call" — a call is already a commitment.
5. A graceful out: one line permitting them not to reply.

The whole email under 120 words. Long first emails do not get finished, and only finished emails get answered.`,
    example: `First line: "Your Ozon guide has no section on listing video — it is asked three times in the comments."
Proposal: "We have 20 listing prompts; I can hand over the video part as a ready insert. Your name on it, a link to us at the bottom."
Benefit: "Closes a question you keep getting, without costing you time."
First step: "Want the draft insert? Five minutes to read."
Out: "If it is not your thing, just leave this — no hard feelings.`,
  },
  "survey-questions": {
    title: "A survey that does not lie",
    summary: "Questions people answer honestly instead of pleasantly.",
    bestFor: "Claude",
    tags: ["survey", "research", "questions"],
    prompt: `You are a researcher. Write a customer survey.

What you want to learn: {the decision that depends on it}
Who you ask: {segment and how many}
Where: {email, in-app, chat}

Deliver:
1. Eight to ten questions. About the past, not the future: "what did you pay last time" gets honest answers, "what would you be willing to pay" does not.
2. Rewrite the leading ones. "How much did you enjoy the new section" already contains its answer.
3. Order: easy and concrete first, sensitive near the end. A money question first ends the survey.
4. Where an open answer is needed and where a choice is. No more than two open ones: not everyone writes them and you read them by hand.
5. What you will do with each answer. A question whose answer changes nothing must go — it spends other people's time.
6. How to invite people and how to thank them without skewing the sample. A gift for answering brings gift hunters.

Do not ask what someone needs. Ask what they did — the need shows through that, and rarely through the first question.`,
    example: `Instead of "which features do you need" then "what did you do last time you could not find the right prompt".
Leading: "how convenient is the new search" then "walk me through how you looked for a prompt last time".
Money question eighth, not first.
What we will do: if more than half go to search after the third screen, search moves to the top.`,
  },
  "segment-rewrite": {
    title: "One text, three segments",
    summary:
      "The same product explained to a beginner, a professional, and the person paying.",
    bestFor: "ChatGPT / Claude",
    tags: ["copy", "segments", "rewriting"],
    prompt: `You are an editor. Rewrite a text for different segments.

Original text: {paste}
Product: {what it is}
Segments: {three groups, who they are}
What matters to each: {if you know}

For each segment deliver:
1. The rewritten text at the same length.
2. What changed: which word became which, and why. Not "made simpler" — which word.
3. Words this segment does not know, and what replaced them.
4. The objection this version answers.
5. What stayed the same across all three. The shared part is your product; if nothing is shared, you have described three.

Do not substitute tone for segmentation. "Friendly for beginners, serious for professionals" is intonation, not segments. What changes is what you talk about, not how.`,
    example: `Beginner: "Not sure where to start — take a ready prompt and change only what is in braces."
Professional: "Role-input-format structure, adapted to your process in a minute."
The person paying for a team: "Five people stop writing prompts five different ways."
Shared by all three: a ready structure nobody has to invent.`,
  },
  "launch-plan": {
    title: "A launch plan",
    summary:
      "What to do two weeks before, on the day, and after — by day, not in generalities.",
    bestFor: "Claude / ChatGPT",
    tags: ["launch", "plan", "product"],
    prompt: `You run launches. Write the plan.

What launches: {product, feature, section}
Date: {when}
Who you announce to: {your list, new people, partners}
What is ready: {site, copy, emails}
Team: {how many people}

Deliver:
1. A countdown by day: what happens at 14, 7, 3, 1 day out and on the day.
2. What must be finished before the announcement rather than "in progress". The list without which the launch is postponed.
3. Three waves: your channels, other people's, paid. Days apart — all at once spends the news in an hour.
4. What to say to each group: an existing customer and a stranger have different questions.
5. What to measure in the first 48 hours and which number counts as failure. Agree before launch, or any number gets called a success.
6. A plan for going unnoticed: what to do on day three with no reaction.
7. What not to do: a first-day discount, a promised date for the next feature.

Point 6 is needed more often than you would think: launches rarely fail, they mostly go unnoticed.`,
    example: `7 days out: email the list that something is coming, no date. Verify payment works on a phone.
Launch day: post at 10am, email at 2pm, answer comments until evening.
Failure is under 20 payments in 48 hours. Agreed in advance.
Quiet on day three: write to ten customers personally and ask whether they saw it. Usually not.`,
  },
  "ad-creative-brief": {
    title: "An ad creative brief",
    summary: "A brief for a designer or editor that does not end in a redo.",
    bestFor: "Claude / ChatGPT",
    tags: ["advertising", "brief", "creative"],
    prompt: `You are a marketer. Write a brief for an ad creative.

What is advertised: {product}
Where it runs: {platform and format}
For whom: {segment}
What the viewer should do: {action}
What you tried: {what worked and what did not}

The brief:
1. One idea. One. Two ideas do not fit in six seconds.
2. The first three seconds: what is seen and what is heard. Fewer than half make it past second three.
3. What must be in frame: product, price, a face, text.
4. On-screen text: under seven words, works with sound and without. Most people watch muted.
5. Three versions of one idea, differing in the run-up rather than the colour of a box.
6. Technical requirements: aspect ratio, duration, the safe area under the platform's own interface.
7. What counts as a result: completion, clicks, payments. And after how many impressions you decide.

Do not describe a mood. Describe what happens on screen second by second — the mood assembles itself.`,
    example: `Idea: "the prompt is already written for you".
Seconds 0-3: hands scrolling a phone, an empty input field, voice: "twentieth rewrite".
Must be in frame: the screen with a finished prompt and a copy button.
Text: "117 ready prompts" — three words, readable muted.
Decide after 10,000 impressions, not earlier.`,
  },
  // ─────────────────────────── UGC ───────────────────────────
  "ugc-script-30s": {
    title: "A 30-second UGC video script",
    summary:
      "A native script, the way you'd tell a friend: hook, problem, demo, CTA — timed out.",
    bestFor: "ChatGPT / Claude",
    tags: ["script", "tiktok", "ugc"],
    prompt: `Write a 30-second UGC video script for {product}.

Audience: {who}
Platform: {TikTok / Reels}
Format: talking head plus a product demo.

Break it down by timing:
0–3 s — hook (a problem or intrigue)
3–8 s — why it matters / the pain
8–20 s — the product in action, what you liked
20–27 s — the result / the emotion
27–30 s — a soft CTA
Tone: alive, the way you'd recommend something to a friend. Add notes in [what we show on camera].`,
    example: `0–3s: "I spent three years looking for a cream that doesn't go shiny by lunch…" [holding the jar]
8–20s: [applying] "Look — matte, but the skin doesn't feel tight"…
27–30s: "I'll leave the link, try it yourself 🤍"`,
  },
  "ugc-hooks-15": {
    title: "15 native hooks for UGC",
    summary:
      "Hooks that don't look like ads — people watch them through and believe them.",
    bestFor: "ChatGPT / Claude",
    tags: ["hooks", "native", "watch time"],
    prompt: `Come up with 15 native hooks for a UGC video about {product}.

Audience: {who}
Important: the hook must NOT sound like an ad. It should sound like a person genuinely sharing.

Mechanics: a personal story, "I was shocked", a before/after comparison, admitting a mistake, anti-advertising ("don't buy this if…"), an insight. Write in the first person, conversationally.`,
    example: `· "I never thought I'd say this about something off a marketplace, but…"
· "I didn't tell my husband what it cost — and he was the first to notice the difference."
· "I bought it expecting to be disappointed. It didn't work out that way."…`,
  },
  "ugc-brief-brand": {
    title: "Brief for a UGC creator",
    summary:
      "A clear spec for a creator: what to film, what to say, what to avoid — no ten rounds of edits.",
    bestFor: "Claude / ChatGPT",
    tags: ["brief", "spec", "creators"],
    prompt: `Write a brief for a UGC creator for a video about {product}.

Brand: {name}
Goal of the video: {sales / product awareness}
Audience: {who}
Key messages that must land: {2–3 points}

The brief must contain:
1. The task and the target action for the viewer.
2. Length and format.
3. Required shots (what to show).
4. What must be said (talking points, not a verbatim script).
5. The do-not list: what NOT to do or say.
6. Style references.
7. Technical requirements (9:16 vertical, sound, light).`,
    example: `Target action: tap the link in the description.
Required shots: unboxing, product close-up in hand, in use…
Do-not list: don't promise it "cures" anything, don't name competitors, no medical claims.`,
  },
  "ugc-testimonial": {
    title: "A testimonial people believe",
    summary:
      "A video testimonial script on the formula «there was a problem → doubt → result».",
    bestFor: "ChatGPT / Claude",
    tags: ["testimonial", "trust", "script"],
    prompt: `Write the script of a sincere video testimonial about {product} using the trust formula.

The customer's experience: {what it was like, what it became}

Structure:
1. Scepticism: "honestly, I had doubts, because…"
2. The problem: what they lived with before.
3. The buying trigger: what convinced them to try.
4. The experience of using it: one concrete detail that stood out.
5. The result: what changed (with a number or fact if there is one).
6. Who I'd recommend it to and who I wouldn't.
No grandeur, no superlatives — ordinary human speech.`,
    example: `"Honestly — I don't trust reviews, so I'll tell it plainly. I took the risk…
A week in I noticed I'd stopped buying the other product. That's the real signal for me."`,
  },
  "ugc-series-ideas": {
    title: "10 ideas for a UGC series",
    summary:
      "A whole series about one product in different formats — a month of content.",
    bestFor: "ChatGPT / Claude",
    tags: ["ideas", "series", "formats"],
    prompt: `Propose 10 UGC video ideas about {product} for a content series.

Audience: {who}
Each idea gets its own format so the series doesn't get stale.

Formats for inspiration: unboxing, "a day with me + the product", top mistakes, "buying it for the first time", a test/challenge, comparison against an alternative, "answering your questions", anti-advertising, "what's inside", a reaction.

For each idea: Format | Hook | What we show | Target action.`,
    example: `1. Unboxing | "I ordered it to test the hype" | box → product → first impression | follow
2. Test | "Will it last 8 hours?" | timelapse of the day | link tap…`,
  },
  "ugc-caption-cta": {
    title: "Caption and CTA for a video",
    summary:
      "A caption that catches plus call-to-action options people actually tap.",
    bestFor: "ChatGPT / Claude",
    tags: ["caption", "cta", "engagement"],
    prompt: `Write a caption for a UGC video about {product}.

What the video is about: {the gist}
Platform: {TikTok / Reels}

Give me:
1. Three variants of the first line (the part visible before "more").
2. The main caption text (alive, 2–4 lines, emoji in moderation).
3. A question for the comments (to drive engagement).
4. 5–7 relevant hashtags (a mix of broad and niche).
5. Three CTA variants of different strength.`,
    example: `First line: "Don't buy it until you've watched to the end 👇"
CTA: soft — "save it so you don't lose it" · medium — "link in bio" · hard — "only a few left, grab one".`,
  },
  "stories-warmup": {
    title: "A 7-day stories warm-up",
    summary:
      "A day-by-day stories plan: what to film, what to write, where the selling goes.",
    bestFor: "ChatGPT / Claude",
    tags: ["stories", "warm-up", "launch"],
    prompt: `Build a 7-day stories warm-up plan ahead of a launch.

What we sell: {product} for {price}
Audience: {who follows you}
The main objection: {what stops them buying}
Sales start date: {day N}
How many stories a day you can realistically film: {number}

For each day:
— The one job of the day
— 4–6 stories: what is on camera, the on-screen text, what to say
— One engagement mechanic (poll, question, reaction) — no more than one a day
— What NOT to do that day

Logic of the week: days 1–2 — context and trust, 3–4 — the pain and its cost, 5 — the solution and a case, 6 — the announcement and terms, 7 — sales open and the deadline.
Direct selling only from day 6. Before that you sell the meaning, not the product.`,
    example: `Day 3 · Job: show the cost of doing nothing.
Story 1: [face to camera] "I worked out how much this costs me over a year"…
Don't: don't name the product's price, it's too early.`,
  },
  "reels-trend-adapt": {
    title: "A trending Reel adapted to your niche",
    summary:
      "Take a popular format and fit it to your product without losing the point.",
    bestFor: "ChatGPT / Claude",
    tags: ["reels", "trend", "adaptation"],
    prompt: `Adapt a trending Reels format to my niche.

The trend: {describe the format or the sound}
My niche: {what you do}
Product: {what we promote}
Audience: {who}

Give 5 adaptations. For each:
— How the trend transfers to the niche (in one sentence)
— The hook: the first line or the first frame
— A second-by-second shot list: what is on camera, what the on-screen text says
— Where the product appears naturally rather than as an ad
— The caption and the call to action

Important: the trend must serve the point, not be forced onto it. If the format doesn't fit the niche, say so and propose one close in spirit.`,
    example: `Option 2 · "What I thought vs what it turned out to be"
0–2s: text "Thought I'd never finish in an hour" [rushing]
2–6s: "Actually — 12 minutes" [timelapse of the work]…`,
  },
  "profile-packaging": {
    title: "Profile packaging and bio",
    summary:
      "Name, bio and pinned posts: three seconds to make following you obvious.",
    bestFor: "ChatGPT / Claude",
    tags: ["profile", "bio", "personal brand"],
    prompt: `Package my profile so that in 3 seconds it is clear who I am and why to follow me.

Who I am and what I do: {description}
Who the content is for: {audience}
What I sell: {product or service}
How I differ: {facts}
Platform: {Instagram / Telegram / TikTok}

Give me:
1. Profile name (the searchable field): 3 variants of "Name | niche as people search it".
2. The first line of the bio — the main promise, without "I help…".
3. The full bio within the character limit: who, for whom, the proof, the call to action.
4. What to pin: 5 topics and why each one.
5. Highlight names: 6 of them, following the customer journey.
6. What to cut from the current bio and why.
Write in the audience's language, no officialese and no list of credentials up front.`,
    example: `First line: "Your finances in order in 20 minutes a week"
Highlights: Start here · Cases · Reviews · Pricing · FAQ · About me`,
  },
  "video-to-post": {
    title: "From video to post and carousel",
    summary:
      "A transcript becomes post copy, a carousel and a set of pull quotes.",
    bestFor: "ChatGPT / Claude",
    tags: ["repurposing", "content", "carousel"],
    prompt: `Turn the transcript of my video into other content formats.

Transcript: {paste the text}
Platform: {where we publish}
Audience: {who}

Do this:
1. A post (up to 1,500 characters): a catching opening, the substance without filler, a conclusion, a question to the reader.
2. An 8-slide carousel: a large headline per slide plus a short caption.
3. Five quotes for separate stories or images — the strongest things said, verbatim.
4. Three hooks for cutting the video into shorts, with timecodes from the transcript.
5. What was said weakly in the video and worth strengthening next time.
Keep my way of speaking: take the wordings from the transcript, don't rewrite them into "editorial" language.`,
    example: `Slide 1: "Three mistakes that burn your budget"
Quote: "Ads don't fail because they're expensive. They fail because they lead to the wrong place."`,
  },
  "comments-replies": {
    title: "Replies to comments and DMs",
    summary:
      "Templates for the usual messages: from «how much is it» to outright rudeness.",
    bestFor: "ChatGPT / Claude",
    tags: ["comments", "dms", "communication"],
    prompt: `Write reply templates for messages from followers.

Niche: {what you do}
Tone: {friendly / expert / informal}
Product and price: {what and how much}

Two variants for each case:
1. "How much is it?" in the comments under a post.
2. "Can it be cheaper / is there a discount?"
3. An enthusiastic review.
4. Fair, constructive criticism.
5. Rudeness and belittling.
6. A question already answered in your pinned posts.
7. A collaboration offer from a brand.
8. A request for a free consultation.

Rules: reply short, like a human, don't apologise for existing. On price — state it right away instead of inviting them to DMs. On rudeness — calm and dignified, no squabbling.`,
    example: `"Too expensive" → "I get it, it's a noticeable sum. Here's what's included, and you decide: …"
Rudeness → "Sorry it didn't land. My content may simply not be for you — that's fine."`,
  },
  "blog-rubricator": {
    title: "Blog rubric system",
    summary:
      "5–7 rubrics with a clear job each, so the content stops being random.",
    bestFor: "Claude / ChatGPT",
    tags: ["rubrics", "strategy", "blog"],
    prompt: `Build a rubric system for a blog so the content stops being chaotic.

Niche and subject of the blog: {description}
Who I am: {expert, experience, what makes me interesting}
Audience: {who and at what stage}
Goal of the blog: {sales / reach / community}
What I publish already: {examples}

Give 5–7 rubrics. For each:
— The rubric name (as the audience would call it)
— Why it exists in the blog: which job it does
— Which stage of the customer journey it serves
— Format and frequency
— Three concrete topic examples for me specifically

At the end: the weekly proportion of rubrics and which one is missing most right now.`,
    example: `Rubric "Other people's mistakes" — removes the objection "it won't work for me", serves the consideration stage.
Topics: "Why his launch flopped", "Three mistakes in a first launch"…`,
  },

  "ugc-unboxing": {
    title: "A 30-second unboxing script",
    summary: "What to say and show before the viewer scrolls past.",
    bestFor: "ChatGPT / Claude",
    tags: ["unboxing", "reels", "script"],
    prompt: `You are a short-video writer. Write an unboxing script.

Product: {what is being unboxed}
Who films: {your persona and tone}
What must be remembered: {one property of the product}
Platform: {Reels / TikTok / Shorts}

Deliver a table by seconds: time, what is in frame, what is said, what appears as on-screen text.

Rules:
1. The first two seconds are not the box but the result or an unexpected shot.
2. The opening itself takes no more than five seconds: it has been filmed a thousand times before you.
3. Reveal one property in detail, mention the rest.
4. The ending is not "hit like" but a reason to have watched to the end.
5. Three alternative opening lines to choose from.`,
    example: `0–2 s: the product already in hand, a shot of the result. Text: "In 40 seconds you will see why I keep it"
2–7 s: opening it, sped up, no commentary…
Ending: "One thing inside I almost threw away" — then show it.`,
  },
  "ugc-before-after": {
    title: "A before-and-after video without deceit",
    summary:
      "How to show a result people believe instead of calling it editing.",
    bestFor: "ChatGPT / Claude",
    tags: ["before-after", "result", "trust"],
    prompt: `You are a results-video author. Write a before-and-after script.

What changes: {object or situation}
Timeframe: {over how long}
What actually contributed: {list it honestly}
Footage available: {what shots exist}

Deliver:
1. Shot order with timings.
2. How to show the "before" so it does not look deliberately worsened: same light, same angle, same time of day.
3. Where to state the timeframe, and why it cannot go at the end.
4. What to say about factors other than the product: without this the video reads as an ad.
5. Three comments people will definitely write, and the answers.
6. What not to show, so as not to promise the impossible.`,
    example: `Same angle, same time of day — otherwise the first comment is "the lighting is different".
Timeframe in the first five seconds: without it viewers assume it took a week…
The comment "what else did you do" — answer it directly, it removes half the doubt.`,
  },
  "ugc-voiceover-script": {
    title: "Voice-over script for existing footage",
    summary: "Text timed to the shots, with pauses and stresses marked.",
    bestFor: "Claude / ChatGPT",
    tags: ["voice-over", "editing", "script"],
    prompt: `You are a voice-over writer. Write narration for footage that already exists.

What is in the shots: {describe them in order with timings}
Total length: {seconds}
Tone: {calm / energetic / dry}
Goal of the video: {what the viewer should do}

Deliver a table: interval, shot, narration, notes.

Requirements:
1. Count the pace: 2.5–3 words per second. Do not write more than fits.
2. The narration does not describe the shot; it adds what cannot be seen in it.
3. Mark pauses, stressed words, and places where the voice stops and the picture works alone.
4. The first line is spoken immediately, with no greeting.
5. Give two versions of the closing line: with a call to action and without.

Silence is a technique: 40 seconds of unbroken speech is hard to listen to.`,
    example: `0–3 s | hands opening a box | "This cost about as much as dinner for two" | stress on "dinner", 0.5 s pause
7–11 s | close-up of the stitching | (silence) | the picture speaks for itself…`,
  },
  "ugc-shot-list": {
    title: "Shot list for a filming day",
    summary:
      "What to shoot, in what order, and what to bring so nothing is reshot.",
    bestFor: "ChatGPT / Claude",
    tags: ["filming", "shot list", "production"],
    prompt: `You are a director of social-media shoots. Build a shot list.

What we are shooting: {the videos and their topics}
Time available: {hours}
Where: {location}
Equipment on hand: {list it}

Deliver:
1. A numbered shot list: shot size (close, medium, wide), what is in frame, duration, which video it belongs to.
2. Shooting order — by light and by location, not by script: moving lights takes longer than performing.
3. What to bring: props, clothes, the small things people forget.
4. Backup shots: what to film "just in case" if the main one does not come together.
5. Three shots that save any edit, even when the day goes wrong.
6. When to stop so there is time to review the footage on location.

Review on location: at home you discover the audio is empty and it is too late to reshoot.`,
    example: `1. Close-up, hands with the product, 6 s, for videos 1 and 3 — shot once, used twice.
Order: start by the window while the light is soft; dark shots come after…
Backups: a walk-through, a shot from behind, hands without a face — these patch any hole in the edit.`,
  },
  "ugc-collab-pitch": {
    title: "A collaboration pitch to a brand",
    summary:
      "A short message that gets answered — with numbers and one concrete idea.",
    bestFor: "ChatGPT / Claude",
    tags: ["collaboration", "outreach", "brand"],
    prompt: `You are a creator writing to brands. Compose the message.

Your channel: {topic, platform, reach, audience}
Brand: {who they are and what they sell}
What you noticed about them: {something specific — a new product, a weak spot, a video that worked}
What you propose: {format}

Requirements:
1. No longer than eight lines — long emails go unread.
2. The first line is about them, not you: what you noticed.
3. One concrete video idea, not "I propose a collaboration".
4. Three numbers about you — the ones the brand cares about, not follower count.
5. One clear next step.
6. No "mutually beneficial", and no rate card in the first message.

Also give a follow-up version for when there is no reply after a week.`,
    example: `"I saw you released a starter set, but the reviews keep asking where to begin" — the first line.
Idea: a video on "the first three days with the set", from someone who genuinely cannot do it yet…
Numbers: 62% completion, 4.1% saves, audience 24–34, large cities.`,
  },
  "ugc-rate-card": {
    title: "Rate card and terms",
    summary:
      "Packages, what is included, how many revisions, and what counts as extra work.",
    bestFor: "Claude / ChatGPT",
    tags: ["rates", "terms", "contract"],
    prompt: `You are a producer helping a creator set prices. Build a rate card.

What you do: {formats of work}
How long each takes: {hours, honestly}
Your reach and results: {numbers}
Who the clients are: {small business / brands / agencies}

Deliver:
1. Three packages of different depth, each listing what is included by name.
2. What is in none of them and is billed separately: props, travel, usage rights in paid advertising.
3. The number of revisions included and the price of one beyond that.
4. Rights: where the brand may use the video, for how long, and what happens beyond that.
5. Payment terms: deposit, deadlines, what happens if a shoot falls through through no fault of yours.
6. Three questions to ask before naming a price.

Paid-advertising usage is its own line: it is where creators most often lose money.`,
    example: `"One video" package: script, filming, editing, vertical format, one revision.
Separate: use in paid ads — a multiplier on the fee, 6-month term…
Question before pricing: "Will the video run as an ad or only on your profile?"
`,
  },
  "ugc-carousel-8": {
    title: "An eight-slide carousel",
    summary: "Text for every slide, the cover, and the caption under the post.",
    bestFor: "ChatGPT / Claude",
    tags: ["carousel", "instagram", "copy"],
    prompt: `You are a carousel author. Build an eight-slide carousel.

Topic: {what about}
For whom: {audience and what they already know}
What the person should do afterwards: {action}

Deliver:
1. Slide 1 — the cover: a headline readable from the feed thumbnail, no longer than six words.
2. Slides 2–6 — one thought per slide, three lines maximum. No "firstly, secondly".
3. Slide 7 — the takeaway: what the person now knows or should do.
4. Slide 8 — the call to action and a teaser for the next post.
5. The caption: not a retelling of the slides but a personal comment ending in a question.
6. Three cover options to choose from.

Cover test: if it could be dropped into someone else's account on another topic, it is weak.`,
    example: `Cover: "Only 12% watch your stories. Here's why"
Slide 2: "You open with 'hey everyone' — those two seconds decide it"…
Caption: "I broke point eight myself for two years. Which one are you on?"
`,
  },
  "ugc-content-repurpose": {
    title: "One shoot, a week of content",
    summary:
      "Turning existing footage into posts, stories and text without filming again.",
    bestFor: "Claude / ChatGPT",
    tags: ["repurposing", "content plan", "efficiency"],
    prompt: `You are a content producer. Split one piece of material into a week of posts.

What exists: {the video, its topic and length}
Platforms: {where we publish}
How many posts are needed: {per week}

Deliver a day-by-day plan; for each post:
1. Format and platform.
2. Which part of the source is used — with timings.
3. What to add in writing or shoot on a phone in five minutes.
4. The headline or opening line.
5. What the post is for: reach, trust or sale.

Separately:
6. What must not be cut out of the source — it loses meaning out of context.
7. Three ideas that can only come from the comments on the first post.

Do not repeat the same thing in different wrapping: people share one feed and see all your posts.`,
    example: `Mon — Reels, 0:12–0:38, rewrite the hook for a cold audience. Goal: reach.
Wed — a carousel of the key points, nothing to film, text only. Goal: saves…
Fri — a story answering the most common comment. Goal: trust.`,
  },
  "ugc-retention-edit": {
    title: "Keeping people to the end",
    summary:
      "Where viewers leave and what to change in the edit so they finish.",
    bestFor: "Claude / ChatGPT",
    tags: ["editing", "retention", "reels"],
    prompt: `You edit short video. Work out why a clip is not finished.

The clip: {subject and length}
Retention graph: {where it dips, if visible}
What is on screen second by second: {describe}
Platform: {Reels, TikTok, Shorts}

Work through:
1. The first 2 seconds: what is visible before the viewer decides to stay. If it opens with a greeting, that is the drop.
2. Every dip in the graph: what is on screen at that second. Usually a pause, a long take, or a switch into explaining.
3. Where to add a change: shot, angle, sound, caption. Every 2-3 seconds in short form.
4. What to cut entirely. There are always 4-6 seconds that add nothing.
5. The last 3 seconds: how to end so the finisher does something.
6. An open loop at the start: a promise closed at the end. Without one there is no reason to stay.

Do not stretch a clip to hit a length: 18 seconds finished beats 40 abandoned halfway.`,
    example: `First 2 seconds: logo and "hey everyone". A third leaves here — replace with the finished result on screen.
Dip at 7s: a long static shot of hands. Cut to one second.
Cut entirely: the list of what the video will cover. Five seconds of promises instead of doing.
Loop: show the outcome in second one, explain only at the end.`,
  },
  "ugc-hook-rewrite": {
    title: "Rewriting a weak hook",
    summary: "The opening line that stops the scroll, in eight versions.",
    bestFor: "ChatGPT / Claude",
    tags: ["hook", "opening line", "reels"],
    prompt: `You write short video. Rewrite the opening line.

Current hook: {as it sounds now}
What the clip is about: {the substance}
For whom: {audience}
What is on screen in second one: {describe}

Deliver:
1. Why the current one fails, in one line, without generalities.
2. Eight versions on different mechanics: question, number, mistake, disagreement, confession, before-after, warning, cut-off sentence.
3. For each, what must be on screen in that same second. A hook is not only words: a strong line over an empty frame holds nobody.
4. Two versions that work with no sound at all, as on-screen text.
5. Which to try first and why.

Every hook under 8 words. Longer and they are already scrolling.`,
    example: `Fails: "Let me tell you how I shoot reels" — promises a talk, not a result.
Mistake: "I shot vertical for three years. Wrongly."
Number: "40 clips, two worked. One difference."
Cut-off: "Never open a video with…"
On screen: a hand covering the lens — movement in second one holds better than a face.`,
  },
  "ugc-ai-video-brief": {
    title: "A video prompt for a product clip",
    summary:
      "A scene description for Sora, Veo or Kling that yields a clip rather than loose frames.",
    bestFor: "ChatGPT / Claude",
    tags: ["generation", "video", "product"],
    prompt: `You direct product films. Build a prompt for a video generator.

Product: {what it is, how it looks}
What to show: {in use, in hand, before-after}
Mood: {two or three words}
Length: {seconds}
Where it goes: {listing, Reels, ads}

Deliver:
1. The prompt in parts: framing, camera move, light, materials, pace. Generators read these literally and ignore vague adjectives.
2. What not to write: words about emotion, brand, "high-converting". There is nothing to draw there.
3. Three versions of one scene: different angle, light, movement.
4. What the generator will certainly ruin: packaging text, hands, fine detail, logos. How to dodge it — by framing, angle, or shooting that part yourself.
5. What to film on a phone and cut in. A mixed clip looks more alive than a fully generated one.
6. How to check before publishing: three tells that give a fake away.

Do not ask a generator to show your exact product: it will draw a lookalike. The exact product comes from a camera.`,
    example: `Prompt: slow push-in on a matte ceramic mug on a wooden table, morning window light from the left, steam rising, shallow depth of field, 4 seconds, no text.
Do not write: "cosy", "premium", "builds trust".
Will ruin: the text on the mug. Dodge by angle — turn it away.
Film yourself: a hand lifting the mug. Three phone seconds, cut in at second two.`,
  },
  "ugc-product-demo": {
    title: "A 20-second product demo",
    summary:
      "Showing how the thing works, without the words quality and convenient.",
    bestFor: "ChatGPT / Claude",
    tags: ["demo", "product", "script"],
    prompt: `You write product films. Write a demo.

Product: {what it is}
Key property: {what sets it apart}
Buyer: {who}
The doubt: {what stops the purchase}

Script it by second:
1. 0-2: the property in action, with no introduction. Not "today I will show you a flask" but a flask being dropped.
2. 3-8: how it works, in one unbroken take. A cut here reads as a swap.
3. 9-14: the doubt and the answer to it. The exact reason people do not buy.
4. 15-18: scale or comparison — next to a hand, a coin, a familiar object.
5. 19-20: what to do next.

For each second: what is in frame, what is said, what is on screen.

The words quality, convenient, stylish and unique are banned. Each has to become an action: convenient means it opens one-handed, and that is visible.`,
    example: `0-2: the flask falls off a table onto tile, the lid holds, nothing spills.
3-8: one take — open one-handed, pour, close. No cuts.
9-14: the doubt is "it will taste of plastic". Pour water, smell it, cut to the steel interior.
15-18: beside a 500ml bottle — it fits the cup holder.
On screen: "drops, does not leak", four words.`,
  },
  "ugc-media-kit": {
    title: "A media kit for brands",
    summary:
      "One page that makes brands want to work with you and know the price.",
    bestFor: "Claude / ChatGPT",
    tags: ["media kit", "brands", "collaboration"],
    prompt: `You manage creators. Build a media kit.

Who you are: {what you do, what you film}
Platforms and numbers: {followers, reach, completion}
Past work: {brands or topics}
What you offer: {formats}
Prices: {if you are willing to state them}

Fit it on one page:
1. First block: who you are and who you film for. The audience, not the follower count: brands care who watches.
2. Numbers that mean something: completion, saves, click-throughs. Followers is the weakest number, shown when there is nothing else.
3. Formats and what each includes: how many clips, how many revisions, whose rights, timelines.
4. Prices or a range. A kit without prices produces a five-email thread about nothing.
5. Two examples and what they achieved: not "it looked good" but a number.
6. Terms: deposit, lead time, what you need from the brand.
7. What you do not do. A refusal in the kit saves both sides a week.

Do not write about yourself in the third person and do not collage screenshots of your stats. One screen, read in a minute.`,
    example: `Audience: marketplace sellers, 25-40, shooting their own listings.
Numbers: 62% average completion, 4.1% saves — both outrank follower count.
Format "clip plus stories": one 20-second clip, 2 revisions, 3 months of social rights, 5 working days.
Do not do: giveaways or loan advertising.`,
  },
  "ugc-brief-decode": {
    title: "Decoding a brand brief",
    summary: "What the brand actually wants and what to ask before you shoot.",
    bestFor: "Claude / ChatGPT",
    tags: ["brief", "brands", "process"],
    prompt: `You are a producer. Decode a brand brief.

The brief: {paste it as sent}
The product: {if the brief does not say}
What is on offer: {format and money}

Work through:
1. What the brand actually wants: awareness, sales, or footage for their own ads. Everything follows from that, and briefs rarely say it.
2. What contradicts itself inside the brief. "Natural, like you would for yourself" and "must say these five points" do not coexist.
3. What is unstated but will surface: rights, usage period, revisions, who approves.
4. Five questions for the brand before you start. Each one asked now is one redo that never happens.
5. What is unrealistic and what to offer instead.
6. Red flags: unlimited revisions, payment after publication, perpetual rights at the same price.

If the brand says "however you like", ask what specifically they liked in your work: usually one clip, and that is the logic to shoot in.`,
    example: `Actually want: footage for their own ads — hence the horizontal requirement.
Contradiction: "lively and natural" plus an approved script word for word.
Unstated: the usage period. Ask — "perpetual" costs double.
Question: "Which of our clips did you like?" The answer sets the tone better than any brief.`,
  },
  "ugc-negotiation": {
    title: "Negotiating revisions and extra pay",
    summary: "How to say this is the third redo without losing the client.",
    bestFor: "Claude / ChatGPT",
    tags: ["negotiation", "revisions", "money"],
    prompt: `You are a producer. Help negotiate revisions.

The job: {project}
What was agreed: {revisions, deadline, money}
What is being asked now: {their exact words}
Which revision this is: {number}
Do you want to keep the client: {yes, no, depends}

Deliver:
1. Whether this is a revision or a new job. The line is simple: a revision fixes a departure from what was agreed; a new job changes the agreement.
2. A five-line reply: willingness first, then the condition.
3. How to name a price without apologising. A price is not a complaint.
4. What to offer instead of refusing, if the client matters: do it now, set the rule for next time.
5. Contract wording for next time: how many revisions are included and what counts as one.
6. When to walk. Signs: revisions change the substance, deadlines never move, and nobody intends to pay for them.

Do not argue taste. Argue the agreement — that one is written down.`,
    example: `This is a new job: they asked to change the presenter, not fix the lighting.
Reply: "Happy to. Changing the presenter is a reshoot, not a revision: lighting and script start over. A reshoot is 60% of the fee, three days. Confirm and I start tomorrow."
For the contract: "Two revisions to lighting, sound and edit are included. Changing script, presenter or location is a new shoot.`,
  },
  "ugc-trend-audit": {
    title: "Take this trend or skip it",
    summary: "A two-minute check: will it work for you or look forced.",
    bestFor: "ChatGPT / Claude",
    tags: ["trends", "decision", "content"],
    prompt: `You are a short-form strategist. Judge whether to take a trend.

The trend: {describe or link}
Your subject: {what the channel is about}
Audience: {who watches}
What you posted last month: {examples}

Check:
1. How old the trend is. Past two weeks and you arrive at an empty table.
2. What actually works in it: the sound, the edit, the phrasing, or the situation. That is what you copy, not the whole clip.
3. Whether it fits your subject without strain. Strain shows instantly and costs more trust than it earns reach.
4. What must change so it is your clip rather than a repeat.
5. Who in your niche already did it. Five means late; zero means check whether there is a reason.
6. The call: take it, take it changed, skip. With one line of why.

Skip is a normal answer. A channel that takes every trend is about nothing within a month.`,
    example: `Five days old — in time.
What works is not the sound but the phrasing: "things I stopped doing".
Fits: "prompts I stopped writing by hand".
Two in the niche did it, both on other subjects.
Call: take it changed — keep the phrasing, drop the sound, it is not ours.`,
  },
  "ugc-batch-month": {
    title: "A month of clips in one shoot day",
    summary:
      "What to film back to back so the rest of the month is only editing.",
    bestFor: "Claude / ChatGPT",
    tags: ["shooting", "planning", "batching"],
    prompt: `You produce content. Plan one shoot day to cover a month.

Channel subject: {what it is}
Clips needed: {number per month}
What you have: {camera, light, location, helper}
Hours available: {realistically}
Already shot: {existing material}

Deliver:
1. The clip list grouped not by topic but by setup: one outfit, one location, one lighting state shoot together.
2. Shooting order: what needs fresh energy first, faceless shots last.
3. What to shoot spare: cutaways, hands, details. Those are what run out in the edit, and reshooting costs a separate day.
4. What cannot be shot ahead: reactions to news, answers to comments. Leave slots for them.
5. An hour-by-hour timing with breaks. After four hours on camera the face tires, and it shows.
6. What to check before starting: sound, battery, card space, how the window light dies by evening.
7. How to name and store files so you can find a take two weeks later.

Do not shoot 30 clips identically: in the feed they run back to back, and the repeated outfit reads as a warehouse.`,
    example: `Group 1, blue shirt, kitchen, daylight: 6 clips about tools.
Order: talking pieces first, hands and screen by evening.
Spare: 10 phone cutaways and 5 hand shots. Always short of those.
Slots: two clips a month left unshot, for comment replies.
Files: date_topic_take, or you will not find it in two weeks.`,
  },
  "ugc-story-poll": {
    title: "A story poll that moves sales",
    summary:
      "Not yes/no for engagement, but a question whose answer changes something.",
    bestFor: "ChatGPT / Claude",
    tags: ["stories", "poll", "sales"],
    prompt: `You produce social. Build a story series around a poll.

What you sell: {product}
What you want to learn or nudge: {goal}
Audience: {who watches}
How many stories you will shoot: {number}

Deliver:
1. The chain: the story before the poll, the poll, what shows after each answer. A poll with no follow-up is a wasted contact.
2. The question with two options people genuinely choose between. "Do you like it?" with "yes" and "very" tells you nothing.
3. What to show the people who picked option one and what for option two. Different answers mean different doubts.
4. Where the link goes and why there: right after the answer, while the person is in contact.
5. How to use the result in the next post. A number from your own poll is the strongest argument: it is about these very people.
6. What not to do: polls for view counts, three polls in a row, questions with an obvious right answer.

The question must be one whose result you actually want to see. If you already know the answer, it is decoration, not a poll.`,
    example: `Before: a frame with two listings, one with video, one without.
Poll: "What do you look at first in a listing?" — "photos" / "video".
Photo voters: a story on building the infographic. Video voters: the generation prompt.
Link right after the answer, not at the end of the series.
Next post: "68% of you look at photos first — so video at the bottom of the listing will not save it.`,
  },
  "ugc-face-to-camera": {
    title: "A talking head people finish",
    summary:
      "What to do on camera when you have no product and no pretty location.",
    bestFor: "ChatGPT / Claude",
    tags: ["shooting", "camera", "delivery"],
    prompt: `You are a director. Help shoot a clip that is just a person on camera.

Subject: {what you talk about}
Length: {seconds}
Location: {where}
What gets in the way: {stiffness, reading off paper, monotone}

Deliver:
1. The script broken into 6-8 second chunks. Long paragraphs cannot be held in the head, and reading off a page shows in the eyes.
2. What to do between chunks: change framing, step, turn, gesture. A still face holds nobody for 30 seconds.
3. Where to place a pause. A pause before the main point beats volume.
4. What to cut from the speech: filler, "actually", "sort of", apologies for the recording quality.
5. Where to stand and where to look. Into the lens, not the screen — otherwise the gaze drops and reads as uncertainty.
6. What to put behind you and what to remove. The background must not be more interesting than you.
7. Three takes with different delivery: calm, fast, with pauses. Cut the best one.

Do not memorise the words. Memorise the order of the thoughts — memorised text is audible and sounds like an advert.`,
    example: `Chunk 1 (7s): "I shot forty clips. Two worked." Pause. Change framing.
Chunk 2 (8s): "The difference was not the lighting or the edit."
Cut: "so", "basically", "sorry about the audio".
Background: close the open wardrobe — the eye goes there.`,
  },
  "ugc-usage-rights": {
    title: "Usage rights and terms",
    summary:
      "What exactly you sell a brand, and what the word perpetual costs.",
    bestFor: "Claude",
    tags: ["rights", "contract", "money"],
    prompt: `You are a producer who explains legal terms plainly. Work through the rights on a clip.

What you shoot: {format}
For whom: {brand}
What they ask for: {the wording from the brief}
Your rate: {per clip}
You are on camera: {yes or no}

Work through:
1. What is actually sold: the file, the right to show it, the right to alter it, the right to use your face. Four different things, usually collapsed into one in the brief.
2. Where it runs: their own social only, paid ads, marketplace listings, out of home. Each is its own line and its own money.
3. Term: 3 months, a year, perpetual. Perpetual is never free — offer a multiplier.
4. Whether the brand may re-edit and re-voice your clip, and whether that needs approval.
5. Your face separately: the right to your likeness does not transfer with the file.
6. What to write on the invoice or contract — three or four plain lines.
7. What to do if the clip is still running after the term ends.

Do not hand over everything forever at the price of one clip: that clip can run in paid ads for a year and you will not be paid for it.`,
    example: `Selling: the right to show on the brand's own social, 6 months. Not selling: paid ads or marketplace listings.
Multipliers: paid ads +60%, perpetual +100%.
Re-edit: by approval only — otherwise the meaning changes and the face stays yours.
On the invoice: "20-second clip. Rights: brand social, 6 months, no paid promotion. Re-edits by approval.`,
  },
  "ugc-hooks-from-reviews": {
    title: "Hooks pulled from reviews",
    summary:
      "Opening lines written not by you but by people who already bought.",
    bestFor: "ChatGPT / Claude",
    tags: ["reviews", "hooks", "content"],
    prompt: `You write short video. Mine hooks out of reviews.

Reviews: {paste, unsorted is fine}
Product: {what it is}
Platform: {where you post}

Deliver:
1. Ten lines from the reviews that work as a first second. Verbatim: a buyer phrases it better than marketing, because they use their own words.
2. Five doubts that repeat. Each is a clip: the doubt in second one, the answer in second two.
3. Three negative reviews that make good clips. An objection you name yourself lands better than one you avoid.
4. The words buyers use for the product. Often not yours — and they will search with theirs.
5. What reviews praise that you never mention. Usually that is the main thing.

Do not tidy the quotes. A review hook works precisely because it sounds like a person rather than copy.`,
    example: `From a review: "bought it for the cottage, turns out I use it more at home" — a ready first line.
Repeating doubt: "it is probably heavy". Clip: put it on the kitchen scale.
Negative review: "the instructions are useless" — shoot your own in 20 seconds.
They call it something else: you write "insulated tumbler", buyers write "cup with a lid".`,
  },
  "ugc-fail-analysis": {
    title: "Post-mortem on a clip that flopped",
    summary: "Why it did not land, in order, rather than by feel.",
    bestFor: "Claude / ChatGPT",
    tags: ["analysis", "stats", "mistakes"],
    prompt: `You analyse short video. Do a post-mortem on a clip that flopped.

The clip: {subject, length}
Numbers: {impressions, completion, saves, follows}
Your usual numbers: {for comparison}
When and where posted: {day, time, platform}
What you did differently: {if anything}

Work out where exactly it broke:
1. Few impressions with normal completion — the platform did not distribute it. The cause is not the clip: check the audio, the tags, a link in the description, the posting time.
2. Normal impressions, low completion — the first second or the middle lost them. Find where.
3. Normal completion, no saves — it was watched but is of no use to anyone. Applicability is missing.
4. Everything normal, no follows — the clip does not say what the channel is about next.
5. One cause, not a list. Five named causes means none of them is testable.
6. One change for the next clip. And the number that will prove that was it.

Do not default to blaming the algorithm. The algorithm explains the first occurrence; after three, it is the clips.`,
    example: `400 impressions against a usual 6,000 — not distributed. Completion 71%, above normal.
Likely not the clip: there is an external link in the description, which is unusual.
Change one thing: next clip with no link, link in the pinned comment instead.
Test: if impressions return to 6,000 at the same completion, that was it.`,
  },
  "ugc-brand-match": {
    title: "Which brands to approach",
    summary:
      "A list of the ones you genuinely fit, instead of a blast to everybody.",
    bestFor: "Claude / ChatGPT",
    tags: ["brands", "prospecting", "collaboration"],
    prompt: `You handle partnerships. Build a brand list for a creator.

What you film: {subject}
Who watches: {audience in detail}
What you have advertised: {if anything}
Your format: {clips, stories, reviews}
Geography: {country, city}

Deliver:
1. Twenty brands in three groups: obvious, non-obvious, and those already working with creators your size.
2. Why each fits — one line about audience overlap, not about the product being good.
3. Who decides inside those companies and how to reach them: a specific role, not a general inbox.
4. What to say in the first message to that particular brand: a hook from their current work.
5. Who not to write to and why: too large, agency-only, recently burned by creators.
6. The order: who to start with so the first reply arrives sooner. Starting with your dream brand is a reliable way to be disheartened by week two.

Twenty specific emails beat two hundred identical ones. Two hundred identical ones do not work at all.`,
    example: `Non-obvious: analytics tools for sellers. Same audience, and they barely hire creators — no competition.
Decides: the marketer, not procurement. Search the company name plus "marketing".
Hook: they published a teardown last month that is missing video.
Do not write: large marketplaces directly — their vendor is booked a year out.
Start: with the non-obvious ones. They reply faster, and then you have something to show the obvious ones.`,
  },
  // ─────────────────────────── Marketplaces ───────────────────────────
  "mp-product-card": {
    title: "SEO listing for Amazon / Etsy",
    summary:
      "Title, benefit bullets and a description with keywords — a listing that gets found and bought.",
    bestFor: "ChatGPT / Claude",
    tags: ["listing", "seo", "amazon"],
    prompt: `You are a marketplace specialist. Write a converting SEO product listing.

Product: {what the product is}
Key specifications: {material, size, features}
Audience: {who buys}
Search terms: {2–5 phrases people search}

Deliver:
1. Title (up to 100 characters, main keyword at the start).
2. 5–7 benefit bullets (a benefit for the buyer, not a dry spec).
3. Description (150–200 words) — weave the keywords in naturally, answer the common questions.
4. A "What's in the box" block.
5. 15 search keywords for the backend keyword field.
Do not keyword-stuff — the text has to read like human writing.`,
    example: `Title: "Kitchen Countertop Organiser — Spice and Small-Item Stand, Bamboo"
Bullet: · Clears your counter — everything in one place instead of scattered across shelves…
Keywords: kitchen organiser, spice rack, bamboo organiser…`,
  },
  "mp-infographic-brief": {
    title: "Spec for listing infographics",
    summary:
      "A 6-image storyboard: what goes on each photo so the listing sells.",
    bestFor: "ChatGPT / Claude",
    tags: ["infographics", "visuals", "conversion"],
    prompt: `Write a spec for the infographics of a product listing (6 images).

Product: {what the product is}
Main benefits: {list}
Buyer objections: {what stops them buying}

For each of the 6 slides describe:
— The job of the slide
— The main headline on the image (large text)
— What to show visually
— Which objection it closes
Logic: 1 — main benefit plus the product, 2 — specifications, 3 — a use case, 4 — comparison / before-after, 5 — contents and dimensions, 6 — guarantee and trust.`,
    example: `Slide 1: headline "A tidy kitchen in 5 minutes", the product large in a real interior — we hook with the main benefit.
Slide 4: "Before/After" — a cluttered counter vs a clean one, closes "will it really help me?".`,
  },
  "mp-review-answers": {
    title: "Replies to reviews (templates)",
    summary:
      "Ready answers to praise and complaints that lift your rating and buyer trust.",
    bestFor: "ChatGPT / Claude",
    tags: ["reviews", "reputation", "service"],
    prompt: `Write seller reply templates for reviews on the {product} listing.

Brand tone: {friendly / businesslike}.

Give 2 reply variants for each case:
1. An enthusiastic 5★ review.
2. A neutral 3★ ("fine, but…").
3. A complaint about product quality.
4. A complaint about delivery (not the seller's fault).
5. A complaint where the buyer misunderstood the product.
Every reply: thank them, show care, and where it's negative offer a resolution — no excuses, no arguing. Add a gentle prompt to contact support if there is a problem.`,
    example: `Quality complaint: "We're very sorry this happened — it isn't our standard. Message us in chat and we'll replace it or refund you. Thank you for letting us know 🤝"`,
  },
  "mp-competitor-analysis": {
    title: "Competitor listing analysis",
    summary:
      "A teardown of a competitor's listing and the list of your advantages worth highlighting.",
    bestFor: "Claude / ChatGPT (vision)",
    tags: ["competitors", "analysis", "strategy"],
    prompt: `Analyse a competitor's product listing (screenshot/description attached) and help me beat it.

My product: {description and price}
Competitor: {what is visible in their listing}

Break down:
1. The strengths of their listing (what is done well).
2. The weak spots and omissions.
3. Which buyer objections they did NOT close.
4. 5 concrete differences I should put in my listing.
5. An idea for the title and the first image so I stand out.
Rely on what actually affects a buyer's choice.`,
    example: `Omission: no size comparison against a hand — buyers get confused about the dimensions.
Your difference to lead with: "twice the compartments for the same price" plus a slide with a ruler.`,
  },
  "mp-bundle-upsell": {
    title: "Bundles and upsells",
    summary: "Bundle and add-on ideas to lift your average order value.",
    bestFor: "ChatGPT / Claude",
    tags: ["upsell", "bundles", "order value"],
    prompt: `Propose bundle and upsell ideas for {product}.

Product price: {price}
Audience: {who buys}

Give me:
1. 3 bundle options (what goes in + who it's for + what to call it).
2. 5 complementary products people logically buy alongside.
3. Listing wordings that nudge people to take the bundle ("N% better value").
4. A gift/bonus idea that raises perceived value without much cost.
Follow the buyer's logic: what is genuinely needed together.`,
    example: `"Starter" bundle: the product + a case + a quick-start card, "everything to begin in one box".
Upsell: replaceable parts — people re-order them, which grows LTV…`,
  },
  "mp-ab-titles": {
    title: "A/B titles for testing",
    summary:
      "10 listing titles across different keywords — to find the one that gets clicked.",
    bestFor: "ChatGPT / Claude",
    tags: ["titles", "a/b", "ctr"],
    prompt: `Generate 10 product listing titles for an A/B test.

Product: {what the product is}
Keywords: {the main search terms}
Limit: up to 100 characters.

Use different approaches:
— keyword + main benefit
— keyword + who it's for
— keyword + the distinguishing spec
— keyword + use case
Start every title with the main keyword. Label which keyword and which angle each one uses.`,
    example: `1. [keyword+benefit] "Travel Mug 500 ml — Keeps Heat 12 Hours, Leak-Proof"
2. [keyword+who for] "Travel Mug for Car and Office, Spill-Proof Lid, 500 ml"…`,
  },
  "unit-economics": {
    title: "Unit economics of a product",
    summary:
      "Work out what is actually left from a sale after fees, logistics and ads.",
    bestFor: "ChatGPT / Claude",
    tags: ["economics", "calculation", "profit"],
    prompt: `Calculate the unit economics of a marketplace product and tell me whether it is worth doing.

Platform: {Amazon / Etsy / eBay}
Cost per unit: {amount}
Planned selling price: {amount}
Category and fee: {percent, if you know it}
Inbound logistics: {amount per unit}
Dimensions and weight: {data}
Expected conversion rate: {expected}
Returns and defect rate: {expected}
Advertising spend: {amount or percent of revenue}
Tax: {regime}

Calculate step by step and show the formulas:
1. All costs per unit, itemised.
2. Margin in money and in percent.
3. Break-even point: how many sales a month are needed.
4. What happens at a price 10% lower and 10% higher.
5. The most vulnerable cost line — at what change in it we go into the red.
6. The verdict: go, rework or drop it, with the reasoning.
If any data is missing — name it, substitute a market average and flag that you did.`,
    example: `Costs per unit: goods 6.80 + fee 15% (3.00) + logistics 1.25 + returns 0.75 + ads 2.40 = $14.20
Margin at a $24 price: $9.80 (41%). Break-even: 96 sales a month.
Vulnerable line: the conversion rate — below 62% we go into the red.`,
  },
  "niche-research": {
    title: "Finding a niche and a product",
    summary:
      "Selection criteria and a way to test the idea before you buy stock and freeze your money.",
    bestFor: "Claude / ChatGPT",
    tags: ["niche", "analytics", "product selection"],
    prompt: `Help me pick a niche and a product to launch on a marketplace.

Budget for stock: {amount}
Experience: {beginner / already selling}
What I'm already considering: {ideas or "none"}
Constraints: {storage, certification, seasonality, what I don't want to sell}
Platform: {Amazon / Etsy / eBay}

Do this:
1. A niche selection checklist: 10 criteria with threshold values (demand, competition, margin, dimensions, seasonality, cost of entry, return risk, review counts of the top sellers, certification, repeat purchase).
2. Five niches that fit my budget — with pros, cons and cost of entry.
3. For each niche: how to test demand in a single evening without spending money.
4. Red flags: the signs that mean you must not enter a niche.
5. A plan to test the hypothesis on a minimum order: how many units, over what period, what counts as success.
Be sober about it: if my budget isn't enough for a niche, say so plainly.`,
    example: `Criterion "competition": if every one of the top 10 has more than 500 reviews, a beginner with no ad budget cannot break in.
Red flag: a seasonal product at the end of its season — your money is frozen until next year.`,
  },
  "infographic-copy": {
    title: "Copy for infographic slides",
    summary:
      "Short lines for the images: a large headline and a caption for each of the 6 slides.",
    bestFor: "ChatGPT / Claude",
    tags: ["infographics", "copy", "listing"],
    prompt: `Write the copy for the infographic slides of a product listing.

Product: {what}
Main benefits: {list}
Specifications: {dimensions, material, contents}
Buyer objections: {what stops them buying}
Audience: {who buys}

For each of the 6 slides give:
— A large headline: up to 5 words, readable in a second on a phone
— A caption: up to 12 words, expanding the headline
— Which 2–3 bullets to put on the slide
— What must be in the photo

Requirements: no "high quality" and no "premium" — specifics and numbers only. The first slide's headline must work even if the person never opens the rest.`,
    example: `Slide 1 · "Tidy in 5 minutes" / caption: "12 compartments — everything to hand, nothing gets lost"
Slide 5 · "Exact dimensions" / photo with a ruler and a hand for scale`,
  },
  "buyer-chat": {
    title: "Replies to buyers in chat",
    summary:
      "Quick templates for pre-purchase questions — from sizing to «is this genuine?».",
    bestFor: "ChatGPT / Claude",
    tags: ["chat", "questions", "service"],
    prompt: `Write reply templates for buyer questions in marketplace chat.

Product: {what}
Specifications: {data}
What's included: {contents}
Warranty and returns: {terms}
Tone: {businesslike / friendly}

Two reply variants for each of:
1. "Which size should I pick?"
2. "Is this genuine?"
3. "When will my order arrive?"
4. "Will it fit {related product}?"
5. "What if it doesn't fit?"
6. "Is there a discount for several?"
7. "It arrived damaged"
8. "It doesn't work, how do I use it?"

Rules: answer the question in the first line, no three paragraphs of "Hello, thank you for reaching out". Where it fits, give the instruction rather than sending them to support. Stay within 2–4 sentences.`,
    example: `"It arrived damaged" → "We're sorry. File a damage return in the app — we'll collect it and refund within 3 days. If a replacement is easier, tell us and we'll ship a new one."`,
  },
  "mp-ads-setup": {
    title: "Marketplace advertising",
    summary:
      "Where to start promoting a listing, what bids to set and when to switch it off.",
    bestFor: "ChatGPT / Claude",
    tags: ["ads", "bids", "promotion"],
    prompt: `Draft an advertising plan for a marketplace listing.

Platform: {Amazon / Etsy / eBay}
Product and price: {what, how much}
Margin per sale: {amount}
Current position: {new listing / already selling, how much}
Monthly ad budget: {amount}
Keywords: {list}

Give me:
1. Which ad type to start with in my situation and why.
2. Starting bids: how to calculate the maximum bid from margin and conversion. Show the formula and compute it for my numbers.
3. A schedule for the first two weeks: what to do on which day, what to measure.
4. Traffic-light metrics: at what values of ad cost of sale, CTR and conversion to scale, fix or switch a campaign off.
5. Five beginner mistakes in advertising on this platform.
6. What to prepare in the listing BEFORE launching ads, or the budget burns for nothing.`,
    example: `Maximum bid = margin × conversion to order. At a $9 margin and 4% CR — no more than $0.36 per click.
Traffic light: ad cost of sale above 25% three days running → cut the bid by 20% rather than switching off at once.`,
  },
  "returns-handling": {
    title: "Cutting your return rate",
    summary:
      "Work through the reasons for returns and what to fix in the listing, the packaging and the product.",
    bestFor: "Claude / ChatGPT",
    tags: ["returns", "quality", "costs"],
    prompt: `Help me cut the return rate.

Product: {what}
Current return rate: {number}
Reasons from the report: {list with shares, if you have them}
What the listing says about size/contents: {text}
How it is packaged: {description}

Break it down:
1. Split the reasons into three groups: the listing's fault (expectation didn't match), the product's fault, logistics' fault.
2. For each reason — a concrete fix: what exactly to change in the copy, the photos, the packaging or the product.
3. What to add to the listing to filter out the wrong buyers before they order (this cuts returns more than anything else).
4. How to rewrite the size and contents block so nothing is ambiguous.
5. How many percentage points of returns each fix can realistically remove — an estimate with reasoning.
6. What to check first if you have no data on the reasons.`,
    example: `Reason "wrong size" (41%) — the listing's fault: no size chart and no photo with a hand for scale.
Fix: add a slide with a ruler plus the line "if you're between sizes, take the larger". Estimate: −12–15% returns.`,
  },

  "mp-seo-keywords": {
    title: "Keywords for a product listing",
    summary: "A list of search terms by volume, and where each one belongs.",
    bestFor: "ChatGPT / Claude",
    tags: ["seo", "listing", "keywords"],
    prompt: `You are a marketplace listing specialist. Build the keyword set for a product page.

Product: {what it is, in plain words}
What makes it different: {material, size, purpose}
Platform: {Amazon / Etsy / other}
What buyers call it: {if you know}

Deliver:
1. Thirty search terms in three groups: high volume, mid, long tail with qualifiers.
2. Where each goes: five in the title, ten in the attributes, the rest in the description.
3. Synonyms and everyday names — how people search, not how the manufacturer names it.
4. Five terms the product does not match: those buyers arrive and return it.
5. How to check demand before rewriting the listing.

Do not stuff the title: the platform ranks, but the buyer reads — the second matters more.`,
    example: `High volume: laundry organiser, storage box…
Title: "Laundry organiser with lid, 6 compartments, grey"
Does not match: "shoe organiser" — they come for something else and send it back.`,
  },
  "mp-photo-brief": {
    title: "Photo brief for a product listing",
    summary:
      "Which shots are needed, in what order, and what must be visible in each.",
    bestFor: "ChatGPT / Claude",
    tags: ["photography", "photo", "brief"],
    prompt: `You are an art director of product photography. Write the brief.

Product: {what we shoot}
Platform: {format requirements, if known}
What the buyer fears: {the main doubt}
Shoot budget: {roughly}

Deliver:
1. The shot list in order: the first one decides the click from search results, the rest in descending importance.
2. For each: shot size, background, what is in frame besides the product, what must be visible.
3. The shot that removes the main doubt: show what the reviews keep asking about.
4. A scale shot: next to a familiar object, not "dimensions in the description".
5. Technical requirements: aspect ratio, resolution, background, margins.
6. Three mistakes that get a listing rejected or beaten by the one next to it.

The first shot decides everything: it earns the click; the rest are seen only by those already interested.`,
    example: `1. Whole product, white background, no shadows near the edges — this is the search-results shot.
3. An "in hand" shot — removes the "is it too small" doubt…
Mistake: a four-photo collage as the first image — in search results it turns to mush.`,
  },
  "mp-supplier-message": {
    title: "Negotiating with a supplier",
    summary:
      "A message about price, lead times and defects — with answers ready for a refusal.",
    bestFor: "Claude / ChatGPT",
    tags: ["supplier", "negotiation", "procurement"],
    prompt: `You are an experienced buyer. Write a message to a supplier.

Product and volume: {what and how much}
Current terms: {price, lead time, payment}
What we want: {lower price / deferred payment / replacement of defects}
What we can offer in return: {volume, prepayment, contract length}
How important we are to them: {honestly}

Deliver:
1. A message no longer than ten lines: the substance in the first two.
2. The request with reasoning for why it benefits them, not only us.
3. What we are ready to give in return, specifically.
4. Three possible answers from them and what to write to each.
5. The walk-away line: terms below which negotiating is pointless.
6. The same thing said in person, in two sentences.

Do not open with a demand for a discount: the first message sets the tone for the whole relationship.`,
    example: `"We take 400 a month instead of 250 at 7% less — it evens out your production load" — substance in the first lines.
If they refuse on price, ask for deferred payment: it costs them less…
Walk-away: below 12% margin the order makes no sense; better to find a second supplier.`,
  },
  "mp-price-strategy": {
    title: "Pricing strategy and discounts",
    summary:
      "What price to set, when to cut it, and how not to lose money on promotions.",
    bestFor: "Claude / ChatGPT",
    tags: ["price", "discounts", "margin"],
    prompt: `You are a marketplace economist. Work out the pricing strategy.

Cost: {purchase + logistics + packaging}
Platform fee: {percentage}
Competitor prices: {range}
Position: {cheaper / level / more expensive and why}
Current volume: {units per month}

Deliver:
1. The minimum price calculation line by line: cost, fee, logistics, returns, tax.
2. The recommended price and why exactly that one.
3. The discount floor: how low a promotion still makes sense, with the arithmetic.
4. What happens to profit at −10%, −20%, −30% if volume doubles.
5. When the price must not be cut, even if the neighbours are cutting theirs.
6. Three ways to raise margin without touching the price.

Count returns: in some categories they eat the entire difference between a good price and a bad one.`,
    example: `Minimum: 640 (purchase 310, fee 17%, logistics 68, returns 6%, tax)
At −30% with double the volume, profit falls 18% — the promotion does not pay for itself…
Do not cut in the first month: the platform remembers the price and will not let you raise it without losing impressions.`,
  },
  "mp-rich-content": {
    title: "Rich content for a listing",
    summary: "Image-and-text blocks people actually read to the end.",
    bestFor: "ChatGPT / Claude",
    tags: ["rich content", "description", "conversion"],
    prompt: `You are a product-listing editor. Build the rich content.

Product: {what it is}
For whom: {the buyer and their situation}
Main doubts: {list them from reviews, or guess}
Available material: {photos, video, diagrams}

Deliver five to seven blocks; for each:
1. A headline that states something, not "Benefits".
2. Text no longer than three lines.
3. What image goes with it and why that one.
4. Which doubt this block removes.

Plus:
5. Block order: doubts first, pleasantries later.
6. What to drop if the listing is mostly viewed on phones.
7. Three phrases to strike out: everyone uses them and they mean nothing.

Strike out: "high quality", "the perfect gift", "premium materials".`,
    example: `Block 1: "Does not slip on tile" + a photo on a wet floor. Removes the main doubt.
Block 4: "Fits in a washing machine" + a shot inside the drum…
Strike out: "made from high-quality materials" — everybody writes that.`,
  },
  "mp-season-plan": {
    title: "Seasonal and sale plan",
    summary:
      "What to buy, when to raise the price, and what stock not to carry over.",
    bestFor: "Claude / ChatGPT",
    tags: ["season", "sale", "purchasing"],
    prompt: `You are a category manager. Build a plan for the season.

Category and products: {list them}
Demand peak: {when}
Current stock: {how much of what}
Lead time: {weeks}
Purchase budget: {amount}

Deliver a week-by-week plan from today to the end of the season:
1. When to place the order so goods arrive in time — counting backwards from the peak.
2. What to buy and in what quantity, allowing for lead time.
3. How to move the price: before the peak, at the peak, after.
4. When to start clearing stock and down to what price — counting storage as a cost.
5. What must not be carried past the season and why writing it off is cheaper.
6. What to record now so next year is not guesswork.

Assume a delivery will fail: a plan without a fallback is not a plan.`,
    example: `−10 weeks: place the order for the main line. −6: confirm and prepay.
Peak: price +8%, no more — the platform cuts impressions for sharp jumps…
+3 weeks after the peak: clear at 25% off; beyond that storage eats the difference.`,
  },
  "mp-card-audit": {
    title: "Your listing against the one next to it",
    summary: "Why buyers pick the other one — point by point, fixable today.",
    bestFor: "ChatGPT / Claude",
    tags: ["audit", "competitors", "listing"],
    prompt: `You are a listing analyst. Compare two listings and explain the difference.

Our listing: {title, price, review count, what is in the photo}
Competitor listing: {the same}
Search positions: {where we are, where they are}

Deliver:
1. What the buyer sees first in search results, ours and theirs — and what earns the click.
2. A point-by-point comparison: title, main photo, price, reviews, description. For each: who wins and why.
3. What we can change today at no cost.
4. What costs money, and roughly how much.
5. What not to change even though it differs: not every difference matters.
6. The single point that gives the most if only one thing gets done.

Do not put "lower the price" first: it is the most expensive and most reversible move there is.`,
    example: `In search results: their photo is on white, ours on colour — ours disappears into the grid.
They have 340 reviews to our 28 — cannot be caught up, but we can answer every one of ours…
One action: reshoot the main photo. Cheapest, biggest effect.`,
  },
  "mp-video-review": {
    title: "Video review script for a listing",
    summary: "A 40-second video that works muted and ends in a purchase.",
    bestFor: "Claude / ChatGPT",
    tags: ["video", "listing", "script"],
    prompt: `You are a product-listing video author. Write the script.

Product: {what it is}
What reviews keep asking: {list it}
Filming conditions: {what you have}
Length: {seconds}

Deliver a table: seconds, what is in frame, on-screen text, what the hands do.

Requirements:
1. The video must work with the sound off: everything important goes on screen as text.
2. The first three seconds show the product in use, not a logo and not a name.
3. Every doubt from the reviews gets its own shot.
4. Show scale by comparison, not by numbers.
5. The last shot is not a call to buy but the thing people buy it for.
6. What to film extra in case the edit comes out short.

On a listing the sound is off almost always: narration the video cannot be understood without is wasted.`,
    example: `0–3 s: a hand sets it on wet tile and presses — it does not slip. Text: "On a wet floor"
12–18 s: next to a phone — the size is obvious…
Ending: folded into a drawer, the drawer closes. Text: "It fits".`,
  },
  "mp-ai-video-listing": {
    title: "Listing video from a generator",
    summary:
      "A Sora, Veo or Kling prompt for your product — and what to film on a phone.",
    bestFor: "ChatGPT / Claude",
    tags: ["video", "generation", "listing"],
    prompt: `You direct product video for marketplaces. Build a prompt for a video generator.

Product: {what it is, material, colour}
Platform: {which marketplace}
What the clip must make clear: {the key property}
Existing footage: {photos, video, nothing}

Deliver:
1. The prompt in parts: framing, camera move, light, surface, duration. Be concrete — adjectives like "premium" are ignored.
2. What the generator will ruin: packaging text, hands, small hardware, the logo. How to dodge it by angle or framing.
3. What you must film yourself: the product in close-up. A generated product resembles yours but is not it — the buyer notices on delivery, and that is a return.
4. A 15-second storyboard: what is in each shot and where the cuts fall.
5. Platform requirements: aspect ratio, length, file size, first frame.
6. What is forbidden: other brands in frame, promises of results, medical claims.
7. How to check before upload: three tells that reveal generation.

Do not build the whole clip from generation. A mix — generated environment, filmed product — looks more expensive and does not lie about the goods.`,
    example: `Prompt: slow orbit around a matte black thermos on wet stone, cold morning light, steam, shallow depth, 5 seconds, no text, no hands.
Will ruin: the logo on the body — turn it away from camera.
Film yourself: 4 seconds of the lid and thread on a phone. That is what people study before buying.
Storyboard: 0-5 generated, 5-9 the lid, 9-15 in hand, cuts on movement.`,
  },
  "mp-photo-prep": {
    title: "Preparing photos to platform specs",
    summary:
      "Resolution, background, margins and shot order — before upload, not after rejection.",
    bestFor: "ChatGPT / Claude",
    tags: ["photos", "requirements", "listing"],
    prompt: `You manage marketplace content. Build the photo requirements.

Product: {what it is}
Platforms: {where you list}
What you have: {a shoot, supplier photos, renders}
Category: {clothing, electronics, cosmetics, other}

Deliver:
1. Each platform's technical specs: size, aspect ratio, weight, format, background. One photo does not fit all — some demand white, some do not.
2. Shot order: what comes first, second, third. The first frame decides whether the listing is opened at all.
3. The minimum number of shots and what each shows. Empty slots damage trust more than mediocre photos do.
4. What to add: scale beside a familiar object, the underside, what is in the box, the product in use.
5. What is not allowed: other brands' logos, price tags, text collages where text is banned, watermarks.
6. What to do with supplier photos: where they are usable, and where a hundred other sellers already run them and they work against you.
7. A pre-upload check: how the first frame looks as a 200-pixel thumbnail. That is how it will be seen.

Point 7 outweighs the rest: listings are chosen in a grid where the photo is the size of a fingernail.`,
    example: `First frame: the whole product, 10% margins, white ground. The silhouette reads at thumbnail size — that is enough.
Second: scale beside a hand. "How big is it" is the most common question.
Do not use the supplier photo as the first frame: they currently sit on 40 other listings.
Add: the underside and the box contents — those cut returns most.`,
  },
  "mp-main-image": {
    title: "The main image: what must be visible",
    summary:
      "The frame you get chosen by, in a grid of forty near-identical products.",
    bestFor: "ChatGPT (vision) / Claude",
    tags: ["main image", "search results", "listing"],
    prompt: `You design listings. Review or design the main image.

Product: {what it is}
What the photo shows now: {describe or attach}
Competitors in the grid: {how their photos look}
What sets you apart: {the property}

Work through:
1. What survives at 200 pixels: the silhouette, the colour, one detail. Nothing more fits, and that is where the choice happens.
2. How your frame differs from its neighbours in the grid. If everyone is on white from the same angle, difference beats beauty.
3. Whether the product fills the frame. A small object in a large field looks cheaper than it is.
4. Whether text belongs on the photo and which text. One word or one number at most, and only where the platform allows it.
5. What to remove: props, shadows, a distracting background, a second product in frame.
6. Three versions to test: different angle, different scale, with and without text.
7. How to compare honestly: screenshot the grid, paste your versions into it, and look from across the room.

Point 7 is mandatory. A photo judged alone always looks fine; it has to be judged in a row of other people's.`,
    example: `At thumbnail size it is a dark rectangle — no silhouette. Rotate 20 degrees and it gains volume.
Everyone in the grid is on white. Use light grey: it separates without looking foreign.
Remove: the branch and the stones. Props become dirt at thumbnail size.
Text: "500ml" in the corner — that is the question asked most often in chat.`,
  },
  "mp-negative-reviews": {
    title: "A wave of bad reviews",
    summary: "What to do when the rating slides: in order, without panic.",
    bestFor: "Claude / ChatGPT",
    tags: ["reviews", "rating", "crisis"],
    prompt: `You handle quality on a marketplace. Work through a wave of bad reviews.

Product: {what it is}
What they say: {paste the reviews}
When it started: {timeframe}
What changed: {batch, supplier, packaging, price}
Current rating: {score and review count}

Work through:
1. Whether it is one cause or several. Sort the reviews by theme and count: usually 80% of complaints are about one thing.
2. Whether the start coincides with a batch or packaging change. The dates almost always line up, and it is the fastest check.
3. What can be fixed today: an insert in the packaging, the description, the photos, the contents. What takes a month: the product itself.
4. Review replies: three templates by theme, each under five lines. You are not writing to the author but to the next buyer, who reads them.
5. What to remove from the listing: promises the product does not keep. Half of bad reviews are about the mismatch, not the goods.
6. Whether to pull the product. Signs: safety complaints, defect rate above 5%, returns above margin.
7. How to know you recovered: which number to watch and after how many weeks.

Do not buy reviews to dilute it. Ratings recover through shipping decent goods; bought reviews are visible to you and to the platform.`,
    example: `80% on one theme: "the lid leaks". Started on the 12th — matches the new batch.
Today: add a photo of the gasket and a line on fitting it. Part of the complaints are about assembly, not defects.
Reply aimed at the next buyer: "In the 12 August batch the gasket ships separately. Fitting is shown in photo five. If it leaks assembled, write to us and we replace it."
Watch: share of leak complaints among new reviews, after 3 weeks.`,
  },
  "mp-stock-planning": {
    title: "How much to order without running dry",
    summary:
      "Sizing a batch between two disasters: out of stock and dead on the shelf.",
    bestFor: "Claude / ChatGPT",
    tags: ["purchasing", "inventory", "maths"],
    prompt: `You plan inventory. Size the next batch.

Product: {what it is}
Weekly sales over recent months: {numbers}
Production and shipping time: {days}
Supplier minimum: {units}
Storage cost: {if any}
Cash available: {amount}

Work out:
1. Average weekly sales and the spread. You cannot plan on the average: one week at double will empty the shelf.
2. The reorder point: the stock level at which you must order to avoid running out. Driven by lead time, not the calendar.
3. Safety stock for the spread and for the supplier being late. They are late; budget for it.
4. Batch size: the supplier's minimum against the cost of frozen cash. Sometimes overpaying for a small batch beats holding six months of stock.
5. What errors cost in each direction: a week out of stock costs how much; 300 spare units is how much money and clears when.
6. Seasonality: which weeks are not representative.
7. Three numbers to check weekly.

Count in money, not units. A warehouse full of fast-moving goods still stops the business when the cash is gone.`,
    example: `Sales 40 a week, spread 25 to 78. Ordering on the average empties on the first strong week.
Lead time 35 days. Reorder point: 40 x 5 weeks plus 120 safety = 320 units on hand.
Batch of 600 instead of the 1,000 minimum: 8% more per unit, but $1,800 is not sitting still for three months.
Weekly: stock on hand, 7-day sales, days to zero.`,
  },
  "mp-promo-decision": {
    title: "Join the promotion or not",
    summary:
      "The maths before you click: what survives the discount, the fees and the return spike.",
    bestFor: "Claude / ChatGPT",
    tags: ["promotions", "maths", "margin"],
    prompt: `You do marketplace economics. Work out whether to join a promotion.

Product and price: {current}
Cost of goods: {delivered to the warehouse}
Commission and logistics: {percentages and sums}
Promotion terms: {discount, duration, requirements}
Normal sales: {units per week}
Return rate: {percentage}

Work out:
1. Margin now and margin in the promotion — in currency per unit, not percentages. Percentages hide the case where every sale loses money.
2. How many units you must sell in the promotion to earn what you earn without it.
3. Whether that volume is realistic: compare with normal sales and with past promotions.
4. What happens after: buyers remember the promotional price, and going back drops conversion for weeks.
5. Returns: they run higher in promotions because buying is impulsive. Add the increase and redo the maths.
6. Hidden terms: a mandatory price-hold period, all sizes included, penalties for leaving.
7. The decision: join, join with part of the range, or decline. With a number, not a feeling.

Cost out "decline" separately: it usually means losing grid position, which is also money and should be named.`,
    example: `Margin now $2.40 a unit, in the promotion $0.73. To earn the same you must sell 3.3 times more.
The last promotion produced 2.1 times. So this earns less.
Returns rise from 6% to roughly 9% — margin falls to $0.47.
Decision: join with two of seven lines, the ones above $3.40 margin. The rest stay out.`,
  },
  "mp-rank-drop": {
    title: "The listing dropped in the grid",
    summary:
      "A check in order: what actually happened and which of it is fixable.",
    bestFor: "Claude / ChatGPT",
    tags: ["ranking", "drop", "diagnosis"],
    prompt: `You work on marketplace visibility. Diagnose a listing that dropped.

Product: {what it is}
Before and after: {positions, impressions, orders}
When it dropped: {date}
What you did those days: {price, stock, ads, listing edits}
Rating and reviews: {any change}

Check in order, without skipping:
1. Stock. Zero or near-zero stock removes a listing from the grid, and it is cause number one. Check it first.
2. Price. A sharp rise drops conversion, and position follows. Compare with competitors' prices that same day.
3. Listing edits. Changing the title or category recalculates relevance, and the listing sinks for a few days.
4. Rating and recent reviews.
5. Competitors: a new one priced lower, or neighbours entering a promotion.
6. Season and day of week. Compare with the same period last year, not last week.
7. Ads: did they stop, did the budget run out.

Name one main cause, not a list. And say what is fixable in a day, what in a week, and what does not come back — lost position after a long stockout has to be rebuilt.`,
    example: `First thing that matches: stock was 0 for three days, the 8th to the 10th. Everything else is secondary.
Price unchanged, reviews unchanged, ads running.
Fixable in a day: get stock to the warehouse. Position returns slowly — usually 2 to 3 weeks.
So it does not repeat: reorder at 320 units on hand, not "when we notice".`,
  },
  "mp-cross-platform": {
    title: "The same listing on another platform",
    summary:
      "Porting without copy-paste: different rules, different buyers, different titles.",
    bestFor: "ChatGPT / Claude",
    tags: ["porting", "platforms", "listing"],
    prompt: `You manage listings. Port a listing to another platform.

Current listing: {title, description, attributes}
From: {platform}
To: {platform}
Product: {what it is}

Deliver:
1. A title under the new platform's rules: some weight the first 60 characters, some expect "brand + type + attribute". A copied title almost always breaks the new rules.
2. The description: what to rewrite, what to delete. Links to the other platform, its promotions and its terminology have to go — listings get hidden for those.
3. Attributes: which fields are mandatory here that did not exist there. Empty fields cost position.
4. Category: where it belongs. The same object sits on different branches per platform, and the whole grid depends on it.
5. Photos: what to reshoot or recrop for a different aspect ratio and background rule.
6. Price: how to absorb different commission and logistics so margin holds.
7. What is forbidden here that was allowed there: text on images, claims, comparisons.

Do not try to port reviews and rating — they cannot move. Assume the first weeks carry no social proof, and decide what replaces it.`,
    example: `Title was "Thermos 500ml black matte stainless for tea and coffee". Here the first 60 characters decide: "Thermos 500ml stainless steel, matte black".
Delete from the description: "on promotion" and the other platform's name.
Fill the mandatory fields: capacity, liner material, heat retention hours. Absent there, required here.
Photos: recrop the main one to 3:4 and widen the margins.`,
  },
  "mp-brand-page": {
    title: "A seller page and brand blurb",
    summary:
      "The text people read before buying from a shop they have never heard of.",
    bestFor: "ChatGPT / Claude",
    tags: ["brand", "shop", "trust"],
    prompt: `You are an editor. Write the brand blurb for a seller page.

What you sell: {range}
Who you are: {manufacturer, distributor, reseller}
How long you have traded: {duration}
What sets you apart: {actually, not as a slogan}
What matters to the buyer: {delivery, warranty, sizing}

Deliver:
1. A first paragraph under three lines: who you are and what you sell. No founding story, no "mission".
2. What answers the main doubt about an unknown seller: where it is made, what the warranty is, how you handle defects.
3. Three concrete facts with numbers. "Trading since 2019" is checkable; "years of experience" is not.
4. The range in one line: what else you carry. Second purchases come from there.
5. How to reach you and when you answer. A stated response time removes more doubt than a promise of quality.
6. What not to write: "dynamically developing company", "team of professionals", "individual approach".

Write it so it could not be pasted onto another seller's page. If it could, you described anyone, not yourself.`,
    example: `First paragraph: "We sew bags in Tver, since 2019. We sell only our own — what you see in the photos is in our warehouse."
Doubt: "One-year warranty on hardware. Zip broken? Send a photo in chat, we ship a new bag and you keep the old one."
Facts: trading since 2019, 11 models, average chat reply 40 minutes on weekdays.
Do not write: "we value every customer".`,
  },
  "mp-question-answers": {
    title: "Answering questions on a listing",
    summary:
      "Public answers read not by the asker but by the hundred people after them.",
    bestFor: "ChatGPT / Claude",
    tags: ["questions", "listing", "conversion"],
    prompt: `You manage a marketplace shop. Answer the questions on a listing.

Product: {what it is}
Questions: {paste}
What the listing is missing: {if you know}

For each question:
1. An answer under four lines, with a number or a fact. "Yes, it fits" is not an answer; "It fits, inner diameter 74mm" is.
2. What to add to the listing so the question stops being asked. A repeated question is a hole in the description, not curiosity.
3. If the answer is no, say so plainly and say who the product does suit. An evasive "depends" produces a return.
4. Separately: the three most frequent questions and exactly where the answers belong — attributes, description, photos.
5. One question nobody asks but should: the thing that most often causes returns.

Write answers that still read in six months. "Currently in stock" expires in a week and starts lying.`,
    example: `Question: "Will it fit a cup holder?" Answer: "Base diameter 68mm, fits a standard holder. Narrow car holders at 65mm, no."
Add to the listing: base diameter in the attributes and on photo five beside a ruler.
Not asked but should be: dishwasher safe. It causes a third of returns.`,
  },
  "mp-abc-analysis": {
    title: "Which products feed you and which eat you",
    summary:
      "A range review by money: what to keep, what to reprice, what to drop.",
    bestFor: "Claude / ChatGPT",
    tags: ["range", "analysis", "profit"],
    prompt: `You analyse product ranges. Rank the products by contribution.

Product list: {name, price, cost, sales for the period, returns}
Period: {duration}
Cash tied up in each: {if known}

Work through:
1. Group by profit, not revenue. Revenue lies: a high-turnover, zero-margin line looks like the leader.
2. What produces most of the profit. Usually two or three of ten — that is where attention goes.
3. What eats: negative margin after returns and logistics, frozen cash, warehouse space.
4. What is held for reasons other than profit: brings traffic, sells in bundles, completes a size range. Legitimate, but it must be a decision rather than an accident.
5. What to do with each group: raise price, cut purchasing, discontinue, leave alone.
6. What happens if you cut the tail: how much cash frees up and whether shop visibility suffers.
7. Three lines to check by hand: the numbers look odd and may be an accounting error.

Compute margin after returns. A line with 12% returns and 15% margin earns less than it appears — sometimes nothing at all.`,
    example: `Two of nine lines produce 71% of all margin.
Eating: line 6, margin 18%, returns 22%. After returns and reverse logistics it is minus $0.45 a unit.
Held deliberately: line 3, near-zero margin, but it is what gets put in the basket first. Keep, do not reprice.
Check by hand: line 8, 0% returns for a quarter. That does not happen — likely an export error.`,
  },
  "mp-price-watch": {
    title: "Reacting to competitors' prices",
    summary:
      "When to follow down, when to hold, when to raise — by rules rather than nerves.",
    bestFor: "Claude / ChatGPT",
    tags: ["pricing", "competitors", "rules"],
    prompt: `You do pricing. Write the rules for reacting to competitors.

Your product and price: {current}
Cost and commission: {numbers}
Competitors and their prices: {list}
Your differences: {delivery, reviews, contents}
What happened: {who cut, and by how much}

Deliver:
1. The floor you cannot go below. Computed from cost plus commission, logistics and returns — not from what you would like to earn.
2. When to follow down and when not. A competitor with 40 reviews against your 900 is not selling the same thing, and the price gap is justified.
3. What to do instead of cutting: a bundle, a larger size, faster delivery, work on the main photo.
4. When to raise: stock running out, competitors out of stock, seasonality.
5. Three automatic rules: on which event you do what, so you are not deciding fresh every time.
6. What to measure after a price change and after how many days. The grid reacts slowly; a hasty reversal blurs the picture.
7. When not to enter a price war: signs the competitor is clearing stock and will leave on their own.

Do not price a penny under your neighbour. It is visible, repeatable, and ends with both of you working for nothing.`,
    example: `Floor: $7.10. Below that we lose money after returns.
A competitor cut to $7.60 with 12 reviews. We hold: 900 reviews and a higher rating justify a 70-cent gap.
Instead of cutting: bundle with a sleeve, +$2.10 price, +90 cents margin.
Rule: follow down only if a competitor with a comparable rating holds a lower price for more than 5 days.`,
  },
  "mp-new-launch": {
    title: "Launching a new product",
    summary:
      "The first thirty days, week by week, so the listing does not die without reviews.",
    bestFor: "Claude / ChatGPT",
    tags: ["launch", "new product", "plan"],
    prompt: `You launch products on marketplaces. Write the first 30 days.

Product: {what it is}
Niche and competitors: {who is there}
Price and cost: {numbers}
Promotion budget: {amount}
Stock on hand: {units}

Week by week:
1. Before launch: what must be ready. A listing with empty attributes and no fifth photo starts worse, and fixing it later costs more — edits reset relevance.
2. Week 1: the goal is first orders at any price except a losing one. No reviews, no trust, low conversion — that is normal and budgeted.
3. Week 2: first reviews. How to get them honestly: an insert in the packaging, chat replies, working with people who already bought.
4. Week 3: edits from data. What to look at: which queries bring people, where they leave, what they ask.
5. Week 4: the decision — invest further or stop. State the numbers that mean stop, in advance.
6. What not to do in month one: change the title repeatedly, run ads at a listing with no reviews, raise the price on a spike.
7. Three numbers to check daily.

Write point 5 before you start. Once money is spent, "stop" is never chosen — the spend feels too costly to waste.`,
    example: `Before launch: 8 photos, video, every attribute, and answers to 5 likely questions already in the description.
Week 1: price 8% under plan, no ads — on a listing with no reviews they burn money.
Week 2: an insert asking for a review plus a QR to the instructions. Not "leave us five stars" but "tell us what is wrong".
Stop if 30 days produce fewer than 25 orders on 40,000 impressions.`,
  },
  "mp-title-formula": {
    title: "A formula for listing titles",
    summary: "Building a name that search finds and a person understands.",
    bestFor: "ChatGPT / Claude",
    tags: ["title", "seo", "listing"],
    prompt: `You build marketplace listings. Write the title.

Product: {what it is}
Platform: {which}
Keywords: {if collected}
What distinguishes it: {size, colour, material, purpose}
Brand: {yes or no}

Deliver:
1. The formula for this platform: the order of type, brand and attributes. It differs by platform, and both search and legibility depend on it.
2. Three titles of different lengths: short, medium, at the limit.
3. What lands in the first 60 characters. Those are visible in the grid and weigh more than the rest.
4. Which words to drop: "buy", "cheap", "bestseller", repeated stems. They do not help search and eat space.
5. How to fit secondary keywords without turning the title into soup. Platforms demote soup.
6. A check: read it aloud. If it is a word list rather than the name of an object, search may find it but a person scrolls past.

A title is written for two readers at once: the search engine and the human. The second is usually sacrificed — which produces impressions without orders.`,
    example: `Formula: type + capacity + material + colour + purpose.
Short: "Thermos 500ml stainless steel black".
First 60 characters: type, capacity, material — that is the click decision.
Drop: "buy", "thermos thermos", "for tea coffee water drinks" — four words for one thing.
Aloud: reads as the name of an object, not a list. It passes.`,
  },
  "mp-supplier-quality": {
    title: "Vetting a supplier and receiving a batch",
    summary:
      "What to ask before paying and what to check once the boxes arrive.",
    bestFor: "Claude / ChatGPT",
    tags: ["suppliers", "receiving", "quality"],
    prompt: `You buy goods. Build a supplier check and a receiving procedure.

Product: {what it is}
Supplier: {where from, how found}
Batch size: {units and value}
What you already know: {correspondence, samples}

Deliver:
1. Ten questions before paying. Production, lead times, defects, packaging, documents, what happens if they are late.
2. What to check in the sample and how: what to measure, what to pull, what to wash, what to leave for a week.
3. How to agree on defects in advance: what rate counts as normal, who pays for returns, how it is recorded.
4. Receiving: how many units to open from a batch of 100, 500, 1,000. Checking everything is impossible; checking three is pointless.
5. What to inspect, in order: contents, dimensions, function, packaging, labelling.
6. What to photograph immediately. A claim without photos taken at opening is refused almost everywhere.
7. Red flags in correspondence: dodging defect questions, rushing payment, refusing a sample, changing price after agreement.

A sample from the batch and a sample "to look at" are different things. Ask for one from the batch being shipped to you.`,
    example: `Before paying: "What defect rate do you consider normal, and what happens above it?" Dodging is itself an answer.
Sample: fill with boiling water, leave 24 hours, then check the smell and the gasket.
Receiving 500 units: open 20, from different cartons, not off the top.
Photograph: carton labels, the packing layer, and every defect with a ruler in frame.`,
  },
  // ─────────────────────────── SaaS ───────────────────────────
  "saas-idea-validation": {
    title: "Validate the idea before the first line of code",
    summary:
      "Your idea broken down into risks plus a one-week test plan — before you spend months.",
    bestFor: "Claude / ChatGPT",
    tags: ["idea", "validation", "market"],
    prompt: `You are a product strategist who has seen plenty of projects die. Assess my SaaS idea honestly, without cheering me on.

Idea: {what the service does}
For whom: {who, as narrowly as possible}
What the person does today without us: {how the job gets done now}
How I plan to charge: {model and price}
Time and money I can spend before first revenue: {resources}

Break it down:
1. The problem: does it hurt regularly, or is it a one-off inconvenience? Answer plainly.
2. Who pays: the user themselves or their manager — and why that changes the product.
3. The three main risks: why this could fail. For each — the cheapest way to test it.
4. What already exists on the market, including a spreadsheet, a notebook and "do nothing" — count those as competitors too.
5. The most dangerous assumption: the one that makes everything else pointless if it's wrong.
6. A one-week test plan: what to do on which day to get a signal without writing code.
7. The kill criterion: what result means the idea should be dropped.

If the idea is weak, say so in the first paragraph.`,
    example: `Most dangerous assumption: that the bookkeeper is allowed to change tools. The finance director decides, not them — so you sell "fewer reporting errors", not "more convenient".
Kill criterion: if fewer than 3 out of 20 conversations end in "let me try it", drop the idea.`,
  },
  "saas-mvp-scope": {
    title: "MVP scope: what's in, what's out",
    summary:
      "The smallest set of features you can already sell, plus what's deferred and why.",
    bestFor: "Claude / ChatGPT",
    tags: ["mvp", "priorities", "launch"],
    prompt: `Help me draw the boundary of an MVP that can actually be shipped and sold.

Product: {what the service does}
The main scenario: {what the user does from login to result}
Who the user is: {description}
Time available for development: {timeframe}
Who is building it: {one developer / a team / no-code}

Do this:
1. One user path from sign-up to first value — step by step, no branches.
2. The features without which that path doesn't work. Each with a reason why it can't be dropped.
3. Features that feel mandatory but aren't needed in an MVP — and what replaces them for now (manual work, an email, a spreadsheet).
4. What to cut entirely, and why it won't stop you selling.
5. The boundaries: what the product does NOT do. Wordings for the site so nobody expects otherwise.
6. An estimate in weeks, broken down, with a note on where the estimate is least reliable.
7. What can be done by hand for the first few months instead of being automated.

Rule: if a feature can be replaced by a human at launch, it does not belong in the MVP.`,
    example: `Do it by hand: PDF export is done by support on request for the first months. Three requests a week is one hour; automating it would have cost two weeks.
Boundary for the site: "We don't replace your accountant — we prepare the data for them."`,
  },
  "saas-user-stories": {
    title: "Stories and acceptance criteria",
    summary:
      "A feature turned into tasks with testable criteria — including errors and empty states.",
    bestFor: "ChatGPT / Claude",
    tags: ["requirements", "tickets", "spec"],
    prompt: `Turn a feature description into a set of user stories with acceptance criteria.

Feature: {what needs building}
User roles: {who, with which permissions}
What already exists in the product: {context}
Constraints: {technical or product}

For each story give:
— The statement: as a {role}, I want {action}, so that {outcome}
— Acceptance criteria as "given / when / then" — testable, with no "convenient" or "fast"
— The empty state: what the person sees when there is no data yet
— Errors: what we show on network failure, missing permissions, invalid input
— What is NOT part of this story

Separately:
1. The order of implementation and what depends on what.
2. The edge cases usually forgotten in exactly this kind of feature.
3. Questions that need answering before work starts.

Do not invent requirements that aren't in the input: if something is missing, put it in the questions.`,
    example: `Criterion: given a project has no members; when the owner opens "Team"; then an explanation and a single "Invite" button are shown, and the table is not rendered at all.
Forgotten case: an invitee accepts after their role has been changed.`,
  },
  "saas-db-schema": {
    title: "Database schema for your product",
    summary:
      "Tables, relations and indexes derived from your scenarios — plus where the schema will strain.",
    bestFor: "ChatGPT / Claude",
    tags: ["database", "schema", "architecture"],
    prompt: `Design the database schema for my service.

What the product does: {description}
Main scenarios: {list of what users do}
Who the users are and how access is separated: {roles, teams, organisations}
Expected volumes: {how many records and queries}
Database: {PostgreSQL / MySQL / other}

Deliver:
1. Tables with fields and types, primary and foreign keys, nullability.
2. Relations and their kind, with the reasoning wherever there was a real choice.
3. Indexes — and the specific query each one serves.
4. How different customers' data is separated and what prevents seeing someone else's.
5. What to do about deletion: soft or real, and why that choice for this data.
6. Three places where the schema will start to hurt as you grow, and what to change then.
7. The SQL to create the tables.

Don't over-engineer ahead of time: if one table solves it, say so.`,
    example: `Customer separation: organization_id on every table, row policies keyed on it. One forgotten filter in a query and a customer sees another's data — so it's enforced in the database, not the code.
Will strain: events in the same table as business data — move them out, partitioned by month.`,
  },
  "saas-tech-stack": {
    title: "Choosing a stack, with the reasoning",
    summary:
      "What to pick for your timeline and skills — and what each choice will cost you later.",
    bestFor: "ChatGPT / Claude",
    tags: ["stack", "choice", "development"],
    prompt: `Help me choose the technologies for a project and explain the price of each decision.

What the product is: {description}
What I can do: {languages and tools, honestly}
Time to launch: {timeframe}
Who will maintain it: {just me / a team / a contractor}
Special requirements: {payments, files, real time, offline, integrations}
Monthly infrastructure budget: {amount}

Break it down:
1. The recommended set: frontend, backend, database, hosting, auth, payments, email.
2. For each — why this one in my situation, and a sensible alternative.
3. The price of the choice: what becomes awkward within a year.
4. What I shouldn't build myself but buy as a service, and what it costs.
5. What to avoid specifically in my case, and why.
6. An estimate of the infrastructure bill at 100, 1,000 and 10,000 users.
7. Which choice will be hardest to reverse later — and how to reduce that lock-in.

Account for my skills: an unfamiliar technology on a short deadline is a risk, not an advantage.`,
    example: `Auth: a ready service, not your own. Your own means emails, password resets, sessions and leaks — two weeks of work and permanent responsibility.
Hardest to replace: the database. Keep queries in one layer so a migration doesn't spread through the whole codebase.`,
  },
  "saas-landing-hero": {
    title: "The hero section of a SaaS landing page",
    summary:
      "A headline, subheading and button that make it clear what this is and why — in five seconds.",
    bestFor: "Claude / ChatGPT",
    tags: ["landing page", "hero", "copy"],
    prompt: `Write the hero section of a landing page for a SaaS product.

Product: {what it does}
For whom: {a narrow audience}
What work it replaces: {what the person does today}
The main benefit in numbers: {time, money or errors saved}
Model: {free tier / trial / paid only}
How it differs from the nearest competitor: {a fact}

Give me:
1. Five headline options: clear rather than clever. No metaphors and no use of the word "platform".
2. A subheading for each: who it's for and what happens after signing up.
3. Button copy — three options, at different levels of commitment.
4. A line under the button that removes fear: card, cancellation, setup time.
5. Three pieces of proof to sit beside the hero that you can show without an existing customer base.
6. What to remove: the standard phrases that say nothing.
7. A test: read the headline aloud and say whether someone hearing about the product for the first time would understand it.

Write it so the headline makes the product's job clear even without the image.`,
    example: `Headline: "Client invoices straight from your spreadsheets — in a minute, without an accountant"
Under the button: "No card. Five-minute setup. Cancel in one click."
Remove: "an innovative platform for optimising business processes" — it says nothing.`,
  },
  "saas-pricing-tiers": {
    title: "Pricing tiers and where the lines fall",
    summary:
      "How many plans, what goes in each and which metric the price grows with — checked for fairness.",
    bestFor: "ChatGPT / Claude",
    tags: ["pricing", "plans", "monetisation"],
    prompt: `Build the pricing for my service.

Product: {what it does}
Who pays: {individuals / small business / companies}
Cost to serve one user per month: {amount or "almost nothing"}
What they perceive as the value: {the features they thank you for}
What grows together with the value: {users, projects, volume, requests}
Competitors and their prices: {list}

Do this:
1. Which metric to charge on and why that one — it must grow with the customer's value, not with our costs.
2. Three plans: name, price, limits, what's included.
3. What belongs in the free tier or trial so a person reaches value but still wants to pay.
4. Features that must never move behind the paywall: without them the product doesn't work, and gating them reads as extortion.
5. Annual billing: what discount is justified and how to present it.
6. What happens when moving between plans: exceeding a limit, downgrading, refunds.
7. Three objections about price and how to answer them.

Don't build five plans: the wider the choice, the more often people choose nothing.`,
    example: `Metric: the number of active projects, not users. Inviting colleagues must be free — otherwise the product never spreads inside a company.
Never behind the paywall: exporting your own data. Locking up someone else's data is a bad long-term trade.`,
  },
  "saas-onboarding-flow": {
    title: "Onboarding up to first value",
    summary:
      "The path from sign-up to «it works», step by step, with the places people leave.",
    bestFor: "ChatGPT / Claude",
    tags: ["onboarding", "retention", "ux"],
    prompt: `Design onboarding so the person sees value as fast as possible.

Product: {what it does}
What counts as first value: {the specific event after which the person gets it}
What is needed from the user: {data, integrations, settings}
How many reach first value today: {percentage or "no idea"}
Where they sign up: {the site, a colleague's invite, from an integration}

Do this:
1. Describe the path step by step: screen by screen from sign-up to first value.
2. For each step: what the person does, what we show, what happens on the server.
3. Remove everything that can be asked later. Justify every question you keep.
4. The empty product: what a person sees when there is no data yet, and how that doesn't look broken.
5. How to show value before everything is configured: demo data, an example, a ready template.
6. Three places where people will leave, and what to do at each.
7. The first days' emails: how many, when and about what — useful only, no "we're delighted to have you".
8. What to measure to see exactly where you lose people.

Rule: every screen before first value must either deliver value or be unavoidable.`,
    example: `Ask later: company name and industry. They change nothing before first value, and two fields at the door cost you people.
Value before setup: show the report on demo data with a "connect your own" button — the person sees the result before doing the work.`,
  },
  "saas-api-design": {
    title: "API design",
    summary:
      "Resources, methods, errors and pagination — set up so you don't have to break compatibility later.",
    bestFor: "ChatGPT / Claude",
    tags: ["api", "integrations", "architecture"],
    prompt: `Design an HTTP API for my product.

What the product does: {description}
Who will call the API: {our frontend / customers / partners}
The main actions: {list of what it must be able to do}
Authorisation: {tokens, keys, OAuth}
Expected load: {requests per minute}

Deliver:
1. The list of resources and paths with methods; one line on the purpose of each.
2. Example JSON request and response for the three main methods.
3. The error format: one for the whole API, with a code, a machine-readable field and human text.
4. Pagination, filters and sorting — one approach for every list.
5. Idempotency wherever a repeated request must not create a second object.
6. Rate limiting: what we return when exceeded and in which headers.
7. Versioning: how to change the API without breaking those already connected.
8. Three decisions that are hard to change later — and how to choose now without regret.

Separately: what not to do in this API, and why.`,
    example: `Idempotency: POST /payments accepts an Idempotency-Key. Without it, a resubmitted form on a bad connection creates a second payment.
Hard to change: the shape of your identifiers. Sequential numbers reveal how many customers you have — use non-sequential ones.`,
  },
  "saas-churn-analysis": {
    title: "Churn teardown",
    summary:
      "Why people leave and what to fix first — from the cancellation reasons, not from guesses.",
    bestFor: "ChatGPT / Claude",
    tags: ["churn", "retention", "analytics"],
    prompt: `Help me work out why users cancel, and what to do about it.

Product and price: {what and how much}
Monthly churn: {percentage}
Reasons given at cancellation: {list with counts, if you have them}
How long they last before cancelling: {distribution or average}
What they did before cancelling: {last actions, if known}
Who churns most: {segments}

Break it down:
1. Split the reasons into three groups: the wrong customer arrived, they never reached value, the value ran out. The group decides what to fix.
2. Mark which churn is cured by the product and which by marketing.
3. Early signals: which actions in the first days predict someone leaving a month later.
4. What to change in the product: three fixes ordered by effect against effort.
5. What to change in acquisition so people who will leave anyway stop arriving.
6. The cancellation screen: how to ask the reason without irritating, and what to offer instead — no traps, no holding people against their will.
7. Which data is missing and what to start recording today.

Do not propose making cancellation harder: that changes the number, not the reason.`,
    example: `Early signal: no project created in the first week — 8 out of 10 of those leave. So fix onboarding, not the day-25 email.
Cancellation: ask one reason from a list and offer a cheaper plan — but "Cancel" stays the first, active button.`,
  },
  "saas-changelog-release": {
    title: "Release notes and the email to users",
    summary:
      "A list of commits becomes a readable changelog and an email people finish reading.",
    bestFor: "ChatGPT / Claude",
    tags: ["release", "changelog", "email"],
    prompt: `Turn a list of changes into release notes and an email to users.

Changes: {paste a list of commits, tickets or your own notes}
Product: {what it does}
Who reads it: {technical users / general users}
Any breaking changes: {yes, which / no}
What the user must do: {nothing / update settings / migrate}

Do this:
1. Release notes grouped into "new", "improved", "fixed". Every item in the language of benefit, not of code.
2. Breaking changes as a separate block at the top, with the exact date and instructions.
3. The email: subject, first line, three paragraphs, one button. About the single biggest change; the rest as a link.
4. A short social post about the most noticeable item.
5. What on the list users don't need to hear about at all — and why.
6. A tone check: cut "we've been working hard" and "we're excited to announce", keep what people can now do.

Rule: never write "fixed bugs" without saying which — be specific or don't mention it.`,
    example: `Improved: the annual report builds in 4 seconds instead of 40 — on large projects it used to time out entirely.
Don't mention: dependency upgrades and the logging migration. They give the user nothing and dilute the email.`,
  },
  "saas-metrics-dashboard": {
    title: "The metrics actually worth watching",
    summary:
      "A short set of numbers for your stage — and why the rest are only a distraction for now.",
    bestFor: "Claude / ChatGPT",
    tags: ["metrics", "analytics", "growth"],
    prompt: `Pick the metrics for my product at its current stage.

Product and model: {what it is and how people pay}
Stage: {no users / first customers / steady sales}
Paying customers now: {number}
What I already track: {list}
The main question I need answered: {e.g. "is it worth spending on ads"}

Do this:
1. Five to seven metrics, no more. For each: what it shows, how it's calculated, how often to look.
2. Why the other popular metrics are only a distraction at my stage.
3. The single number that shows whether the product is healthy — and how to calculate it for my case specifically.
4. Benchmarks: which value counts as bad, normal and good for my model.
5. How each metric can be accidentally gamed, and what to watch alongside it so that doesn't happen.
6. What to start recording in the product now so there is something to analyse in six months.
7. For each metric: what decision I'll make if it turns bad.

If a metric leads to no decision, leave it out.`,
    example: `The number that matters at your stage: the share reaching first value within 7 days. Revenue at 30 customers is noise — one payment swings it.
How it's gamed: retention rises if you stop acquiring. Watch new sign-ups alongside it.`,
  },

  "saas-support-macros": {
    title: "Support reply templates",
    summary: "Ready answers for common tickets — human, not robotic.",
    bestFor: "ChatGPT / Claude",
    tags: ["support", "templates", "customers"],
    prompt: `You are a support lead. Write reply templates.

Product: {what it is}
Common tickets: {list five to seven}
Tone: {how you talk to customers}
What you can and cannot do: {boundaries — refunds, access, timelines}

For each ticket deliver:
1. A reply under six lines, the substance in the first one.
2. What to ask if information is missing — one question, not a list.
3. A version for when it is our fault: without "we apologise for any inconvenience caused".
4. A version for when we cannot help: what to offer instead.
5. A note on when the template must not be used and a real reply is needed.

Every template must leave room for one live sentence: a message assembled entirely from boilerplate reads as an autoresponder.`,
    example: `"The login email never arrives": "Check your spam folder — about one in twenty lands there. If it is not there either, tell me which address you are using and I will look at the logs."
When it is our fault: "This is our mistake, I can see it in the logs. Fixing it, I will come back to you today."`,
  },
  "saas-security-review": {
    title: "Security check before release",
    summary:
      "The list of things that break silently: access, keys, database permissions.",
    bestFor: "Claude / ChatGPT",
    tags: ["security", "release", "checklist"],
    prompt: `You are an application security engineer. Check readiness for release.

What is shipping: {feature or change}
What was touched: {database, auth, payments, external calls}
Who has access to data: {roles}
Where keys are stored: {how it is now}

Go through the points and mark each "done / not done / not applicable":
1. Keys and secrets: none in the code, none in variables with a public prefix, none in logs.
2. Database permissions: can one user read another's data by substituting an identifier.
3. Input validation on the server, not only in the form.
4. What ends up in logs on error — no personal data, no tokens.
5. Open endpoints with no access check: routes someone forgot to close.
6. Fail closed: if a variable is unset, does access close or open to everyone.

Point 6 is the most common: code that says "if the key is set, check it" lets everyone through when the key is empty.`,
    example: `Not done: the mailing route checks the secret only when it is set — with an empty one it lets everyone in. Close before release.
Done: database access policies verified by substituting another user's identifier.`,
  },
  "saas-migration-plan": {
    title: "Data migration plan",
    summary:
      "Step order, the point of no return, and how to know everything arrived.",
    bestFor: "Claude / ChatGPT",
    tags: ["migration", "database", "release"],
    prompt: `You are an engineer who moves data without downtime.

What we move: {from what to what, volume}
Can the service stop: {yes / no / for how long}
What breaks if the data does not match: {consequences}

Deliver:
1. Steps in order, each with a time estimate.
2. The point of no return: up to which step rollback is free, and exactly how to roll back.
3. Checks after each step: which numbers to compare to be sure nothing was lost.
4. What to do with records that fail to migrate: dropping them is not an option, so where do they go.
5. How to operate during the switch if stopping is impossible: dual writes, a queue, read-only mode.
6. What to tell users and when.
7. How to tell the next day that the migration succeeded — three numbers.

Compare sums, not just row counts: lost values do not show up in a counter of rows.`,
    example: `Step 3 is the point of no return. After it the old database changes and rollback costs a day.
Check: row count, sum of the money column, count of unique users — all three must match…
Failed to migrate: 14 records with an empty date — into a separate table, handled by hand.`,
  },
  "saas-integration-docs": {
    title: "Documentation for integrators",
    summary:
      "A page an outside developer can connect from without emailing support.",
    bestFor: "Claude / ChatGPT",
    tags: ["documentation", "api", "integration"],
    prompt: `You are a technical writer. Write an integration page.

What is being connected: {feature or API}
Who reads it: {reader's level}
What they need beforehand: {keys, access}
Common failures: {what breaks for people}

Structure:
1. What the result will be — one paragraph and one example response.
2. What is needed before starting: a list of three or four items.
3. A minimal working example: exactly enough code to see the first response, and not one line more.
4. The response field by field: what each means and what values occur.
5. Errors: code, meaning, what to do. As a table.
6. Limits: request rate, sizes, key lifetimes.
7. What to do when it does not work: three checks in order.

The first example must run by copy-paste: if anything has to be filled in first, the reader goes to support instead.`,
    example: `Result: a list of orders for a period, as JSON. The example response sits right under the paragraph.
Error 401 — wrong or expired key. 429 — more than 60 requests a minute, wait…
Not working: 1) check the key, 2) check the URL, 3) read the whole response body.`,
  },
  "saas-trial-emails": {
    title: "Trial-period emails",
    summary:
      "A sequence that leads to first value instead of nagging about payment.",
    bestFor: "ChatGPT / Claude",
    tags: ["trial", "email", "onboarding"],
    prompt: `You are an onboarding specialist. Write the trial email sequence.

Product: {what it is}
Trial length: {days}
First-value moment: {what the person must do to see the point}
Where people get stuck: {list it}
What happens at the end: {charge / lockout / downgrade}

For each email:
1. The day it goes out and the reason — an event, not "day three of the trial".
2. A subject under 45 characters.
3. Body under eight lines, one action at the end.
4. Who must not receive it: anyone who already did that action.

Required:
5. An email for those who never came back after signing up.
6. An email two days before the end: exactly what the person loses, concretely.
7. An email after it ends for those who did not pay — with no pressure.

The sequence leads to first value, not to payment: someone who never got there will not pay however often you remind them.`,
    example: `Day 0, right after sign-up: "Your first result in 4 minutes" — one link, one action.
Day 5, only for those who never returned: "Looks like you did not get to it. What got in the way?" — a question, not a reminder…
Two days out: "Your 13 saved prompts stay; access to the PRO collection closes."`,
  },
  "saas-feature-spec": {
    title: "Feature specification",
    summary: "What we build, what we do not, and how we will know it worked.",
    bestFor: "Claude / ChatGPT",
    tags: ["specification", "product", "development"],
    prompt: `You are a product manager. Write a feature specification.

Feature: {what we build}
Problem: {whose pain and what kind, with an example}
User: {role}
Constraints: {deadlines, people, technology}

Deliver:
1. The job in one sentence: who, what they will be able to do, why.
2. How it works, step by step, through the user's eyes, with no talk of databases or code.
3. What happens in the unhappy cases: empty, error, no permission, slow.
4. What is not in this version — as a list. This matters more than the list of what is.
5. How we will know it worked: one metric and its current value.
6. What breaks in existing behaviour and who needs warning.
7. Three questions that need answers before work starts.

Point 4 is mandatory: without boundaries the work spreads and nobody ships on time.`,
    example: `Job: an author can drop a PDF into a folder and see it on the site without touching code.
Not included: editing PDFs, manual covers, custom ordering. That is the next version…
Metric: time from "the file exists" to "it is on the site". Currently an hour of developer work.`,
  },
  "saas-postmortem": {
    title: "Incident review without blame",
    summary:
      "What broke, why it was possible, and what to change so it does not repeat.",
    bestFor: "Claude / ChatGPT",
    tags: ["incident", "reliability", "review"],
    prompt: `You are the engineer running an incident review. Write it up.

What happened: {describe it}
When it was noticed and how: {who saw it first}
How long it lasted: {duration}
Who was affected: {how many people, what did not work}
How it was fixed: {what was done}

Deliver:
1. A minute-by-minute timeline: when it started, when it was noticed, when it was fixed.
2. What exactly broke — the technical cause in one paragraph.
3. Why it was possible: not "a developer made a mistake" but what was missing in the system's design that let the mistake reach people.
4. Why it was not noticed immediately — and how to find out sooner next time.
5. Three actions: what to do today, this week, this quarter.
6. What not to do, even though it is the first thing that comes to mind.

Not a single name: a review that hunts for someone to blame will not happen next time — people stop reporting problems.`,
    example: `Broke: the variable was unset and the secret check silently let everyone through.
Why possible: the code read "if the secret is set, check it". The default on failure was open…
Today: close it. This week: a test for the empty variable. This quarter: audit every access check for the same shape.`,
  },
  "saas-roadmap-quarter": {
    title: "Quarterly roadmap",
    summary:
      "What we build, in what order, and what gets cut if we fall behind.",
    bestFor: "Claude / ChatGPT",
    tags: ["roadmap", "planning", "product"],
    prompt: `You are a product lead. Build a plan for the quarter.

Product and stage: {where it is now}
Main goal for the quarter: {one}
What users ask for: {list it}
What the business asks for: {list it}
Resources: {how many people, how much time}

Deliver:
1. One goal for the quarter, stated as a number rather than a word.
2. Three to five items, each with an answer for how it moves the goal. Anything that does not move it is out.
3. Order: what comes first because the rest depends on it.
4. Estimates in weeks with slack, and where the slack came from.
5. What gets cut first if we fall behind — decided now, not at the end of the quarter.
6. What we are not doing this quarter despite requests — and what to tell the people asking.
7. One mid-quarter check: what tells us the plan is not adding up.

Publish the "not doing" list alongside the plan: otherwise the same request arrives every week.`,
    example: `Goal: raise the share of users reaching first value from 22% to 40%.
Not included: dark mode — often requested, does not move the goal. Answer: "It is in next quarter's plan"…
Mid-quarter check: if the number has not moved by week six, we cut the third item.`,
  },
  "saas-activation-metric": {
    title: "The moment after which people stay",
    summary:
      "Find the action after which users stop leaving, and start counting it.",
    bestFor: "Claude",
    tags: ["activation", "metrics", "retention"],
    prompt: `You are a product analyst. Find the activation metric.

Product: {what it is}
What people do inside: {main actions}
Data: {which events exist, over what period}
First-month churn: {if known}

Work through:
1. Candidates for the aha moment: three or four actions after which the value becomes obvious. Not signup, not a completed profile — those are work, not value.
2. How to test each against the data: compare retention of those who did it with those who did not. The gap should be a multiple, not a couple of points.
3. The causation caveat: active people do more of everything. Check the action leads to retention rather than accompanying it.
4. The metric with a number and a window: how many times, within how many days. "Uses the product" is not a metric.
5. The current value and where it should be by the end of the quarter.
6. What stops people reaching the moment — three places where they fall out.
7. One product change that shortens the path.

There must be one metric. Three activation metrics means the team will push whichever grows easiest.`,
    example: `Candidates: copied a prompt, saved a favourite, opened a third section.
In the data: people who copy at least 3 prompts in a week stay 4.7 times more often. The other candidates differ within noise.
Metric: 3 prompts copied in the first 7 days. Currently 19% get there.
Blockers: search is invisible on phones, the category is picked blind, half the prompts show no example output.`,
  },
  "saas-cancel-flow": {
    title: "The cancellation flow",
    summary:
      "How to ask why and offer a way out without holding people hostage.",
    bestFor: "Claude / ChatGPT",
    tags: ["churn", "cancellation", "retention"],
    prompt: `You work on retention. Design the cancellation flow.

Product: {what it is}
Plans: {which}
Why people usually leave: {if known}
What you can offer: {pause, discount, downgrade, nothing}

Design:
1. The reason step: five or six options plus "other". The wording must separate different problems: "too expensive" and "not using it" need different answers.
2. What to show for each reason. One offer, appropriate to that reason: not using it means a pause; too expensive means a lower plan; could not figure it out means a short conversation.
3. Where an offer is inappropriate: if they are leaving over a missing feature, a discount reads as mockery.
4. Pause instead of cancel: for how long, and what happens to their data.
5. Cancellation in two clicks. A hidden button does not return money, it returns complaints and card disputes.
6. The email afterwards: confirmation, access until when, how to come back, how to delete data.
7. What to measure: save rate per reason. Above 25% you are not retaining, you are obstructing — and it returns as refunds.

Cancelling must work without contacting support. Everything else is about leaving calmly and being able to return.`,
    example: `Reasons: not using it, too expensive, could not figure it out, found something else, one-off job finished, other.
"Not using it" then a 2-month pause, access frozen, data kept.
"Found something else" then no offer. Ask which one, in a single field, and let them go.
Cancellation: two buttons, no calls, no chat.
Measure: save rate by reason. "Too expensive" saves 31% today — too high; the discount is hitting people who would have paid.`,
  },
  "saas-dunning": {
    title: "Recovering failed payments",
    summary:
      "Half of lost subscriptions are not a decision to leave but an expired card.",
    bestFor: "Claude / ChatGPT",
    tags: ["payments", "subscriptions", "revenue"],
    prompt: `You run subscriptions. Set up failed-payment recovery.

Product and price: {what and how much}
How people pay: {card, invoice}
What happens today on failure: {as it is}
How many cases a month: {if known}

Deliver:
1. The retry schedule: when to try again. An hour later is pointless; three days later can land on payday — different probabilities entirely.
2. Splitting by cause: expired card, insufficient funds, bank decline, blocked card. The emails differ because the actions differ.
3. Copy for three emails: the first calm, the second with the exact thing to do, the third with the cut-off date.
4. What to show inside the product: a bar with one action, not a lockout. A locked-out person does not pay, they leave.
5. How many days to keep access. Too few loses people who are simply on holiday; too many teaches people not to pay.
6. What to do with the ones who never recover: an email a month later, separate from the newsletter.
7. What to measure: recovery rate. Below 25% means the schedule or the copy is bad.

Do not write "your payment was declined" with no explanation. People assume the fault is yours and never check their card.`,
    example: `Schedule: immediately, after 3 days, after 7. Put the third retry on a weekday.
Expired card: an email linking straight to the replacement form, one action.
Insufficient funds: same copy, but retry after 5 days — odds improve after payday.
Access held for 10 days. Top bar: "Payment failed, access until 14 September" and a button.
Currently recovering 12% — the schedule is a single same-day retry.`,
  },
  "saas-inapp-guidance": {
    title: "In-app hints instead of a tour",
    summary:
      "Help at the moment someone is stuck, not seven modals on first login.",
    bestFor: "Claude / ChatGPT",
    tags: ["onboarding", "hints", "interface"],
    prompt: `You are a product designer. Replace the product tour with contextual hints.

Product: {what it is}
Current onboarding: {tour, video, nothing}
Where people get stuck: {if known}
The key action: {what they must do}

Deliver:
1. Three or four moments that need a hint. A moment is not a screen but a state: empty, first time, after an error, before something irreversible.
2. For each: what to show, in one sentence, and where. A hint lives beside its element, not in the middle of the screen.
3. The show condition and the condition for never showing again. A hint that returns on the tenth visit is an irritant.
4. What the interface should solve instead of a hint. If a field needs explaining, renaming the field is usually cheaper.
5. What to delete from the tour entirely. First-login tours are watched by 20% and remembered by nobody: the person does not yet know why they would care.
6. How not to obstruct experienced users: one way to dismiss everything.
7. What to measure: share reaching the key action, before and after.

Rule: a hint appears once the person is already trying to do something. Before the attempt there is nothing to explain — they do not need it yet.`,
    example: `Moment: an empty favourites list. Hint by the heart button: "Tap to keep a prompt here."
Gone for good: after the first save.
Solved by interface, not a hint: rename the "Slug" field to "Page address" and the hint becomes unnecessary.
Cut from the tour: 5 of 7 steps. Keep one — where the sections are.
Measure: share who copy their first prompt within the session.`,
  },
  "saas-first-30-days": {
    title: "A user's first thirty days",
    summary:
      "Most churn happens in the first month — here is what happens week by week.",
    bestFor: "Claude",
    tags: ["onboarding", "retention", "plan"],
    prompt: `You are a product manager. Map a user's first 30 days.

Product: {what it is}
Type: {self-serve or assisted}
Key action: {what delivers value}
What happens after signup today: {as it is}

Map it week by week:
1. Day 0: what they must accomplish in the first session. One action, not profile setup.
2. Days 1-7: what has to happen for a second visit. The second visit is the fork; after it the odds of staying change several times over.
3. Days 8-14: turning one-off use into a habit. What to show someone who used it twice and vanished.
4. Days 15-30: expansion — a second use case, a second teammate, a second area of the product.
5. For each week: what the product does, what an email does, what a human does.
6. Three signals someone is leaving, and the action for each.
7. What not to do: ask for a review before first value, invite to a webinar on day one, show everything at once.

Separately: what happens if they do nothing for 72 hours. It is the most common case and almost nobody plans for it.`,
    example: `Day 0: copy one prompt. Everything else waits.
Days 1-7: a day-two email with a prompt for the job they picked at signup. Not a digest.
Churn signal: visited three times, copied nothing. They cannot find it — surface search with a hint.
After 72 hours of nothing: one email with the three shortest prompts. Not "we miss you".`,
  },
  "saas-pricing-change": {
    title: "Raising prices without a revolt",
    summary:
      "Who to tell, when, and in what words, so a handful leaves rather than half.",
    bestFor: "Claude",
    tags: ["pricing", "subscriptions", "communication"],
    prompt: `You are a product manager. Plan a price change.

Current price and plans: {as they are}
New price: {to what}
Why: {the real reason}
Paying customers: {number and mix}
What was added to the product this year: {list}

Plan:
1. Who the change does not touch at all: grandfathered customers, annual plans until renewal. Decide this first — the whole message depends on it.
2. How much notice. Under 30 days reads as a trick, even where the contract allows it.
3. The email: reason, new price, date, what to do if they disagree. A real reason — "infrastructure costs rose" sounds more honest than "we got better".
4. What not to write: a long list of improvements as justification. It reads as trying to sell what they already paid for.
5. What to offer the unhappy: a year at the old price paid now, a downgrade, a pause.
6. Announcement order: large customers personally first, then everyone by email. A large customer who learns from a newsletter calls to complain.
7. What to measure and when: churn at 30 and 90 days, not at one week. The first week always looks frightening.

Offer a way to lock the old price for a year. Some of the unhappy will pay for a year up front — you get the cash and defuse the grievance.`,
    example: `Not affected: 340 annual subscribers until renewal, and anyone who pays before 1 October.
45 days notice.
Reason in the email: "We held the price for three years; infrastructure costs have doubled since."
Offer: pay for a year at the old price before 1 October.
Measure: 90-day churn against normal, not the first week's panic.`,
  },
  "saas-nps-followup": {
    title: "What to do with survey answers",
    summary:
      "The scores are in — now turn them into decisions rather than a slide with a number.",
    bestFor: "ChatGPT / Claude",
    tags: ["survey", "feedback", "decisions"],
    prompt: `You are a product analyst. Work through survey responses.

What you asked: {the wording}
Scores and comments: {paste}
How many answered, out of how many: {numbers}
Product: {what it is}

Work through:
1. Who answered. Extremes answer — the delighted and the furious. The middle stays silent and is absent from this data.
2. Themes in the comments with mention counts. One mention is not a theme.
3. What you actually intend to fix and what you do not. A list nobody intends to build is worse than no list.
4. Who to reply to personally and what to say: a low score with a coherent comment is a free interview, if you write the same day.
5. What to do with high scores: ask for a review or a referral, but not in the same email where you thank them.
6. One product change for the coming month.
7. What to ask next time so the data is more useful.

The score itself decides nothing. The comments decide, and so does who wrote them: a complaint from a large customer and one from a free plan are worth different amounts.`,
    example: `84 of 1,200 answered — 7%. Almost no middling scores; this is not a picture of the base.
Themes: slow search (19 mentions), no dark mode (11), plan is unclear (9).
Fixing: search. Dark mode already exists — so it is not being found, which is a different problem.
Reply personally: the 6 people scoring 3-5 with a coherent comment, today.
Next time ask: what they did in the product this week.`,
  },
  "saas-switch-page": {
    title: "A switch-from page",
    summary:
      "Copy for people already using something else and wondering whether to move.",
    bestFor: "Claude / ChatGPT",
    tags: ["competitors", "landing", "migration"],
    prompt: `You do product marketing. Write a page for people switching from a competitor.

Your product: {what it is}
Competitor: {who}
Why you are better for their users specifically: {real differences}
Where they are better: {honestly}
What blocks a move: {data, habit, contract}

Write:
1. A headline with no swipes at the competitor. The reader uses it — criticism reads as calling their choice stupid.
2. Three differences that matter to their users. Not a feature list but the things their community complains about.
3. An admission of where they are better. Without it the page is not credible: people know the product they use.
4. What happens to data in a move: can it transfer, how long, who does it.
5. The first 15 minutes after switching: what they see and what they get done.
6. Who should not switch. That filters out the people who would return unhappy and write a review.
7. A comparison table, if it is honest. A table where you have every tick reads as advertising and does not work.

Do not make price the only argument. Whoever moved for price will move away from you for the same reason.`,
    example: `Headline: "Moving from X: we transfer your data in a day."
Differences: works on a phone, you pay for use rather than seats, search across the whole archive.
Honestly: X has stronger integrations. If you live in their ecosystem, stay.
Data: CSV export, import on our side, typically 4 hours, we do it.
Do not switch: if you have 50+ people and configured roles — we do not have those yet.`,
  },
  "saas-error-messages": {
    title: "Error messages",
    summary:
      "What happened, what to do, and whose fault it is — three lines instead of a 500.",
    bestFor: "Claude / ChatGPT",
    tags: ["errors", "copy", "interface"],
    prompt: `You are a UX writer. Rewrite the error messages.

Product: {what it is}
The errors: {how they read now}
Who uses it: {audience}

For each error:
1. What happened — with no technical words, if the reader is not technical.
2. What to do right now. One action. "Contact support" is not an action, it is a hand-off.
3. Whose fault it is. Own yours plainly: "this is on our side" defuses more than an apology.
4. What happened to the data they already entered. The most common fear is that it is gone.
5. Where to show it: at the field, as a top bar, as a dialog. Dialogs are for irreversible things only.
6. What goes in the log and what goes to the person. An error code helps support, not the reader — put it small at the bottom.
7. Three errors to remove rather than rewrite: the interface can prevent them.

Do not write "something went wrong". It is the most useless sentence in interfaces: it says nothing and sounds like an excuse.`,
    example: `Was: "Error 422". Now: "We could not accept that email — it looks like there is a stray space. Check it and send again."
Our fault: "Could not save, this is on our side. Your text is still in the field, try again in a minute."
Data: say so always, even when it is safe — otherwise people check themselves and lose it.
Remove entirely: "file too large" — show the limit before the file picker.`,
  },
  "saas-ai-feature": {
    title: "An AI feature inside the product",
    summary:
      "How to build one that solves a job rather than filling space on the landing page.",
    bestFor: "Claude",
    tags: ["ai", "features", "product"],
    prompt: `You are a product manager. Design an AI feature.

Product: {what it is}
The user's job: {what they do by hand and slowly}
Data you hold: {what can go in}
Who uses it: {audience}

Design:
1. What gets faster and by how much. If the saving is under a minute the feature is unnecessary — it will be ignored.
2. Where it lives: inside an existing step, or as its own button. A separate "ask AI" button is almost always left unpressed.
3. What goes in, and what the person can adjust before running it.
4. What happens on a bad answer. This is the main part: answers will be bad regularly and the product must survive it. Edit, retry, undo.
5. How you show the answer was generated, and why not to hide it: trust is lost once and permanently.
6. Cost: per call, calls per user per month, and what happens at ten times the volume.
7. What is not allowed: deciding for the person without confirmation, irreversible actions, other people's personal data.
8. The metric: not how many pressed it, but how many outputs were kept unedited.

Point 8 separates a working feature from a decorative one. Curiosity gets one press; keeping the output means it was good enough.`,
    example: `Faster: finding the right prompt. By hand it is scrolling 200 cards; with the feature it is describing the job in words.
Lives in search, not a separate button: that is where people already are.
Bad answer: show three options, not one. One wrong answer reads as broken; one of three reads as a choice.
Metric: share who copy one of the suggested prompts instead of scrolling on.`,
  },
  "saas-usage-limits": {
    title: "Usage limits in plans",
    summary:
      "Where to draw the line so it nudges an upgrade rather than reading as punishment.",
    bestFor: "Claude / ChatGPT",
    tags: ["plans", "limits", "monetisation"],
    prompt: `You are a product manager. Set the usage limits.

Product: {what it is}
Current plans: {as they are}
What costs you money: {expenses that grow with usage}
How people use it: {typical and heavy behaviour}

Deliver:
1. Which parameter to limit. It must grow with value, not with your costs: people pay for value, not for your servers.
2. Where the line goes: look at the distribution and find the gap where a normal user never hits it and a heavy user hits it regularly.
3. What happens on reaching it: a soft stop, an advance warning, an overage charge. A hard block mid-task reads as a trick.
4. When to warn. At 80% of the limit, not at 100%.
5. What never to limit: exporting their own data, access to what they already created. Otherwise it reads as hostage-taking.
6. How to explain the limit on the pricing page in one line, understandable without a calculator.
7. What to measure: how many hit the limit and how many upgrade. If 40% hit it and 2% upgrade, the limit irritates rather than nudges.

The limit must be clear before payment. Someone who discovers it after buying will refund and tell people.`,
    example: `Limit on prompts copied per month, not on logins: copying is the value.
Line at 15: a normal user copies 4-6, a heavy one 30+. The gap between them is the comfortable place.
At 12 of 15: a bar saying "3 left this month". Not a dialog.
Never limited: access to saved items — those are already theirs.
Measure: 18% hit it, 9% upgrade. It works.`,
  },
  "saas-quickstart-docs": {
    title: "A quickstart page",
    summary: "The page after which something actually works, in ten minutes.",
    bestFor: "Claude / ChatGPT",
    tags: ["documentation", "quickstart", "developers"],
    prompt: `You are a technical writer. Write the quickstart page.

Product: {what it is}
For whom: {developer, analyst, ordinary user}
What they end up with: {the result}
What is needed first: {key, account, install}

Write:
1. What they will have at the end — the first line, before any preamble. They must be able to judge whether ten minutes is worth it.
2. Prerequisites, as a list. Not buried where they surface at step four.
3. The steps. Each is one action and one check: how to know it worked. A step without a check ends with someone continuing from a broken state.
4. Code or values that can be copied whole and run. Placeholders like your_key are the only thing they change.
5. What goes wrong for half of them: three common errors and what to do, on this page, not in a troubleshooting section.
6. What next — three links, no more.
7. What does not belong here: architecture, explanations of why things are built this way, a full parameter reference.

To test the page: hand it to someone who has never seen the product and watch in silence. Every place they stop is an edit.`,
    example: `First line: "In 10 minutes you will send your first request and get a prompt back."
Step 2, check: "The response should be 200 with an id field. A 401 means the key was truncated — it is 40 characters."
Common error: a test-environment key against the production URL. Everyone does it, including us.
Next: three links — reference, limits, examples.`,
  },
  "saas-churn-interview": {
    title: "A conversation with a churned customer",
    summary: "Fifteen minutes that explain churn better than any dashboard.",
    bestFor: "Claude / ChatGPT",
    tags: ["churn", "interviews", "customers"],
    prompt: `You are a researcher. Prepare a call with a churned customer.

Product: {what it is}
Who left: {segment, how much they paid, how long they stayed}
What the data says: {their last actions}
What you want to learn: {the decision that depends on it}

Prepare:
1. The invitation: a three-line email, with no gift attached. A gift produces polite answers instead of honest ones.
2. A first question that is not "why did you leave". That gets a rehearsed answer. Start with what they did in the product last month.
3. Eight questions about facts rather than opinions: what they did, what replaced it, who decided, what the last straw was.
4. The alternative question: what they use now and what is better there. That answer is worth more than the rest of the call.
5. What not to ask: will you come back, what should we improve. Both produce polite untruths.
6. How to take criticism: do not defend, do not fix it live. One objection and they stop talking.
7. What to do after: what not to promise, and what to write in the thank-you.

Note separately: a churned customer owes you nothing. Fifteen minutes, and not one more without their consent.`,
    example: `Invitation: "You stopped using us in July. I am not selling anything — I want to understand what went wrong. 15 minutes?"
First question: "Walk me through how you used it in your last month."
Last straw: "What happened on the day you decided not to renew?"
Do not ask: "what should we improve" — the answer will be about buttons, and buttons are not why they left.`,
  },
  "saas-billing-emails": {
    title: "Billing and renewal emails",
    summary: "The dull emails that cause most of the card disputes.",
    bestFor: "ChatGPT / Claude",
    tags: ["email", "billing", "subscriptions"],
    prompt: `You are an editor. Write the money emails.

Product and price: {what and how much}
How the subscription works: {period, auto-renewal}
What you send today: {as it is}

Write five emails:
1. Payment succeeded: what was bought, for how long, the amount, where the receipt is. Short but complete — people keep it.
2. Renewal coming: 3 to 5 days ahead, with the amount and date. This email prevents more card disputes than any terms page.
3. Renewal succeeded: same as the first, without congratulations.
4. Subscription ending and not renewing: what stops working and what remains.
5. Refund: confirmation, amount, when it lands, what happens to access.

For each: subject under 40 characters, body under 100 words, one button.

Rules: amount and date in the first two lines; a cancellation link in every money email; no upsells in a charge notification — it reads as trading on someone else's wallet.

The upcoming-charge email matters most. It gets skipped so as not to "scare people off", and then come the refunds and disputes.`,
    example: `Subject: "Renewing 14 September, $6".
Body: "Your PRO subscription renews automatically on 14 September and we will charge $6 to card ending 4417. If you would rather not renew, cancel and access stays until the 14th."
Button: "Manage subscription".
Not included: the annual plan offer. Not in this email.`,
  },
  "saas-demo-script": {
    title: "A demo script",
    summary:
      "Twenty minutes of showing that leaves a decision rather than an impression.",
    bestFor: "Claude / ChatGPT",
    tags: ["sales", "demo", "b2b"],
    prompt: `You lead sales. Write a product demo script.

Product: {what it is}
Who you show it to: {role, company size}
What you know before the call: {form, correspondence}
Time available: {minutes}
What must happen after: {next step}

The script:
1. The first five minutes are questions, not screens. What they do now, how long it takes, what gets in the way. Without that a demo becomes a tour of the menu.
2. What to show: one workflow, theirs, start to result. Not a feature survey.
3. Where to stop and ask. Every five minutes: "is that how it looks on your side?"
4. What not to show: settings, the admin panel, anything in development. Whatever is shown will be asked for later.
5. Price: when to say it. Before they ask, and not at the end — price at the end turns everything shown into a wind-up.
6. Three objections this role will raise, and the answers.
7. A next step with a date. "We will think about it" is not a next step.
8. What to write down afterwards while you remember: in the customer's words, not yours.

Demo on their data if you can. A demo on invented data leaves "would it work for us" unanswered.`,
    example: `First 5 minutes: "How does a listing get written now? Who writes the copy? How long does it take?"
Show one path: from product description to finished listing copy, on their product.
Price at minute ten, not at the end.
Objection for this role: "we have a copywriter". Answer: not a replacement, a speed-up — a draft in a minute instead of an hour.
Next step: "Access today, call Thursday at 3pm.`,
  },
  // ─────────────────────────── Threads ───────────────────────────
  "threads-hook-lab": {
    title: "20 hooks that fit before the «more» cut",
    summary:
      "The first line decides everything: on a phone only about 90 characters show before «more». Hooks are written to that limit.",
    bestFor: "ChatGPT / Claude",
    tags: ["hooks", "threads", "reach"],
    prompt: `Write 20 opening lines for Threads posts on the topic "{topic}".

Audience: {who}
My role: {who you are to them — practitioner, seller, observer}

Hard limits:
— No line longer than 90 characters. That is what shows in the feed before someone taps "more"; anything past it goes unread if the first part didn't land.
— No "Did you know that", "Top 5 ways", "Here's a roundup" — these read as templates and get scrolled past.
— No caps lock, no emoji chains.

Give 4 groups of 5:
1. Personal experience with a specific number or timeframe.
2. Disagreement with received wisdom in the niche.
3. An observation the reader recognises in themselves.
4. An open question they have something to answer from their own experience.

After each line, in brackets, say what reply it is built for. If the only possible reply is "agreed" — rewrite it: that hook collects likes, not conversation.`,
    example: `Personal experience:
"Posted on Threads daily for six months. First four months: about 30 views each." (expecting: "so what changed in month five?")

Disagreement:
"Posting at the best time is advice that will do nothing for you. Here's why." (expecting: pushback from people who believe in timing)`,
  },
  "threads-reply-magnet": {
    title: "A post built for replies, not likes",
    summary:
      "Replies are the strongest signal in the recommendation feed. This post is assembled so people want to write, not silently like.",
    bestFor: "ChatGPT / Claude",
    tags: ["threads", "engagement", "recommendations"],
    prompt: `Write a Threads post on the topic "{topic}" designed to pull replies.

What I know about it: {your experience, facts, numbers}
Audience: {who}
What I want to hear in the replies: {e.g. how other people solve this}

Rules:
— No longer than 500 characters, that is the platform limit. 300 is better.
— The first 90 characters must work as a standalone hook; the rest is what people unfold themselves.
— End on a question the reader already has an answer to from their own experience. Not "what do you think?" but something specific: their case, their number, their choice.
— Leave a place in the text where the reader can disagree. A post everyone agrees with gives nobody anything to say.

Don't do this:
— "Tell me in the comments!" — a direct ask works worse than a question people simply have something to say to.
— Don't invent provocation for the sake of an argument. A fight collects replies once, and then people unfollow.

Give 3 versions of the post and, under each, what kind of reply it is most likely to collect.`,
    example: `Version 1 (298 characters):
"I let go of the strongest person on the team. He was right more often than anyone — and that was the problem.

He didn't argue, he explained. After a few of those explanations people stopped offering their own ideas — why bother if you'll turn out wrong anyway.

One strong voice can quietly switch off everyone else.

Has this happened to you, and how did you handle it?"

Will collect: stories about people's own "too-right" colleagues, and an argument about whether letting them go was right.`,
  },
  "threads-first-thirty": {
    title: "The first thirty minutes after posting",
    summary:
      "The feed watches speed: 20 replies in half an hour push a post further than 50 over a day. A plan for that window.",
    bestFor: "ChatGPT / Claude",
    tags: ["threads", "algorithm", "first hour"],
    prompt: `Draw up a plan for the first 30 minutes after publishing a Threads post.

Post text: {paste the post}
Topic: {what it's about}
Who I am in this niche: {role}
Follower count: {number}

The recommendation feed looks at speed rather than total reactions: a post that collects replies in the first half hour is shown more widely than the same post collecting more over a full day. So that half hour has to be worked by hand.

Give me:
1. Three prepared answers to the most likely objections to this post — so I reply immediately instead of composing on the spot.
2. The first comment worth leaving under my own post: it must add to the topic, not be a "bumping this".
3. Five types of account worth pulling into the conversation and what to write to them — not "check out my post", but something substantive.
4. Three posts by other authors on the topic where a substantial reply in the same window is worth leaving: other people's threads bring visitors to the profile.
5. The "this one didn't work" signal: what numbers at minute 30 mean pushing further is pointless, and what to do instead.

Do not suggest: engagement pods, one-word replies, reposting the same text an hour later.`,
    example: `Answer to "your sample is just too small":
"Agreed, 40 cases is thin for conclusions. That's why I wrote 'this is how it went for me', not 'this is how it always works'. Has it gone differently for you on a bigger sample?"

"Didn't work" signal: fewer than 3 replies and under 200 views at minute 30. Stop pushing — work out why the first line failed and reuse the topic in a week with a different hook.`,
  },
  "threads-link-without-loss": {
    title: "A link without losing reach",
    summary:
      "A link in the body sends people off-platform, and the feed accounts for that. The scheme: the post stands alone, the link comes as the first reply.",
    bestFor: "ChatGPT / Claude",
    tags: ["threads", "traffic", "links"],
    prompt: `Split my link into a Threads post and a first reply.

Where I'm sending people: {URL and what's there}
Who needs it: {audience}
What they get by clicking: {specific benefit}

Platforms have no interest in sending people away, and a link in the post body historically cost reach. The rules are softer now, but "post separately, link in the first reply" stays safer: the post gets to travel on its own merits first.

Give me:
1. A post with no link that is useful on its own — someone who clicks nothing still takes something away. No more than 500 characters.
2. A first reply with the link: one line of context and the URL. Not "more at the link", but what exactly is waiting there.
3. A second version of the post with the link inline, so there is something to compare against if I decide to test both.
4. What to measure to tell which version worked better: two specific numbers and how to compare them.

Separately, warn me if my link requires signing up or leads straight to a payment page: that visibly cuts click-through, and it is better to say so honestly in the reply itself.`,
    example: `Post (no link):
"Spent three weeks working out what shipping to the marketplace actually costs. Turned out 18% more than my spreadsheet said.

I'd left out: returns, paid intake, storage over the limit.

If you're doing unit economics — check those three lines, they're almost always missing."

First reply:
"Put my spreadsheet with those lines here, take it: {link}"`,
  },
  "threads-strong-opinion": {
    title: "A strong opinion you won't regret",
    summary:
      "A post worth arguing with on the merits. Checked separately so it doesn't turn into cheap provocation.",
    bestFor: "ChatGPT / Claude",
    tags: ["threads", "opinion", "discussion"],
    prompt: `Help me put a strong opinion into a Threads post.

Topic: {what about}
What I actually think: {your position, a rough draft is fine}
What it's based on: {experience, numbers, cases}

I want a post some readers will disagree with — and want to explain why. But not at the cost of my reputation.

Do this:
1. State my position in one sentence under 90 characters, so it is clear exactly what there is to argue with.
2. Assemble a post under 500 characters: the position, one piece of grounding from my own experience, and an admission of where I am wrong. That last part is mandatory — an opinion with no stated limits reads as posturing.
3. Write the three strongest objections that will come, and an honest answer to each.
4. Check the resulting post against this list and give a verdict on every point:
   — Would I repeat this under my own name a year from now?
   — Is this an argument about the work, or a swipe at people?
   — Do I have grounds beyond irritation?
   — If someone else had written this, would I reply on the merits or scroll past?

If even one point fails, say so plainly and suggest how to reframe it.`,
    example: `Position (84 characters):
"AI courses sell a skill that goes stale faster than the course takes to finish."

Check:
— Repeat in a year: yes, the field is only speeding up.
— About the work: yes, this is about the product, not the people.
— Grounds: two courses taken, both outdated by the end.
— Would reply myself: yes, there's a case to make about fundamentals.`,
  },
  "threads-week-plan": {
    title: "A week of posts from one piece of material",
    summary:
      "One breakdown, article or video becomes seven standalone posts — not by slicing it, but by taking different angles.",
    bestFor: "ChatGPT / Claude",
    tags: ["threads", "content plan", "repurposing"],
    prompt: `Turn one piece of material into a week of Threads posts.

Material: {paste the text, transcript or notes}
My niche: {what my profile is about}
Audience: {who}

Don't slice the material into sequential chunks — that gives you seven fragments where each one needs the previous to make sense. Take different angles on the same thing instead.

Seven posts, one per day, each under 500 characters and self-contained:
1. Monday — the conclusion in full, no build-up.
2. Tuesday — the least obvious detail in the material.
3. Wednesday — a mistake I made myself on this topic.
4. Thursday — a number or fact that surprises.
5. Friday — a question to the audience they have their own answer to.
6. Saturday — a short breakdown of someone else's case or objection.
7. Sunday — what I'm changing in my own work after this.

For each, give: the first line under 90 characters separately, the post itself, and one topic tag (no more than one — a pile of tags reads as spam and performs worse).

At the end, say which two of the seven belong at the start of the week if I only publish some of them, and why those two.`,
    example: `Wednesday (a mistake):
First line: "Kept a spending spreadsheet for a year that lied to me every month."

Post: "I counted purchase and shipping, I didn't count time. My own time never went into cost of goods — it was 'free', after all.

Once I priced it at $5/hour, two products out of five turned out to run at a loss.

Tag: #marketplaces"`,
  },
  "threads-profile-setup": {
    title: "A profile that turns a visit into a follow",
    summary:
      "From a recommended post people land on your profile and decide in seconds. A 150-character bio and a pinned post built for that decision.",
    bestFor: "ChatGPT / Claude",
    tags: ["threads", "profile", "followers"],
    prompt: `Put together my Threads profile: bio and pinned post.

What I do: {occupation}
What I'll be writing about: {2–3 topics}
Who for: {audience}
How I differ from others in this niche: {experience, numbers, point of view}
What someone gets by following: {specifically}

People arrive at the profile from the recommendation feed and decide in a couple of seconds. The bio is 150 characters, and that is all you get.

Give me:
1. Five bio options under 150 characters. Each must make clear what the profile is about and why you specifically. No "coffee and travel lover", no list of credentials.
2. For each option — who it suits and who it doesn't.
3. A pinned post under 500 characters: who you are, what will be here, and one example of your usefulness inside the text itself — not a promise, but something useful right away.
4. Three topics for the first posts that will make good on the bio's promise. If the bio promises breakdowns and the first posts are about breakfast, people unfollow.

Separately, tell me if my answers don't show any difference from a hundred similar profiles — and what to put up front in that case.`,
    example: `Bio (129 characters):
"4 years selling on marketplaces, 6 stores now. I write about honest unit economics — including my own million-dollar mistakes."

Who it suits: people already making sales. A beginner won't see themselves — for them, option 3 works better.`,
  },
  "threads-post-mortem": {
    title: "A breakdown of the post that didn't take off",
    summary:
      "An honest walk through the funnel: where exactly it broke — the first line, the unfold, or the reply.",
    bestFor: "ChatGPT / Claude",
    tags: ["threads", "analytics", "breakdown"],
    prompt: `Break down my Threads post that got no reach.

Post text: {paste the whole post}
Views: {number}
Likes: {number}
Replies: {number}
Reposts: {number}
Followers at time of posting: {number}
Posted at: {when}

Work through it stage by stage, not in generalities. A post has a funnel, and it can break in three different places — each treated differently:

1. Few views with a normal reply rate — the post didn't get distributed. Look at the topic and the timing.
2. Many views, few replies — the first line didn't work, or the post left nothing to talk about.
3. Replies but no reposts — the post is interesting but not something people want to pass on. Look for anything a reader could claim as their own.

Work out which case mine is from the numbers and say it plainly. Then:
— What exactly in the text caused it. Quote the lines.
— Rewrite the first line three ways.
— Say whether the topic is worth reusing or is dead.
— One lesson for next time, stated as a rule.

If the numbers are normal for a profile my size and I'm worrying over nothing, say that. Don't invent a problem.`,
    example: `Yours is case two: 1,400 views against 2 replies. Distribution happened, conversation didn't.

The cause is the line "I've put together a roundup of tools for you" — it promises a list, and lists get read in silence.

Rewrite: "Out of 12 tools I tried, two are left. I deleted the rest in the first week."

Rule: if a post can be silently saved, it will be silently saved.`,
  },
  "threads-story-thread": {
    title: "A story across several posts",
    summary: "A personal episode broken into a chain people read to the end.",
    bestFor: "ChatGPT / Claude",
    tags: ["story", "thread", "engagement"],
    prompt: `You are a Threads author. Break a story into a chain of posts.

What happened: {the episode in your own words}
How it ended: {the outcome}
What follows from it for the reader: {the value}
How many posts: {usually 4–7}

Deliver:
1. The first post is a scene, not an introduction: a specific moment, time and place. No "let me tell you a story".
2. One turn per post, each ending with a reason to read on.
3. The moment it went wrong — without it the story does not work.
4. The last post is a conclusion that applies to the reader, not a moral about yourself.
5. Three options for the first post.
6. What to cut if the story runs longer than six posts.

First-post test: if it could sit on top of someone else's story, it is weak.`,
    example: `1: "At 23:40 I deleted a folder I had spent six months building. There was no backup."
2: "At first it did not register. It did an hour later, when I opened the project"…
Last: "You do not back up when you have time — you back up when you create the folder."`,
  },
  "threads-carousel-text": {
    title: "A text carousel with no images",
    summary: "A series of short posts that read as one argument.",
    bestFor: "ChatGPT / Claude",
    tags: ["carousel", "format", "copy"],
    prompt: `You are a Threads author. Build a text carousel.

Topic: {what about}
Main claim: {what you want to prove}
For whom: {audience}
Number of posts: {5–8}

Requirements:
1. The first post is the claim itself: short and arguable, but honest.
2. Each following post is one argument or example, no longer than three lines.
3. No post that could be skipped without loss.
4. The second to last is an objection against yourself, with the answer.
5. The last is what the reader should do about it today.
6. Three versions of the first post at different sharpness: soft, medium, sharp.

The self-objection is mandatory: a chain where the author doubts nothing reads as an advert.`,
    example: `1: "You do not need a content plan. You need a list of topics you keep coming back to."
4: "'What about consistency' — consistency comes from the list, not from a table of dates"…
Last: "Open your notes and write down the five topics you talk about most."`,
  },
  "threads-question-post": {
    title: "A question post people answer",
    summary:
      "A question that is easy to answer and interesting to read in the replies.",
    bestFor: "ChatGPT / Claude",
    tags: ["question", "comments", "reach"],
    prompt: `You are a Threads author. Come up with question posts.

Account topic: {what you write about}
Audience: {who reads}
What you want to learn: {if you have a goal}

Give ten questions in three groups:
1. Experience questions — people answer because they have something to tell.
2. Either-or questions — answered in one word, low barrier.
3. Confession questions — answered because everyone has done it.

For each:
4. The question itself, up to two lines.
5. Your own answer as the first reply — without it, answering feels awkward.
6. A note on what answers you will get and what to do with them afterwards.

Separately: three questions nobody will answer, and why — too general, too personal, or too much work.`,
    example: `Experience: "Which tool did you abandon after a week, and why?"
Either-or: "Do you plan your content or post by mood?"
Nobody answers: "What do you think about the future of AI?" — too broad, there is nothing to say.`,
  },
  "threads-repurpose-blog": {
    title: "An article turned into a chain of posts",
    summary:
      "A long text broken into posts without retelling it or losing the point.",
    bestFor: "Claude / ChatGPT",
    tags: ["repurposing", "thread", "content"],
    prompt: `You are an editor. Turn an existing article into a chain of posts.

Article text: {paste it}
Threads audience: {how it differs from the article's readers}
How many posts are acceptable: {number}

Deliver:
1. The article's main idea in one sentence — the chain starts there.
2. Three to five ideas that survive the format, and what to drop.
3. The chain: one idea per post, in your own words rather than quotes.
4. The first post is the strongest claim in the article, not its introduction.
5. Where to put the link and how to frame it so the click makes sense.
6. What from the article does not work as posts: long examples, tables, source citations.

Do not retell it in order: the article was written to be read straight through; a feed is not.`,
    example: `Main idea: "For the first three months consistency beats quality."
Drop: the research section — numbers without a chart do not read…
Link in the fourth post, right after the most arguable claim: that is where people go looking for proof.`,
  },
  "threads-numbers-post": {
    title: "A numbers post that does not read as bragging",
    summary:
      "Your own results, framed so people read for the lesson instead of rolling their eyes.",
    bestFor: "Claude / ChatGPT",
    tags: ["numbers", "results", "trust"],
    prompt: `You are a Threads author. Write a post about your own numbers.

What the numbers are: {what was measured and over what period}
The result: {what came out}
What produced it: {honestly, including luck and outside factors}
What failed: {failures in the same period}

Requirements:
1. Open not with the result but with what it cost — otherwise it reads as bragging.
2. Numbers with context: not "+300%" but from what to what.
3. Name what contributed besides your own effort: season, luck, someone else's repost.
4. One failure from the same period, with a number.
5. A conclusion usable by a reader who does not have your starting position.
6. What to cut if your audience is smaller than the numbers in the post: otherwise the gap reads as mockery.

Point 3 is mandatory: a post where the entire result is explained by your own actions produces distrust, not admiration.`,
    example: `"Of 47 posts in two months, four worked. Here is what those four had in common."
Not "+300% reach" but "from 1,200 to 4,800 on average per post"…
What helped: one repost from a large account produced a third of the growth. Without it, +90%.`,
  },
  "threads-comment-strategy": {
    title: "Commenting under other people's posts",
    summary:
      "What to write so people visit your profile instead of scrolling past.",
    bestFor: "ChatGPT / Claude",
    tags: ["comments", "growth", "strategy"],
    prompt: `You are a Threads growth strategist. Explain how to comment.

Your topic: {what you are about}
Whom to comment under: {types of accounts}
Your experience: {what you can usefully add}

Deliver:
1. Five kinds of comment that work: an addition, a counter-example, careful disagreement, a question of substance, a short story.
2. For each, a two-to-three-line sample on your topic.
3. What does not work: empty agreement, emoji, "great post", self-promotion.
4. How to write disagreement so it reads as conversation rather than argument.
5. How many comments a day make sense and why more is worse.
6. How to tell in two weeks that it is working: two signs.

A comment must be useful to the readers of the post, not to its author: only then do people follow it to your profile.`,
    example: `Addition: "This works with a warm audience. I tried it cold — here is what happened: …"
Does not work: "Totally agree!" — gives the reader nothing, nobody follows that to a profile…
Sign: people start reaching your profile from other people's posts, not only from search.`,
  },
  "threads-series-arc": {
    title: "A week-long series with one arc",
    summary: "Seven posts tied by a single line, so people wait for the next.",
    bestFor: "Claude / ChatGPT",
    tags: ["series", "plan", "retention"],
    prompt: `You are a serial-content editor. Build a week of posts with one through-line.

Topic of the week: {what about}
What the reader should understand by the end: {the takeaway}
Your experience with it: {what you can tell}
Number of posts: {usually 7}

Deliver:
1. The through-line in one sentence: from what to what we lead the reader.
2. Day by day: the post's topic, its opening line, what it adds to the line.
3. Where to place the most arguable post — and why not on day one.
4. A post that stands alone, for people who land in the middle of the series.
5. How to link posts without saying "as we discussed last time".
6. The last post: the takeaway and what to do next.
7. What to do if the third post flops: change the line or carry on.

Every post must read on its own: in a feed a series is seen in fragments, not in order.`,
    example: `Line: from "I post when I feel like it" to "I post from a list of topics and it does not kill the life in it".
Wednesday gets the most arguable one: by then there are people following…
If the third flops, carry on: a series is judged on the sum, not on one post.`,
  },
  "threads-analytics-review": {
    title: "Reading your own analytics",
    summary:
      "What a month of numbers says, and which three posts are worth repeating.",
    bestFor: "Claude / ChatGPT",
    tags: ["analytics", "analysis", "planning"],
    prompt: `You are a social media analyst. Review an account's statistics.

Numbers for the period: {reach, likes, comments, saves, follows per post}
Number of posts: {in the period}
What was published: {topics and formats}
Audience size: {followers}

Deliver:
1. The median reach, not the average: one lucky post skews the average and paints a false picture.
2. Three posts at twice the median — and what they have in common: format, topic, timing, opening line.
3. Three posts below the median — and what they lacked.
4. What does not matter although it seems to: posting time, length, emoji — check it against this data.
5. The saves-to-reach ratio: for useful content this is the key number, more telling than likes.
6. Three conclusions and three actions for next month.
7. What this data cannot tell you — and what to measure so that it can.

Point 7 is mandatory: conclusions drawn from insufficient data cost more than no conclusions at all.`,
    example: `Median 1,400, average 2,600 — one post pulled the average up; do not steer by it.
What the top three share: the opening line names a specific moment in time, not a topic…
Cannot be said: whether the carousel format works — there were two in a month, that is not a sample.`,
  },
  "threads-topics-setup": {
    title: "Profile topics",
    summary:
      "The topics on your profile decide which strangers get shown your posts.",
    bestFor: "ChatGPT / Claude",
    tags: ["profile", "topics", "reach"],
    prompt: `You do social strategy. Pick profile topics for Threads.

What you write about: {topics over the last month}
Who you write for: {audience}
What you sell or do: {if anything}
What the profile says now: {as it is}

Deliver:
1. Three to five topics you should be found under. Not what interests you, but what strangers will look for you under.
2. How each topic overlaps with what you actually post. A topic with no posts works against you: arrivals leave.
3. What to remove: the too broad ("marketing") and the too narrow that nobody searches.
4. How this fits the first line of the bio. Topic and bio must agree, or the profile reads as somebody else's.
5. Three opening posts per topic, so an arrival sees this place is about that.
6. When to check and what to look at: the share of non-followers in your reach.

Topics are not hashtags. They are a claim about which feed you belong in, and the claim is backed by posts, not words.`,
    example: `Topics: prompts for work, marketplaces, seller tools.
Remove "AI" — too broad, you are two hundredth there.
Bio first line: "I break down prompts that save sellers time." Matches the topics.
Check in 3 weeks: share of impressions from non-followers. Was 40%, should rise.`,
  },
  "threads-niche-replies": {
    title: "Replies under other people's posts",
    summary:
      "The fastest growth on Threads is not your posts but your replies in your niche.",
    bestFor: "Claude / ChatGPT",
    tags: ["replies", "growth", "niche"],
    prompt: `You do Threads strategy. Build a practice of replying under other people's posts.

Your subject: {what it is}
Who your future followers read: {5-10 accounts}
Time per day: {minutes}
What you know better than most: {expertise}

Deliver:
1. The account list in groups: large with busy comments, mid-size with live discussion, peers your own size. Under the large ones you are invisible; under mid-size ones you read best.
2. When to reply: the first 20-30 minutes after posting. Nobody reads the hundredth comment, the author included.
3. Three reply types that work: add a fact, offer a counter-case, ask a real question. And why agreeing does not work — it adds nothing.
4. Reply length: two to four lines. A long comment reads as an attempt to pull people away.
5. What is banned: links to yourself, "follow me", generic praise, arguing for sport.
6. How this becomes followers: someone taps your name, lands on your profile, and it must be about the same thing.
7. A daily quota, and how to keep it from becoming a job: how many replies, in how many minutes.

Do not write a reply that would fit under any post. It brings nobody and costs the same time.`,
    example: `Large: 3 accounts, reply within 20 minutes. Mid-size: 6 accounts, where your reply lands second or third.
Reply type: counter-case. "Ours went the other way — the listing without video sold better, because…"
Do not write: "great post, agreed".
Quota: 8 replies a day, 25 minutes. More becomes an obligation and gets dropped in a week.`,
  },
  "threads-trend-format": {
    title: "A trending format for your subject",
    summary:
      "How to take the format going round the feed and not look like a tourist.",
    bestFor: "ChatGPT / Claude",
    tags: ["trends", "format", "feed"],
    prompt: `You write on Threads. Adapt a trending format to your subject.

The format: {describe it — city lists, five jobs, unpopular opinion, whatever}
Your subject: {what you write about}
Audience: {who reads}
Your last month of posts: {examples}

Deliver:
1. What works mechanically in the format: enumeration, recognition, disagreement, nostalgia. Copy the mechanism, not the words.
2. Three versions for your subject. Each must stay yours: if the format would fit any account, it adds nothing to yours.
3. What to drop in the transfer: whatever was funny only in the original.
4. The first line of each version. The feed shows that and half of the second.
5. What to reply in the comments so the discussion continues. For list formats this is the main thing: people come to add their own.
6. When not to take the format: if your subject offers no recognition, an enumeration reads as a list.

Do not take a format after day seven. By then the feed is tired of it and your post reads as an echo.`,
    example: `Mechanism: recognition through enumeration. People add their own in the comments.
Version: "Five prompts I stopped writing by hand." Enumeration plus a confession.
Drop: the office joke — our audience works from home.
First line: "Five prompts I no longer write by hand" — enough to open it.`,
  },
  "threads-list-post": {
    title: "A list post that is not an article",
    summary: "An enumeration people finish and then add to in the comments.",
    bestFor: "ChatGPT / Claude",
    tags: ["list", "format", "post"],
    prompt: `You write short. Build a list post.

Subject: {what about}
What you enumerate: {mistakes, tools, rules, observations}
How many items: {number}
Audience: {who reads}

Build:
1. A headline with a number and a promise. The number sets the length — the reader knows what they are getting into.
2. One line per item. Two sentences per item turns it into an article, and articles do not get read in a feed.
3. Order: the most surprising first, the most useful second. The last item is remembered, but they have to reach it.
4. One item worth arguing with. Without it there are no comments.
5. A last line inviting additions: "what would you add". A list without one ends rather than continues.
6. What to cut: items everyone has, and items you have not tried yourself.

Five to seven items. Ten does not get finished; three looks like a draft of something larger.`,
    example: `Headline: "6 prompts I deleted after a month of use."
Argument item: "A prompt longer than one screen is always worse than a short one." People argue, which is the point.
One line per item, no explanations — those go into the comment replies.
Last line: "What did you delete?`,
  },
  "threads-daily-30": {
    title: "Thirty minutes a day",
    summary: "A routine that survives months, instead of weekend sprints.",
    bestFor: "Claude / ChatGPT",
    tags: ["routine", "habit", "growth"],
    prompt: `You do social strategy. Write a 30-minute daily routine.

Subject: {what you write about}
Follower count: {number}
What you do now: {as it is}
When it suits you: {time of day}
What you are worst at: {ideas, writing, replying}

Write:
1. The 30 minutes broken into parts: reading the feed, replying elsewhere, your own post, replying at home. With minutes.
2. What comes first. Not your own post: an empty head writes badly, and replies warm it up.
3. Where topics come from without extra time: your own replies from yesterday are ready drafts.
4. What to do on a day with nothing to say. That day comes every week, and the plan for it matters more than the plan for a good day.
5. What can be skipped with no loss: stories, design, checking analytics more than weekly.
6. How not to burn out: what to skip when there is nothing left, and what cannot be skipped even then.
7. After how many weeks to look at results, and at which number.

Rule: replies beat posts. A post with no replies elsewhere is seen by the people already following you.`,
    example: `30 minutes: 5 reading, 15 replying elsewhere, 7 your post, 3 replying at home.
First: replies. Your post last, built from a thought that surfaced while replying.
Nothing to say: take yesterday's own comment longer than three lines and post it.
Never skipped, even empty: replies at home. An author silent under their own post loses the thread.`,
  },
  "threads-photo-post": {
    title: "A post with an image",
    summary: "When a picture helps, when it hurts, and what has to be on it.",
    bestFor: "ChatGPT / Claude",
    tags: ["image", "post", "attention"],
    prompt: `You edit social. Build a post with an image.

What the post says: {the substance}
The image: {screenshot, photo, chart, cover}
Audience: {who reads}

Deliver:
1. Whether an image belongs here at all. On Threads text works on its own, and a spare image pulls attention off the first line — say plainly if it is better without.
2. What must be visible in the preview. Feed images are small: small type on them is never read.
3. How text and image connect: the text does not narrate the picture, it adds what is not in it.
4. Screenshots: what to crop and what to redact. Personal data, other people's names, spare interface.
5. Charts: one idea, axes labelled in words, one highlighted point. A chart with no conclusion in the caption goes unread.
6. The first line of the post — it still decides. An image will not save a weak first line, and a strong one works without an image.

Do not add a picture "so people notice". They will notice and scroll: the feed has too many images and too few reasons to stop.`,
    example: `Image belongs: showing the difference between two model outputs — in words it would take three paragraphs.
Visible in preview: two text blocks side by side, the left one shorter. Nothing else is needed.
The text adds: what exactly changed in the prompt. That is not in the picture.
Redact: the client's name in the screenshot header.`,
  },
  "threads-hot-take-safe": {
    title: "A strong opinion without a fight",
    summary:
      "How to say it so people argue with the idea rather than with you.",
    bestFor: "Claude",
    tags: ["opinion", "debate", "reputation"],
    prompt: `You are an editor. Help phrase a strong opinion.

The idea: {what you want to say}
Why you think so: {experience, data}
Who will dislike it: {who objects}
What you sell or do: {context}

Deliver:
1. A phrasing about the approach, not about people. "This is not worth doing" and "people who do this are fools" are one idea and two different reputations.
2. Your grounds in one line: your experience, a number, a case. An opinion without grounds collects abuse rather than debate.
3. The caveat where you might be wrong. It does not weaken the position; it removes half the objections in advance.
4. Three objections that will come, and your answers — prepared before publishing.
5. What to do if the post travels somewhere unintended: when to reply, when to stay quiet, when to correct.
6. A red line: subjects not worth an opinion for the sake of reach. Reach from a scandal arrives once and stays with you forever.
7. A check: read the phrasing as someone who does the opposite. If they feel insulted rather than interested, rewrite it.

Arguing for sport is visible. An opinion with no experience behind it is taken apart in an hour, and then the subject becomes you.`,
    example: `About the approach: "Long prompts hurt more often than they help" rather than "anyone writing walls of text has not understood it".
Grounds: "Of our 117 prompts, the best are under 15 lines."
Caveat: "For complex analysis the length is justified — there it carries structure."
Objection: "what about context". The answer is ready in advance.
Red line: no opinions on other people's pricing or other people's layoffs.`,
  },
  "threads-ama": {
    title: "Answering readers' questions",
    summary: "Collect questions and answer them so it becomes a week of posts.",
    bestFor: "ChatGPT / Claude",
    tags: ["questions", "audience", "content"],
    prompt: `You write on Threads. Run a question round.

Subject: {what you cover}
Followers: {number}
What has been asked in comments: {examples}
How many you will answer: {number}

Deliver:
1. How to invite questions. Not "ask me anything" — a narrow frame produces more questions than a wide one. People do not know what to ask an open door.
2. What to do with few followers: where else to get questions — a month of comments, your inbox, search on your subject.
3. How to select: questions interesting to more than the asker. Answer the rest privately.
4. Answer format: one post per question, not a ten-part thread. Each answer lives its own life in the feed.
5. What a good answer looks like: the question on line one, the answer on line two, detail after.
6. What to do with an awkward question: answer plainly or say you will not — but do not ignore it in public.
7. How this becomes a week of posts, and what to do with questions that return every month.

A repeating question is not boredom, it is a signal: the answer exists nowhere. That answer belongs pinned.`,
    example: `Invite: "Ask me about prompts — what is not working" rather than "ask me anything".
Select: "how do I know a prompt is bad" interests everyone. "Why will the PDF not open" gets a private reply.
Format: the post opens with the question itself, verbatim. That way people who did not ask recognise it.
Returns monthly: "where do I start". That needs a pinned post.`,
  },
  "threads-instagram-link": {
    title: "Threads and Instagram together",
    summary:
      "What to post in both, what only here, and how not to duplicate yourself.",
    bestFor: "Claude / ChatGPT",
    tags: ["instagram", "cross-posting", "content"],
    prompt: `You do social strategy. Connect Threads and Instagram.

Your subject: {what it is}
What Instagram already has: {format, audience, reach}
What Threads has: {as it is}
Time available: {per week}

Deliver:
1. What lives only on Threads: thoughts, observations, short opinions, questions. There is no point dragging those to Instagram, where they go unread.
2. What lives only on Instagram: the visual, the saveable, the finished.
3. What belongs in both and how to rewrite it in the move. Copied text is visible and devalues both places.
4. How to send people from Threads to Instagram and back. Not "link in bio" on every post — that stops being noticed within a week.
5. What to do about shared followers: they see you twice a day, and identical text reads as spam.
6. How to use Threads to test ideas before spending a day filming for Instagram.
7. What to measure separately on each, and why comparing the numbers across them is meaningless.

Point 6 is the main benefit. A Threads post costs five minutes; if the thought lands flat, the video is not worth making.`,
    example: `Threads only: "Noticed that prompts longer than a screen are almost always worse." Five minutes, immediate reaction.
Instagram only: a carousel breaking down a finished prompt — that gets saved.
Both: the month's results, as text on Threads and as a numbers graphic on Instagram.
Idea testing: if the thought draws discussion on Threads, film it. If silence, do not spend the day.`,
  },
  "threads-community-20": {
    title: "Twenty people worth talking to",
    summary: "A circle that moves an account more than any twenty posts do.",
    bestFor: "Claude / ChatGPT",
    tags: ["community", "relationships", "growth"],
    prompt: `You build communities. Assemble a circle on Threads.

Your subject: {what it is}
Your size: {followers}
Who you already read: {accounts}
What you can give others: {expertise, audience, help}

Deliver:
1. Twenty accounts in three groups: peers your size, slightly larger, adjacent subjects. Peers matter more than large accounts — with them the exchange is mutual.
2. Why adjacent subjects work better than direct competitors: different audiences, no fight over the same people.
3. How to start: not with "let us be friends" but with a useful reply under their post. Three or four times before any direct message.
4. What to offer in the first direct message. Something from your side, not a request.
5. How to maintain it: once a week, with no obligations and no scheduled like-swapping. Transactional exchange is visible and cheapens both parties.
6. Who not to invite: people looking only for gain, and people whose audience you would not want.
7. What this yields in three months and how to measure it.

Do not build a like-swap group. It lifts the numbers and brings not one person who actually needs you.`,
    example: `Peers: 8 accounts at 2-5k writing about marketplaces. Real exchange there.
Adjacent: 6 accounts on logistics and photography. Same audience, different subject — no competition.
Start: reply substantively under their posts for two weeks, then write.
First message: "Worked through your question about listing video, here is the prompt. Use it, no link needed.`,
  },
  "threads-one-or-thread": {
    title: "One post or a thread",
    summary:
      "When a thought fits one screen, and when it genuinely needs unpacking.",
    bestFor: "ChatGPT / Claude",
    tags: ["format", "thread", "length"],
    prompt: `You are an editor. Decide whether a text is one post or a thread.

The text: {paste}
Subject: {what it is}
What the reader should take away: {one thought}

Work through:
1. How many thoughts are in it. One thought is one post, always. A thread caused by length rather than by count reads as padded.
2. If there are several: are they sequential. A thread works when point two makes no sense without point one. If the points are independent, that is a list in one post.
3. How to compress to one screen: what to cut. Usually the preamble, the repetitions, and explaining what was already clear.
4. If a thread is warranted: how to build the first post. It must work alone — most people read only that.
5. How to end each node so people continue.
6. The maximum number of nodes. After the fifth almost nobody follows, and a second thread the next day works better.
7. What a thread costs: discussion smears across the nodes and the comments stay empty.

The default is one post. A thread has to be justified, not chosen by habit.`,
    example: `One thought: "short prompts work better." So, one post.
Cut: two paragraphs on how you got there. They do not fit, and the comments are where you tell it.
Were it a thread: node one is the conclusion, not the preamble. Everyone reads that, half read the rest.
Maximum: 4 nodes.`,
  },
  "threads-recycle-best": {
    title: "Reposting your best",
    summary: "How to bring back what worked without looking like a repeat.",
    bestFor: "ChatGPT / Claude",
    tags: ["reposting", "archive", "content"],
    prompt: `You are an editor. Prepare a repost of old material.

Best posts: {paste several}
How long ago: {timeframe}
Followers then and now: {numbers}
What has changed since: {in the subject, for you}

Deliver:
1. Which posts are worth repeating: those whose idea has not aged while the audience grew. A post everyone saw is not worth repeating.
2. What to change first: a new opening line, always. The same run-up over the same text is recognised and scrolled past.
3. Three ways to repost: with a new occasion, with a correction, with an admission. The last works best: "a year ago I wrote this, now I think otherwise".
4. What to do with numbers and examples: outdated ones must be refreshed, or the repost reads as carelessness.
5. How long to wait. Under three months is too soon.
6. How many such posts to keep in reserve and how to pick them without trawling the archive by hand.
7. What not to do: repost verbatim, repost more than monthly, repost what caused a fight.

A good repost is not a copy but a continuation. It adds what you did not know a year ago.`,
    example: `Repost: the short-prompts piece — 900 people saw it, there are 4,000 followers now.
New opening line: "I wrote this a year ago. A third of my view has changed since."
Refresh: was "of 69 prompts", now "of 207".
Do not repost: the pricing argument — a second run collects the same fight, angrier.`,
  },
  "threads-launch-product": {
    title: "Launching a product without ads",
    summary:
      "Two weeks of posts that end in sales — with no post saying buy this.",
    bestFor: "Claude / ChatGPT",
    tags: ["launch", "sales", "plan"],
    prompt: `You are a marketer. Plan a product launch through Threads.

Product: {what it is}
Launch date: {when}
Followers: {number}
What you usually write about: {topics}
What people already know: {nothing, heard of it, waiting}

Plan two weeks:
1. Days 1-4: the problem the product solves, with no product in frame. People must recognise their problem before they hear about a solution.
2. Days 5-8: how you solved it yourself. Process, mistakes, what did not work. That is the proof you understand the subject.
3. Days 9-11: the product as a by-product of that work. Not an announcement but "here is what came out of it".
4. Launch day: one post. What it is, who it is for, how much, where to get it. No exclamation marks, no countdowns.
5. The days after: answering questions, handling objections, showing how people use it.
6. How many of the fourteen posts mention the product. More than three and the feed starts unfollowing.
7. What to do if launch day is quiet. Silence is likelier than noise, and the plan for it is needed in advance.

You can only sell on Threads with what you already talk about. An account that went silent for two weeks and returned with a sale sells nothing.`,
    example: `Days 1-4: "A seller spends three of four hours on listing copy." Not a word about the product.
Days 5-8: how we wrote 20 prompts and threw 7 away. The post about the discarded ones reads best.
Launch day: one post, four lines, a link.
Of 14 posts, 3 mention the product. The rest are the subject.
If quiet: write personally to the ten people who commented during the fortnight.`,
  },
  "threads-quiet-week": {
    title: "Reach dropped",
    summary:
      "What to check and what not to do in the week everything went quiet.",
    bestFor: "Claude / ChatGPT",
    tags: ["reach", "decline", "diagnosis"],
    prompt: `You analyse social. Diagnose a drop in reach.

Before and after: {numbers over two or three weeks}
What you posted those days: {topics and formats}
What you did differently: {if anything}
Followers: {number}

Check in order:
1. How many days the drop has lasted. Two days is not a drop, it is two days. Reacting before a week means fixing something that is not there.
2. What changed on your side: posted less often, stopped replying, changed subject, started adding links.
3. Outbound links: almost everywhere they suppress reach. Check whether the start coincides with their appearance.
4. Format: whether you drifted into one type of post. Feeds tire of sameness faster than of bad.
5. The calendar: holidays, summer, major events. They move numbers more than your work does.
6. What to do this week: one change, not five. With five you will not know which worked.
7. What not to do: delete posts, double your posting rate, buy anything, change subject.

A two or three week dip is normal, not a fault. The problem starts when it lasts a month with your work unchanged.`,
    example: `Nine days — worth looking at.
Coincidence: from the 3rd every post carries a link to the site. There were no links before.
Format: 8 list posts in a row. The feed is tired.
One change this week: links move to the first comment. Watch for 7 days.
Not doing: posting more often, deleting anything.`,
  },
  "threads-voice-find": {
    title: "What makes you different in the feed",
    summary:
      "Find your angle before you are mistaken for three identical accounts.",
    bestFor: "Claude",
    tags: ["voice", "positioning", "difference"],
    prompt: `You are an editor. Help find someone's own angle.

Their posts: {paste 5-10}
Subject: {what they write about}
Who they read: {accounts}
What they have done that others have not: {experience}

Work through:
1. What repeats across the posts: words, the shape of the thinking, the kind of examples. That is the raw material of a voice, and it usually goes unnoticed.
2. How they differ from the accounts they read. If they do not, they are retelling, and it shows.
3. Experience nobody else in the subject has. Not "ten years in the field" but specific situations lived through.
4. The angle in one line: not what they write about but where they look from. "About prompts" is a subject. "About prompts as someone selling on a marketplace" is an angle.
5. Three topics visible only from that angle.
6. What to stop writing: whatever anyone else in the subject would write. It brings neither followers nor pleasure.
7. A test: cover the author's name on one of their posts. Are they recognisable?

An angle is not invented. It is found in what is already written — which is why we start from the posts rather than a blank page.`,
    example: `Repeats: always an example with a number, always what did not work.
Difference: everyone else in the subject shows successes; you show what was thrown away.
Angle: "prompts, from someone who binned half of them".
Topics from that angle: why long prompts look better than they work; what the discarded ones had in common.
Test: name covered — recognisable from "I binned seven of twenty".`,
  },
};
