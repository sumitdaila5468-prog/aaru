/* ------------------------------------------------------------------ */
/*  Petals — very subtle floating rose petals for emotional moments     */
/*  Slow, wind-reactive, naturally fading — never fills the screen.   */
/*  Use count 12-18 for hero/final, 8 for reasons.                   */
/* ------------------------------------------------------------------ */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useExperience } from '../../state/experience'

function createPetalTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, 128, 128)
  // soft petal shape — vertical ellipse with gradient
  const g = ctx.createRadialGradient(64, 48, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,247,248,1)')
  g.addColorStop(0.35, 'rgba(248,200,212,0.95)')
  g.addColorStop(0.65, 'rgba(239,167,184,0.85)')
  g.addColorStop(1, 'rgba(239,167,184,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(64, 64, 28, 44, 0, 0, Math.PI * 2)
  ctx.fill()
  // subtle vein
  ctx.strokeStyle = 'rgba(122,41,69,0.12)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(64, 24)
  ctx.lineTo(64, 104)
  ctx.stroke()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

interface PetalsProps {
  count?: number
  area?: [number, number, number] // x,z spread, y height
  opacity?: number
  speed?: number // wind speed multiplier
}

export function Petals({ count = 14, area = [14, 6, 14], opacity = 0.52, speed = 1 }: PetalsProps) {
  const group = useRef<THREE.Group>(null)
  const isMobile = useExperience((s) => s.isMobile)
  const reduced = useExperience((s) => s.reducedMotion)
  const texture = useMemo(() => createPetalTexture(), [])

  const actualCount = useMemo(() => {
    let n = count
    if (isMobile) n = Math.round(n * 0.5)
    if (reduced) n = Math.round(n * 0.6)
    return Math.max(4, n)
  }, [count, isMobile, reduced])

  const seeds = useMemo(
    () =>
      Array.from({ length: actualCount }, () => ({
        x: (Math.random() - 0.5) * area[0],
        y: 0.6 + Math.random() * area[1],
        z: (Math.random() - 0.5) * area[2],
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        sx: 0.22 + Math.random() * 0.18,
        drift: 0.18 + Math.random() * 0.35,
        spin: (Math.random() - 0.5) * 0.9,
        phase: Math.random() * Math.PI * 2,
        fall: 0.06 + Math.random() * 0.12,
      })),
    [actualCount, area],
  )

  useFrame((state) => {
    if (!group.current || reduced) return
    const paused = useExperience.getState().paused
    if (paused) return
    const t = state.clock.elapsedTime * speed
    group.current.children.forEach((child, i) => {
      const s = seeds[i]
      if (!s) return
      // gentle fall + wind drift
      child.position.y = s.y - (t * s.fall) % (area[1] + 2) + Math.sin(t * 0.3 + s.phase) * 0.18
      child.position.x = s.x + Math.sin(t * s.drift + s.phase) * 0.9 + Math.cos(t * 0.12) * 0.4
      child.position.z = s.z + Math.cos(t * s.drift * 0.7 + s.phase) * 0.7
      child.rotation.x = s.rx + t * s.spin * 0.3
      child.rotation.y = s.ry + t * s.spin * 0.5
      child.rotation.z = s.rz + Math.sin(t * 0.4 + s.phase) * 0.35
      // wrap around when below ground
      if (child.position.y < 0.15) {
        child.position.y += area[1] + 2
      }
    })
  })

  if (reduced && count > 10) {
    // on reduced motion, show even fewer but still elegant
  }

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <Float key={i} speed={0.6 + s.drift} rotationIntensity={0.18} floatIntensity={0.22} floatingRange={[-0.06, 0.06]}>
          <sprite scale={[s.sx * 2.2, s.sx * 2.8, 1]}>
            <spriteMaterial
              map={texture}
              transparent
              opacity={opacity * (0.7 + Math.random() * 0.3)}
              depthWrite={false}
              depthTest={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        </Float>
      ))}
    </group>
  )
}
