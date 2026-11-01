/* ------------------------------------------------------------------ */
/*  SCENE 7 — Future: golden-pink sunset, mountains, hopeful horizon    */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
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
      {/* deep sunset / twilight — premium, real photos are hero, no characters */}
      <Environment preset="sunset" keyIntensity={0.88} showGround={false} showStars={false} showParticles={false} />
      <Ground radius={34} glow={0.22} color="#9EB89A" />
      <Starfield count={380} rMin={32} rMax={62} opacity={0.08} colorA="#FFFDFB" colorB="#FFD6A5" />
      <Petals count={4} area={[18, 7, 18]} opacity={0.16} />
      <DistantMountains />

      <GlowSprite position={[2.6, 1.4, -30]} scale={28} color="#FFD6A5" opacity={0.42} />
      <GlowSprite position={[2.6, 0.9, -30]} scale={16} color="#FFE8C7" opacity={0.26} />
      <GlowSprite position={[-4, 6.5, -22]} scale={14} color="#EFA7B8" opacity={0.10} />

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

/**
 * Distant horizon haze — premium atmospheric depth replaces primitive cones.
 * No coneGeometry — uses soft gradient sprites + layered glow for realistic dusk.
 */
function DistantMountains() {
  return (
    <group position={[0, -0.45, -20]}>
      {/* layered horizon haze — warm sunset atmospheric perspective */}
      <GlowSprite position={[0, 1.0, 0]} scale={32} color="#FFD6A5" opacity={0.18} />
      <GlowSprite position={[-4, 1.4, -2]} scale={20} color="#EFA7B8" opacity={0.10} />
      <GlowSprite position={[4, 1.2, -1.5]} scale={18} color="#FFE8C7" opacity={0.12} />
      {/* subtle horizon line — not geometric, just soft light */}
      <GlowSprite position={[0, 0.42, 2]} scale={24} color="#FFF7F8" opacity={0.07} />
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
