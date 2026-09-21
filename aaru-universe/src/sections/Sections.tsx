/* ------------------------------------------------------------------ */
/*  Sections — 5 cinematic overlays (single-page film)                  */
/* ------------------------------------------------------------------ */

import { useExperience } from '../state/experience'
import { Section01Intro } from './Section01Intro'
import { Section02Universe } from './Section02Universe'
import { Section04Memories } from './Section04Memories'
import { Section07Future } from './Section07Future'
import { Section09Finale } from './Section09Finale'

export function Sections() {
  const loaded = useExperience((s) => s.loaded)
  const stage = useExperience((s) => s.stage)

  if (!loaded) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {stage === 0 && <Section01Intro />}
      {stage === 1 && <Section02Universe />}
      {stage === 2 && <Section04Memories />}
      {stage === 3 && <Section07Future />}
      {stage === 4 && <Section09Finale />}
    </div>
  )
}
