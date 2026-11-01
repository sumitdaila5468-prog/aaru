/* ------------------------------------------------------------------ */
/*  CameraDirector — every camera move in the film                      */
/*                                                                      */
/*  Scenes publish CameraShots to the store; the director tweens a     */
/*  proxy with gsap, layers pointer-parallax on top (an autonomous     */
/*  drift on touch devices), and can hold a slow orbit.                */
/* ------------------------------------------------------------------ */

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { useExperience } from '../state/experience'
import { damp } from '../utils/math'

interface Proxy {
  px: number
  py: number
  pz: number
  tx: number
  ty: number
  tz: number
  fov: number
  blend: number
}

export function CameraDirector() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const shot = useExperience((s) => s.shot)
  const isMobile = useExperience((s) => s.isMobile)

  const proxy = useRef<Proxy>({ px: 0, py: 2.2, pz: 15, tx: 0, ty: 1.3, tz: -1, fov: 40, blend: 0 })
  const parallax = useRef({ x: 0, y: 0 })
  const orbit = useRef<{ angle: number } | null>(null)

  useEffect(() => {
    const p = proxy.current
    const reduced = useExperience.getState().reducedMotion
    const duration = shot.duration ?? 3.2
    const instant = duration <= 0.05 || reduced

    if (shot.orbit) {
      const o = shot.orbit
      orbit.current = { angle: o.angle0 }
      const startX = o.center[0] + Math.sin(o.angle0) * o.radius
      const startZ = o.center[2] + Math.cos(o.angle0) * o.radius
      gsap.to(p, {
        px: startX,
        py: o.height,
        pz: startZ,
        tx: o.center[0],
        ty: o.center[1],
        tz: o.center[2],
        fov: shot.fov ?? 42,
        blend: 1,
        duration: instant ? 0.01 : duration,
        ease: shot.ease ?? 'power2.inOut',
        overwrite: true,
        delay: shot.delay ?? 0,
      } as gsap.TweenVars)
    } else {
      orbit.current = null
      gsap.to(p, {
        blend: 0,
        duration: 0.01,
        overwrite: false,
      } as gsap.TweenVars)
      gsap.to(p, {
        px: shot.position?.[0] ?? p.px,
        py: shot.position?.[1] ?? p.py,
        pz: shot.position?.[2] ?? p.pz,
        tx: shot.lookAt?.[0] ?? p.tx,
        ty: shot.lookAt?.[1] ?? p.ty,
        tz: shot.lookAt?.[2] ?? p.tz,
        fov: shot.fov ?? 42,
        duration: instant ? 0.01 : duration,
        ease: shot.ease ?? 'power2.inOut',
        overwrite: true,
        delay: shot.delay ?? 0,
      } as gsap.TweenVars)
    }

    return () => {
      gsap.killTweensOf(p)
    }
  }, [shot])

  useFrame((state, rawDt) => {
    const st = useExperience.getState()
    if (st.paused) return
    const dt = Math.min(rawDt, 0.05)
    const reduced = st.reducedMotion
    const p = proxy.current
    const t = state.clock.elapsedTime

    // pointer parallax (desktop) / autonomous drift (touch)
    const strength = reduced ? 0 : (shot.parallax ?? 0.4)
    let targetX: number
    let targetY: number
    if (isMobile) {
      targetX = Math.sin(t * 0.1) * strength * 0.4
      targetY = Math.sin(t * 0.13 + 1) * strength * 0.16
    } else {
      targetX = state.pointer.x * strength
      targetY = state.pointer.y * strength * 0.5
    }
    parallax.current.x = damp(parallax.current.x, targetX, 2.2, dt)
    parallax.current.y = damp(parallax.current.y, targetY, 2.2, dt)

    let px = p.px + parallax.current.x
    let py = p.py + parallax.current.y
    let pz = p.pz
    let tx = p.tx
    let ty = p.ty
    let tz = p.tz

    if (orbit.current && shot.orbit) {
      const o = shot.orbit
      if (!reduced) orbit.current.angle += dt * o.speed
      const a = orbit.current.angle + parallax.current.x * 0.3
      const ox = o.center[0] + Math.sin(a) * o.radius
      const oz = o.center[2] + Math.cos(a) * o.radius
      const oy = o.height + parallax.current.y
      const b = THREE.MathUtils.clamp(p.blend, 0, 1)
      px = THREE.MathUtils.lerp(px, ox, b)
      py = THREE.MathUtils.lerp(py, oy, b)
      pz = THREE.MathUtils.lerp(pz, oz, b)
      tx = THREE.MathUtils.lerp(tx, o.center[0], b)
      ty = THREE.MathUtils.lerp(ty, o.center[1], b)
      tz = THREE.MathUtils.lerp(tz, o.center[2], b)
    }

    camera.position.set(px, py, pz)
    camera.lookAt(tx, ty, tz)
    if (Math.abs(camera.fov - p.fov) > 0.01) {
      camera.fov = p.fov
      camera.updateProjectionMatrix()
    }
  })

  return null
}
