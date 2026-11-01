/* ------------------------------------------------------------------ */
/*  LetterSection — MY LETTER: handwritten-style line-by-line reveal      */
/* ------------------------------------------------------------------ */

import { useState } from 'react'
import { CinematicLines } from '../components/ui/CinematicLines'
import { ContinueCue } from '../components/ui/ContinueCue'
import { SceneLabel } from '../components/ui/SceneLabel'
import { story } from '../data/story'
import { motion } from 'framer-motion'

export function LetterSection() {
  const [done, setDone] = useState(false)
  const lines = story.letter.lines.filter((l) => l !== '').map((t) => ({ text: t as string, hold: 2200 }))

  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 md:px-6">
      <SceneLabel index={10} label={story.navigation[10].label} />
      {/* dark warm cinematic background handled by 3D night */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[560px]"
      >
        {/* elegant paper letter */}
        <div className="relative overflow-hidden rounded-[18px] bg-[#FFFDFB]/92 p-[10px] shadow-[0_20px_60px_rgba(20,10,20,0.32),0_4px_14px_rgba(90,24,50,0.12)] backdrop-blur-xl">
          <div className="rounded-[12px] border border-[#EFA7B8]/18 bg-gradient-to-b from-[#FFFDFB] via-[#FFF7F8] to-[#FFFDFB] p-6 md:p-8">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0 }}
              className="text-center font-display text-[22px] italic text-[#5A1832]"
            >
              {story.letter.greeting}
            </motion.p>
            <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-[#EFA7B8]/30 to-transparent" />
            <CinematicLines lines={lines as any} onDone={() => setDone(true)} startDelay={600} keepLast variant="dark" className="min-h-[18rem] max-w-xl" />
          </div>
        </div>
        {/* warm glow behind letter */}
        <div className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-br from-[#FFD6A5]/14 via-[#EFA7B8]/10 to-transparent blur-2xl" aria-hidden="true" />
      </motion.div>
      {done && <ContinueCue delay={1.4} />}
    </section>
  )
}
