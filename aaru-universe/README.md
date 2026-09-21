# Aaru — A Little Universe

A premium cinematic 3D romantic web experience. Nine scenes, two stylised
characters, a heart drawn in stars, floating memories, a letter that reveals
itself line by line — and a sky that quietly grows into a universe.

Built with **React + Vite + TypeScript + Three.js (React Three Fiber + drei)**,
Framer Motion, GSAP, Tailwind CSS and Lucide icons.

---

## Contents

1. [Quick start](#1-quick-start)
2. [How to add Aaru's photos](#2-how-to-add-aarus-photos)
3. [How to change the messages](#3-how-to-change-the-messages)
4. [How to replace the 3D characters](#4-how-to-replace-the-3d-characters)
5. [How to deploy](#5-how-to-deploy)
6. [How to change the music](#6-how-to-change-the-music)
7. [How to customize the colors](#7-how-to-customize-the-colors)
8. [Project structure](#8-project-structure)
9. [Controls, accessibility & performance](#9-controls-accessibility--performance)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Quick start

Requires **Node.js 18+**.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # type-checks, then builds to dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint
npm run typecheck  # TypeScript only
```

URL parameters for testing:

- `?force2d=1` — preview the 2D fallback experience
- `?lowquality=1` — force the medium quality tier

---

## 2. How to add Aaru's photos

All photos live in **`public/memories/`**. The project ships with elegant
placeholder images so everything works out of the box.

**The easiest way to add real photos — keep the same file names:**

| File                      | Used in                       | Ideal shape      |
| ------------------------- | ----------------------------- | ---------------- |
| `public/memories/memory-01.jpg` … `memory-06.jpg` | Scene 4 — the photo gallery | portrait 4:5 (e.g. 1200×1500) |
| `public/memories/chapter-01.jpg` … `chapter-04.jpg` | Scene 3 — the timeline chapters | landscape 3:2 (e.g. 1600×1000) |

Drop your photos into `public/memories/`, overwriting the placeholders —
nothing else to do.

- The photos are **never modified** by the app — they are displayed as-is.
- Keep files reasonably compressed (~300–500 KB each) so the experience
  loads fast on mobile data.
- Prefer landscape orientation for the four chapter images and portrait
  for the six gallery memories; the frames are shaped for those ratios.

**Prefer different file names or more photos?** Edit the paths in
`src/data/story.ts`:

```ts
memories: [
  { src: '/memories/us-at-the-beach.jpg', title: '…', date: '…', description: '…' },
  // add as many as you like — the gallery arranges them automatically
],
```

Each memory supports `title`, `date` and `description`, shown in the
fullscreen view when a photo is clicked.

---

## 3. How to change the messages

**Every word in the experience lives in one file: `src/data/story.ts`.**

Open it and you'll find clearly labelled sections for every scene:

| Section in `story.ts`      | What it controls                                            |
| -------------------------- | ----------------------------------------------------------- |
| `meta`                     | Page title, the "for Aaru" eyebrow, loading caption         |
| `intro.lines`              | The five opening lines + `buttonText` ("Enter Our Story")   |
| `universe`                 | "Welcome to our little universe." + the gratitude verse     |
| `chapters[]`               | Scene 3 — chapter titles, descriptions, photo paths         |
| `memories[]`               | Scene 4 — photo paths + title / date / description          |
| `poses[]`                  | Scene 5 — titles & descriptions of the four moments         |
| `reasons.items[]`          | Scene 6 — the 20 "things I love about Aaru" (editable)      |
| `future.lines` + `future.cards[]` | Scene 7 — dawn lines + the five future cards         |
| `letter.greeting` + `letter.lines[]` | Scene 8 — the full letter, line by line     |
| `finale`                   | Scene 9 — "Aaru ❤️", the closing lines, "Always.", replay   |
| `navigation[]`             | The nine chapter labels used by the progress rail           |

Lines appear one at a time; each entry can set `hold` (milliseconds on
screen) and `accent` (larger, rose-coloured). In `letter.lines`, an empty
string `''` becomes a breathing gap between paragraphs.

---

## 4. How to replace the 3D characters

By default the experience uses **procedural stylised characters** — elegant
dark silhouettes with velvet-sheen clothing, subtle idle animation
(breathing, sway, gaze) and four choreographed moments. They are artistic
figures, not realistic portraits, and they are entirely original — no
copyrighted assets are used.

**To use your own GLB/GLTF models later:**

1. Put your models in a new folder, e.g. `public/models/aaru.glb` and
   `public/models/me.glb`.
   Only use models you have the rights to (e.g. self-made, CC0, or
   purchased with a licence that allows this use).
2. Point to them in `src/data/story.ts`:

   ```ts
   characters: {
     female: { name: 'Aaru', glb: '/models/aaru.glb', scale: 1, rotationY: 0 },
     male:   { name: 'you',  glb: '/models/me.glb',  scale: 1, rotationY: 0 },
   }
   ```

3. Tune `scale` and `rotationY` so the model stands on the floor facing the
   camera. Positions, lighting, shadows and camera work are handled for you.

Models are loaded with `useGLTF` from drei; the procedural figure is used
automatically whenever `glb` is `null`.

> Tip: pose choreography (standing / looking / walking / sitting) applies to
> the procedural figures. GLB models use their own animations — a hook for
> those lives in `src/components/characters/CharacterPair.tsx`.

---

## 5. How to deploy

The build is a fully static site — any static host works.

```bash
npm run build     # outputs dist/
```

- **Netlify** — drag the `dist` folder in, or connect the repo
  (build command `npm run build`, publish directory `dist`).
- **Vercel** — framework preset "Vite"; build `npm run build`, output `dist`.
- **GitHub Pages** — set `base: '/<repo-name>/'` in `vite.config.ts`,
  build, and publish `dist` (e.g. with the `gh-pages` package).
- **Any server / CDN** — upload the contents of `dist/`.

No environment variables, no backend, no API keys needed.

---

## 6. How to change the music

By default the experience synthesises a **soft generative ambience** with the
Web Audio API — slow warm pads, a whisper of filtered noise and occasional
distant chimes. Nothing is streamed and nothing is copyrighted. It starts
after "Enter Our Story" is clicked (browser autoplay rules require a user
gesture) and can be muted any time with the speaker icon (or the `M` key).

**To use your own track:**

1. Add your audio file, e.g. `public/music/our-song.mp3`
   (use a file you have the rights to).
2. In `src/data/story.ts`:

   ```ts
   audio: {
     src: '/music/our-song.mp3',
     volume: 0.5,
   }
   ```

The track loops; `volume` is 0–1.

---

## 7. How to customize the colors

All colors are centralised in `src/data/story.ts` under `theme`:

```ts
theme: {
  background: '#050406',   // deep night
  ink: '#efe6ec',          // primary text
  rose: '#c98aa0',         // soft dusty rose — accents, particles
  roseGlow: '#e8a8bd',     // brighter rose — glows
  burgundy: '#5a1f30',     // deep wine — rim light
  burgundyLight: '#8a3a52',
  gold: '#d9b08c',         // warm candle accent
  dawn: '#c97a55',         // dawn horizon (Scene 7)
  dawnSky: '#1c1018',
}
```

Change a hex value and the **entire universe follows** — the 3D lighting
rigs, star colors, the heart constellation, the sky gradients, and every DOM
interface element read from this object. Keep values deep and desaturated
for the cinematic look; bright pinks will fight the mood.

---

## 8. Project structure

```
aaru-universe/
├── public/
│   ├── favicon.svg
│   ├── grain.svg                 # film grain texture
│   └── memories/                 # THE PHOTOS (replace these)
├── src/
│   ├── assets/                   # flourish divider (SVG)
│   ├── components/
│   │   ├── CanvasRoot.tsx        # the <Canvas>, DPR, WebGL context care
│   │   ├── CameraDirector.tsx    # all camera choreography
│   │   ├── ErrorBoundary.tsx     # falls back to the 2D experience
│   │   ├── Experience.tsx        # composition root
│   │   ├── characters/           # procedural figures, poses, GLB swap
│   │   ├── effects/              # starfield, heart, beams, sky, post FX…
│   │   └── ui/                   # loading, veil, rail, lightbox, cursor…
│   ├── data/
│   │   └── story.ts              # ★ ALL PERSONAL CONTENT LIVES HERE
│   ├── hooks/                    # navigation, staged text, camera shots
│   ├── scenes/                   # the nine 3D scenes + router + 2D fallback
│   ├── sections/                 # the DOM overlays (typography) per scene
│   ├── state/experience.ts       # zustand store — the flow of the film
│   ├── styles/index.css          # fonts, cinematic helpers
│   ├── types/                    # shared TypeScript types
│   └── utils/                    # audio engine, textures, detection, math
├── index.html
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

Scenes 3–9 are lazy-loaded (code splitting); the three.js stack is its own
vendor chunk.

---

## 9. Controls, accessibility & performance

**Controls**

- Scroll / swipe / arrow keys — move between scenes
- Click or tap staged lines — reveal the next line sooner
- Click glowing chapters, photo frames and floating cards — interact
- `Esc` — close the photo lightbox; arrows navigate it (swipe on touch)
- `M` — mute / unmute; `R` — replay (from the finale)

**Accessibility**

- Real DOM text throughout (screen-reader friendly), focus-visible rings,
  `aria` labels on all controls, keyboard navigation everywhere.
- `prefers-reduced-motion` is respected: camera moves become cuts,
  particles settle, pulses stop.

**Performance**

- Adaptive quality tiers (device-based) with reduced particle counts and
  no depth-of-field on mobile; DPR is clamped (1.4–1.8).
- One-draw-call starfields (custom shader), instanced sprites for glows,
  cheap fake-volumetric light cones instead of real volumetrics.
- Photos are preloaded with a real progress screen, then served from cache.
- If WebGL is unavailable (or the context is lost), the experience
  automatically switches to a beautiful CSS-crafted 2D version with the
  same story, chapters, gallery and letter.

---

## 10. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Photos don't show | File names in `public/memories/` must match `story.ts` exactly (case-sensitive). |
| No sound | Browsers require a click before audio — audio starts at "Enter Our Story"; check the speaker icon / `M`. |
| Looks flat / gray on an old device | The medium quality tier disables depth-of-field and shadows by design. |
| White screen | Run `npm install` then `npm run dev`; check the browser console; the 2D fallback appears if WebGL is blocked. |
| Text feels small on a phone | The mobile composition is intentional — rotate to landscape for the gallery scene if you prefer. |

Made with intention, for Aarju.
