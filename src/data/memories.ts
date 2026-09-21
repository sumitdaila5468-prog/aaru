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
}

function m(
  id: string,
  image: string,
  title: string,
  date: string,
  description: string,
): MemoryEntry {
  return { id, image, src: image, title, date, description }
}

export const memories: MemoryEntry[] = [
  m(
    'memory-01',
    '/memories/memory-01.jpg',
    'Memory One',
    'add a date',
    'A few words about this moment…',
  ),
  m(
    'memory-02',
    '/memories/memory-02.jpg',
    'Memory Two',
    'add a date',
    'A few words about this moment…',
  ),
  m(
    'memory-03',
    '/memories/memory-03.jpg',
    'Memory Three',
    'add a date',
    'A few words about this moment…',
  ),
  m(
    'memory-04',
    '/memories/memory-04.jpg',
    'Memory Four',
    'add a date',
    'A few words about this moment…',
  ),
  m(
    'memory-05',
    '/memories/memory-05.jpg',
    'Memory Five',
    'add a date',
    'A few words about this moment…',
  ),
  m(
    'memory-06',
    '/memories/memory-06.jpg',
    'Memory Six',
    'add a date',
    'A few words about this moment…',
  ),
]

/** Optional helper — use when a component expects image field */
export function getMemoryImage(entry: MemoryEntry): string {
  return entry.image ?? entry.src
}
