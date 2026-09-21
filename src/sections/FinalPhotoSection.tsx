/* ------------------------------------------------------------------ */
/*  FinalPhotoSection — strongest photo with blurred background depth    */
/*  If I had to choose my favorite place...                              */
/* ------------------------------------------------------------------ */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CinematicLines } from '../components/ui/CinematicLines'
import { SceneLabel } from '../components/ui/SceneLabel'
import { ContinueCue } from '../components/ui/ContinueCue'
import { story } from '../data/story'
import { withBase } from '../utils/paths'
import { useExperience } from '../state/experience'

export function FinalPhotoSection() {
  const [done, setDone] = useState(false)
  const setEasterFound = useExperience((s) => s.setEasterFound)
  const easterFound = useExperience((s) => s.easterFound)
  const src = withBase('/memories/memory-01.jpg')
  const [failed, setFailed] = useState(false)

  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={14} label={story.navigation[14].label} />

      {/* blurred enlarged background depth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img src={src} alt="" className="h-full w-full object-cover opacity-30 blur-[28px] scale-110" style={{ objectPosition: '50% 28%' }} />
        <div className="absolute inset-0 bg-[#1A0A1F]/42" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A1F]/68 via-transparent to-[#1A0A1F]/28" />
      </div>

      <div className="relative flex w-full max-w-3xl flex-col items-center">
        {/* foreground sharp photo */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden rounded-[12px] bg-[#FFFDFB] p-[8px] shadow-[0_20px_60px_rgba(20,10,20,0.32)]">
          <div className="relative overflow-hidden rounded-[8px] border border-[#EFA7B8]/20">
            {!failed ? (
              <img src={src} alt="Aaru — forever" className="h-[48vh] max-h-[520px] w-[84vw] max-w-[480px] object-cover" style={{ objectPosition: '50% 28%' }} onError={() => setFailed(true)} loading="eager" />
            ) : (
              <div className="flex h-[48vh] max-h-[520px] w-[84vw] max-w-[480px] items-center justify-center bg-gradient-to-br from-[#FFE8EE] to-[#F8C8D4]"><span className="font-display italic text-[#7A2945]/42">Always</span></div>
            )}
            <div className="photo-film-grain opacity-[0.06]" aria-hidden="true" />
          </div>
        </motion.div>

        <div className="mt-8">
          <CinematicLines lines={story.finalPhoto.lines as any} onDone={() => setDone(true)} startDelay={600} keepLast variant="light" className="min-h-[14rem] max-w-xl" />
        </div>

        {done && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.6 }}
            onClick={() => setEasterFound()}
            className="pointer-events-auto mt-6 flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD6A5]/22 text-[#FFD6A5] backdrop-blur-md animate-pulse"
            aria-label="Secret heart"
            title="psst…"
          >
            <span className="text-[11px]">❤️</span>
          </motion.button>
        )}

        {easterFound && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#FFD6A5]/80">{story.easterEgg.hint}</p>
            <CinematicLines lines={story.easterEgg.lines as any} startDelay={400} variant="light" className="min-h-[6rem] max-w-md" keepLast />
          </motion.div>
        )}

        {done && !easterFound && <ContinueCue delay={4.2} />}
        {easterFound && <ContinueCue delay={4.0} />}
      </div>
    </section>
  )
}
