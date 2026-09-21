/* ------------------------------------------------------------------ */
/*  AaruSoloStage — cinematic solo moment: Aaru's photo under stars     */
/*  No primitive characters — uses real photograph as elegant memory.   */
/*  Camera slowly approaches, warm intimate light, super-premium.       */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { SceneEnvironment } from '../components/effects/SceneEnvironment'
import { Starfield } from '../components/effects/Starfield'
import { ParticleField } from '../components/effects/ParticleField'
import { GlowSprite } from '../components/effects/GlowSprite'
import { Ground } from '../components/effects/Ground'
import { SkyDome } from '../components/effects/SkyDome'
import { useSceneShots } from '../hooks/useSceneShots'
import { adaptShot } from '../utils/math'
import { useExperience } from '../state/experience'
import { story } from '../data/story'

export function AaruSoloStage() {
  const isMobile = useExperience((s) => s.isMobile)

  const shots = useMemo(
    () => [
      {
        shot: adaptShot(
          {
            position: [0, 1.6, 5.2],
            lookAt: [0, 1.1, -0.2],
            fov: 38,
            duration: 0,
            parallax: 0.3,
          },
          isMobile,
        ),
      },
      {
        shot: adaptShot(
          {
            position: [0.22, 1.32, 2.9],
            lookAt: [0, 1.05, -0.3],
            fov: 34,
            duration: 14,
            ease: 'sine.inOut',
            parallax: 0.35,
          },
          isMobile,
        ),
        at: 0.5,
      },
    ],
    [isMobile],
  )
  useSceneShots(shots)

  return (
    <group>
      <SceneEnvironment preset="night" keyIntensity={0.72} />
      <SkyDome top="#1A0A1F" mid="#2A0E1E" horizon="#5A1832" glow={0.52} />
      <Starfield count={1800} opacity={0.42} colorA="#FFFDFB" colorB="#FFD6A5" />
      <ParticleField preset="romantic" count={32} scale={[8, 5, 8]} opacity={0.18} />
      <Ground radius={20} glow={0.28} color="#1A0A14" />

      {/* soft nebula behind — warm highlight for photo */}
      <GlowSprite position={[0, 5.2, -18]} scale={18} color={story.theme.burgundy} opacity={0.22} />
      <GlowSprite position={[-6, 8, -22]} scale={10} color={story.theme.rose} opacity={0.12} />
      <GlowSprite position={[6.5, 7.2, -16]} scale={10} color="#FFD6A5" opacity={0.10} />
    </group>
  )
}
