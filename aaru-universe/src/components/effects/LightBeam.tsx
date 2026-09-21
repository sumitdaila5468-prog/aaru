/* ------------------------------------------------------------------ */
/*  LightBeam — fake volumetric spotlight cone (cheap, additive)        */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useExperience } from '../../state/experience'

const vertexShader = /* glsl */ `
  varying vec3 vNormalView;
  varying float vHeight;
  void main() {
    vNormalView = normalize(normalMatrix * normal);
    vHeight = uv.y; // 0 at bottom of cone geometry, 1 at top (roughly)
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormalView;
  varying float vHeight;
  void main() {
    // fade at silhouette edges (fresnel) and toward the floor
    float edge = pow(1.0 - abs(vNormalView.z), 1.6);
    float alpha = (0.04 + edge * 0.22) * smoothstep(0.0, 0.35, vHeight) * uIntensity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

interface LightBeamProps {
  position?: [number, number, number]
  height?: number
  bottomRadius?: number
  color?: string
  intensity?: number
}

export function LightBeam({
  position = [0, 0, 0],
  height = 7,
  bottomRadius = 1.6,
  color = '#e8a8bd',
  intensity = 1,
}: LightBeamProps) {
  const reduced = useExperience((s) => s.reducedMotion)

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uIntensity: { value: intensity },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [color, intensity],
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    if (reduced) return
    const t = state.clock.elapsedTime
    material.uniforms.uIntensity.value =
      intensity * (0.82 + 0.18 * Math.sin(t * 0.6 + position[0]))
  })

  // cone pointing down from a spotlight source; open ended
  return (
    <mesh
      position={[position[0], position[1] + height / 2, position[2]]}
      material={material}
    >
      <cylinderGeometry args={[0.08, bottomRadius, height, 32, 1, true]} />
    </mesh>
  )
}
