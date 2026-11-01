/* ------------------------------------------------------------------ */
/*  ProposalSection — ROMANTIC PROPOSAL: Will you choose me... YES/NO     */
/*  Playful NO that moves, YES dominant after few tries.                   */
/* ------------------------------------------------------------------ */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CinematicLines } from '../components/ui/CinematicLines'
import { SceneLabel } from '../components/ui/SceneLabel'
import { story } from '../data/story'
import { useExperience } from '../state/experience'

export function ProposalSection() {
  const [phase, setPhase] = useState<'q' | 'ask'>('q')
  const [noCount, setNoCount] = useState(0)
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const requestStage = useExperience((s) => s.requestStage)
  const setSaidYes = useExperience((s) => s.setSaidYes)
  const incrementNo = useExperience((s) => s.incrementProposalNo)

  const handleYes = () => {
    setSaidYes()
    requestStage(12)
  }

  const handleNo = () => {
    setNoCount((c) => c + 1)
    incrementNo()
    const x = (Math.random() - 0.5) * 140
    const y = (Math.random() - 0.5) * 40
    setNoPos({ x, y })
  }

  const currentNoLabel = noCount === 0 ? story.proposal.noLabel : story.proposal.noMessages[(noCount - 1) % story.proposal.noMessages.length]

  return (
    <section className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
      <SceneLabel index={11} label={story.navigation[11].label} />
      {phase === 'q' && (
        <CinematicLines lines={story.proposal.lines as any} onDone={() => setPhase('ask')} startDelay={700} variant="light" className="min-h-[8rem] max-w-xl" keepLast />
      )}
      {phase === 'ask' && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <p className="max-w-md whitespace-pre-line text-center font-display text-[clamp(1.6rem,4vw,2.4rem)] font-light leading-tight text-ink text-glow">
            {story.proposal.question}
          </p>
          <div className="relative mt-10 flex items-center gap-4">
            <button
              onClick={handleYes}
              className={`ghost-btn pointer-events-auto ${noCount >= 3 ? 'scale-110 shadow-[0_8px_36px_rgba(239,167,184,0.32)]' : ''} transition-transform`}
              style={{ transform: noCount >= 3 ? 'scale(1.08)' : undefined }}
            >
              {story.proposal.yesLabel}
            </button>
            <motion.button
              onClick={handleNo}
              animate={{ x: noPos.x, y: noPos.y }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="pointer-events-auto rounded-full border border-white/35 bg-white/14 px-6 py-3 text-[11px] tracking-[0.18em] uppercase text-white/80 backdrop-blur-xl hover:bg-white/20"
              aria-label="No"
            >
              {currentNoLabel}
            </motion.button>
          </div>
          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.24em] text-white/42">choose wisely ♡</p>
        </motion.div>
      )}
    </section>
  )
}
