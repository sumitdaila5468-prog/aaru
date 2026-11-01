/* ------------------------------------------------------------------ */
/*  SceneLabel — the small chapter mark in the corner                   */
/* ------------------------------------------------------------------ */

import { motion } from 'framer-motion'
import { useExperience } from '../../state/experience'

export function SceneLabel({ index, label }: { index: number; label: string }) {
  const reduced = useExperience((s) => s.reducedMotion)
  return (
    <motion.div
      initial={{ opacity: 0, x: reduced ? 0 : -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, delay: 0.7 }}
      className="pointer-events-none absolute left-5 top-6 z-10 rounded-2xl border border-white/25 bg-white/58 px-3.5 py-2.5 backdrop-blur-xl shadow-[0_8px_24px_rgba(90,24,50,0.08)] md:left-8 md:top-8"
      aria-hidden="true"
    >
      <p className="font-display text-sm font-light tracking-wide text-[#7A2945]/80">
        {String(index + 1).padStart(2, '0')}
      </p>
      <p className="mt-0.5 text-[9px] uppercase tracking-[0.28em] text-[#7A2945]/52">{label}</p>
      <div className="mt-2 h-px w-10 bg-gradient-to-r from-[#EFA7B8]/65 to-transparent" />
    </motion.div>
  )
}
