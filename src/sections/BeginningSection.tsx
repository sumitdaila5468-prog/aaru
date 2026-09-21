/* ------------------------------------------------------------------ */
/*  BeginningSection — OUR BEGINNING: warm golden hour, the start        */
/*  Text: It started with a moment... → the beginning of our story.      */
/* ------------------------------------------------------------------ */

import { CinematicLines } from '../components/ui/CinematicLines'
import { ContinueCue } from '../components/ui/ContinueCue'
import { SceneLabel } from '../components/ui/SceneLabel'
import { story } from '../data/story'

export function BeginningSection() {
  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={1} label={story.navigation[1].label} />
      <CinematicLines lines={story.beginning.lines as any} startDelay={800} variant="dark" className="min-h-[14rem] max-w-2xl" keepLast />
      <ContinueCue delay={6.2} />
    </section>
  )
}
