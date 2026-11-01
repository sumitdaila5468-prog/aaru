/* ------------------------------------------------------------------ */
/*  Sections — 16 cinematic overlays: premium romantic short film          */
/*  Chronology preserved: Photo 1→02, Photo 2→03, etc.                      */
/* ------------------------------------------------------------------ */

import { useExperience } from '../state/experience'
import { Section01Intro } from './Section01Intro'
import { MemorySection } from './MemorySection'
import { Section07Future } from './Section07Future'
import { BeginningSection } from './BeginningSection'
import { OurWorldSection } from './OurWorldSection'
import { LetterSection } from './LetterSection'
import { ProposalSection } from './ProposalSection'
import { YesSection } from './YesSection'
import { PostYesSection } from './PostYesSection'
import { FinalPhotoSection } from './FinalPhotoSection'
import { ReplaySection } from './ReplaySection'

export function Sections() {
  const loaded = useExperience((s) => s.loaded)
  const stage = useExperience((s) => s.stage)

  if (!loaded) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {stage === 0 && <Section01Intro />}
      {stage === 1 && <BeginningSection />}
      {stage === 2 && <MemorySection index={0} stage={2} />}
      {stage === 3 && <MemorySection index={1} stage={3} />}
      {stage === 4 && <MemorySection index={2} stage={4} />}
      {stage === 5 && <MemorySection index={3} stage={5} />}
      {stage === 6 && <MemorySection index={4} stage={6} />}
      {stage === 7 && <MemorySection index={5} stage={7} />}
      {stage === 8 && <OurWorldSection />}
      {stage === 9 && <Section07Future />}
      {stage === 10 && <LetterSection />}
      {stage === 11 && <ProposalSection />}
      {stage === 12 && <YesSection />}
      {stage === 13 && <PostYesSection />}
      {stage === 14 && <FinalPhotoSection />}
      {stage === 15 && <ReplaySection />}
    </div>
  )
}
