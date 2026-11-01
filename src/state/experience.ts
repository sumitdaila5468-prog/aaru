/* ------------------------------------------------------------------ */
/*  Experience state — one small store driving the whole universe      */
/* ------------------------------------------------------------------ */

import { create } from 'zustand'
import type { CameraShot, Quality } from '../types'
import {
  detectMobile,
  detectQuality,
  detectReducedMotion,
  detectWebGL,
  urlFlag,
} from '../utils/detect'

export const STAGE_COUNT = 16

export interface ExperienceState {
  /* environment */
  webgl: boolean
  isMobile: boolean
  reducedMotion: boolean
  quality: Quality
  degraded: boolean

  /* flow */
  loaded: boolean
  entered: boolean
  stage: number
  pendingStage: number | null
  transitioning: boolean

  /* scene-local selections */
  chapter: number // scene 3: -1 = overview
  memory: number | null // lightbox index for photo stages
  reason: number // scene 6
  pose: number // scene 5
  aaruSolo: boolean // intro special moment
  proposalNoCount: number
  saidYes: boolean
  easterFound: boolean

  /* ui */
  audioOn: boolean
  audioVolume: number
  paused: boolean
  hintDismissed: boolean

  /* finale animation channels (tweened via gsap, read in useFrame) */
  burst: number
  universeScale: number

  /* camera */
  shot: CameraShot

  /* actions */
  setLoaded: (loaded: boolean) => void
  setEntered: () => void
  requestStage: (target: number) => void
  commitStage: () => void
  finishTransition: () => void
  nextStage: () => void
  prevStage: () => void
  setChapter: (i: number) => void
  setMemory: (i: number | null) => void
  setReason: (i: number) => void
  setPose: (i: number) => void
  setAaruSolo: (v: boolean) => void
  incrementProposalNo: () => void
  setSaidYes: () => void
  setEasterFound: () => void
  toggleAudio: () => void
  setAudioVolume: (v: number) => void
  togglePaused: () => void
  setPaused: (v: boolean) => void
  dismissHint: () => void
  setDegraded: () => void
  setReducedMotion: (v: boolean) => void
  setMobile: (v: boolean) => void
  setWebgl: (v: boolean) => void
  setShot: (shot: CameraShot) => void
  setBurst: (v: number) => void
  setUniverseScale: (v: number) => void
  replay: () => void
}

const clampStage = (n: number): number => Math.max(0, Math.min(STAGE_COUNT - 1, n))

/** Reset per-scene selections when we leave that scene. */
function resetSceneLocals(oldStage: number): Partial<ExperienceState> {
  const patch: Partial<ExperienceState> = {}
  if (oldStage >= 2 && oldStage <= 7) patch.memory = null
  return patch
}

const initialWebgl = urlFlag('force2d') ? false : detectWebGL()
const initialMobile = detectMobile()
const initialQuality = urlFlag('lowquality') ? 'medium' : detectQuality(initialMobile)

export const useExperience = create<ExperienceState>()((set, get) => ({
  webgl: initialWebgl,
  isMobile: initialMobile,
  reducedMotion: detectReducedMotion(),
  quality: initialQuality,
  degraded: false,

  loaded: false,
  entered: false,
  stage: 0,
  pendingStage: null,
  transitioning: false,

  chapter: -1,
  memory: null,
  reason: 0,
  pose: 0,
  aaruSolo: false,
  proposalNoCount: 0,
  saidYes: false,
  easterFound: false,

  audioOn: true,
  audioVolume: 0.62,
  paused: false,
  hintDismissed: false,

  burst: 0,
  universeScale: 1,

  shot: { position: [0, 2.2, 15], lookAt: [0, 1.3, -1], fov: 40, duration: 0 },

  setLoaded: (loaded) => set({ loaded }),
  setEntered: () => set({ entered: true }),

  requestStage: (target) => {
    const s = get()
    const t = clampStage(target)
    if (s.transitioning || t === s.stage) return
    if (!s.entered && t !== 0) return
    set({ pendingStage: t, transitioning: true })
  },

  commitStage: () => {
    const s = get()
    if (s.pendingStage === null) return
    const oldStage = s.stage
    set({
      stage: s.pendingStage,
      pendingStage: null,
      burst: oldStage === 15 ? 0 : s.burst,
      universeScale: oldStage === 15 ? 1 : s.universeScale,
      ...resetSceneLocals(oldStage),
    })
  },

  finishTransition: () => set({ transitioning: false }),

  nextStage: () => get().requestStage(get().stage + 1),
  prevStage: () => get().requestStage(get().stage - 1),

  setChapter: (i) => set({ chapter: i }),
  setMemory: (i) => set({ memory: i }),
  setReason: (i) => set({ reason: i }),
  setPose: (i) => set({ pose: i }),
  setAaruSolo: (v) => set({ aaruSolo: v }),
  incrementProposalNo: () => set({ proposalNoCount: get().proposalNoCount + 1 }),
  setSaidYes: () => set({ saidYes: true }),
  setEasterFound: () => set({ easterFound: true }),

  toggleAudio: () => set({ audioOn: !get().audioOn }),
  setAudioVolume: (v) => set({ audioVolume: Math.max(0, Math.min(1, v)) }),
  togglePaused: () => set({ paused: !get().paused }),
  setPaused: (v) => set({ paused: v }),
  dismissHint: () => set({ hintDismissed: true }),
  setDegraded: () => set({ degraded: true, quality: 'medium' }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setMobile: (v) => set({ isMobile: v }),
  setWebgl: (v) => set({ webgl: v }),

  setShot: (shot) => set({ shot }),

  setBurst: (v) => set({ burst: v }),
  setUniverseScale: (v) => set({ universeScale: v }),

  replay: () =>
    set({
      entered: false,
      stage: 0,
      pendingStage: null,
      transitioning: false,
      chapter: -1,
      memory: null,
      reason: 0,
      pose: 0,
      aaruSolo: false,
      proposalNoCount: 0,
      saidYes: false,
      easterFound: false,
      burst: 0,
      universeScale: 1,
    }),
}))

/* Debug handle for testing (dev only). */
if (import.meta.env.DEV) {
  ;(window as unknown as Record<string, unknown>).__aaru = useExperience
}
