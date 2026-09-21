/* ------------------------------------------------------------------ */
/*  AaruCharacter — the female figure, Aaru / Aarju                      */
/*  Premium cinematic: reads appearance from characters.ts, supports     */
/*  all 7 poses, idle life (breath, blink, sway) and cinematic light.   */
/* ------------------------------------------------------------------ */

import { CharacterFigure } from './CharacterFigure'
import type { CharacterPose } from './poses'
import { charactersConfig } from '../../data/characters'

interface AaruCharacterProps {
  pose: CharacterPose
  position?: [number, number, number]
  rotationY?: number
  phase?: number
  castShadow?: boolean
}

export function AaruCharacter({
  pose,
  position,
  rotationY,
  phase = 1.7,
  castShadow = true,
}: AaruCharacterProps) {
  return (
    <CharacterFigure
      variant="female"
      pose={pose}
      position={position}
      rotationY={rotationY}
      phase={phase}
      castShadow={castShadow}
      appearance={charactersConfig.aaru}
    />
  )
}
