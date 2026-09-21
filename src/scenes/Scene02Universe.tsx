/* ------------------------------------------------------------------ */
/*  SCENE 2 — OUR WORLD: golden-hour dream, elegant depth                */
/*  Warm sunset, soft clouds, light rays, realistic depth-of-field.      */
/*  Characters de-emphasized — text & atmosphere are hero.               */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
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
      <Environment preset="garden" keyIntensity={0.72} showGround={false} showStars={false} showParticles={false} />
      <Ground radius={28} glow={0.26} color="#B8CCB4" />
      <GardenElements variant="dense" />
      <Starfield count={1100} opacity={0.28} colorA="#FFFDFB" colorB="#FFD6A5" />
      <Petals count={6} area={[18, 7, 18]} opacity={0.24} />

      {/* heart — subtle, elegant, not dominating */}
      <HeartConstellation scale={0.28} position={[0, 6.8, -9]} opacity={0.68} />
      <GlowSprite position={[0, 6.6, -11]} scale={18} color="#FFD6A5" opacity={0.18} />
      <GlowSprite position={[-7, 9, -24]} scale={14} color="#FFE8EE" opacity={0.10} />
      <GlowSprite position={[8, 7, -24]} scale={10} color="#EFA7B8" opacity={0.08} />
      {/* golden-hour haze */}
      <GlowSprite position={[0, 3.2, -8]} scale={22} color="#FFE8C7" opacity={0.09} />
    </group>
  )
}
