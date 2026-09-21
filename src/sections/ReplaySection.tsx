/* ------------------------------------------------------------------ */
/*  ReplaySection — THE END ...or maybe just the beginning.              */
/* ------------------------------------------------------------------ */

import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { SceneLabel } from '../components/ui/SceneLabel'
import { story } from '../data/story'
import { useExperience } from '../state/experience'

export function ReplaySection() {
  const replay = useExperience((s) => s.replay)

  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={15} label={story.navigation[15].label} />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="flex flex-col items-center">
        <h2 className="hero-serif text-center text-[clamp(2.8rem,8vw,5rem)] font-light tracking-tight text-ink">{story.replay.title}</h2>
        <p className="mt-3 text-center font-display text-[15px] italic text-ink/72">{story.replay.subtitle}</p>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.0, delay: 0.6 }} className="mt-6 h-px w-12 origin-center bg-[#EFA7B8]/45" />
        <button onClick={replay} className="ghost-btn pointer-events-auto mt-8">
          <RotateCcw className="h-3.5 w-3.5" />
          {story.replay.buttonText}
        </button>
        <p className="mt-3 text-[9px] uppercase tracking-[0.32em] text-ink/32">made for Aaru ♡</p>
      </motion.div>
    </section>
  )
}
