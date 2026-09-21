/* ------------------------------------------------------------------ */
/*  SkyDome — a huge gradient dome that carries the mood of each scene  */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useExperience } from '../../state/experience'

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform float uGlow;
  varying vec3 vWorld;
  void main() {
    float h = normalize(vWorld).y;
    vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.28, h));
    col = mix(col, uTop, smoothstep(0.22, 0.75, h));
    // horizon glow band
    float band = exp(-abs(h - 0.015) * 13.0);
    col += uHorizon * band * uGlow;
    // darken below the horizon
    col *= mix(0.55, 1.0, smoothstep(-0.25, 0.05, h));
    gl_FragColor = vec4(col, 1.0);
  }
`

export interface SkyDomeProps {
  top?: string
  mid?: string
  horizon?: string
  glow?: number
  radius?: number
}

export function SkyDome({
  top = '#04030a',
  mid = '#0d0713',
  horizon = '#3a1c28',
  glow = 0.55,
  radius = 62,
}: SkyDomeProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const reduced = useExperience((s) => s.reducedMotion)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTop: { value: new THREE.Color(top) },
          uMid: { value: new THREE.Color(mid) },
          uHorizon: { value: new THREE.Color(horizon) },
          uGlow: { value: glow },
        },
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [top, mid, horizon, glow],
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    if (!mesh.current || reduced) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.004
  })

  return (
    <mesh ref={mesh} material={material} frustumCulled={false}>
      <sphereGeometry args={[radius, 32, 24]} />
    </mesh>
  )
}
