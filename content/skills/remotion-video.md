---
name: remotion-video
description: Create programmatic videos with Remotion (React-based video framework). Use this skill whenever the user wants to create videos from code, build motion graphics, add captions/subtitles, voiceover, audio visualization, transitions, 3D content, text animations, or any video editing/compositing with React. Also trigger for requests involving video rendering, video montage, animated explainers, promo videos, TikTok-style captions, audiograms, transparent video export, parametrized video templates, or AI-generated voiceover integration. Trigger even for casual mentions like 'make a video', 'video with text', 'animate this', 'add subtitles to video', 'video from images', 'motion design', 'video template'. This skill covers the FULL Remotion ecosystem including @remotion/media, @remotion/captions, @remotion/transitions, @remotion/three, @remotion/lottie, @remotion/light-leaks, @remotion/google-fonts, @remotion/layout-utils, @remotion/media-utils, @remotion/install-whisper-cpp, and @remotion/gif.
---

# Remotion — Programmatic Video Creation in React

Remotion lets you create videos using React components. Every frame is a React render. All animations MUST be driven by `useCurrentFrame()` — CSS transitions/animations and Tailwind `animate-*` classes are FORBIDDEN (they won't render correctly).

## New project setup

```bash
npx create-video@latest --yes --blank --no-tailwind my-video
```

## Core concepts

### Composition (src/Root.tsx)

Defines video dimensions, fps, and duration:

```tsx
import { Composition } from "remotion";
import { MyComp } from "./MyComp";

export const RemotionRoot = () => (
  <Composition
    id="MyComp"
    component={MyComp}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
  />
);
```

### Animation with interpolate + Easing

```tsx
import { useCurrentFrame, interpolate, Easing, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1), // crisp ease-out
});
```

Common easing curves:
- **Crisp entrance**: `Easing.bezier(0.16, 1, 0.3, 1)` — strong ease-out, no overshoot
- **Editorial fade**: `Easing.bezier(0.45, 0, 0.55, 1)` — balanced in-out
- **Playful pop**: `Easing.bezier(0.34, 1.56, 0.64, 1)` — overshoot then settle

Use `Easing.out` for enter, `Easing.in` for exit animations.

### Sequencing

```tsx
import { Sequence, AbsoluteFill, Series } from "remotion";

// Delay + duration
<Sequence from={1 * fps} durationInFrames={2 * fps} layout="none">
  <Title />
</Sequence>

// Sequential playback (no overlap)
<Series>
  <Series.Sequence durationInFrames={45}><Intro /></Series.Sequence>
  <Series.Sequence durationInFrames={60}><Main /></Series.Sequence>
  <Series.Sequence durationInFrames={30}><Outro /></Series.Sequence>
</Series>
```

Always premount Sequences: `<Sequence premountFor={1 * fps}>`. Inside a `<Sequence>`, `useCurrentFrame()` returns local frame (starts from 0).

### Media — Video, Audio, Images

Install: `npx remotion add @remotion/media`

```tsx
import { Video, Audio } from "@remotion/media";
import { Img, staticFile } from "remotion";

<Video src={staticFile("video.mp4")} />
<Audio src={staticFile("audio.mp3")} />
<Img src={staticFile("logo.png")} style={{ width: 100 }} />
```

All media supports: `volume` (0-1 or callback), `trimBefore`/`trimAfter` (frames), `playbackRate`, `loop`, `muted`, `toneFrequency` (pitch 0.01-2, render only).

Assets go in `public/` folder, referenced via `staticFile()`. Remote URLs also work.

### Trimming content

```tsx
// Trim start of video/audio (non-destructive)
<Video src={staticFile("v.mp4")} trimBefore={2 * fps} trimAfter={10 * fps} />

// Trim start of animation
<Sequence from={-15}><MyAnimation /></Sequence>

// Trim end
<Sequence durationInFrames={45}><MyAnimation /></Sequence>
```

## Video layout principles

Before designing scenes, read [references/video-layout.md](references/video-layout.md).

Key rules:
- Safe area: 80px sides, 100px top/bottom for 1080px wide video
- Min text sizes (1080px wide): headline 84px, supporting 44px, labels 32px
- Use flex/grid for layout, absolute only for decorative elements
- Solve crowding with TIME (reveal elements sequentially), not shrinking
- One focal point per scene

## Transitions

Read [references/transitions.md](references/transitions.md) for full details.

```bash
npx remotion add @remotion/transitions
```

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}><SceneA /></TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  <TransitionSeries.Sequence durationInFrames={60}><SceneB /></TransitionSeries.Sequence>
</TransitionSeries>
```

Available: `fade`, `slide` (directions: from-left/right/top/bottom), `wipe`, `flip`, `clockWipe`.

Transitions SHORTEN total duration: `60 + 60 - 15 = 105 frames`.

## Captions & Subtitles (TikTok-style)

Read [references/captions.md](references/captions.md) for full pipeline.

### Transcribe audio → JSON

```bash
npx remotion add @remotion/install-whisper-cpp
```

Script to transcribe:
```ts
import { installWhisperCpp, downloadWhisperModel, transcribe, toCaptions } from "@remotion/install-whisper-cpp";
// Install whisper, download model, transcribe, write JSON to public/
```

### Display with word highlighting

```bash
npx remotion add @remotion/captions
```

```tsx
import { createTikTokStyleCaptions } from "@remotion/captions";

