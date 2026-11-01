# Happy Birthday, Aarju! ❤️

A personal, interactive birthday universe made by Sumit for Aarju — birthday **3 November**.

## GitHub Pages deployment (recommended)

This repository includes `.github/workflows/deploy.yml`. It automatically builds and deploys the site to GitHub Pages whenever you push to the `main` branch.

1. Create a GitHub repository and upload/push **all files inside this project folder** (including `src`, `public`, `package.json`, `package-lock.json`, and `.github`). Do not upload `node_modules` or `dist`.
2. Open the repository on GitHub → **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push your code to the `main` branch. Open the repository's **Actions** tab and wait for “Deploy birthday website to GitHub Pages” to finish successfully.
5. Open the Pages URL shown in **Settings → Pages**.

The Vite build uses a relative base (`./`), so it supports both `https://USERNAME.github.io/REPOSITORY/` project sites and a GitHub Pages user/organization site. Do not change the base to a hard-coded repository name unless you know you need to.

## Run and test locally

Requires Node.js 18 or newer (Node.js 20 LTS recommended).

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run preview
```

Open the local URL printed by Vite. The deploy workflow runs the production build automatically; `dist/` is the publish directory.

## Experience included

- Birthday landing screen and live annual countdown to 3 November.
- Personal photo gallery, memory vault and fullscreen photo viewer.
- Love room, relationship games, 100 reasons, romantic letter and surprise boxes.
- Compliment machine, mood buttons, hidden-heart hunt and secret room.
- Future wishes, proposal moment and final birthday message.
- Optional soundtrack (`public/music/our-song.mp3`), started only after the visitor taps a control (browser autoplay restrictions).
- Responsive mobile, tablet and desktop layouts.

## Personalize

- Photos: replace `public/memories/memory-01.jpg` through `memory-06.jpg` (keep filenames). The four `chapter-*.jpg` files are retained for the optional cinematic scene experience.
- Captions and memory order: `src/data/memories.ts` and `src/data/websiteContent.ts`.
- Birthday date: `src/website/sections/BirthdayCountdown.tsx` (currently 3 November, repeats annually in the visitor's local timezone).
- Main landing copy: `src/website/sections/HomeHero.tsx`.
- Love notes, games, reasons and final message: `src/data/websiteContent.ts`.
- Music: replace `public/music/our-song.mp3` with audio you have permission to use; keep the same filename.

## Technical notes

- Static frontend only: no server, database, API key or paid backend is required.
- `src/App.tsx` mounts `src/Website.tsx`; `src/scenes/` and `src/sections/` contain retained cinematic/legacy components.
- `.gitignore` excludes dependencies, build output, local environment files and logs.
- Preview the deployed Pages URL on both a phone and desktop before sharing it.


## Birthday celebration redesign

The landing experience is a birthday-first celebration with a live countdown to 3 November, party confetti, photo collage, music control, first-gift message, birthday-world cards, and a six-photo strip. The original memory vault, 100 reasons, letter, games, surprise boxes, secret room, future section, and finale remain available below.

### GitHub Pages

This project is a static Vite + React site. Keep the repository root structure intact, commit changes to `main`, and let `.github/workflows/deploy.yml` build and publish the `dist` folder. Asset URLs use `import.meta.env.BASE_URL` through `withBase()` for GitHub Pages compatibility.
