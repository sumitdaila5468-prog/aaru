/* ------------------------------------------------------------------ */
/*  Small math helpers                                                  */
/* ------------------------------------------------------------------ */

import * as THREE from 'three'
import type { CameraShot } from '../types'

export const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v))

export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  THREE.MathUtils.damp(current, target, lambda, dt)

/** The classic parametric heart curve. Returns [x, y] for t in [0, 2π). */
export function heartCurve(t: number): [number, number] {
  const x = 16 * Math.pow(Math.sin(t), 3)
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  return [x, y]
}

/** n points around the heart curve. */
export function heartPoints(n: number): Array<[number, number]> {
  return Array.from({ length: n }, (_, i) => heartCurve((i / n) * Math.PI * 2))
}

/** Uniform-ish random point on a sphere shell between rMin and rMax. */
export function randomShellPoint(rMin: number, rMax: number): THREE.Vector3 {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = rMin + Math.random() * (rMax - rMin)
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}

/**
 * Adapt a camera shot for mobile: pull the camera back ~30% and widen
 * the field of view so the composition breathes on small screens.
 */
export function adaptShot(shot: CameraShot, isMobile: boolean): CameraShot {
  if (!isMobile) return shot
  const out: CameraShot = { ...shot }
  if (shot.position && shot.lookAt) {
    const [lx, ly, lz] = shot.lookAt
    const [px, py, pz] = shot.position
    const k = 1.32
    out.position = [lx + (px - lx) * k, ly + (py - ly) * k * 0.7, lz + (pz - lz) * k]
  }
  if (shot.fov !== undefined) out.fov = shot.fov + 9
  if (shot.orbit) {
    out.orbit = { ...shot.orbit, radius: shot.orbit.radius * 1.28, height: shot.orbit.height + 0.25 }
  }
  if (shot.parallax !== undefined) out.parallax = shot.parallax * 0.6
  return out
}