const { pages } = createTikTokStyleCaptions({
  captions,
  combineTokensWithinMilliseconds: 1200,
});
// Map pages to <Sequence> components with token highlighting
```

Import from `.srt`: `parseSrt({ input: srtText })` from `@remotion/captions`.

## Voiceover (AI TTS)

Read [references/voiceover.md](references/voiceover.md) for full details.

1. Generate audio per scene with ElevenLabs TTS API → save to `public/voiceover/`
2. Use `calculateMetadata` to measure audio durations and set composition length dynamically
3. Render `<Audio>` components synced with scenes

## Audio Visualization

Read [references/audio-visualization.md](references/audio-visualization.md) for full details.

```bash
npx remotion add @remotion/media-utils
```

```tsx
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";

const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
  src: staticFile("music.mp3"), frame, fps, windowInSeconds: 30,
});

const frequencies = visualizeAudio({
  fps, frame, audioData, numberOfSamples: 256,
  optimizeFor: "speed", dataOffsetInSeconds,
});
// frequencies[0..31] = bass, rest = mids/highs. Values 0-1.
```

## Sound Effects

```tsx
import { Audio } from "@remotion/sfx";
<Audio src="https://remotion.media/whoosh.wav" />
```

Available: whoosh, whip, page-turn, switch, mouse-click, ding, vine-boom, record-scratch, dramatic-boomer, and 20+ more. Full list in [references/sfx.md](references/sfx.md).

## Fonts

```bash
npx remotion add @remotion/google-fonts
```

```tsx
import { loadFont } from "@remotion/google-fonts/Montserrat";
const { fontFamily } = loadFont("normal", { weights: ["400", "700"], subsets: ["latin"] });
```

Local fonts: see [references/local-fonts.md](references/local-fonts.md).

## Text Animations & Measurement

Typewriter: slice string character-by-character based on frame. Never use per-character opacity.

Fit text to container:
```tsx
import { fitText } from "@remotion/layout-utils"; // npx remotion add @remotion/layout-utils
const { fontSize } = fitText({ text: "Hello", withinWidth: 600, fontFamily: "Inter" });
```

## 3D Content

Read [references/3d.md](references/3d.md).

```bash
npx remotion add @remotion/three
```

Use `<ThreeCanvas width={w} height={h}>` — NOT `<Canvas>`. All animation via `useCurrentFrame()`. `useFrame()` from R3F is FORBIDDEN.

## Lottie Animations

Read [references/lottie.md](references/lottie.md).

```bash
npx remotion add @remotion/lottie
```

Fetch JSON → `delayRender`/`continueRender` → `<Lottie animationData={data} />`

## Light Leak Effects

```bash
npx remotion add @remotion/light-leaks
```

```tsx
import { LightLeak } from "@remotion/light-leaks";
// Use inside <TransitionSeries.Overlay> or standalone
<LightLeak seed={5} hueShift={240} />
```

## GIFs & Animated Images

```tsx
import { AnimatedImage, staticFile } from "remotion";
<AnimatedImage src={staticFile("anim.gif")} width={500} height={500} />
```

Supports GIF, APNG, AVIF, WebP. Props: `fit`, `playbackRate`, `loopBehavior`.

## Dynamic Duration & Metadata

Use `calculateMetadata` on `<Composition>` to set duration/dimensions from data:

```tsx
const calculateMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  const duration = await getVideoDuration(props.videoSrc);
  return { durationInFrames: Math.ceil(duration * 30) };
};
```

Get media info with Mediabunny — see [references/media-info.md](references/media-info.md).

## Parametrized Videos (Zod Schema)

```tsx
import { z } from "zod";
export const Schema = z.object({ title: z.string(), color: zColor() });
// Pass schema={Schema} to <Composition> for visual editor in Studio
```

## Transparent Video Export

```bash
# ProRes (for editing software)
npx remotion render --image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444 MyComp out.mov

