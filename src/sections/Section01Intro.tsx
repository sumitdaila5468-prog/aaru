/* ------------------------------------------------------------------ */
/*  SECTION 1 — OPENING: For Aaru — premium cinematic, movie start       */
/*  Very subtle animation, luxury typography, custom-made feeling.       */
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
      {/* richer opening lens glow behind title */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[90vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40" style={{ background: 'radial-gradient(ellipse at center, rgba(255,214,165,0.18), rgba(239,167,184,0.12) 42%, transparent 70%)', filter: 'blur(18px)' }} aria-hidden="true" />
      <AnimatePresence mode="wait">
        {!aaruSolo ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <CinematicLines lines={story.intro.lines} onDone={() => setDone(true)} startDelay={1400} variant="dark">
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-8"
                >
                  {/* SUPER-PREMIUM hero — richer champagne/burgundy/gold */}
                  <div className="flex flex-col items-center">
                    <motion.p
                      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="eyebrow-cine text-[#7A2945]/62"
                    >
                      — for Aaru —
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 1.6, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="hero-serif text-center text-[clamp(3.8rem,13vw,8.4rem)] font-light text-glow-warm"
                      style={{
                        background: 'linear-gradient(135deg, #3A0E22 0%, #5A1832 22%, #7A2945 42%, #C98AA0 68%, #EFA7B8 82%, #FFD6A5 100%)',
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
                      transition={{ duration: 1.4, delay: 1.0 }}
                      className="mt-4 max-w-[32rem] text-center font-display text-[clamp(1.05rem,2.3vw,1.22rem)] font-light italic leading-[1.7] text-[#5A1832]/78 text-balance"
                    >
                      our little universe
                    </motion.p>
                    {/* subtle divider — rose-gold hairline */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 1.2, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-6 h-px w-28 origin-center bg-gradient-to-r from-transparent via-[#EFA7B8]/65 to-transparent"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button onClick={enter} className="ghost-btn enter-halo pointer-events-auto">
                      {story.intro.buttonText}
                    </button>
                    <button
                      onClick={() => setAaruSolo(true)}
                      className="pointer-events-auto text-[10px] tracking-[0.30em] uppercase text-[#7A2945]/45 transition-colors hover:text-[#7A2945]/75"
                    >
                      — a moment for Aaru —
                    </button>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.6, delay: 1.8 }}
                    className="text-center text-[9px] uppercase tracking-[0.30em] text-[#7A2945]/28"
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
