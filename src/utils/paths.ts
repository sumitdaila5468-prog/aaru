/**
 * Centralized asset path helper — handles GitHub Pages base path correctly.
 *
 * With vite.config.ts `base: '/aaru/'`, absolute URLs like `/memories/foo.jpg`
 * must be resolved against import.meta.env.BASE_URL or they 404 on GH Pages.
 * This helper ensures every photo loads reliably in production AND dev.
 */

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/'
  // Remove leading slash from path, ensure base ends with slash
  const cleanPath = path.replace(/^\//, '')
  const cleanBase = base.endsWith('/') ? base : `${base}/`
  return `${cleanBase}${cleanPath}`
}

/** Convenience for memories public folder */
export function memoryUrl(fileName: string): string {
  return withBase(`memories/${fileName}`)
}

export function grainUrl(): string {
  return withBase('grain.svg')
}
export function faviconUrl(): string {
  return withBase('favicon.svg')
}
