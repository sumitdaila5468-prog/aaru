/* ------------------------------------------------------------------ */
/*  PartnerCharacter — the male figure (her partner)                     */
/* ------------------------------------------------------------------ */

import { CharacterFigure } from './CharacterFigure'
import type { CharacterPose } from './poses'
import { charactersConfig } from '../../data/characters'

interface PartnerCharacterProps {
  pose: CharacterPose
  position?: [number, number, number]
  rotationY?: number
  phase?: number
  castShadow?: boolean
}

export function PartnerCharacter({
  pose,
  position,
  rotationY,
  phase = 0,
  castShadow = true,
}: PartnerCharacterProps) {
  return (
    <CharacterFigure
      variant="male"
      pose={pose}
      position={position}
      rotationY={rotationY}
      phase={phase}
      castShadow={castShadow}
      appearance={charactersConfig.partner}
    />
  )
}
