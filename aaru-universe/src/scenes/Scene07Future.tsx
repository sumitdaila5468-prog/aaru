/* ------------------------------------------------------------------ */
/*  SCENE 7 — Future: golden-pink sunset, mountains, hopeful horizon    */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { CharacterPair } from '../components/characters/CharacterPair'
import { Environment } from '../components/effects/Environment'
import { Starfield } from '../components/effects/Starfield'
import { Petals } from '../components/effects/Petals'
import { GlowSprite } from '../components/effects/GlowSprite'
import { Ground } from '../components/effects/Ground'
import { useSceneShots } from '../hooks/useSceneShots'
import { adaptShot } from '../utils/math'
import { createFutureCardTexture } from '../utils/textures'
import { useExperience } from '../state/experience'
import { story } from '../data/story'

/** Future cards float in a gentle arc on the left of the horizon. */
function futurePlacement(i: number, total: number): { position: [number, number, number]; rotY: number } {
  const a = total === 1 ? 0 : -0.5 + (i / (total - 1)) * 1.0
  const x = -3.6 + (i / (total - 1)) * 2.9
  const y = 1.25 + Math.sin(i * 1.7 + 0.4) * 0.42
  const z = -2.4 - Math.sin(a + 0.5) * 1.3
  return { position: [x, y, z], rotY: 0.34 - (i / (total - 1)) * 0.2 }
}

export function Scene07Future() {
  const isMobile = useExperience((s) => s.isMobile)

  const shots = useMemo(
    () => [
      {
        shot: adaptShot(
          {
            fov: 44,
            parallax: 0.32,
            duration: 0,
            orbit: {
              center: [0, 1.5, -3],
              radius: 7.2,
              height: 1.85,
              speed: 0.012,
              angle0: 1.32,
            },
          },
          isMobile,
        ),
      },
    ],
    [isMobile],
  )
  useSceneShots(shots)

  return (
    <group>
      <Environment preset="sunset" keyIntensity={0.95} showGround={false} showStars={false} showParticles={false} />
      <Ground radius={34} glow={0.32} color="#9EB89A" />
      <Starfield count={600} rMin={32} rMax={62} opacity={0.14} colorA="#FFFDFB" colorB="#FFD6A5" />
      <Petals count={8} area={[18, 7, 18]} opacity={0.38} />
      {/* distant dreamy mountains — low poly hint */}
      <DistantMountains />

      {/* the two of them, facing hopeful horizon */}
      <group position={[-0.4, 0, 0]}>
        <CharacterPair poseKey="horizon" />
      </group>

      <GlowSprite position={[2.6, 1.4, -30]} scale={28} color="#FFD6A5" opacity={0.52} />
      <GlowSprite position={[2.6, 0.9, -30]} scale={16} color="#FFE8C7" opacity={0.32} />
      <GlowSprite position={[-4, 6.5, -22]} scale={14} color="#EFA7B8" opacity={0.12} />

      {/* floating future cards — luxury glass */}
      {story.future.cards.map((card, i) => {
        const { position, rotY } = futurePlacement(i, story.future.cards.length)
        return (
          <FutureCard key={card.title} card={card} position={position} rotY={rotY} index={i} />
        )
      })}
    </group>
  )
}

function DistantMountains() {
  return (
    <group position={[0, -0.45, -18]}>
      <mesh position={[-3.2, 0.9, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[3.2, 2.4, 6]} />
        <meshStandardMaterial color="#7A6A7A" roughness={0.92} transparent opacity={0.72} />
      </mesh>
      <mesh position={[2.8, 0.72, -1.2]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2.8, 1.9, 6]} />
        <meshStandardMaterial color="#8A7A8E" roughness={0.92} transparent opacity={0.68} />
      </mesh>
      <mesh position={[0.2, 0.55, -2.5]} rotation={[0, 0, 0]}>
        <coneGeometry args={[4.2, 1.6, 7]} />
        <meshStandardMaterial color="#9A8A9A" roughness={0.94} transparent opacity={0.62} />
      </mesh>
      {/* sunset glow behind mountains */}
      <GlowSprite position={[0, 1.2, -2]} scale={22} color="#FFD6A5" opacity={0.22} />
    </group>
  )
}

function FutureCard({
  card,
  position,
  rotY,
  index,
}: {
  card: { title: string; subtitle?: string }
  position: [number, number, number]
  rotY: number
  index: number
}) {
  const texture = useMemo(
    () => createFutureCardTexture(card.title, card.subtitle),
    [card.title, card.subtitle],
  )

  return (
    <Float
      speed={0.9 + (index % 3) * 0.2}
      rotationIntensity={0.07}
      floatIntensity={0.5}
      floatingRange={[-0.05, 0.07]}
    >
      <group position={position} rotation={[0, rotY, 0]}>
        <mesh>
          <planeGeometry args={[1.02, 0.64]} />
          <meshBasicMaterial map={texture} transparent opacity={0.96} toneMapped={false} />
        </mesh>
        <sprite scale={[1.9, 1.3, 1]} position={[0, -0.08, -0.07]}>
          <spriteMaterial
            color={'#FFD6A5'}
            transparent
            opacity={0.14}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>
    </Float>
  )
}
