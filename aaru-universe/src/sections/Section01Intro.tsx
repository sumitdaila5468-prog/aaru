/* ------------------------------------------------------------------ */
/*  SECTION 1 — intro overlay: the words, then the door                 */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CinematicLines } from '../components/ui/CinematicLines'
import { useExperience } from '../state/experience'
import { story } from '../data/story'
import { ambientAudio } from '../utils/audio'
import { AaruMomentOverlay } from './AaruMomentOverlay'

export function Section01Intro() {
  const [done, setDone] = useState(false)
  const setEntered = useExperience((s) => s.setEntered)
  const requestStage = useExperience((s) => s.requestStage)
  const audioOn = useExperience((s) => s.audioOn)
  const aaruSolo = useExperience((s) => s.aaruSolo)
  const setAaruSolo = useExperience((s) => s.setAaruSolo)

  const enter = (): void => {
    if (audioOn) void ambientAudio.start()
    setEntered()
    requestStage(1)
  }

  // Esc closes the solo moment
  useEffect(() => {
    if (!aaruSolo) return
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setAaruSolo(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aaruSolo, setAaruSolo])

  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {!aaruSolo ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <CinematicLines lines={story.intro.lines} onDone={() => setDone(true)} startDelay={2200} variant="dark">
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-7"
                >
                  {/* Hero — luxury redesign: large Aaru */}
                  <div className="flex flex-col items-center">
                    <motion.h1
                      initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="hero-serif text-center text-[clamp(3.2rem,12vw,7.2rem)] font-light tracking-tight text-glow-warm"
                      style={{
                        background: 'linear-gradient(135deg, #5A1832 0%, #9E3D5C 45%, #EFA7B8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Aaru
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.4, delay: 0.9 }}
                      className="mt-3 max-w-[28rem] text-center font-display text-[clamp(0.95rem,2.2vw,1.15rem)] font-light italic leading-relaxed text-[#7A2945]/72 text-balance"
                    >
                      Somewhere between all the ordinary moments,
                      <br />
                      you became my favorite one.
                    </motion.p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button onClick={enter} className="ghost-btn enter-halo pointer-events-auto">
                      Enter Our Story
                    </button>
                    <button
                      onClick={() => setAaruSolo(true)}
                      className="pointer-events-auto text-[11px] tracking-[0.28em] uppercase text-[#7A2945]/55 transition-colors hover:text-[#9E3D5C]"
                    >
                      — a moment for Aaru —
                    </button>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.6, delay: 1.6 }}
                    className="text-center text-[9px] uppercase tracking-[0.3em] text-[#7A2945]/32"
                  >
                    {story.intro.hint}
                  </motion.p>
                </motion.div>
              )}
            </CinematicLines>
          </motion.div>
        ) : (
          <motion.div key="aaru-solo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <AaruMomentOverlay active={aaruSolo} onDone={() => setAaruSolo(false)} onSkip={() => setAaruSolo(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
