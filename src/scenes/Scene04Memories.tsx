/* ------------------------------------------------------------------ */
/*  SCENE 4 — Aaru's memories: dream-world gallery with cinematic      */
/*  camera choreography (move toward frame → focus → return)            */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo } from 'react'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { Environment } from '../components/effects/Environment'
import { Ground } from '../components/effects/Ground'
import { LightBeam } from '../components/effects/LightBeam'
import { GlowSprite } from '../components/effects/GlowSprite'
import { ParticleField } from '../components/effects/ParticleField'
import { MemoryFrame } from '../components/effects/MemoryFrame'
import { useSceneShots } from '../hooks/useSceneShots'
import { adaptShot } from '../utils/math'
import { useExperience } from '../state/experience'
import { story } from '../data/story'

function framePlacement(i: number, total: number): { position: [number, number, number]; rotY: number } {
  const span = 1.15
  const a = total === 1 ? 0 : (-span + (i / (total - 1)) * span * 2)
  const x = Math.sin(a) * 3.4
  const z = -1.35 - Math.cos(a) * 1.15
  const y = 1.55 + Math.sin(i * 2.1) * 0.14
  const rotY = Math.atan2(0 - x, 4.6 - z)
  return { position: [x, y, z], rotY }
}

/** Abstract floating dream objects — soft geometric whispers */
function DreamObjects() {
  return (
    <group>
      {Array.from({ length: 5 }, (_, i) => {
        const x = (i - 2) * 2.1 + Math.sin(i * 1.3) * 0.6
        const y = 1.2 + (i % 2) * 0.9
        const z = -5 - i * 1.4
        return (
          <Float key={i} speed={0.6 + (i % 3) * 0.2} rotationIntensity={0.35} floatIntensity={0.6}>
            <mesh position={[x, y, z]} rotation={[0.4, 0.7, 0]}>
              <octahedronGeometry args={[0.22 + (i % 2) * 0.1, 0]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#5a1f30' : '#31182a'} transparent opacity={0.42} roughness={0.85} metalness={0.12} />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

export function Scene04Memories() {
  const isMobile = useExperience((s) => s.isMobile)
  const memory = useExperience((s) => s.memory)
  const setMemory = useExperience((s) => s.setMemory)

  const textures = useTexture(story.memories.map((m) => m.src))
  useEffect(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
    })
  }, [textures])

  // camera choreography: overview orbit vs. move toward selected frame
  const shots = useMemo(() => {
    if (memory !== null) {
      const { position } = framePlacement(memory, story.memories.length)
      return [
        {
          shot: adaptShot(
            {
              position: [position[0] + 0.35, position[1] + 0.1, position[2] + 2.15],
              lookAt: [position[0], position[1], position[2]],
              fov: 32,
              duration: 2.4,
              ease: 'power2.inOut',
              parallax: 0.22,
            },
            isMobile,
          ),
        },
      ]
    }
    return [
      {
        shot: adaptShot(
          {
            position: [0, 1.62, 4.7],
            lookAt: [0, 1.5, -1.5],
            fov: 44,
            duration: 0,
            parallax: 0.55,
          },
          isMobile,
        ),
      },
      {
        shot: adaptShot(
          {
            position: [0, 1.58, 4.25],
            lookAt: [0, 1.5, -1.5],
            fov: 44,
            duration: 9,
            ease: 'sine.inOut',
            parallax: 0.55,
          },
          isMobile,
        ),
        at: 1.2,
      },
    ]
  }, [memory, isMobile])
  useSceneShots(shots)

  return (
    <group>
      {/* dream world environment — burgundy / rose haze, light rays, orbs */}
      <Environment preset="dream" keyIntensity={0.85} showGround={false} showStars={true} showParticles={false} />
      {/* ground tuned for the dream stage */}
      <Ground radius={22} glow={0.38} color="#0c0610" />
      <ParticleField preset="romantic" count={110} scale={[14, 7, 14]} />
      {/* dream haze */}
      <GlowSprite position={[0, 6, -14]} scale={20} color={story.theme.burgundy} opacity={0.42} />
      <GlowSprite position={[-5, 3, -10]} scale={12} color={story.theme.rose} opacity={0.18} />
      <LightBeam position={[-1.4, 1.8, -1.2]} height={6} bottomRadius={1.1} intensity={0.22} />
      <LightBeam position={[1.6, 1.6, 0.4]} height={5.4} bottomRadius={0.9} color={story.theme.rose} intensity={0.18} />
      <DreamObjects />

      {story.memories.map((memoryItem, i) => {
        const { position, rotY } = framePlacement(i, story.memories.length)
        // dim non-selected frames when one is focused
        const focused = memory === null || memory === i
        return (
          <group key={memoryItem.src} visible={focused}>
            <MemoryFrame position={position} rotY={rotY} texture={textures[i]} index={i} onOpen={() => setMemory(i)} />
          </group>
        )
      })}
    </group>
  )
}
