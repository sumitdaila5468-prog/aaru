/* ------------------------------------------------------------------ */
/*  Canvas-texture factory — glow sprites, reason cards, future cards  */
/*  (text rendered to canvas keeps everything self-contained: no       */
/*  external font downloads at runtime, crisp at 2x)                   */
/* ------------------------------------------------------------------ */

import * as THREE from 'three'

const SERIF = '"Cormorant Garamond", Georgia, serif'
const SANS = 'Inter, system-ui, sans-serif'

let glowTexture: THREE.CanvasTexture | null = null

/** Soft radial glow — warm cream / rose-gold, for halos & bokeh */
export function getGlowTexture(): THREE.CanvasTexture {
  if (glowTexture) return glowTexture
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  gradient.addColorStop(0, 'rgba(255, 214, 165, 0.88)')
  gradient.addColorStop(0.22, 'rgba(239, 167, 184, 0.42)')
  gradient.addColorStop(0.52, 'rgba(255, 232, 238, 0.18)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  glowTexture = new THREE.CanvasTexture(canvas)
  glowTexture.colorSpace = THREE.SRGBColorSpace
  return glowTexture
}

/** Wrap text into lines that fit maxWidth at the given font. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word
    if (ctx.measureText(attempt).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = attempt
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Set canvas letter-spacing where supported (gracefully ignored elsewhere). */
function setLetterSpacing(ctx: CanvasRenderingContext2D, value: string): void {
  const wide = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
  wide.letterSpacing = value
}

function paintCardBase(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rose: string,
): void {
  // luxurious translucent-cream — like premium glass
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#FFFDFB')
  bg.addColorStop(0.45, '#FFF7F8')
  bg.addColorStop(1, '#FFE8EE')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // soft rose-gold inner glow — top right
  const glow = ctx.createRadialGradient(w * 0.78, h * 0.08, 0, w * 0.78, h * 0.08, w * 0.65)
  glow.addColorStop(0, 'rgba(239, 167, 184, 0.18)')
  glow.addColorStop(0.45, 'rgba(255, 214, 165, 0.10)')
  glow.addColorStop(1, 'rgba(255, 253, 251, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  // bottom warm wash
  const warm = ctx.createRadialGradient(w * 0.5, h * 0.95, 0, w * 0.5, h * 0.95, w * 0.55)
  warm.addColorStop(0, 'rgba(255, 214, 165, 0.12)')
  warm.addColorStop(1, 'rgba(255, 253, 251, 0)')
  ctx.fillStyle = warm
  ctx.fillRect(0, 0, w, h)

  // soft cream border — outer
  ctx.strokeStyle = 'rgba(255, 253, 251, 0.95)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(12, 12, w - 24, h - 24)
  // rose-gold hairline — inner
  ctx.strokeStyle = 'rgba(239, 167, 184, 0.42)'
  ctx.lineWidth = 1.2
  ctx.strokeRect(15, 15, w - 30, h - 30)
  ctx.strokeStyle = 'rgba(255, 214, 165, 0.22)'
  ctx.lineWidth = 1
  ctx.strokeRect(26, 26, w - 52, h - 52)

  // corner ticks — rose-gold luxury
  ctx.strokeStyle = rose
  ctx.lineWidth = 1.8
  const t = 34
  const corners: Array<[number, number, number, number, number, number]> = [
    [14, 14 + t, 14, 14, 14 + t, 14],
    [w - 14 - t, 14, w - 14, 14, w - 14, 14 + t],
    [14, h - 14 - t, 14, h - 14, 14 + t, h - 14],
    [w - 14 - t, h - 14, w - 14, h - 14, w - 14, h - 14 - t],
  ]
  for (const [x1, y1, x2, y2, x3, y3] of corners) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x3, y3)
    ctx.stroke()
  }
}

export interface CardTextureOptions {
  /** small caps eyebrow, e.g. "REASON" */
  eyebrow?: string
  /** big serif number, e.g. "07" */
  number?: string
  /** main message */
  text: string
  /** italic sub-line under the text */
  subtitle?: string
  width?: number
  height?: number
}

/** A floating "reason" / "future" card rendered to a canvas texture — luxury glass. */
export function createCardTexture(opts: CardTextureOptions): THREE.CanvasTexture {
  const w = opts.width ?? 1024
  const h = opts.height ?? 608
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  paintCardBase(ctx, w, h, 'rgba(239, 167, 184, 0.92)')

  const ink = '#7A2945' // deep wine — luxury on cream
  const rose = '#EFA7B8'

  if (opts.eyebrow) {
    ctx.fillStyle = 'rgba(122, 41, 69, 0.55)'
    ctx.font = `400 24px ${SANS}`
    setLetterSpacing(ctx, '12px')
    ctx.textAlign = 'center'
    ctx.fillText(opts.eyebrow.toUpperCase(), w / 2, 92)
    setLetterSpacing(ctx, '0px')
  }

  if (opts.number) {
    ctx.fillStyle = rose
    ctx.font = `300 132px ${SERIF}`
    ctx.textAlign = 'center'
    ctx.fillText(opts.number, w / 2, 214)
    // soft rose-gold divider
    ctx.strokeStyle = 'rgba(239, 167, 184, 0.42)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(w / 2 - 84, 248)
    ctx.lineTo(w / 2 + 84, 248)
    ctx.stroke()
  }

  // main text — editorial serif, deep wine for luxury readability
  ctx.fillStyle = ink
  ctx.font = `400 ${opts.number ? 60 : 54}px ${SERIF}`
  ctx.textAlign = 'center'
  const maxWidth = w - 190
  const lines = wrapText(ctx, opts.text, maxWidth)
  const lineHeight = 80
  let y = opts.number ? 326 : h / 2 - ((lines.length - 1) * lineHeight) / 2 - 8
  for (const line of lines) {
    ctx.fillText(line, w / 2, y)
    y += lineHeight
  }

  if (opts.subtitle) {
    ctx.fillStyle = 'rgba(122, 41, 69, 0.52)'
    ctx.font = `italic 400 30px ${SERIF}`
    ctx.fillText(opts.subtitle, w / 2, h - 62)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/** Smaller portrait-orientation card used for the future scene. */
export function createFutureCardTexture(title: string, subtitle?: string): THREE.CanvasTexture {
  return createCardTexture({
    eyebrow: 'the future',
    text: title,
    subtitle,
    width: 896,
    height: 560,
  })
}
