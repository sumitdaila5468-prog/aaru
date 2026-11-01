/* ------------------------------------------------------------------ */
/*  ParticleField — reusable, optimised particle system                   */
/*  Four cinematic types, single BufferGeometry / Points per field,       */
/*  adaptive count on mobile / medium tier, no React-per-particle.       */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sparkles } from '@react-three/drei'
import { story } from '../../data/story'
import { useExperience } from '../../state/experience'
import { getGlowTexture } from '../../utils/textures'

export type ParticlePreset = 'stars' | 'dust' | 'romantic' | 'reveal'

interface ParticleFieldProps {
  preset?: ParticlePreset
  count?: number
  scale?: [number, number, number]
  color?: string
  opacity?: number
  speed?: number
}

const PRESET_DEFAULTS: Record<ParticlePreset, { count: number; color: string; opacity: number; speed: number }> = {
  stars: { count: 110, color: story.theme.roseGlow, opacity: 0.5, speed: 0.18 },
  dust: { count: 90, color: story.theme.roseGlow, opacity: 0.42, speed: 0.22 },
  romantic: { count: 80, color: '#e8a8bd', opacity: 0.55, speed: 0.16 },
  reveal: { count: 140, color: story.theme.rose, opacity: 0.6, speed: 0.12 },
}

/**
 * ParticleField — use this everywhere instead of hand-rolling Sparkles / points.
 * `preset` chooses the cinematic mood; `count`/`scale`/`color` override if needed.
 */
export function ParticleField({
  preset = 'dust',
  count,
  scale,
  color,
  opacity,
  speed,
}: ParticleFieldProps) {
  const d = PRESET_DEFAULTS[preset]
  const reduced = useExperience((s) => s.reducedMotion)
  const isMobile = useExperience((s) => s.isMobile)
  const quality = useExperience((s) => s.quality)

  const actualCount = useMemo(() => {
    let n = count ?? d.count
    if (isMobile) n = Math.round(n * 0.45)
    if (quality === 'medium') n = Math.round(n * 0.65)
    return n
  }, [count, d.count, isMobile, quality])

  const actualScale: [number, number, number] = scale ?? (preset === 'reveal' ? [18, 8, 18] : preset === 'stars' ? [16, 7, 16] : [13, 6, 13])

  return (
    <Sparkles
      count={actualCount}
      scale={actualScale}
      size={preset === 'romantic' ? 2.8 : preset === 'reveal' ? 2.4 : 2.2}
      speed={reduced ? 0 : (speed ?? d.speed)}
      opacity={opacity ?? d.opacity}
      color={color ?? d.color}
      noise={preset === 'dust' ? 0.6 : 0.45}
    />
  )
}

/** Floating glowing orbs — romantic bokeh */
export function RomanticOrbs({
  count = 4,
  radius = 5,
  height = 2.5,
}: {
  count?: number
  radius?: number
  height?: number
}) {
  const group = useRef<THREE.Group>(null)
  const reduced = useExperience((s) => s.reducedMotion)
  const texture = useMemo(() => getGlowTexture(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2 + Math.random(),
        r: radius * (0.6 + Math.random() * 0.5),
        y: height * (0.4 + Math.random() * 0.8),
        speed: 0.03 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2,
        scale: 0.35 + Math.random() * 0.5,
      })),
    [count, radius, height],
  )

  useFrame((state) => {
    if (!group.current) return
    const t = reduced ? 0 : state.clock.elapsedTime
    group.current.children.forEach((child, i) => {
      const s = seeds[i]
      if (!s) return
      const a = s.angle + t * s.speed
      child.position.set(Math.sin(a) * s.r, s.y + Math.sin(t * 0.3 + s.phase) * 0.35, Math.cos(a) * s.r)
      const pulse = 0.75 + 0.25 * Math.sin(t * 0.8 + s.phase)
      child.scale.setScalar(s.scale * pulse)
    })
  })

  return (
    <group ref={group}>
      {seeds.map((_s, i) => (
        <sprite key={i} scale={[1, 1, 1]}>
          <spriteMaterial map={texture} color={story.theme.roseGlow} transparent opacity={0.38} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  )
}

/** Final reveal burst — particles explode outward then fade (used in finale) */
export function RevealBurst({ active = false }: { active?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const { geometry, material } = useMemo(() => {
    const N = 520
    const pos = new Float32Array(N * 3)
    const seed = new Float32Array(N)
    const size = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 0.2 + Math.random() * 0.9
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      seed[i] = Math.random()
      size[i] = 0.6 + Math.random() * 1.6
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor: { value: new THREE.Color(story.theme.roseGlow) },
        uOpacity: { value: 0.75 },
      },
      vertexShader: /* glsl */ `
        attribute float aSeed;
        attribute float aSize;
        uniform float uTime;
        uniform float uProgress;
        varying float vSeed;
        void main() {
          vSeed = aSeed;
          vec3 dir = normalize(position);
          vec3 p = position + dir * uProgress * (4.0 + aSeed * 6.0);
          p.y += sin(uTime * 0.6 + aSeed * 10.0) * 0.2 * uProgress;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = aSize * (280.0 / -mv.z) * (0.5 + 0.5 * uProgress);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uProgress;
        varying float vSeed;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          float a = smoothstep(0.5, 0.12, d);
          float fade = smoothstep(0.0, 0.25, uProgress) * (1.0 - smoothstep(0.6, 1.0, uProgress));
          gl_FragColor = vec4(uColor, a * uOpacity * fade);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geometry, material }
  }, [])

  useEffect(() => () => { geometry.dispose(); material.dispose() }, [geometry, material])

  useFrame((state, dt) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    const target = active ? 1 : 0
    matRef.current.uniforms.uProgress.value = THREE.MathUtils.damp(
      matRef.current.uniforms.uProgress.value,
      target,
      0.9,
      Math.min(dt, 0.05),
    )
  })

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
}
