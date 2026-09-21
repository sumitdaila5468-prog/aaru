/* ------------------------------------------------------------------ */
/*  GlowSprite — a soft billboarded halo of light                       */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import * as THREE from 'three'
import { getGlowTexture } from '../../utils/textures'

interface GlowSpriteProps {
  position?: [number, number, number]
  scale?: number
  color?: string
  opacity?: number
}

export function GlowSprite({
  position = [0, 0, 0],
  scale = 2,
  color = '#e8a8bd',
  opacity = 0.5,
}: GlowSpriteProps) {
  const texture = useMemo(() => getGlowTexture(), [])
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  )
}
