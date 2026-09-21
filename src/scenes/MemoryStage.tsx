/* ------------------------------------------------------------------ */
/*  MemoryStage — per-photo cinematic 3D environment                     */
/*  Each photo gets its own mood, lighting, camera, atmosphere.          */
/*  Super-premium: layered depth, volumetric light, haze, bokeh, DoF.    */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { Environment } from '../components/effects/Environment'
import { Ground } from '../components/effects/Ground'
import { GlowSprite } from '../components/effects/GlowSprite'
import { ParticleField } from '../components/effects/ParticleField'
import { Starfield } from '../components/effects/Starfield'
import { useSceneShots } from '../hooks/useSceneShots'
import { adaptShot } from '../utils/math'
import { useExperience } from '../state/experience'
import { story } from '../data/story'

interface MemoryStageProps {
  index: number // 0..5
}

const PRESET_MAP: Array<{ preset: 'sunset' | 'garden' | 'dream' | 'dawn' | 'sunset' | 'night'; keyIntensity: number; groundColor: string; glowColor: string }> = [
  { preset: 'dawn', keyIntensity: 0.82, groundColor: '#E8D4B8', glowColor: '#FFE8C7' }, // 01 warm indoor cinematic
  { preset: 'sunset', keyIntensity: 0.88, groundColor: '#9EB89A', glowColor: '#FFD6A5' }, // 02 soft sunset outdoor
  { preset: 'dream', keyIntensity: 0.72, groundColor: '#140A14', glowColor: '#7A2945' }, // 03 dreamy night
  { preset: 'garden', keyIntensity: 0.78, groundColor: '#B8CCB4', glowColor: '#FFE8EE' }, // 04 elegant warm
  { preset: 'sunset', keyIntensity: 0.76, groundColor: '#8A6A7A', glowColor: '#EFA7B8' }, // 05 deep twilight
  { preset: 'night', keyIntensity: 0.68, groundColor: '#1A0A1F', glowColor: '#FFD6A5' }, // 06 dark romantic
]

export function MemoryStage({ index }: MemoryStageProps) {
  const isMobile = useExperience((s) => s.isMobile)
  const cfg = PRESET_MAP[index] ?? PRESET_MAP[0]

  const shots = useMemo(() => {
    // Each memory has subtle distinct camera
    const base = [
      { pos: [0, 1.68, 5.0], look: [0, 1.45, -1.2], fov: 42 }, // 01
      { pos: [0.22, 1.62, 4.6], look: [0, 1.4, -0.9], fov: 40 }, // 02
      { pos: [-0.18, 1.72, 5.2], look: [0, 1.5, -1.4], fov: 44 }, // 03
      { pos: [0, 1.58, 4.4], look: [0, 1.42, -1.0], fov: 41 }, // 04
      { pos: [0.16, 1.64, 4.8], look: [0, 1.46, -1.1], fov: 43 }, // 05
      { pos: [0, 1.72, 5.4], look: [0, 1.52, -1.6], fov: 42 }, // 06
    ][index] ?? { pos: [0, 1.68, 5.0], look: [0, 1.45, -1.2], fov: 42 }

    return [
      {
        shot: adaptShot({ position: base.pos as [number, number, number], lookAt: base.look as [number, number, number], fov: base.fov, duration: 0, parallax: 0.32 }, isMobile),
      },
      {
        shot: adaptShot({ position: [base.pos[0] * 0.96, base.pos[1] - 0.04, base.pos[2] - 0.3] as [number, number, number], lookAt: base.look as [number, number, number], fov: base.fov - 0.6, duration: 14, ease: 'sine.inOut', parallax: 0.34 }, isMobile),
        at: 1.0,
      },
    ]
  }, [index, isMobile])
  useSceneShots(shots)

  return (
    <group>
      <Environment preset={cfg.preset} keyIntensity={cfg.keyIntensity} showGround={false} showStars={index === 2 || index === 5} showParticles={false} />
      <Ground radius={index === 5 ? 26 : 24} glow={index === 5 ? 0.28 : 0.24} color={cfg.groundColor} />

      {/* subtle layered depth — foreground/midground/background */}
      {index === 0 && (
        <>
          <ParticleField preset="dust" count={28} scale={[12, 6, 12]} color="#FFE8C7" opacity={0.18} />
          <GlowSprite position={[0, 5.2, -14]} scale={20} color="#FFE8C7" opacity={0.14} />
          <GlowSprite position={[-3.8, 2.8, -9]} scale={12} color="#FFFDFB" opacity={0.08} />
        </>
      )}
      {index === 1 && (
        <>
          <Starfield count={420} rMin={32} rMax={60} opacity={0.09} colorA="#FFFDFB" colorB="#FFD6A5" />
          <ParticleField preset="romantic" count={32} scale={[14, 7, 14]} color="#FFD6A5" opacity={0.18} />
          <GlowSprite position={[2.2, 1.2, -22]} scale={26} color="#FFD6A5" opacity={0.38} />
        </>
      )}
      {index === 2 && (
        <>
          <Starfield count={1400} opacity={0.42} colorA="#FFE8EE" colorB="#E8D9FF" />
          <GlowSprite position={[0, 6.8, -12]} scale={18} color={story.theme.burgundy} opacity={0.28} />
          <GlowSprite position={[0, 4.2, -8]} scale={16} color="#EFA7B8" opacity={0.12} />
        </>
      )}
      {index === 3 && (
        <>
          <ParticleField preset="dust" count={36} scale={[14, 6, 14]} color="#FFE8C7" opacity={0.16} />
          <GlowSprite position={[0, 3.4, -10]} scale={22} color="#FFE8EE" opacity={0.10} />
          <GlowSprite position={[4.2, 6.2, -18]} scale={14} color="#FFD6A5" opacity={0.09} />
        </>
      )}
      {index === 4 && (
        <>
          <GlowSprite position={[0, 1.0, -18]} scale={28} color="#7A2945" opacity={0.22} />
          <GlowSprite position={[2.4, 2.8, -10]} scale={14} color="#EFA7B8" opacity={0.14} />
        </>
      )}
      {index === 5 && (
        <>
          <Starfield count={1800} opacity={0.34} colorA="#FFFDFB" colorB="#FFD6A5" />
          <ParticleField preset="dust" count={28} scale={[16, 7, 16]} color="#FFE8C7" opacity={0.12} />
          <GlowSprite position={[0, 7.2, -18]} scale={22} color="#7A2945" opacity={0.32} />
          <GlowSprite position={[6.5, 9.2, -24]} scale={10} color="#FFFDFB" opacity={0.08} />
        </>
      )}

      {/* volumetric-looking light — soft beam */}
      <GlowSprite position={[0, 6.2, -16]} scale={18} color={cfg.glowColor} opacity={0.07} />
    </group>
  )
}
