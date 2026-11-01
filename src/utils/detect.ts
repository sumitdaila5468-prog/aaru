/* ------------------------------------------------------------------ */
/*  Environment detection — WebGL support, device tier, URL flags      */
/* ------------------------------------------------------------------ */

import type { Quality } from '../types'

export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

export function detectMobile(): boolean {
  if (typeof window === 'undefined') return false
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  return coarse || window.innerWidth < 768
}

export function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function detectQuality(mobile: boolean): Quality {
  if (mobile) return 'medium'
  const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency ?? 4) : 4
  const webgl2 = (() => {
    try {
      return !!document.createElement('canvas').getContext('webgl2')
    } catch {
      return false
    }
  })()
  if (!webgl2 || cores <= 4) return 'medium'
  return 'high'
}

/** Debug / support flags: ?force2d=1, ?lowquality=1 */
export function urlFlag(name: string): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get(name) === '1'
}
