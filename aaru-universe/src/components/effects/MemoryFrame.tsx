/* ------------------------------------------------------------------ */
/*  MemoryFrame — a single floating 3D photo frame for Aaru's gallery     */
/*  Slow float, micro-rotation, pointer tilt, soft lighting & shadow,     */
/*  hover grow, click to expand (camera + lightbox).                    */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { damp } from '../../utils/math'
import { getGlowTexture } from '../../utils/textures'
import { useExperience } from '../../state/experience'
import { story } from '../../data/story'

interface MemoryFrameProps {
  position: [number, number, number]
  rotY: number
  texture: THREE.Texture
  index: number
  onOpen: () => void
}

export function MemoryFrame({ position, rotY, texture, index, onOpen }: MemoryFrameProps) {
  const outer = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const hover = useRef(false)
  const glowTexture = useMemo(() => getGlowTexture(), [])

  // one-by-one entrance: photo cinema stagger
  useEffect(() => {
    const g = outer.current
    if (!g) return
    const reduced = useExperience.getState().reducedMotion
    gsap.set(g.scale, { x: 0.85, y: 0.85, z: 0.85 })
    // hidden via scale; gsap will reveal
    const tween = gsap.to(g.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: reduced ? 0.5 : 1.1,
      delay: reduced ? 0 : index * 0.32,
      ease: 'power2.out',
    })
    return () => {
      tween.kill()
    }
  }, [index])

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    if (!inner.current) return
    const reduced = useExperience.getState().reducedMotion
    const isMobile = useExperience.getState().isMobile
    const tiltY = reduced || isMobile ? 0 : state.pointer.x * 0.2
    const tiltX = reduced || isMobile ? 0 : -state.pointer.y * 0.12
    inner.current.rotation.y = damp(inner.current.rotation.y, tiltY, 2.5, dt)
    inner.current.rotation.x = damp(inner.current.rotation.x, tiltX, 2.5, dt)
    const s = damp(inner.current.scale.x, hover.current ? 1.055 : 1, 4, dt)
    inner.current.scale.setScalar(s)
  })

  return (
    <group ref={outer} position={position} rotation={[0, rotY, 0]}>
      <Float
        speed={1.1 + (index % 3) * 0.18}
        rotationIntensity={0.08}
        floatIntensity={0.5}
        floatingRange={[-0.045, 0.06]}
      >
        <group
          ref={inner}
          onClick={(e) => {
            e.stopPropagation()
            onOpen()
          }}
          onPointerOver={() => {
            hover.current = true
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            hover.current = false
            document.body.style.cursor = ''
          }}
        >
          {/* precious memory frame — cream + rose-gold */}
          <mesh position={[0, 0, -0.045]} castShadow receiveShadow>
            <boxGeometry args={[1.68, 2.08, 0.028]} />
            <meshStandardMaterial color={'#EFA7B8'} roughness={0.45} metalness={0.14} />
          </mesh>
          {/* cream border */}
          <mesh position={[0, 0, -0.03]} castShadow receiveShadow>
            <boxGeometry args={[1.62, 2.02, 0.052]} />
            <meshStandardMaterial color={'#FFFDFB'} roughness={0.38} metalness={0.06} />
          </mesh>
          {/* warm inner edge */}
          <mesh position={[0, 0, 0.018]} castShadow receiveShadow>
            <boxGeometry args={[1.49, 1.89, 0.012]} />
            <meshStandardMaterial color={'#FFE8C7'} roughness={0.5} transparent opacity={0.92} />
          </mesh>
          {/* photo */}
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[1.46, 1.86]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
          {/* warm light behind — precious glow */}
          <sprite scale={[3.4, 3.9, 1]} position={[0, 0, -0.16]}>
            <spriteMaterial
              map={glowTexture}
              color={'#FFD6A5'}
              transparent
              opacity={0.38}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <sprite scale={[2.2, 2.6, 1]} position={[0, 0, -0.12]}>
            <spriteMaterial
              map={glowTexture}
              color={story.theme.rose}
              transparent
              opacity={0.22}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
          <pointLight intensity={1.6} distance={2.4} decay={2} color={'#FFD6A5'} position={[0, 0, 0.3]} />
        </group>
      </Float>

      {/* underglow — memory lit from below */}
      <sprite scale={[1.9, 0.9, 1]} position={[0, -1.25, 0.05]}>
        <spriteMaterial
          map={glowTexture}
          color={story.theme.rose}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}
