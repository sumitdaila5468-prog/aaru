/* ------------------------------------------------------------------ */
/*  Shared types for the Aaru universe                                 */
/* ------------------------------------------------------------------ */

export type Vec3 = [number, number, number]

/** Quality tier derived from device capabilities. */
export type Quality = 'high' | 'medium'

/** A line of cinematic text that appears on its own. */
export interface StagedLine {
  text: string
  /** ms to keep the line on screen after it has fully appeared */
  hold?: number
  /** rendered larger, in the accent rose colour */
  accent?: boolean
  italic?: boolean
}

export interface ChapterData {
  id: string
  index: string
  title: string
  photo: string
  description: string
}

export interface MemoryItem {
  id?: string
  src: string
  /** canonical field per spec — alias for src */
  image?: string
  title: string
  date: string
  description: string
}

export interface ReasonItem {
  text: string
}

export interface FutureCard {
  title: string
  subtitle?: string
}

export interface PoseLabel {
  key: string
  title: string
  description: string
}

/* ---------------- camera ---------------- */

export interface OrbitConfig {
  center: Vec3
  radius: number
  height: number
  /** radians per second */
  speed: number
  /** starting angle (radians) */
  angle0: number
}

export interface CameraShot {
  position?: Vec3
  lookAt?: Vec3
  fov?: number
  /** tween duration in seconds — 0 = jump instantly */
  duration?: number
  ease?: string
  delay?: number
  /** pointer parallax strength, 0 = none */
  parallax?: number
  orbit?: OrbitConfig
}

/** A camera shot applied at a delay after a scene (re)mounts. */
export interface TimedShot {
  shot: CameraShot
  /** seconds after mount */
  at?: number
}
