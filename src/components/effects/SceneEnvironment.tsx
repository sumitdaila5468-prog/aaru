/* ------------------------------------------------------------------ */
/*  SceneEnvironment — fog, background colour and lighting rigs         */
/*  per scene mood: night / dawn / void                                 */
/* ------------------------------------------------------------------ */

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'

export type EnvPreset = 'night' | 'dawn' | 'garden' | 'sunset' | 'dream' | 'void'

const PRESETS: Record<EnvPreset, { bg: string; fog: string; near: number; far: number }> = {
  night: { bg: '#2A0E1E', fog: '#3A1025', near: 9, far: 58 },
  dawn: { bg: '#FFE8EE', fog: '#FFE8C7', near: 8, far: 62 },
  garden: { bg: '#FFE8EE', fog: '#FFF7F8', near: 10, far: 64 },
  sunset: { bg: '#FFE8C7', fog: '#F8C8D4', near: 10, far: 68 },
  dream: { bg: '#3A1025', fog: '#4A1A35', near: 7, far: 52 },
  void: { bg: '#2A0E1E', fog: '#2A0E1E', near: 3, far: 26 },
}

/** Tweens scene fog + background between presets. */
// eslint-disable-next-line react-refresh/only-export-components -- dev fast-refresh nicety; hook is cohesive with the presets here
export function useSceneEnvironment(preset: EnvPreset): void {
  const scene = useThree((s) => s.scene)
  const { bg, fog: fogColor, near, far } = PRESETS[preset]

  useEffect(() => {
    if (!(scene.background instanceof THREE.Color)) {
      scene.background = new THREE.Color(bg)
    }
    if (!(scene.fog instanceof THREE.Fog)) {
      scene.fog = new THREE.Fog(fogColor, near, far)
    }
    const background = scene.background as THREE.Color
    const fog = scene.fog as THREE.Fog
    const target = new THREE.Color(bg)
    const fogTarget = new THREE.Color(fogColor)
    const tween = gsap.timeline()
    tween.to(
      background,
      { r: target.r, g: target.g, b: target.b, duration: 2.2, ease: 'sine.inOut' },
      0,
    )
    tween.to(
      fog.color,
      { r: fogTarget.r, g: fogTarget.g, b: fogTarget.b, duration: 2.2, ease: 'sine.inOut' },
      0,
    )
    tween.to(fog, { near, far, duration: 2.2, ease: 'sine.inOut' }, 0)
    return () => {
      tween.kill()
    }
  }, [scene, bg, fogColor, near, far])
}

interface SceneEnvironmentProps {
  preset: EnvPreset
  /** extra warm key light rig for character close-ups */
  keyIntensity?: number
}

/** The lighting rig component — pair with useSceneEnvironment in each scene. */
export function SceneEnvironment({ preset, keyIntensity = 1 }: SceneEnvironmentProps) {
  useSceneEnvironment(preset)

  if (preset === 'dawn' || preset === 'sunset') {
    return (
      <>
        <ambientLight intensity={0.42} color={'#FFE8C7'} />
        <directionalLight position={[0, 2.8, -12]} intensity={2.4 * keyIntensity} color={'#FFD6A5'} castShadow />
        <directionalLight position={[4, 6, 8]} intensity={0.62} color={'#FFFDFB'} />
        <pointLight position={[-3, 2.2, -2]} intensity={6} distance={14} decay={2} color={'#EFA7B8'} />
        <pointLight position={[2.8, 2.4, 2.5]} intensity={5} distance={14} decay={2} color={'#FFD6A5'} />
      </>
    )
  }

  if (preset === 'garden') {
    return (
      <>
        {/* warm rose-gold key — sunset through trees */}
        <ambientLight intensity={0.48} color={'#FFF7F8'} />
        <directionalLight position={[2, 4.5, -6]} intensity={2.1 * keyIntensity} color={'#FFD6A5'} castShadow />
        <directionalLight position={[-4, 5, 4]} intensity={0.55} color={'#FFE8EE'} />
        {/* soft pink rim */}
        <pointLight position={[-2.8, 2.0, -3.2]} intensity={9} distance={16} decay={2} color={'#EFA7B8'} />
        <pointLight position={[3.0, 1.8, -2.8]} intensity={7} distance={14} decay={2} color={'#FFD6A5'} />
        {/* cream fill — faces clearly visible */}
        <pointLight position={[0, 2.8, 4.2]} intensity={4.2} distance={12} decay={2} color={'#FFFDFB'} />
        {/* subtle lavender ambient */}
        <hemisphereLight args={['#E8D9FF', '#FFE8C7', 0.32]} />
      </>
    )
  }

  if (preset === 'dream') {
    return (
      <>
        <ambientLight intensity={0.32} color={'#E8D9FF'} />
        <directionalLight position={[0, 3, -6]} intensity={1.15 * keyIntensity} color={'#FFE8EE'} />
        <pointLight position={[-2.8, 1.8, -2]} intensity={10} distance={14} decay={2} color={'#7A2945'} />
        <pointLight position={[2.5, 1.6, 1.2]} intensity={6} distance={12} decay={2} color={'#EFA7B8'} />
        <pointLight position={[0, 2.8, 3.5]} intensity={3.2} distance={10} decay={2} color={'#FFD6A5'} />
      </>
    )
  }

  if (preset === 'void') {
    return (
      <>
        <ambientLight intensity={0.22} color={'#FFF7F8'} />
        <pointLight position={[0, 3, 0]} intensity={8} distance={14} decay={2} color={'#FFD6A5'} />
      </>
    )
  }

  // night — warm-white stars with rose-gold glow, deep wine depth
  return (
    <>
      <ambientLight intensity={0.28} color={'#E8D9FF'} />
      <directionalLight position={[4, 8, 3]} intensity={1.1 * keyIntensity} color={'#FFFDFB'} castShadow />
      <pointLight position={[-3.2, 2.4, -3]} intensity={12} distance={16} decay={2} color={'#7A2945'} />
      <pointLight position={[3.2, 2.1, -2.6]} intensity={9} distance={14} decay={2} color={'#EFA7B8'} />
      <pointLight position={[0, 3, 4.5]} intensity={4.0} distance={12} decay={2} color={'#FFE8C7'} />
      <hemisphereLight args={['#E8D9FF', '#7A2945', 0.22]} />
    </>
  )
}
