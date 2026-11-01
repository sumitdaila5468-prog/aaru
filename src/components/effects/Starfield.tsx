/* ------------------------------------------------------------------ */
/*  Starfield — thousands of soft twinkling stars in a shell            */
/*  One draw call (THREE.Points + custom shader), adaptive count.       */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { randomShellPoint } from '../../utils/math'
import { useExperience } from '../../state/experience'

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uScale;
  uniform float uBurst;
  varying float vSeed;
  varying float vTwinkle;

  void main() {
    vSeed = aSeed;
    vec3 dir = normalize(position + vec3(0.0001));
    vec3 pos = position * uScale + dir * uBurst * (5.0 + aSeed * 7.0);
    pos.y += sin(uTime * 0.045 + aSeed * 40.0) * 0.4;
    pos.x += cos(uTime * 0.03 + aSeed * 20.0) * 0.3;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (260.0 / -mv.z);
    vTwinkle = 0.45 + 0.55 * sin(uTime * (0.25 + aSeed * 0.9) + aSeed * 60.0);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vSeed;
  varying float vTwinkle;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.05, d);
    vec3 col = mix(uColorA, uColorB, fract(vSeed * 7.31));
    gl_FragColor = vec4(col, a * vTwinkle * uOpacity);
  }
`

interface StarfieldProps {
  count?: number
  rMin?: number
  rMax?: number
  colorA?: string
  colorB?: string
  opacity?: number
}

export function Starfield({
  count = 3200,
  rMin = 22,
  rMax = 58,
  colorA = '#FFFDFB',
  colorB = '#FFD6A5',
  opacity = 0.85,
}: StarfieldProps) {
  const reduced = useExperience((s) => s.reducedMotion)
  const isMobile = useExperience((s) => s.isMobile)
  const quality = useExperience((s) => s.quality)

  const actualCount = useMemo(() => {
    let n = count
    if (isMobile) n = Math.round(n * 0.42)
    if (quality === 'medium') n = Math.round(n * 0.65)
    return n
  }, [count, isMobile, quality])

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3)
    const sizes = new Float32Array(actualCount)
    const seeds = new Float32Array(actualCount)
    for (let i = 0; i < actualCount; i++) {
      const p = randomShellPoint(rMin, rMax)
      positions[i * 3] = p.x
      positions[i * 3 + 1] = Math.abs(p.y) * 0.85 + 1 // bias stars upward
      positions[i * 3 + 2] = p.z
      const hero = Math.random() < 0.03
      sizes[i] = hero ? 2.6 + Math.random() * 1.6 : 0.6 + Math.random() * 1.2
      seeds[i] = Math.random()
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uBurst: { value: 0 },
        uOpacity: { value: opacity },
        uColorA: { value: new THREE.Color(colorA) },
        uColorB: { value: new THREE.Color(colorB) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geometry, material }
  }, [actualCount, rMin, rMax, colorA, colorB, opacity])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  const clock = useRef(0)

  useFrame((_, rawDt) => {
    const paused = useExperience.getState().paused
    const dt = Math.min(rawDt, 0.05)
    if (!reduced && !paused) clock.current += dt
    material.uniforms.uTime.value = clock.current
    const s = useExperience.getState()
    material.uniforms.uScale.value = s.universeScale
    material.uniforms.uBurst.value = s.burst
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}

// reusable alias as requested in spec: <StarField /> (capital F)
export const StarField = Starfield
