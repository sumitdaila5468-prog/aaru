/* ------------------------------------------------------------------ */
/*  SCENE 1 — Hero: dreamy garden at sunset — luxury redisign           */
/*  Warm sunset gradient, characters in distance, petals, bokeh         */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { CharacterPair } from '../components/characters/CharacterPair'
import { Environment } from '../components/effects/Environment'
import { Starfield } from '../components/effects/Starfield'
import { Ground } from '../components/effects/Ground'
import { Petals } from '../components/effects/Petals'
import { GardenElements } from '../components/effects/GardenElements'
import { LightBeam } from '../components/effects/LightBeam'
import { GlowSprite } from '../components/effects/GlowSprite'
import { useSceneShots } from '../hooks/useSceneShots'
import { adaptShot } from '../utils/math'
import { useExperience } from '../state/experience'
import { AaruSoloStage } from './AaruSoloStage'

export function Scene01Intro() {
  const isMobile = useExperience((s) => s.isMobile)
  const aaruSolo = useExperience((s) => s.aaruSolo)

  const pairShots = useMemo(
    () => [
      {
        shot: adaptShot(
          {
            // camera begins in darkness behind them, then reveals and orbits gently
            position: [0, 1.78, 8.3],
            lookAt: [0, 1.28, -1],
            fov: 40,
            duration: 14,
            ease: 'sine.inOut',
            parallax: 0.42,
          },
          isMobile,
        ),
      },
    ],
    [isMobile],
  )

  const soloShots = useMemo(
    () => [
      {
        shot: adaptShot(
          {
            position: [0, 1.85, 5.6],
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
            position: [0.18, 1.34, 3.1],
            lookAt: [0, 1.05, -0.3],
            fov: 34,
            duration: 14,
            ease: 'sine.inOut',
            parallax: 0.35,
          },
          isMobile,
        ),
        at: 0.4,
      },
    ],
    [isMobile],
  )

  useSceneShots(aaruSolo ? soloShots : pairShots)

  if (aaruSolo) return <AaruSoloStage />

  return (
    <group>
      {/* garden at sunset — main identity, warm dreamy */}
      <Environment preset="garden" keyIntensity={0.85} showGround={false} showStars={false} showParticles={false} />
      <Ground radius={22} glow={0.42} color="#8BA888" />
      <GardenElements variant="sparse" />
      <Starfield count={1200} rMin={28} rMax={62} opacity={0.22} colorA="#FFFDFB" colorB="#FFD6A5" />
      <Petals count={12} area={[16, 7, 16]} opacity={0.48} />
      {/* layered warm fog */}
      <GlowSprite position={[0, 8.2, -22]} scale={22} color="#FFD6A5" opacity={0.18} />
      <GlowSprite position={[-6, 5.5, -14]} scale={16} color="#FFE8EE" opacity={0.16} />
      <GlowSprite position={[6, 6, -16]} scale={14} color="#EFA7B8" opacity={0.12} />

      {/* characters in the distance — intimate, not dominating */}
      <group position={[0, 0, -2.2]}>
        <CharacterPair poseKey="together" />
        {/* rose-gold luxury light around them */}
        <LightBeam position={[-0.42, 0.5, 0]} height={6.8} bottomRadius={1.15} intensity={0.82} color="#FFD6A5" />
        <LightBeam position={[0.46, 0.5, 0.12]} height={6.2} bottomRadius={0.92} color="#EFA7B8" intensity={0.38} />
        <pointLight position={[0, 2.2, 0.8]} intensity={3.2} distance={10} decay={2} color="#FFFDFB" />
      </group>

      {/* dreamy clouds */}
      <GlowSprite position={[0, 9.5, -28]} scale={18} color="#FFE8C7" opacity={0.14} />
    </group>
  )
}
