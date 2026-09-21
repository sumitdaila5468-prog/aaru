/* ------------------------------------------------------------------ */
/*  AudioToggle — simple 🔊 / 🔇 — starts only after user gesture      */
/* ------------------------------------------------------------------ */

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExperience } from '../../state/experience'
import { ambientAudio } from '../../utils/audio'

export function AudioToggle() {
  const loaded = useExperience((s) => s.loaded)
  const audioOn = useExperience((s) => s.audioOn)
  const toggleAudio = useExperience((s) => s.toggleAudio)
  const stage = useExperience((s) => s.stage)
  const everStarted = useRef(false)

  useEffect(() => {
    if (!everStarted.current || !ambientAudio.running) return
    void ambientAudio.setEnabled(audioOn)
  }, [audioOn])

  useEffect(() => {
    if (!ambientAudio.running || !audioOn) return
    ambientAudio.fadeForScene(stage)
  }, [stage, audioOn])

  const handleToggle = async (): Promise<void> => {
    const next = !audioOn
    if (next && !ambientAudio.running) {
      await ambientAudio.start()
      everStarted.current = true
    } else if (ambientAudio.running) {
      everStarted.current = true
      await ambientAudio.setEnabled(next)
    }
    toggleAudio()
  }

  return (
    <AnimatePresence>
      {loaded && (
        <motion.button
          key="audio"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          onClick={() => void handleToggle()}
          className="fixed right-4 top-4 md:right-6 md:top-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/72 text-[#7A2945]/70 backdrop-blur-xl shadow-[0_4px_20px_rgba(90,24,50,0.08)] transition-colors hover:border-[#EFA7B8]/40 hover:bg-white/85 hover:text-[#5A1832]"
          aria-label={audioOn ? 'Mute' : 'Unmute'}
          aria-pressed={audioOn}
        >
          <span aria-hidden="true" className="text-[15px] leading-none">
            {audioOn ? '🔊' : '🔇'}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
