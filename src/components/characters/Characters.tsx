/* ------------------------------------------------------------------ */
/*  Characters — both figures together (Aaru + Partner)                  */
/*  Reusable across all 7 poses. Handles GLB swap, shadows, platform.    */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { AaruCharacter } from './AaruCharacter'
import { PartnerCharacter } from './PartnerCharacter'
import { PAIR_POSES } from './poses'
import { charactersConfig } from '../../data/characters'
import { useExperience } from '../../state/experience'
import { getGlowTexture } from '../../utils/textures'

export interface CharactersProps {
  poseKey?: string
  shadows?: boolean
  platform?: boolean
}

function GLTFCharacter({
  url,
  scale,
  rotationY,
  position,
}: {
  url: string
  scale: number
  rotationY: number
  position: [number, number, number]
}) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(true), [scene])
  return <primitive object={cloned} scale={scale} rotation={[0, rotationY, 0]} position={position} />
}

export function Characters({ poseKey = 'together', shadows = true, platform = false }: CharactersProps) {
  const pose = PAIR_POSES[poseKey] ?? PAIR_POSES.together
  const quality = useExperience((s) => s.quality)
  const glow = useMemo(() => getGlowTexture(), [])

  const femaleGlb = charactersConfig.aaru.glb
  const maleGlb = charactersConfig.partner.glb

  return (
    <group>
      {maleGlb ? (
        <GLTFCharacter url={maleGlb} scale={charactersConfig.partner.scale} rotationY={charactersConfig.partner.rotationY} position={pose.malePos} />
      ) : (
        <PartnerCharacter pose={pose.male} position={pose.malePos} castShadow={quality === 'high'} />
      )}
      {femaleGlb ? (
        <GLTFCharacter url={femaleGlb} scale={charactersConfig.aaru.scale} rotationY={charactersConfig.aaru.rotationY} position={pose.femalePos} />
      ) : (
        <AaruCharacter pose={pose.female} position={pose.femalePos} castShadow={quality === 'high'} />
      )}

      {shadows && (
        <ContactShadows
          position={[0.1, 0.001, 0]}
          opacity={0.45}
          scale={5}
          blur={2.6}
          far={2.2}
          color={'#000000'}
          frames={1}
          key={`char-shadow-${poseKey}`}
        />
      )}

      {platform && (
        <group position={[0.05, 0, 0.02]}>
          <mesh position={[0, 0.085, 0]} receiveShadow>
            <cylinderGeometry args={[0.92, 1.05, 0.17, 28]} />
            <meshStandardMaterial color={'#0d0910'} roughness={0.85} metalness={0.12} />
          </mesh>
          <sprite scale={[3.4, 3.4, 1]} position={[0, 0.02, 0]}>
            <spriteMaterial map={glow} color={'#5a1f30'} transparent opacity={0.32} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      )}
    </group>
  )
}

if (charactersConfig.aaru.glb) useGLTF.preload(charactersConfig.aaru.glb)
if (charactersConfig.partner.glb) useGLTF.preload(charactersConfig.partner.glb)
