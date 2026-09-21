/* ------------------------------------------------------------------ */
/*  CinematicStage — generic super-premium 3D environment for any stage */
/*  Handles: layered depth, volumetric light, haze, bokeh, DoF subtle.   */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { Environment } from '../components/effects/Environment'
import { Ground } from '../components/effects/Ground'
import { GlowSprite } from '../components/effects/GlowSprite'
import { Starfield } from '../components/effects/Starfield'
import { ParticleField } from '../components/effects/ParticleField'
import { useSceneShots } from '../hooks/useSceneShots'
import { adaptShot } from '../utils/math'
import { useExperience } from '../state/experience'
import { story } from '../data/story'

type Preset = 'sunset' | 'garden' | 'dream' | 'dawn' | 'night' | 'void'

interface Props {
  preset: Preset
  keyIntensity?: number
  groundColor?: string
  showStars?: boolean
  showParticles?: boolean
  shotIndex?: number
}

export function CinematicStage({ preset, keyIntensity = 0.76, groundColor = '#1A0A14', showStars = false, showParticles = false, shotIndex = 0 }: Props) {
  const isMobile = useExperience((s) => s.isMobile)

  const shots = useMemo(() => {
    const bases: Array<{ pos: [number, number, number]; look: [number, number, number]; fov: number }> = [
      { pos: [0, 1.64, 5.0], look: [0, 1.42, -1.0], fov: 42 },
      { pos: [0.18, 1.58, 4.6], look: [0, 1.38, -0.8], fov: 40 },
      { pos: [-0.14, 1.68, 5.2], look: [0, 1.46, -1.2], fov: 43 },
      { pos: [0, 1.72, 4.8], look: [0, 1.48, -1.0], fov: 41 },
    ]
    const b = bases[shotIndex % bases.length]
    return [
      { shot: adaptShot({ position: b.pos, lookAt: b.look, fov: b.fov, duration: 0, parallax: 0.28 }, isMobile) },
      { shot: adaptShot({ position: [b.pos[0] * 0.96, b.pos[1] - 0.04, b.pos[2] - 0.3] as [number, number, number], lookAt: b.look, fov: b.fov - 0.6, duration: 14, ease: 'sine.inOut', parallax: 0.32 }, isMobile), at: 0.8 },
    ]
  }, [isMobile, shotIndex])
  useSceneShots(shots)

  return (
    <group>
      <Environment preset={preset} keyIntensity={keyIntensity} showGround={false} showStars={false} showParticles={false} />
      <Ground radius={26} glow={0.24} color={groundColor} />
      {showStars && <Starfield count={1200} opacity={0.32} colorA="#FFFDFB" colorB="#FFD6A5" />}
      {showParticles && <ParticleField preset="dust" count={28} scale={[14, 6, 14]} color="#FFE8C7" opacity={0.16} />}
      {/* layered haze */}
      <GlowSprite position={[0, 5.8, -16]} scale={20} color={story.theme.burgundy} opacity={0.18} />
      <GlowSprite position={[0, 3.2, -10]} scale={18} color="#FFE8C7" opacity={0.09} />
      <GlowSprite position={[-4, 6.2, -18]} scale={12} color="#EFA7B8" opacity={0.08} />
    </group>
  )
}
