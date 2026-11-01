/* ------------------------------------------------------------------ */
/*  ContinueCue — the quiet invitation to keep going                    */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExperience } from '../../state/experience'

interface ContinueCueProps {
  delay?: number
  label?: string
  onClick?: () => void
}

export function ContinueCue({ delay = 2.6, label = 'continue', onClick }: ContinueCueProps) {
  const [visible, setVisible] = useState(false)
  const transitioning = useExperience((s) => s.transitioning)
  const nextStage = useExperience((s) => s.nextStage)
  const reduced = useExperience((s) => s.reducedMotion)

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), delay * 1000)
    return () => window.clearTimeout(t)
  }, [delay])

  return (
    <AnimatePresence>
      {visible && !transitioning && (
        <motion.button
          key="cue"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          onClick={onClick ?? nextStage}
          className="pointer-events-auto fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-white/35 bg-white/72 px-4 py-2 text-[#7A2945]/62 shadow-[0_8px_24px_rgba(90,24,50,0.10)] backdrop-blur-xl transition-colors duration-500 hover:border-white/55 hover:bg-white/84 hover:text-[#5A1832] md:bottom-7 md:right-7"
          aria-label={`Continue — ${label}`}
        >
          <span className="text-[9px] tracking-[0.28em] uppercase">{label}</span>
          <motion.span
            animate={reduced ? undefined : { x: [0, 4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFA7B8]/22"
          >
            <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
