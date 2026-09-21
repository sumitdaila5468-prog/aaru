/* ==================================================================
 *  MEMORIES — personal photos for Aaru's gallery
 *
 *  Replace the placeholder images in public/memories/ with your own
 *  photos, keeping the same filenames — or edit the `image` / `src`
 *  paths here. No other file needs to be touched.
 *
 *  The structure supports both `image` (spec) and `src` (legacy) so
 *  existing components keep working while new code can use `image`.
 * ================================================================== */

export interface MemoryEntry {
  id: string
  /** canonical image path — preferred field (spec) */
  image: string
  /** alias for backwards compatibility */
  src: string
  title: string
  date: string
  description: string
  /** cinematic framing hint */
  objectPosition?: string
}

function m(
  id: string,
  image: string,
  title: string,
  date: string,
  description: string,
  objectPosition?: string,
): MemoryEntry {
  return { id, image, src: image, title, date, description, objectPosition }
}

/**
 * CENTRALIZED PHOTO CONFIG — every real photo lives here.
 * Paths are raw (e.g. /memories/...) and are resolved via withBase() at render time,
 * ensuring correct loading under GitHub Pages subpath (/aaru/).
 * Images are real photos from public/memories/ — all portrait, preserved aspect.
 */
export const memories: MemoryEntry[] = [
  m(
    'memory-01',
    '/memories/memory-01.jpg',
    'Where it began',
    'that first hello',
    'The first message — small, quiet, and somehow unforgettable.',
    '50% 28%',
  ),
  m(
    'memory-02',
    '/memories/memory-02.jpg',
    'The favourite',
    'a day we kept',
    'The laugh that stayed longer than the moment itself.',
    '50% 22%',
  ),
  m(
    'memory-03',
    '/memories/memory-03.jpg',
    'The funny one',
    'we still laugh about',
    'A little chaos that became a favourite story.',
    '50% 30%',
  ),
  m(
    'memory-04',
    '/memories/memory-04.jpg',
    'A soft day',
    'worth remembering',
    'Slower, brighter — the kind of day you keep exactly as it was.',
    '50% 28%',
  ),
  m(
    'memory-05',
    '/memories/memory-05.jpg',
    'Recent',
    'still close',
    'Close enough to feel, far enough to know it mattered.',
    '50% 24%',
  ),
  m(
    'memory-06',
    '/memories/memory-06.jpg',
    'Always us',
    'always',
    'Just us — and that is enough.',
    '50% 32%',
  ),
]

/** Optional helper — use when a component expects image field */
export function getMemoryImage(entry: MemoryEntry): string {
  return entry.image ?? entry.src
}
