/* ------------------------------------------------------------------ */
/*  MemoryGallery — Aaru's floating photo gallery in the dream world      */
/*  Arranged in a gentle arc, each frame floats and responds to cursor.  */
/*  Uses the single source of truth: src/data/memories.ts               */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { MemoryFrame } from './MemoryFrame'
import { useExperience } from '../../state/experience'
import { memories } from '../../data/memories'

function framePlacement(i: number, total: number): { position: [number, number, number]; rotY: number } {
  const span = 1.15
  const a = total === 1 ? 0 : (-span + (i / (total - 1)) * span * 2)
  const x = Math.sin(a) * 3.4
  const z = -1.35 - Math.cos(a) * 1.15
  const y = 1.55 + Math.sin(i * 2.1) * 0.14
  const rotY = Math.atan2(0 - x, 4.6 - z)
  return { position: [x, y, z], rotY }
}

export interface MemoryGalleryProps {
  onSelect?: (index: number) => void
}

export function MemoryGallery({ onSelect }: MemoryGalleryProps) {
  const setMemory = useExperience((s) => s.setMemory)
  const handleSelect = onSelect ?? setMemory

  const textures = useTexture(memories.map((m) => m.image))

  useEffect(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
    })
  }, [textures])

  const placements = useMemo(() => memories.map((_, i) => framePlacement(i, memories.length)), [])

  return (
    <group>
      {memories.map((memory, i) => {
        const { position, rotY } = placements[i]
        return (
          <MemoryFrame
            key={memory.id}
            position={position}
            rotY={rotY}
            texture={textures[i]}
            index={i}
            onOpen={() => handleSelect(i)}
          />
        )
      })}
    </group>
  )
}
