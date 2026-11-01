/* ------------------------------------------------------------------ */
/*  Theme — hex to "r g b" triplet for CSS custom properties            */
/* ------------------------------------------------------------------ */

export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return '255 255 255'
  return `${r} ${g} ${b}`
}
