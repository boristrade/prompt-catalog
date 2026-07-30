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
    summary:
      "Bundle and add-on ideas to lift your average order value.",
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
};
