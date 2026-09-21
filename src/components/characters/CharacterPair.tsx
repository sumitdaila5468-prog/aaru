/* ------------------------------------------------------------------ */
/*  CharacterPair — the two of them                                     */
/*                                                                      */
/*  Renders the procedural figures by default. If you set a glb path   */
/*  in story.ts (characters.female.glb / characters.male.glb) the      */
/*  matching figure is replaced by your own model — see README §4.     */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { CharacterFigure } from './CharacterFigure'
import { PAIR_POSES } from './poses'
import { story } from '../../data/story'
import { useExperience } from '../../state/experience'
import { getGlowTexture } from '../../utils/textures'

interface GLTFCharacterProps {
  url: string
  scale: number
  rotationY: number
  position: [number, number, number]
}

/** Your own GLB model, positioned like a built-in figure. */
function GLTFCharacter({ url, scale, rotationY, position }: GLTFCharacterProps) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(true), [scene])
  return (
    <primitive
      object={cloned}
      scale={scale}
      rotation={[0, rotationY, 0]}
      position={position}
    />
  )
}

export interface CharacterPairProps {
  /** one of the pose keys from PAIR_POSES */
  poseKey?: string
  /** show the soft ground shadow */
  shadows?: boolean
  /** show the sitting platform (used by the "sitting" pose) */
  platform?: boolean
}

export function CharacterPair({ poseKey = 'together', shadows = true, platform = false }: CharacterPairProps) {
  const pose = PAIR_POSES[poseKey] ?? PAIR_POSES.together
  const quality = useExperience((s) => s.quality)
  const glow = useMemo(() => getGlowTexture(), [])

  const femaleGlb = story.characters.female.glb
  const maleGlb = story.characters.male.glb

  return (
    <group>
      {/* the two figures */}
      {maleGlb ? (
        <GLTFCharacter
          url={maleGlb}
          scale={story.characters.male.scale}
          rotationY={story.characters.male.rotationY}
          position={pose.malePos}
        />
      ) : (
        <CharacterFigure
          variant="male"
          pose={pose.male}
          position={pose.malePos}
          phase={0}
          castShadow={quality === 'high'}
        />
      )}
      {femaleGlb ? (
        <GLTFCharacter
          url={femaleGlb}
          scale={story.characters.female.scale}
          rotationY={story.characters.female.rotationY}
          position={pose.femalePos}
        />
      ) : (
        <CharacterFigure
          variant="female"
          pose={pose.female}
          position={pose.femalePos}
          phase={1.7}
          castShadow={quality === 'high'}
        />
      )}

      {/* soft contact shadow */}
      {shadows && (
        <ContactShadows
          position={[0.1, 0.001, 0]}
          opacity={0.5}
          scale={5}
          blur={2.6}
          far={2.2}
          color={'#000000'}
          frames={1}
          key={`pair-shadow-${poseKey}`}
        />
      )}

      {/* low glowing stone they sit on in the "sitting" pose */}
      {platform && (
        <group position={[0.05, 0, 0.02]}>
          <mesh position={[0, 0.085, 0]} receiveShadow>
            <cylinderGeometry args={[0.92, 1.05, 0.17, 28]} />
            <meshStandardMaterial color={'#0d0910'} roughness={0.85} metalness={0.12} />
          </mesh>
          <sprite scale={[3.4, 3.4, 1]} position={[0, 0.02, 0]}>
            <spriteMaterial
              map={glow}
              color={story.theme.burgundy}
              transparent
              opacity={0.32}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </sprite>
        </group>
      )}
    </group>
  )
}

/* Preload user-provided models if configured. */
if (story.characters.female.glb) useGLTF.preload(story.characters.female.glb)
if (story.characters.male.glb) useGLTF.preload(story.characters.male.glb)
