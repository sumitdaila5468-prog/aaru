/* ------------------------------------------------------------------ */
/*  AaruMomentOverlay — the words that accompany Aaru alone            */
/*  "Aaru..." → "Some people enter your life quietly..." → "…become    */
/*  a part of everything." — staged, elegant, then fades back.        */
/* ------------------------------------------------------------------ */

import { motion } from 'framer-motion'
import { CinematicLines } from '../components/ui/CinematicLines'
import { story } from '../data/story'

interface AaruMomentOverlayProps {
  active: boolean
  onDone: () => void
  onSkip?: () => void
}

export function AaruMomentOverlay({ active, onDone, onSkip }: AaruMomentOverlayProps) {
  if (!active) return null
  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 backdrop-blur-[14px]"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% 38%, rgba(255,247,248,0.92) 0%, rgba(255,232,238,0.78) 38%, rgba(255,232,199,0.62) 68%, rgba(122,41,69,0.34) 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      onClick={onSkip}
    >
      <CinematicLines lines={story.aaruMoment.lines} onDone={onDone} startDelay={800} variant="dark">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.6 }}
          onClick={(e) => {
            e.stopPropagation()
            onDone()
          }}
          className="ghost-btn pointer-events-auto mt-8"
        >
          continue
        </motion.button>
      </CinematicLines>
      <p className="pointer-events-none absolute bottom-8 text-center text-[9px] uppercase tracking-[0.32em] text-[#7A2945]/42">
        tap anywhere to continue · esc to return
      </p>
    </motion.div>
  )
}
