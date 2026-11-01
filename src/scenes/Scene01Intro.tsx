/* ------------------------------------------------------------------ */
/*  SCENE 0 — OPENING: golden-hour pull-back, rich champagne/burgundy    */
/*  Camera starts close to soft cinematic detail, slowly pulls back.      */
/*  Warm sunset, realistic sky, subtle clouds, atmospheric depth,          */
/*  foreground blur, golden highlights, rose/champagne, lens glow,        */
/*  realistic shadows, elegant depth. Super-premium.                      */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { Environment } from '../components/effects/Environment'
import { Starfield } from '../components/effects/Starfield'
import { Ground } from '../components/effects/Ground'
import { Petals } from '../components/effects/Petals'
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
            // close cinematic detail — intimate, shallow DoF feeling
            position: [0, 0.94, 1.35],
            lookAt: [0, 0.72, -0.6],
            fov: 28,
            duration: 0,
            parallax: 0.18,
          },
          isMobile,
        ),
      },
      {
        shot: adaptShot(
          {
            // slow pull-back revealing the world
            position: [0, 1.72, 7.8],
            lookAt: [0, 1.28, -1.2],
            fov: 40,
            duration: 16,
            ease: 'sine.inOut',
            parallax: 0.36,
          },
          isMobile,
        ),
        at: 0.6,
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
      {/* RICH golden-hour environment — warm champagne + dusty rose + deep burgundy + golden light */}
      <Environment preset="sunset" keyIntensity={0.92} showGround={false} showStars={false} showParticles={false} />
      {/* layered sky rich depth */}
      <GlowSprite position={[0, 9.2, -26]} scale={28} color="#FF8A6B" opacity={0.22} />
      <GlowSprite position={[-7, 7.2, -18]} scale={18} color="#FFD6A5" opacity={0.18} />
      <GlowSprite position={[7, 6.4, -20]} scale={16} color="#EFA7B8" opacity={0.14} />
      <GlowSprite position={[0, 3.6, -10]} scale={24} color="#FFE8C7" opacity={0.12} />

      {/* realistic ground with shadows */}
      <Ground radius={26} glow={0.32} color="#BFA090" />

      {/* atmospheric depth — foreground blur bokeh (close to camera) */}
      <GlowSprite position={[0.8, 0.72, 0.6]} scale={2.2} color="#FFE8C7" opacity={0.42} />
      <GlowSprite position={[-0.9, 0.62, 0.8]} scale={1.6} color="#FFD6A5" opacity={0.32} />
      <GlowSprite position={[0, 0.52, 1.0]} scale={3.4} color="#FFF7F8" opacity={0.18} />

      {/* midground soft haze + lens glow */}
      <Starfield count={480} rMin={28} rMax={62} opacity={0.09} colorA="#FFFDFB" colorB="#FFD6A5" />
      <Petals count={5} area={[14, 6, 14]} opacity={0.18} />
      <GlowSprite position={[0, 1.4, -8]} scale={14} color="#FFD6A5" opacity={0.16} />
      <GlowSprite position={[2.8, 4.2, -14]} scale={12} color="#EFA7B8" opacity={0.09} />

      {/* distant sunset horizon */}
      <GlowSprite position={[0, 1.0, -28]} scale={32} color="#7A2945" opacity={0.14} />
    </group>
  )
}
