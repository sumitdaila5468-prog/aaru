/* ------------------------------------------------------------------ */
/*  Environment — three cinematic worlds for the film                     */
/*                                                                      */
/*  night    — dark sky, thousands of stars, moon light, fog, ground     */
/*  dream    — burgundy / rose haze, floating orbs, light rays           */
/*  dawn     — blue→warm gradient, horizon glow, soft sunlight            */
/*                                                                      */
/*  Reusable: <Environment preset="night" /> etc. Handles fog, sky,     */
/*  lighting, ground and particles in one place.                        */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { Float } from '@react-three/drei'
import { SkyDome } from './SkyDome'
import { Ground } from './Ground'
import { Starfield } from './Starfield'
import { ParticleField, RomanticOrbs } from './ParticleField'
import { LightBeam } from './LightBeam'
import { GlowSprite } from './GlowSprite'
import { story } from '../../data/story'
import { useExperience } from '../../state/experience'

export type EnvironmentPreset = 'night' | 'dream' | 'dawn' | 'garden' | 'sunset' | 'void'

const PRESETS: Record<EnvironmentPreset, { bg: string; fog: string; near: number; far: number }> = {
  night: { bg: '#2A0E1E', fog: '#3A1025', near: 9, far: 58 },
  dream: { bg: '#3A1025', fog: '#4A1A35', near: 7, far: 52 },
  dawn: { bg: '#FFE8EE', fog: '#FFE8C7', near: 8, far: 62 },
  garden: { bg: '#FFE8EE', fog: '#FFF7F8', near: 10, far: 64 },
  sunset: { bg: '#FFE8C7', fog: '#F8C8D4', near: 10, far: 68 },
  void: { bg: '#2A0E1E', fog: '#2A0E1E', near: 3, far: 26 },
}

function useEnvFog(preset: EnvironmentPreset): void {
  const scene = useThree((s) => s.scene)
  const { bg, fog: fogColor, near, far } = PRESETS[preset]
  useEffect(() => {
    if (!(scene.background instanceof THREE.Color)) scene.background = new THREE.Color(bg)
    if (!(scene.fog instanceof THREE.Fog)) scene.fog = new THREE.Fog(fogColor, near, far)
    const background = scene.background as THREE.Color
    const fog = scene.fog as THREE.Fog
    const target = new THREE.Color(bg)
    const fogTarget = new THREE.Color(fogColor)
    const tl = gsap.timeline()
    tl.to(background, { r: target.r, g: target.g, b: target.b, duration: 2.2, ease: 'sine.inOut' }, 0)
    tl.to(fog.color, { r: fogTarget.r, g: fogTarget.g, b: fogTarget.b, duration: 2.2, ease: 'sine.inOut' }, 0)
    tl.to(fog, { near, far, duration: 2.2, ease: 'sine.inOut' }, 0)
    return () => { tl.kill() }
  }, [scene, bg, fogColor, near, far])
}

interface EnvironmentProps {
  preset: EnvironmentPreset
  keyIntensity?: number
  showGround?: boolean
  showStars?: boolean
  showParticles?: boolean
}

