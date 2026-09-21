/* ------------------------------------------------------------------ */
/*  SECTION 4 — gallery overlay: hint + the fullscreen lightbox         */
/* ------------------------------------------------------------------ */

import { motion, AnimatePresence } from 'framer-motion'
import { Lightbox } from '../components/ui/Lightbox'
import { SceneLabel } from '../components/ui/SceneLabel'
import { ContinueCue } from '../components/ui/ContinueCue'
import { useExperience } from '../state/experience'
import { story } from '../data/story'

export function Section04Memories() {
  const memory = useExperience((s) => s.memory)
  const setMemory = useExperience((s) => s.setMemory)

  return (
    <section className="absolute inset-0 z-10">
      <SceneLabel index={3} label={story.navigation[3].label} />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.6 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/25 bg-white/52 px-4 py-2 pb-[env(safe-area-inset-bottom)] text-center text-[9px] uppercase tracking-[0.32em] text-[#7A2945]/62 backdrop-blur-xl"
      >
        tap a frame to open a memory
      </motion.p>

      <AnimatePresence>
        {memory !== null && (
          <Lightbox
            items={story.memories}
            index={memory}
            onClose={() => setMemory(null)}
            onNavigate={(i) => setMemory(i)}
          />
        )}
      </AnimatePresence>

      {memory === null && <ContinueCue delay={3} />}
    </section>
  )
}
