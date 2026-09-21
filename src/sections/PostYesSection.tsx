/* ------------------------------------------------------------------ */
/*  PostYesSection — OUR NEXT CHAPTER: More sunsets... Aaru × Forever    */
/* ------------------------------------------------------------------ */

import { CinematicLines } from '../components/ui/CinematicLines'
import { ContinueCue } from '../components/ui/ContinueCue'
import { SceneLabel } from '../components/ui/SceneLabel'
import { story } from '../data/story'

export function PostYesSection() {
  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={13} label={story.navigation[13].label} />
      <p className="mb-6 text-center text-[10px] uppercase tracking-[0.32em] text-white/52">{story.postYes.intro}</p>
      <CinematicLines lines={story.postYes.lines as any} startDelay={700} variant="light" className="min-h-[14rem] max-w-xl" keepLast />
      <p className="mt-8 text-center font-display text-[18px] italic tracking-wide text-[#FFD6A5]">{story.postYes.closing}</p>
      <ContinueCue delay={6.0} />
    </section>
  )
}
