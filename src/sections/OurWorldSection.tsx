/* ------------------------------------------------------------------ */
/*  OurWorldSection — OUR WORLD: cinematic after memories               */
/*  Some moments become memories... etc.                                  */
/* ------------------------------------------------------------------ */

import { CinematicLines } from '../components/ui/CinematicLines'
import { ContinueCue } from '../components/ui/ContinueCue'
import { SceneLabel } from '../components/ui/SceneLabel'
import { story } from '../data/story'

export function OurWorldSection() {
  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={8} label={story.navigation[8].label} />
      <CinematicLines lines={story.ourWorld.lines as any} startDelay={900} variant="dark" className="min-h-[10rem] max-w-2xl" keepLast />
      <ContinueCue delay={4.8} />
    </section>
  )
}
