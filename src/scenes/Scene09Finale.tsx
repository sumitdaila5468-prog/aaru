/* ------------------------------------------------------------------ */
/*  SCENE 9 — The reveal: the camera pulls back, the universe grows     */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo } from 'react'
import gsap from 'gsap'
import { SceneEnvironment } from '../components/effects/SceneEnvironment'
import { Starfield } from '../components/effects/Starfield'
import { Petals } from '../components/effects/Petals'
import { ParticleField, RevealBurst } from '../components/effects/ParticleField'
import { HeartConstellation } from '../components/effects/HeartConstellation'
import { LightBeam } from '../components/effects/LightBeam'
import { GlowSprite } from '../components/effects/GlowSprite'
import { Ground } from '../components/effects/Ground'
import { SkyDome } from '../components/effects/SkyDome'
import { useSceneShots } from '../hooks/useSceneShots'
import { adaptShot } from '../utils/math'
import { useExperience } from '../state/experience'

export function Scene09Finale() {
  const isMobile = useExperience((s) => s.isMobile)

  const shots = useMemo(
    () => [
      {
        shot: adaptShot(
          {
            position: [0, 1.78, 5.6],
            lookAt: [0, 1.35, 0],
            fov: 42,
            duration: 0,
            parallax: 0.3,
          },
          isMobile,
        ),
      },
      {
        shot: adaptShot(
          {
            // the long, slow pull-back — gentle easing, never sudden
            position: [0, 2.3, 20.5],
            lookAt: [0, 1.7, -1],
            fov: 44,
            duration: 28,
            ease: 'sine.inOut',
            parallax: 0.24,
          },
          isMobile,
        ),
        at: 0.4,
      },
    ],
    [isMobile],
  )
  useSceneShots(shots)

  /* the universe quietly expands while we watch */
  useEffect(() => {
    const proxy = { v: 1 }
    const tween = gsap.to(proxy, {
      v: 1.8,
      duration: 27,
      ease: 'sine.inOut',
      onUpdate: () => {
        useExperience.getState().setUniverseScale(proxy.v)
      },
    })
    return () => {
      tween.kill()
      useExperience.getState().setUniverseScale(1)
    }
  }, [])

  return (
    <group>
      {/* most beautiful — sunset dissolving into deep burgundy + lavender night */}
      <SceneEnvironment preset="night" keyIntensity={0.92} />
      {/* layered sky — starts warm sunset, deepens to wine/lavender */}
      <SkyDome top="#1A0A1F" mid="#2A0E1E" horizon="#7A2945" glow={0.72} />
      <GlowSprite position={[0, 12, -32]} scale={34} color="#FFD6A5" opacity={0.10} />
      {/* warm-white stars, rose-gold glow, depth layers */}
      <Starfield count={3400} opacity={0.72} colorA="#FFFDFB" colorB="#FFD6A5" />
      <Starfield count={1200} rMin={52} rMax={78} opacity={0.22} colorA="#E8D9FF" colorB="#FFE8EE" />
      <Petals count={6} area={[20, 8, 20]} opacity={0.22} />
      <ParticleField preset="reveal" count={48} scale={[18, 8, 18]} color="#FFE8C7" opacity={0.28} />
      <RevealBurst active />

      <Ground radius={34} glow={0.30} color="#2A0E1E" />

      {/* soft moonlight — characters clearly visible, warm */}
      <LightBeam position={[-0.42, 0.5, 0]} height={6.8} bottomRadius={1.12} intensity={0.72} color="#FFFDFB" />
      <LightBeam position={[0.46, 0.5, 0.12]} height={6.6} bottomRadius={0.92} color="#FFD6A5" intensity={0.34} />
      <pointLight position={[0, 3.2, 2.8]} intensity={4.2} distance={12} decay={2} color="#FFE8C7" />

      {/* heart — warm, not neon, elegant */}
      <HeartConstellation scale={0.52} position={[0, 8.6, -13]} opacity={0.92} nodeCount={30} />
      <GlowSprite position={[0, 8.2, -15]} scale={24} color="#7A2945" opacity={0.42} />
      <GlowSprite position={[-10, 11, -30]} scale={14} color="#EFA7B8" opacity={0.18} />
      <GlowSprite position={[11, 8, -26]} scale={10} color="#FFD6A5" opacity={0.14} />
      {/* subtle crescent moon glow */}
      <GlowSprite position={[7, 10.2, -26]} scale={9} color="#FFFDFB" opacity={0.12} />
    </group>
  )
}
