/* ------------------------------------------------------------------ */
/*  SECTION 2 — the welcome and the gratitude verse                     */
/* ------------------------------------------------------------------ */

import { useState } from 'react'
import { CinematicLines } from '../components/ui/CinematicLines'
import { ContinueCue } from '../components/ui/ContinueCue'
import { SceneLabel } from '../components/ui/SceneLabel'
import { story } from '../data/story'

export function Section02Universe() {
  const [phase, setPhase] = useState<'a' | 'b' | 'c'>('a')

  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={1} label={story.navigation[1].label} />

      {phase === 'a' && (
        <CinematicLines
          lines={[{ text: 'Somewhere between ordinary days...', hold: 2200 }]}
          onDone={() => setPhase('b')}
          startDelay={1600}
          variant="dark"
          className="min-h-[5rem]"
        />
      )}
      {phase === 'b' && (
        <CinematicLines
          lines={[{ text: '...you became my favorite part of them.', hold: 2400 }]}
          onDone={() => setPhase('c')}
          startDelay={500}
          variant="dark"
          className="min-h-[5rem]"
        />
      )}
      {phase === 'c' && (
        <CinematicLines
          lines={[{ text: 'Welcome to our little world.', hold: 2600 }]}
          onDone={() => {}}
          startDelay={400}
          keepLast
          variant="dark"
          className="min-h-[5rem]"
        />
      )}

      {phase === 'c' && <ContinueCue delay={2.4} />}
    </section>
  )
}
