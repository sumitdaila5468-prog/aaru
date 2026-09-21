/* ------------------------------------------------------------------ */
/*  SECTION 7 — the future: two lines over the dawn                     */
/* ------------------------------------------------------------------ */

import { useState } from 'react'
import { CinematicLines } from '../components/ui/CinematicLines'
import { ContinueCue } from '../components/ui/ContinueCue'
import { SceneLabel } from '../components/ui/SceneLabel'
import { story } from '../data/story'

export function Section07Future() {
  const [phase, setPhase] = useState<'a' | 'b'>('a')

  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={3} label={story.navigation[3].label} />

      {phase === 'a' && (
        <CinematicLines
          lines={[
            { text: 'More places.', hold: 1800 },
            { text: 'More late-night conversations.', hold: 2000 },
            { text: 'More random adventures.', hold: 1900 },
            { text: 'More memories.', hold: 1800 },
          ]}
          onDone={() => setPhase('b')}
          startDelay={1200}
          variant="dark"
          className="min-h-[7rem]"
        />
      )}
      {phase === 'b' && (
        <CinematicLines
          lines={[{ text: 'More us.', hold: 2600, accent: true }]}
          onDone={() => {}}
          startDelay={500}
          keepLast
          variant="dark"
          className="min-h-[5rem]"
        />
      )}

      {phase === 'b' && <ContinueCue delay={1.6} />}
    </section>
  )
}