export function Environment({
  preset,
  keyIntensity = 1,
  showGround = true,
  showStars = true,
  showParticles = true,
}: EnvironmentProps) {
  useEnvFog(preset)

  return (
    <>
      {/* sky — romantic luxury gradients */}
      {preset === 'night' && <SkyDome top="#1A0A1F" mid="#2A0E1E" horizon="#7A2945" glow={0.58} />}
      {preset === 'dream' && <SkyDome top="#2A0E1E" mid="#4A1A35" horizon="#9E3D5C" glow={0.78} />}
      {preset === 'dawn' && <SkyDome top="#FFE8EE" mid="#FFE8C7" horizon="#FFA07A" glow={1.15} />}
      {preset === 'garden' && <SkyDome top="#FFE8EE" mid="#FFF7F8" horizon="#FFD6A5" glow={0.95} />}
      {preset === 'sunset' && <SkyDome top="#FFD6A5" mid="#FFE8EE" horizon="#FF8A6B" glow={1.22} />}
      {preset === 'void' && <SkyDome top="#2A0E1E" mid="#3A1025" horizon="#5A1832" glow={0.28} />}

      {/* stars — warm-white with rose-gold */}
      {showStars && preset === 'night' && <Starfield count={3400} opacity={0.72} colorA="#FFFDFB" colorB="#FFD6A5" />}
      {showStars && preset === 'dream' && <Starfield count={1600} opacity={0.38} colorA="#FFE8EE" colorB="#F8C8D4" />}
      {showStars && preset === 'dawn' && <Starfield count={700} rMin={30} rMax={60} opacity={0.18} colorA="#FFFDFB" colorB="#FFD6A5" />}
      {showStars && preset === 'garden' && <Starfield count={900} rMin={30} rMax={58} opacity={0.22} colorA="#FFFDFB" colorB="#FFE8C7" />}
      {showStars && preset === 'sunset' && <Starfield count={600} rMin={32} rMax={60} opacity={0.16} colorA="#FFFDFB" colorB="#FFD6A5" />}
      {showStars && preset === 'void' && <Starfield count={420} rMin={26} rMax={60} opacity={0.18} colorA="#FFFDFB" colorB="#E8D9FF" />}

      {/* ground */}
      {showGround && preset === 'dream' && <Ground radius={28} glow={0.32} color="#3A1025" />}
      {showGround && preset === 'garden' && <Ground radius={34} glow={0.42} color="#2A4A2E" />}
      {showGround && preset === 'sunset' && <Ground radius={34} glow={0.36} color="#3D2A1A" />}
      {showGround && preset === 'dawn' && <Ground radius={30} glow={0.28} color="#E8D4B8" />}
      {showGround && preset === 'night' && <Ground radius={26} glow={0.22} color="#1A0A14" />}
      {showGround && preset !== 'void' && !['dream','garden','sunset','dawn','night'].includes(preset) && <Ground radius={24} glow={0.38} color="#070509" />}
      {showGround && preset === 'void' && (
        <mesh position={[0, 0.001, -1.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.4, 36]} />
          <meshStandardMaterial color={'#2A0E1E'} roughness={0.9} metalness={0.05} />
        </mesh>
      )}

      {/* particles */}
      {showParticles && preset === 'dream' && (
        <>
          <ParticleField preset="romantic" count={90} scale={[14, 6, 14]} />
          <RomanticOrbs count={5} radius={6} height={2.8} />
        </>
      )}
      {showParticles && preset === 'night' && <ParticleField preset="dust" />}
      {showParticles && preset === 'dawn' && <ParticleField preset="dust" count={70} scale={[14, 6, 16]} color={story.theme.dawn} />}

      {/* particles */}
      {showParticles && preset === 'dream' && (
        <>
          <ParticleField preset="romantic" count={90} scale={[14, 6, 14]} />
          <RomanticOrbs count={5} radius={6} height={2.8} />
        </>
      )}
      {showParticles && preset === 'garden' && (
        <>
          <ParticleField preset="romantic" count={70} scale={[16, 7, 16]} color="#FFD6A5" />
          <RomanticOrbs count={4} radius={5.5} height={2.8} />
        </>
      )}
      {showParticles && preset === 'night' && <ParticleField preset="dust" color="#FFE8C7" />}
      {showParticles && preset === 'dawn' && <ParticleField preset="dust" count={70} scale={[14, 6, 16]} color="#FFD6A5" />}
      {showParticles && preset === 'sunset' && <ParticleField preset="dust" count={60} scale={[18, 7, 18]} color="#FFD6A5" />}

      {/* lighting — warm rose-gold, cream fill, lavender ambient */}
      {preset === 'night' && (
        <>
          <ambientLight intensity={0.32} color={'#E8D9FF'} />
          <directionalLight position={[4, 8, 3]} intensity={1.15 * keyIntensity} color={'#FFFDFB'} castShadow={keyIntensity > 0.5} />
          <pointLight position={[-3.2, 2.4, -3]} intensity={13} distance={16} decay={2} color={'#7A2945'} />
          <pointLight position={[3.2, 2.1, -2.6]} intensity={9} distance={14} decay={2} color={'#EFA7B8'} />
          <pointLight position={[0, 3, 4.5]} intensity={4.6} distance={12} decay={2} color={'#FFE8C7'} />
          <hemisphereLight args={['#E8D9FF', '#7A2945', 0.24]} />
        </>
      )}
      {preset === 'dream' && (
        <>
          <ambientLight intensity={0.32} color={'#E8D9FF'} />
          <directionalLight position={[0, 3, -6]} intensity={1.15 * keyIntensity} color={'#FFE8EE'} />
          <pointLight position={[-2.8, 1.8, -2]} intensity={10} distance={14} decay={2} color={'#7A2945'} />
          <pointLight position={[2.5, 1.6, 1.2]} intensity={6} distance={12} decay={2} color={'#EFA7B8'} />
          <pointLight position={[0, 2.8, 3.5]} intensity={3.2} distance={10} decay={2} color={'#FFD6A5'} />
          <LightBeam position={[-1.2, 1.6, -1]} height={6} bottomRadius={1.05} intensity={0.22} />
          <LightBeam position={[1.0, 1.4, 0.8]} height={5.4} bottomRadius={0.9} color={'#EFA7B8'} intensity={0.18} />
        </>
      )}
      {preset === 'garden' && (
        <>
          <ambientLight intensity={0.52} color={'#FFE8EE'} />
          <directionalLight position={[2, 4.5, -6]} intensity={1.85 * keyIntensity} color={'#FFD6A5'} castShadow />
          <directionalLight position={[-4, 5, 4]} intensity={0.62} color={'#FFFDFB'} />
          <pointLight position={[-2.8, 2.0, -3.2]} intensity={9} distance={16} decay={2} color={'#EFA7B8'} />
          <pointLight position={[3.0, 1.8, -2.8]} intensity={7} distance={14} decay={2} color={'#FFD6A5'} />
          <pointLight position={[0, 2.8, 4.2]} intensity={4.6} distance={12} decay={2} color={'#FFFDFB'} />
          <hemisphereLight args={['#E8D9FF', '#FFE8C7', 0.28]} />
        </>
      )}
      {preset === 'sunset' && (
        <>
          <ambientLight intensity={0.48} color={'#FFE8C7'} />
          <directionalLight position={[1, 3.2, -10]} intensity={2.3 * keyIntensity} color={'#FFD6A5'} castShadow />
          <directionalLight position={[4, 5, 7]} intensity={0.6} color={'#FFFDFB'} />
          <pointLight position={[2.8, 2.4, 2]} intensity={5} distance={14} decay={2} color={'#9E3D5C'} />
          <GlowSprite position={[2.6, 1.4, -30]} scale={28} color={'#FFD6A5'} opacity={0.58} />
          <GlowSprite position={[2.6, 0.9, -30]} scale={16} color={'#FFE8C7'} opacity={0.38} />
        </>
      )}
      {preset === 'dawn' && (
        <>
          <ambientLight intensity={0.42} color={'#FFE8C7'} />
          <directionalLight position={[0, 2.8, -12]} intensity={2.2 * keyIntensity} color={'#FFD6A5'} castShadow />
          <directionalLight position={[4, 6, 8]} intensity={0.62} color={'#FFFDFB'} />
          <pointLight position={[3, 2.5, 2]} intensity={5} distance={14} decay={2} color={'#9E3D5C'} />
          <GlowSprite position={[2.6, 1.4, -30]} scale={26} color={'#FFD6A5'} opacity={0.56} />
          <GlowSprite position={[2.6, 0.9, -30]} scale={14} color={'#FFE8C7'} opacity={0.34} />
          <DawnClouds />
        </>
      )}
      {preset === 'void' && (
        <>
          <ambientLight intensity={0.34} color={'#FFE8EE'} />
          <pointLight position={[0, 3, 0]} intensity={9} distance={14} decay={2} color={'#FFD6A5'} />
          <hemisphereLight args={['#FFE8EE', '#7A2945', 0.18]} />
        </>
      )}
    </>
  )
}

function DawnClouds() {
  const reduced = useExperience((s) => s.reducedMotion)
  const isMobile = useExperience((s) => s.isMobile)
  const count = isMobile || reduced ? 2 : 3
  const clouds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (i - 1) * 5.5 + (Math.random() - 0.5) * 2,
        z: -18 - i * 3.5,
        y: 3.2 + i * 0.6,
        scale: 7 + Math.random() * 5,
        opacity: 0.08 + Math.random() * 0.07,
      })),
    [count],
  )
  return (
    <group>
      {clouds.map((c, i) => (
        <Float key={i} speed={0.35 + i * 0.12} rotationIntensity={0.03} floatIntensity={0.25} floatingRange={[-0.08, 0.08]}>
          <mesh position={[c.x, c.y, c.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[c.scale, c.scale * 0.55]} />
            <meshStandardMaterial color={'#c97a55'} transparent opacity={c.opacity} depthWrite={false} roughness={1} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
