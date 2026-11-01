/* ------------------------------------------------------------------ */
/*  Ground — a dark stage floor with a soft glowing halo                */
/* ------------------------------------------------------------------ */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getGlowTexture } from '../../utils/textures'
import { useExperience } from '../../state/experience'
import { story } from '../../data/story'

interface GroundProps {
  radius?: number
  glow?: number
  color?: string
  receiveShadow?: boolean
}

export function Ground({
  radius = 24,
  glow = 0.4,
  color = '#070509',
  receiveShadow = true,
}: GroundProps) {
  const halo = useRef<THREE.Sprite>(null)
  const texture = useRef(getGlowTexture())

  useFrame((state) => {
    const reduced = useExperience.getState().reducedMotion
    if (reduced || !halo.current) return
    const material = halo.current.material as THREE.SpriteMaterial
    material.opacity = glow * (0.75 + 0.25 * Math.sin(state.clock.elapsedTime * 0.5))
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={receiveShadow}>
        <circleGeometry args={[radius, 48]} />
        <meshStandardMaterial color={color} roughness={0.94} metalness={0.08} />
      </mesh>
      <sprite ref={halo} scale={[10, 10, 1]} position={[0, 0.06, 0]}>
        <spriteMaterial
          map={texture.current}
          color={story.theme.burgundy}
          transparent
          opacity={glow}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}
