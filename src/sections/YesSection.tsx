/* ------------------------------------------------------------------ */
/*  YesSection — She said yes. Transform screen to warm golden glow.     */
/* ------------------------------------------------------------------ */

import { CinematicLines } from '../components/ui/CinematicLines'
import { ContinueCue } from '../components/ui/ContinueCue'
import { SceneLabel } from '../components/ui/SceneLabel'
import { story } from '../data/story'

export function YesSection() {
  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={12} label={story.navigation[12].label} />
      {/* warm golden glow behind */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[90vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30" style={{ background: 'radial-gradient(ellipse at center, rgba(255,214,165,0.42), rgba(239,167,184,0.18) 45%, transparent 72%)', filter: 'blur(22px)' }} aria-hidden="true" />
      <CinematicLines lines={story.yes.lines as any} startDelay={600} variant="light" className="min-h-[14rem] max-w-xl" keepLast />
      <ContinueCue delay={5.2} />
    </section>
  )
}
