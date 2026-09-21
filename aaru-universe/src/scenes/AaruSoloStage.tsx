/* ------------------------------------------------------------------ */
/*  AaruSoloStage — dedicated cinematic moment: Aaru alone under stars  */
/*  Camera slowly approaches, particles surround her, soft solo light.  */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { AaruCharacter } from '../components/characters/AaruCharacter'
import { SceneEnvironment } from '../components/effects/SceneEnvironment'
import { Starfield } from '../components/effects/Starfield'
import { ParticleField, RomanticOrbs } from '../components/effects/ParticleField'
import { LightBeam } from '../components/effects/LightBeam'
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
      <SceneEnvironment preset="night" keyIntensity={0.9} />
      <SkyDome top="#04030a" mid="#0c0713" horizon="#31182a" glow={0.45} />
      <Starfield count={2800} opacity={0.75} />
      <ParticleField preset="romantic" count={110} scale={[8, 5, 8]} />
      <RomanticOrbs count={6} radius={3.2} height={2.1} />
      <Ground radius={20} glow={0.5} />

      {/* Aaru alone — gentle grace, head slightly tilted */}
      <group position={[0, 0, -0.2]}>
        <AaruCharacter
          pose={{
            rootY: 0,
            headRotY: -0.1,
            headRotX: 0.06,
            torsoRotX: 0.015,
          }}
          position={[0, 0, 0]}
          castShadow
        />
        {/* her light — warm, intimate */}
        <LightBeam position={[0, 1.1, 0.15]} height={6} bottomRadius={0.95} intensity={0.85} />
        <LightBeam position={[0.45, 0.9, 0.25]} height={5.2} bottomRadius={0.7} color={story.theme.gold} intensity={0.32} />
      </group>

      {/* soft nebula behind her */}
      <GlowSprite position={[0, 5.2, -18]} scale={18} color={story.theme.burgundy} opacity={0.38} />
      <GlowSprite position={[-6, 8, -22]} scale={10} color={story.theme.rose} opacity={0.2} />
    </group>
  )
}
