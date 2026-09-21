/* ==================================================================
 *  STORY — every word of this little universe lives in this file.
 *
 *  Edit anything below and the whole experience updates.
 *  Only this file (plus the photos in public/memories) is personal.
 * ================================================================== */

import type {
  ChapterData,
  FutureCard,
  PoseLabel,
  ReasonItem,
  StagedLine,
} from '../types'
import { memories as memoryEntries } from './memories'
import { charactersConfig } from './characters'

export const story = {
  /* --------------------------------------------------------------
   * META
   * -------------------------------------------------------------- */
  meta: {
    title: 'Aaru — A Little Universe',
    madeFor: 'Aarju',
    eyebrow: 'for Aaru',
    loadingCaption: 'Creating our little universe…',
  },

  /* --------------------------------------------------------------
   * THEME — change the colours and the entire universe follows
   * (3D lighting, particles and the DOM UI all read from here)
   * -------------------------------------------------------------- */
  theme: {
    // Romantic Luxury palette — dreamy fantasy + premium 3D film
    background: '#5A1832', // deep wine — contrast depth, not black
    backgroundLight: '#FFF7F8', // primary — soft blush page base
    blush: '#FFE8EE', // soft blush
    blushMid: '#F8C8D4', // dusty rose
    rose: '#EFA7B8', // romantic rose — main accent
    roseGlow: '#F8C8D4', // soft rose glow
    cream: '#FFFDFB', // warm cream — neutral
    creamWarm: '#FFE8C7', // warm highlight
    burgundy: '#7A2945', // deep accent — wine
    burgundyLight: '#9E3D5C', // lighter wine
    burgundyDeep: '#5A1832', // deepest wine
    gold: '#FFD6A5', // rose-gold warm highlight
    goldSoft: '#FFE8C7',
    lavender: '#E8D9FF', // soft lavender — dreamy
    dawn: '#FF8A6B', // warm sunset horizon — peach/coral
    dawnSky: '#FFE8EE', // dawn sky base — soft pink
    dawnGold: '#FFD6A5', // warm sunlight
    ink: '#FFF7F8', // primary text on dark — blush cream
    inkDark: '#5A1832', // text on light — deep wine
    night: '#5A1832',
  },

  /* --------------------------------------------------------------
   * AUDIO — cinematic music player
   * Uses /public/music/our-song.mp3 — replace this file with your own
   * song (keep same name). No code change needed. Starts only after
   * user clicks "Enter our universe". Gracefully fails if missing.
   * -------------------------------------------------------------- */
  audio: {
    src: '/music/our-song.mp3' as string | null,
    volume: 0.62,
  },

  /* --------------------------------------------------------------
   * CHARACTERS — now driven by src/data/characters.ts
   * Edit appearance there; GLB swap still works (see README §4).
   * These are fictional artistic representations, not exact
   * real-life likenesses.
   * -------------------------------------------------------------- */
  characters: {
    female: {
      name: charactersConfig.aaru.name,
      nickname: charactersConfig.aaru.nickname,
      glb: charactersConfig.aaru.glb as string | null,
      scale: charactersConfig.aaru.scale,
      rotationY: charactersConfig.aaru.rotationY,
      /* full config — appearance is resolved from charactersConfig */
      appearance: charactersConfig.aaru,
    },
    male: {
      name: charactersConfig.partner.name,
      glb: charactersConfig.partner.glb as string | null,
      scale: charactersConfig.partner.scale,
      rotationY: charactersConfig.partner.rotationY,
      appearance: charactersConfig.partner,
    },
  },

  /* --------------------------------------------------------------
   * NAVIGATION — 16 cinematic chapters: premium romantic short film
   * Chronology preserved: Photo 1→01, Photo 2→02, etc.
   * -------------------------------------------------------------- */
  navigation: [
    { label: 'For Aaru' },          // 0 Intro
    { label: 'Our Beginning' },     // 1 Beginning
    { label: '01' },                // 2 Photo 1
    { label: '02' },                // 3 Photo 2
    { label: '03' },                // 4 Photo 3
    { label: '04' },                // 5 Photo 4
    { label: '05' },                // 6 Photo 5
    { label: '06' },                // 7 Photo 6
    { label: 'Our World' },         // 8 Our World
    { label: 'Our Future' },        // 9 Future
    { label: 'My Letter' },         // 10 Letter
    { label: 'Proposal' },          // 11 Proposal
    { label: 'Yes' },               // 12 Yes
    { label: 'Next Chapter' },      // 13 Post-Yes
    { label: 'Forever' },           // 14 Final Photo
    { label: 'The End' },           // 15 Replay
  ],

  /* --------------------------------------------------------------
   * SCENE 0 — CINEMATIC OPENING: For Aaru — golden-hour pull-back
   * Rich champagne / dusty rose / deep burgundy / golden light.
   * -------------------------------------------------------------- */
  intro: {
    lines: [
      { text: 'For Aaru', hold: 2400, accent: true },
      { text: 'A little universe made for you.', hold: 2800 },
    ] as StagedLine[],
    buttonText: 'Enter our universe ♡',
    hint: 'headphones recommended · scroll, swipe or arrow keys to continue',
    subtitle: 'A little universe made for you.',
  },

  /* --------------------------------------------------------------
   * SCENE 1 — OUR BEGINNING: warm golden hour, the start
   * -------------------------------------------------------------- */
  beginning: {
    lines: [
      { text: 'Our Beginning', hold: 2000, accent: true },
      { text: 'It started with a moment', hold: 2000 },
      { text: "I didn't know would become", hold: 1800 },
      { text: 'a memory I would keep forever.', hold: 2400 },
      { text: 'Somehow, that moment became', hold: 2000 },
      { text: 'the beginning of our story.', hold: 2800 },
    ] as StagedLine[],
  },

  /* --------------------------------------------------------------
   * SCENE 8 — OUR WORLD: elegant, warm, heartfelt
   * -------------------------------------------------------------- */
  universe: {
    welcome: 'Our World',
    subtitle: 'a little universe',
    verse: [
      'Some moments become memories.',
      'Some memories become home.',
      'And some become a part of your world.',
    ],
  },
  ourWorld: {
    lines: [
      { text: 'Our World', hold: 2000, accent: true },
      { text: 'Some moments become memories.', hold: 2000 },
      { text: 'Some memories become home.', hold: 2200 },
      { text: 'And some become a part of your world.', hold: 2600 },
    ] as StagedLine[],
  },

  /* --------------------------------------------------------------
   * SCENE 3 — MEMORY JOURNEY (40–60s, floating points)
   * Each memory: camera approaches → light increases → photo → text
   * → soft transition → return. Use placeholders below.
   * -------------------------------------------------------------- */
  chapters: [
    {
      id: 'beginning',
      index: 'Memory 01',
      title: 'Beginning',
      photo: '/memories/chapter-01.jpg',
      description:
        'Where it all began — the first hello, the first laugh, the quiet start of something you only understood later.',
    },
    {
      id: 'favorite-moment',
      index: 'Memory 02',
      title: 'Favorite moment',
      photo: '/memories/chapter-02.jpg',
      description:
        'The favourite — the one you keep coming back to, the one that still makes you smile without trying.',
    },
    {
      id: 'funny-memory',
      index: 'Memory 03',
      title: 'Funny memory',
      photo: '/memories/chapter-03.jpg',
      description:
        'The laugh you did not expect — the little chaos that became a favourite story.',
    },
    {
      id: 'special-day',
      index: 'Memory 04',
      title: 'Special day',
      photo: '/memories/chapter-04.jpg',
      description:
        'A day that felt different — slower, brighter, the kind you want to remember exactly as it was.',
    },
    {
      id: 'recent-memory',
      index: 'Memory 05',
      title: 'Recent memory',
      photo: '/memories/memory-05.jpg',
      description:
        'The most recent — close enough to still feel, far enough to know it mattered.',
    },
  ] as ChapterData[],

  /* --------------------------------------------------------------
   * SCENE 4 — AARU'S MEMORIES
   * Single source of truth: src/data/memories.ts
   * Replace images in public/memories/ or edit that file.
   * Portrait 4:5 (1200×1500) looks best.
   * -------------------------------------------------------------- */
  memories: memoryEntries as unknown as import('../types').MemoryItem[],

  /* --------------------------------------------------------------
   * PHOTO CHAPTERS — each photo its own cinematic scene
   * Each entry defines its own mood, lighting, camera.
   * -------------------------------------------------------------- */
  photoScenes: [
    {
      id: 'the-beginning',
      label: 'The Beginning',
      memoryIndex: 0,
      environment: 'sunset' as const,
      mood: 'warm indoor cinematic',
      title: 'The Beginning',
      subtitle: 'where it all began',
    },
    {
      id: 'that-smile',
      label: 'That Smile',
      memoryIndex: 1,
      environment: 'garden' as const,
      mood: 'soft sunset outdoor',
      title: 'That Smile',
      subtitle: 'the favourite we keep',
    },
    {
      id: 'little-moments',
      label: 'Little Moments',
      memoryIndex: 2,
      environment: 'dream' as const,
      mood: 'dreamy night',
      title: 'Our Little Moments',
      subtitle: 'the funny one',
    },
    {
      id: 'the-memory',
      label: 'The Memory',
      memoryIndex: 3,
      environment: 'dawn' as const,
      mood: 'elegant warm cinematic',
      title: 'The Memory',
      subtitle: 'a soft day',
    },
    {
      id: 'us',
      label: 'Us',
      memoryIndex: 4,
      environment: 'sunset' as const,
      mood: 'deep twilight',
      title: 'Us',
      subtitle: 'still close',
    },
    {
      id: 'always',
      label: 'Always',
      memoryIndex: 5,
      environment: 'night' as const,
      mood: 'dark romantic with warm highlights',
      title: 'Always',
      subtitle: 'our little universe',
    },
  ],

  /* --------------------------------------------------------------
   * SCENE 5 — TWO CHARACTERS — seven cinematic poses
   * -------------------------------------------------------------- */
  poses: [
    {
      key: 'standing-apart',
      title: 'Standing separately',
      description: 'Two figures, one sky — before they find each other.',
    },
    {
      key: 'standing',
      title: 'Standing together',
      description: 'Two people, one quiet sky — where we usually are.',
    },
    {
      key: 'looking',
      title: 'Looking at each other',
      description: 'The moment the world goes quiet.',
    },
    {
      key: 'walking',
      title: 'Walking together',
      description: 'Not the destination — the walking itself.',
    },
    {
      key: 'sitting',
      title: 'Sitting under the stars',
      description: 'The stars are better shared.',
    },
    {
      key: 'horizon',
      title: 'Looking toward the horizon',
      description: 'Something beautiful is still ahead.',
    },
    {
      key: 'final',
      title: 'Together, while the world grows',
      description: 'The camera pulls away — they stay.',
    },
  ] as PoseLabel[],

  /* --------------------------------------------------------------
   * SCENE 6 — LITTLE REASONS
   * Twenty placeholders. Replace each with your own reasons.
   * -------------------------------------------------------------- */
  reasons: {
    eyebrow: 'little reasons, one at a time',
    title: 'Things I love about Aaru',
    items: [
      { text: 'Your smile.' },
      { text: 'The way you make ordinary moments special.' },
      { text: 'The person you are.' },
      { text: 'The sound of your laugh.' },
      { text: 'The way you see the world.' },
      { text: 'Your kindness — quiet and constant.' },
      { text: 'How time feels different with you.' },
      { text: 'Your courage.' },
      { text: 'The comfort of simply being with you.' },
      { text: 'Your patience with me.' },
      { text: 'The little things you notice.' },
      { text: 'The way you make hard days lighter.' },
      { text: 'Your honesty.' },
      { text: 'How you make me want to be better.' },
      { text: 'The warmth you carry with you.' },
      { text: 'Your dreams — and how you chase them.' },
      { text: 'How a message from you changes my whole day.' },
      { text: 'Your strength.' },
      { text: 'Every version of you I have met so far.' },
      { text: 'And every version still to come.' },
    ] as ReasonItem[],
  },

  /* --------------------------------------------------------------
   * SCENE 9 — OUR FUTURE: deep sunset → twilight → night
   * -------------------------------------------------------------- */
  future: {
    lines: [
      { text: 'More moments.', hold: 1600 },
      { text: 'More memories.', hold: 1600 },
      { text: 'More ordinary days', hold: 2000 },
      { text: 'that become beautiful', hold: 1800 },
      { text: 'because they are with you.', hold: 2600 },
    ] as StagedLine[],
    cards: [
      { title: 'More places', subtitle: 'the map is still unwritten' },
      { title: 'More laughs', subtitle: 'the ordinary, together' },
      { title: 'More memories', subtitle: 'always more' },
      { title: 'Quiet moments', subtitle: 'just us, just stillness' },
      { title: 'Adventures', subtitle: 'no plan, just us' },
    ] as FutureCard[],
  },

  /* --------------------------------------------------------------
   * SCENE 10 — MY LETTER: cinematic line-by-line reveal
   * -------------------------------------------------------------- */
  letter: {
    greeting: 'Aaru…',
    lines: [
      "I don't know what every tomorrow",
      'will look like.',
      '',
      'But I know one thing…',
      '',
      'I want more ordinary days',
      'that somehow become extraordinary',
      "because you're there.",
      '',
      'More laughs.',
      '',
      'More memories.',
      '',
      'More us.',
      '',
      'Forever yours. ❤️',
    ],
    continueHint: 'one last question…',
  },

  /* --------------------------------------------------------------
   * SCENE 5 — AARU MOMENT (20s, solo under stars)
   * -------------------------------------------------------------- */
  aaruMoment: {
    lines: [
      { text: 'Aaru...', hold: 2000, accent: true },
      { text: 'Some people become memories.', hold: 2200 },
      { text: 'Some become home.', hold: 2000 },
      { text: 'And some become a part of your world.', hold: 2400 },
    ] as StagedLine[],
  },

  /* --------------------------------------------------------------
   * SCENE 11 — ROMANTIC PROPOSAL: emotional climax
   * -------------------------------------------------------------- */
  proposal: {
    lines: [
      { text: 'Aaru…', hold: 2000, accent: true },
      { text: 'I have one last question.', hold: 2600 },
    ] as StagedLine[],
    question: 'Will you choose me,\nagain and again,\nin every version of our story?',
    yesLabel: 'YES ❤️',
    noLabel: 'NO 🙈',
    noMessages: [
      'No? Are you sure? 🥺',
      'Think again 😂',
      'Wrong button 😌',
      'Nice try ❤️',
      "I'm pretty sure you meant YES.",
      'System says: suspicious answer detected 😭',
      "Okay… I'll ask one more time.",
    ],
  },

  /* --------------------------------------------------------------
   * SCENE 12 — YES: She said yes
   * -------------------------------------------------------------- */
  yes: {
    lines: [
      { text: 'She said yes. ❤️', hold: 2600, accent: true },
      { text: "Then let's make every ordinary moment", hold: 2200 },
      { text: 'a little more beautiful.', hold: 2200 },
      { text: 'Welcome to forever.', hold: 2800, accent: true },
    ] as StagedLine[],
  },

  /* --------------------------------------------------------------
   * SCENE 13 — POST-YES: Our Next Chapter
   * -------------------------------------------------------------- */
  postYes: {
    intro: 'OUR NEXT CHAPTER',
    lines: [
      { text: 'More sunsets.', hold: 1800 },
      { text: 'More random laughs.', hold: 1800 },
      { text: 'More stupid little fights.', hold: 1800 },
      { text: 'More making up.', hold: 1800 },
      { text: 'More memories.', hold: 1800 },
      { text: 'More us.', hold: 2200, accent: true },
    ] as StagedLine[],
    closing: 'Aaru × Forever',
  },

  /* --------------------------------------------------------------
   * SCENE 14 — FINAL PHOTO: strongest real photo
   * -------------------------------------------------------------- */
  finalPhoto: {
    lines: [
      { text: 'If I had to choose my favorite place', hold: 2200 },
      { text: 'in every universe…', hold: 2000 },
      { text: 'it would still be', hold: 1800 },
      { text: 'beside you.', hold: 2400 },
      { text: 'Forever yours, Aaru. ❤️', hold: 3200, accent: true },
    ] as StagedLine[],
  },

  /* Hidden easter egg near final */
  easterEgg: {
    hint: 'You found the secret.',
    lines: [
      { text: 'One more thing…', hold: 2000 },
      { text: "I'd still choose you.", hold: 2200 },
      { text: 'Every single time. ❤️', hold: 2800, accent: true },
    ] as StagedLine[],
  },

  /* --------------------------------------------------------------
   * SCENE 15 — REPLAY: The End / Beginning
   * -------------------------------------------------------------- */
  replay: {
    title: 'THE END',
    subtitle: '...or maybe just the beginning.',
    buttonText: 'Replay our story ↻',
  },

  /* --------------------------------------------------------------
   * SCENE 9 — FINAL MESSAGE (legacy, kept for compatibility)
   * -------------------------------------------------------------- */
  finale: {
    title: 'Aaru ❤️',
    lines: [
      { text: 'Wherever life takes us,', hold: 2200 },
      { text: 'I hope I always find', hold: 1800 },
      { text: 'my way back to you.', hold: 2400 },
      { text: 'Forever yours ❤️', hold: 3200, accent: true },
    ] as StagedLine[],
    closing: 'Always.',
    replayLabel: 'Relive our story',
    subline: 'Wherever life takes us, I hope I always find my way back to you.',
  },
}

export type Story = typeof story
