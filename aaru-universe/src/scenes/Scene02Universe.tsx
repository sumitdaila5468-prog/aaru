/* ------------------------------------------------------------------ */
/*  SCENE 2 — Our universe: a slow orbit beneath a heart of stars        */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { CharacterPair } from '../components/characters/CharacterPair'
import { Environment } from '../components/effects/Environment'
import { Starfield } from '../components/effects/Starfield'
import { Petals } from '../components/effects/Petals'
import { GardenElements } from '../components/effects/GardenElements'
import { HeartConstellation } from '../components/effects/HeartConstellation'
import { GlowSprite } from '../components/effects/GlowSprite'
import { Ground } from '../components/effects/Ground'
import { useSceneShots } from '../hooks/useSceneShots'
import { adaptShot } from '../utils/math'
import { useExperience } from '../state/experience'

export function Scene02Universe() {
  const isMobile = useExperience((s) => s.isMobile)

  const shots = useMemo(
    () => [
      {
        shot: adaptShot(
          {
            fov: 42,
            parallax: 0.5,
            duration: 0,
            orbit: {
              center: [0, 1.28, -0.4],
              radius: 6.6,
              height: 2.0,
              speed: 0.05,
              angle0: 0.9,
            },
          },
          isMobile,
        ),
        at: 0.6,
      },
    ],
    [isMobile],
  )
  useSceneShots(shots)

  return (
    <group>
      <Environment preset="garden" keyIntensity={0.92} showGround={false} showStars={false} showParticles={false} />
      <Ground radius={28} glow={0.38} color="#8BA888" />
      <GardenElements variant="dense" />
      <Starfield count={1800} opacity={0.42} colorA="#FFFDFB" colorB="#FFD6A5" />
      <Petals count={10} area={[18, 7, 18]} opacity={0.42} />

      <CharacterPair poseKey="walking" />

      {/* heart constellation — warm, not neon */}
      <HeartConstellation scale={0.36} position={[0, 6.8, -9]} opacity={0.92} />
      <GlowSprite position={[0, 6.6, -11]} scale={18} color="#FFD6A5" opacity={0.28} />
      <GlowSprite position={[-7, 9, -24]} scale={14} color="#FFE8EE" opacity={0.16} />
      <GlowSprite position={[8, 7, -24]} scale={10} color="#EFA7B8" opacity={0.12} />
    </group>
  )
}
