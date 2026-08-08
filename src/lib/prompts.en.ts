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
};
