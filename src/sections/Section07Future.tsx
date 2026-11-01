/* ------------------------------------------------------------------ */
/*  SECTION 4 — OUR FUTURE: warm sunset, hopeful horizon                */
/*  "More moments. More memories. More ordinary days that become          */
/*   beautiful because they are with you." — slow, emotional.            */
/* ------------------------------------------------------------------ */

import { useState } from 'react'
import { motion } from 'framer-motion'
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
          lines={story.future.lines as any}
          onDone={() => setPhase('b')}
          startDelay={1100}
          variant="dark"
          className="min-h-[9rem] max-w-2xl"
        />
      )}
      {phase === 'b' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <p className="font-display text-[13px] italic leading-relaxed tracking-wide text-[#7A2945]/42">
            sunset · dusk · warm lights · still ahead
          </p>
          <div className="mt-4 h-px w-12 bg-gradient-to-r from-transparent via-[#EFA7B8]/35 to-transparent" />
        </motion.div>
      )}

      {phase === 'b' && <ContinueCue delay={1.4} />}
    </section>
  )
}