# WebM VP9 (for web)
npx remotion render --image-format=png --pixel-format=yuva420p --codec=vp9 MyComp out.webm
```

## FFmpeg in Remotion

No install needed — use `npx remotion ffmpeg` and `npx remotion ffprobe`.

## Preview & Render

```bash
npx remotion studio              # Preview
npx remotion still MyComp --frame=30 --scale=0.25  # Single frame check
npx remotion render MyComp out.mp4   # Full render
```

## Detailed References

For complex tasks, load the relevant reference file:

| Topic | File |
|-------|------|
| Video layout & design | [references/video-layout.md](references/video-layout.md) |
| Transitions & overlays | [references/transitions.md](references/transitions.md) |
| Captions pipeline | [references/captions.md](references/captions.md) |
| Voiceover + TTS | [references/voiceover.md](references/voiceover.md) |
| Audio visualization | [references/audio-visualization.md](references/audio-visualization.md) |
| Sound effects list | [references/sfx.md](references/sfx.md) |
| Advanced timing | [references/timing.md](references/timing.md) |
| Advanced audio | [references/audio.md](references/audio.md) |
| Advanced video | [references/video.md](references/video.md) |
| 3D with Three.js | [references/3d.md](references/3d.md) |
| Lottie animations | [references/lottie.md](references/lottie.md) |
| Local fonts | [references/local-fonts.md](references/local-fonts.md) |
| Text measurement | [references/text-measurement.md](references/text-measurement.md) |
| Media info (duration/dims) | [references/media-info.md](references/media-info.md) |
| GIFs & animated images | [references/gifs.md](references/gifs.md) |
| Light leaks | [references/light-leaks.md](references/light-leaks.md) |
| Silence detection | [references/silence-detection.md](references/silence-detection.md) |
| HTML in Canvas (WebGL) | [references/html-in-canvas.md](references/html-in-canvas.md) |
| Maps (MapLibre) | [references/maps.md](references/maps.md) |
| Transparent video | [references/transparent-video.md](references/transparent-video.md) |
| Compositions & stills | [references/compositions.md](references/compositions.md) |
| Parametrized videos | [references/parameters.md](references/parameters.md) |
| Sequencing patterns | [references/sequencing.md](references/sequencing.md) |
| Trimming patterns | [references/trimming.md](references/trimming.md) |
