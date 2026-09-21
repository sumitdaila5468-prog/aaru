/* ------------------------------------------------------------------ */
/*  SECTION 9 — the final reveal: her name, the choice, "Always."       */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { RotateCcw } from 'lucide-react'
import { CinematicLines } from '../components/ui/CinematicLines'
import { SceneLabel } from '../components/ui/SceneLabel'
import { useExperience } from '../state/experience'
import { story } from '../data/story'
import { finalMessage } from '../data'

export function Section09Finale() {
  const [phase, setPhase] = useState<'letter' | 'end'>('letter')
  const replay = useExperience((s) => s.replay)
  const setBurst = useExperience((s) => s.setBurst)

  // subtle burst when letter finishes
  useEffect(() => {
    if (phase !== 'end') return
    const proxy = { v: 0 }
    const tl = gsap.timeline()
    tl.to(proxy, { v: 1, duration: 1.1, ease: 'power2.out', onUpdate: () => setBurst(proxy.v) })
    tl.to(proxy, { v: 0.32, duration: 2.2, ease: 'sine.out', onUpdate: () => setBurst(proxy.v) })
    return () => {
      tl.kill()
    }
  }, [phase, setBurst])

  // filter empty strings for staged text (keep pauses via hold)
  const lines = finalMessage.lines.filter((l) => l.text !== '')

  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={4} label={story.navigation[4].label} />

      {phase === 'letter' && (
        <CinematicLines
          lines={lines as any}
          onDone={() => setPhase('end')}
          startDelay={800}
          keepLast
          className="min-h-[16rem] max-w-xl"
        />
      )}

      <AnimatePresence>
        {phase === 'end' && (
          <motion.div
            key="replay"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="pointer-events-auto mt-10 flex flex-col items-center gap-3"
          >
            <button onClick={replay} className="ghost-btn">
              <RotateCcw className="h-3.5 w-3.5" />
              Replay our story
            </button>
            <p className="text-[9px] uppercase tracking-[0.32em] text-ink/32">or press r</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
