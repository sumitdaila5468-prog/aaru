/* ------------------------------------------------------------------ */
/*  Poses — the quiet choreography of the two characters                */
/*  Seven cinematic poses as per the premium brief + ambient helpers    */
/* ------------------------------------------------------------------ */

import type { Vec3 } from '../../types'

export interface CharacterPose {
  rootY?: number
  rootRotY?: number
  headRotX?: number
  headRotY?: number
  torsoRotX?: number
  armL?: { x?: number; z?: number }
  armR?: { x?: number; z?: number }
  legL?: number
  legR?: number
  hipsY?: number
  gownScaleY?: number
  animate?: 'idle' | 'walk'
}

export interface PairPose {
  male: CharacterPose
  female: CharacterPose
  malePos: Vec3
  femalePos: Vec3
  /** human-readable label (optional) */
  label?: string
}

export const BASE_POSE: CharacterPose = {
  rootY: 0,
  rootRotY: 0,
  headRotX: 0,
  headRotY: 0,
  torsoRotX: 0,
  armL: { x: 0.06, z: 0.16 },
  armR: { x: 0.06, z: -0.16 },
  legL: 0,
  legR: 0,
  hipsY: 0,
  gownScaleY: 1,
  animate: 'idle',
}

const withBase = (pose: CharacterPose): CharacterPose => ({
  ...BASE_POSE,
  ...pose,
  armL: { ...BASE_POSE.armL, ...pose.armL },
  armR: { ...BASE_POSE.armR, ...pose.armR },
})

/** Seven cinematic poses + ambient helpers — all smooth, subtle, never exaggerated */
export const PAIR_POSES: Record<string, PairPose> = {
  // ambient — used by intro / universe / finale when no explicit pose
  together: {
    male: withBase({ headRotY: 0.18, torsoRotX: 0.01 }),
    female: withBase({ headRotY: -0.14, torsoRotX: 0.01 }),
    malePos: [-0.38, 0, 0],
    femalePos: [0.34, 0, 0.05],
    label: 'together',
  },

  // POSE 1 — Both standing separately (intro reveal, before they meet)
  'standing-apart': {
    male: withBase({ headRotY: 0.08, torsoRotX: 0.005 }),
    female: withBase({ headRotY: -0.08, torsoRotX: 0.005 }),
    malePos: [-1.45, 0, -0.2],
    femalePos: [1.45, 0, 0.2],
    label: 'standing separately',
  },

  // POSE 2 — Both standing next to each other (companionable)
  standing: {
    male: withBase({ headRotY: 0.14 }),
    female: withBase({ headRotY: -0.12 }),
    malePos: [-0.36, 0, 0],
    femalePos: [0.32, 0, 0.04],
    label: 'standing next to each other',
  },

  // POSE 3 — Both looking at each other (the quiet moment)
  looking: {
    male: withBase({ headRotY: 0.52, torsoRotX: 0.03, armL: { z: 0.1 }, armR: { z: -0.08 } }),
    female: withBase({ headRotY: -0.58, torsoRotX: 0.02, armL: { z: 0.1 }, armR: { z: -0.08 } }),
    malePos: [-0.52, 0, 0],
    femalePos: [0.48, 0, 0.02],
    label: 'looking at each other',
  },

  // POSE 4 — Both walking slowly together (side by side, gentle stride)
  walking: {
    male: withBase({
      animate: 'walk',
      torsoRotX: 0.07,
      legL: 0.38,
      legR: -0.32,
      armL: { x: 0.3 },
      armR: { x: -0.28 },
    }),
    female: withBase({
      animate: 'walk',
      torsoRotX: 0.05,
      legL: 0.34,
      legR: -0.28,
      armL: { x: -0.22 },
      armR: { x: 0.26 },
    }),
    malePos: [-0.42, 0, 0],
    femalePos: [0.4, 0, 0.06],
    label: 'walking slowly together',
  },

  // POSE 5 — Both sitting under the stars (legs over the edge)
  sitting: {
    male: withBase({
      rootY: 0.17,
      hipsY: -0.44,
      legL: -1.32,
      legR: -1.16,
      torsoRotX: 0.12,
      headRotX: 0.07,
      armL: { x: -0.52, z: 0.34 },
      armR: { x: -0.46, z: -0.26 },
    }),
    female: withBase({
      rootY: 0.17,
      hipsY: -0.42,
      legL: -1.24,
      legR: -1.1,
      torsoRotX: 0.06,
      gownScaleY: 0.68,
    }),
    malePos: [-0.4, 0, 0],
    femalePos: [0.36, 0, 0.05],
    label: 'sitting under the stars',
  },

  // POSE 6 — Both looking toward the horizon (dawn / future)
  horizon: {
    male: withBase({ rootRotY: Math.PI, headRotX: 0.06 }),
    female: withBase({ rootRotY: Math.PI, headRotX: 0.05, headRotY: 0.1 }),
    malePos: [0.52, 0, -1.4],
    femalePos: [0.98, 0, -1.15],
    label: 'looking toward the horizon',
  },

  // POSE 7 — Final: stand together while camera pulls away (same as together but slightly more open)
  final: {
    male: withBase({ headRotY: 0.12, torsoRotX: 0.015, armL: { z: 0.12 }, armR: { z: -0.12 } }),
    female: withBase({ headRotY: -0.1, torsoRotX: 0.015, armL: { z: 0.12 }, armR: { z: -0.12 } }),
    malePos: [-0.34, 0, 0],
    femalePos: [0.33, 0, 0.04],
    label: 'final — standing together as the world grows',
  },
}

/** Stable ordered list for Scene 5 UI — seven poses */
export const POSE_ORDER: Array<{ key: string; pose: PairPose }> = [
  'standing-apart',
  'standing',
  'looking',
  'walking',
  'sitting',
  'horizon',
  'final',
].map((k) => ({ key: k, pose: PAIR_POSES[k] }))
