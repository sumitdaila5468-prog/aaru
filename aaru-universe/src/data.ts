/* ==================================================================
 *  data.ts — single source of truth for Aaru's universe
 *  All personal content lives here. Edit this file, nothing else.
 *  Kept minimal: memories, future, letter — the story's heart.
 * ================================================================== */

export const memories = [
  {
    id: 'memory-01',
    image: '/memories/memory-01.jpg',
    src: '/memories/memory-01.jpg',
    title: 'Where it began',
    date: 'that first hello',
    description: 'The first message — small, quiet, and somehow unforgettable.',
  },
  {
    id: 'memory-02',
    image: '/memories/memory-02.jpg',
    src: '/memories/memory-02.jpg',
    title: 'The favorite',
    date: 'a day we kept',
    description: 'The laugh that stayed longer than the moment itself.',
  },
  {
    id: 'memory-03',
    image: '/memories/memory-03.jpg',
    src: '/memories/memory-03.jpg',
    title: 'The funny one',
    date: 'we still laugh about',
    description: 'A little chaos that became a favourite story.',
  },
  {
    id: 'memory-04',
    image: '/memories/memory-04.jpg',
    src: '/memories/memory-04.jpg',
    title: 'A special day',
    date: 'worth remembering',
    description: 'Slower, brighter — the kind of day you keep exactly as it was.',
  },
  {
    id: 'memory-05',
    image: '/memories/memory-05.jpg',
    src: '/memories/memory-05.jpg',
    title: 'Recent',
    date: 'still close',
    description: 'Close enough to feel, far enough to know it mattered.',
  },
  {
    id: 'memory-06',
    image: '/memories/memory-06.jpg',
    src: '/memories/memory-06.jpg',
    title: 'Us',
    date: 'always',
    description: 'Just us — and that is enough.',
  },
] as const

export const futureLines = [
  'More places.',
  'More late-night conversations.',
  'More random adventures.',
  'More memories.',
  'More us.',
] as const

export const finalMessage = {
  lines: [
    { text: 'Aaru...', hold: 2200, accent: true },
    { text: "I don't know if a website can explain", hold: 2000 },
    { text: 'what you mean to me.', hold: 2100 },
    { text: '' },
    { text: 'But I wanted to create', hold: 1800 },
    { text: 'one little place...', hold: 1900 },
    { text: '...that belongs only to our story.', hold: 2400 },
    { text: '' },
    { text: 'Thank you for being you.', hold: 2600 },
    { text: '' },
    { text: 'Out of everything this world', hold: 2000 },
    { text: 'could have given me...', hold: 2100 },
    { text: "I'm grateful it gave me you.", hold: 2800 },
    { text: '' },
    { text: 'Always. ❤️', hold: 3200, accent: true },
  ],
} as const

// Re-export for compatibility — so existing story.ts keeps working
export { memories as memoriesLegacy } from './data/memories'
export { charactersConfig } from './data/characters'
