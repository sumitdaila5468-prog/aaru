/* ==================================================================
 *  CHARACTERS — premium cinematic appearance configuration
 *
 *  Edit ANY value below and the 3D characters update instantly.
 *  No code changes required elsewhere.
 *
 *  These are fictional artistic representations — not photorealistic
 *  likenesses. Keep them elegant, never plastic or exaggerated.
 * ================================================================== */

export type HairStyle = 'long-wavy' | 'long-straight' | 'shoulder-bob' | 'ponytail' | 'short-modern' | 'short-cropped' | 'side-part'
export type OutfitStyle = 'gown-rose' | 'gown-burgundy' | 'dress-ivory' | 'kurta-modern' | 'shirt-casual' | 'suit-elegant'
export type SkinPreset = 'warm-light' | 'warm-medium' | 'warm-deep' | 'porcelain' | 'olive'

export interface CharacterAppearance {
  /** display name */
  name: string
  nickname?: string
  /** skin */
  skinTone: string // hex
  skinPreset: SkinPreset
  /** hair */
  hairStyle: HairStyle
  hairColor: string // hex
  /** outfit */
  outfit: OutfitStyle
  outfitColor: string // hex (overrides preset if you want)
  outfitAccent: string // hex — sheen / embroidery highlight
  /** accessories — keep subtle and cinematic */
  accessories: {
    earrings: boolean
    pendant: boolean
    bracelet: boolean
  }
  /** optional GLB override — see README §4 */
  glb: string | null
  scale: number
  rotationY: number
}

export interface CharactersConfig {
  aaru: CharacterAppearance
  partner: CharacterAppearance
}

export const charactersConfig: CharactersConfig = {
  aaru: {
    name: 'Aarju',
    nickname: 'Aaru',
    skinTone: '#F5D6C8', // warm soft blush — romantic luxury
    skinPreset: 'warm-light',
    hairStyle: 'long-wavy',
    hairColor: '#2B1B1E', // soft deep chestnut — not harsh black
    outfit: 'dress-ivory',
    outfitColor: '#FFFDFB', // soft ivory / blush dress — as requested
    outfitAccent: '#EFA7B8', // dusty rose sheen
    accessories: {
      earrings: true,
      pendant: true,
      bracelet: false,
    },
    glb: null,
    scale: 1,
    rotationY: 0,
  },
  partner: {
    name: 'you',
    nickname: undefined,
    skinTone: '#E8C9B5',
    skinPreset: 'warm-medium',
    hairStyle: 'short-modern',
    hairColor: '#1F1620',
    outfit: 'shirt-casual',
    outfitColor: '#FFF7F8', // cream shirt
    outfitAccent: '#7A2945', // burgundy accent for trousers harmony
    accessories: {
      earrings: false,
      pendant: false,
      bracelet: false,
    },
    glb: null,
    scale: 1,
    rotationY: 0,
  },
}

/** Map outfit presets to cinematic colour pairs (outfitColor, accent) */
export const OUTFIT_PRESETS: Record<OutfitStyle, { color: string; accent: string }> = {
  'gown-rose': { color: '#FFF7F8', accent: '#EFA7B8' }, // blush with rose sheen
  'gown-burgundy': { color: '#FFFDFB', accent: '#9E3D5C' }, // ivory with wine
  'dress-ivory': { color: '#FFFDFB', accent: '#EFA7B8' }, // soft ivory — Aaru suggested
  'kurta-modern': { color: '#FFF7F8', accent: '#7A2945' },
  'shirt-casual': { color: '#FFFDFB', accent: '#7A2945' }, // cream shirt — male suggested
  'suit-elegant': { color: '#2E2428', accent: '#5A1832' }, // charcoal + wine
}

/** Resolve final outfit colour — explicit override wins, otherwise preset */
export function resolveOutfit(appearance: CharacterAppearance): { color: string; accent: string } {
  const preset = OUTFIT_PRESETS[appearance.outfit]
  return {
    color: appearance.outfitColor || preset.color,
    accent: appearance.outfitAccent || preset.accent,
  }
}
