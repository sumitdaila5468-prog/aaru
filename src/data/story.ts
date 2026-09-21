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
   * AUDIO — ambient music
   * By default a soft generative ambience is synthesised in the
   * browser (no audio file needed, nothing copyrighted).
   * To use your own track: drop a file in public/music/ and set
   * src to e.g. '/music/our-song.mp3'.
   * -------------------------------------------------------------- */
  audio: {
    src: null as string | null,
    volume: 0.5,
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
   * NAVIGATION — five cinematic chapters (simplified)
   * -------------------------------------------------------------- */
  navigation: [
    { label: 'Entrance' },
    { label: 'Our World' },
    { label: 'Memories' },
    { label: 'Our Future' },
    { label: 'Always' },
  ],

  /* --------------------------------------------------------------
   * SCENE 1 — DARKNESS (10–15s, continuous film opening)
   * Starts dark → tiny particles → soft ambient → stars fade in.
   * Text appears slowly, never overloaded.
   * -------------------------------------------------------------- */
  intro: {
    lines: [
      { text: 'Some moments stay.', hold: 1800 },
      { text: 'Some people do too.', hold: 1800 },
      { text: 'Aaru...', hold: 2000, accent: true },
      { text: 'I made something for you.', hold: 2200 },
    ] as StagedLine[],
    buttonText: 'Enter',
    hint: 'headphones recommended · scroll, swipe or arrow keys to continue',
  },

  /* --------------------------------------------------------------
   * SCENE 2 — OUR UNIVERSE (20–30s, slow orbit)
   * Camera reveals stars, soft fog, night, two characters orbiting.
   * -------------------------------------------------------------- */
  universe: {
    welcome: 'Welcome to our little universe.',
    verse: [
      'Out of countless moments...',
      "I'm grateful some became ours.",
    ],
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
   * SCENE 7 — FUTURE (20–30s, night → dawn)
   * -------------------------------------------------------------- */
  future: {
    lines: [
      { text: 'Some memories already exist.', hold: 1800 },
      { text: 'Some are waiting for us.', hold: 2000 },
    ] as StagedLine[],
    cards: [
      { title: 'New places', subtitle: 'the map is still unwritten' },
      { title: 'More laughs', subtitle: 'the ordinary, together' },
      { title: 'More memories', subtitle: 'always more' },
      { title: 'Quiet moments', subtitle: 'just us, just stillness' },
      { title: 'Adventures', subtitle: 'no plan, just us' },
    ] as FutureCard[],
  },

  /* --------------------------------------------------------------
   * SCENE 8 — FINAL LETTER
   * The letter reveals itself line by line. Use '' for a breathing
   * gap between paragraphs.
   * -------------------------------------------------------------- */
  letter: {
    greeting: 'Dear Aaru…',
    lines: [
      'I don’t know if a website can ever explain',
      'everything someone means to you.',
      '',
      'But I wanted to create this little world',
      'just to remind you of one thing…',
      '',
      'You are special to me.',
      '',
      'Thank you for every smile,',
      'every conversation,',
      'every memory,',
      'and every little moment.',
      '',
      'And if this is only the beginning,',
      'I can’t wait to see what comes next.',
    ],
    continueHint: 'one last thing…',
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
   * SCENE 9 — FINAL CINEMATIC REVEAL
   * -------------------------------------------------------------- */
  finale: {
    title: 'Aaru ❤️',
    lines: [
      { text: 'Out of all the places in this universe…', hold: 2000 },
      { text: 'I’d still choose the one where I found you.', hold: 2200 },
    ] as StagedLine[],
    closing: 'Always.',
    replayLabel: 'Relive it again',
  },
}

export type Story = typeof story
