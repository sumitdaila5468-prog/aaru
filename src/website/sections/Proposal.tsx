import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { proposalContent } from '../../data/websiteContent'

export function Proposal({ onYes, onBurst }: { onYes?: ()=>void; onBurst?: (e:any)=>void }) {
  const [answer, setAnswer] = useState<null | 'yes' | 'obviously' | 'think'>(null)

  const handle = (choice: 'yes'|'obviously'|'think', e:any) => {
    setAnswer(choice)
    onBurst?.(e)
    if(choice==='yes' || choice==='obviously'){
      setTimeout(()=> onYes?.(), 1400)
    }
  }

  return (
    <section id="proposal" className="relative bg-[#5A1832] px-4 py-14 text-white md:px-6 md:py-20">
      <div className="absolute inset-0 opacity-[0.10]" style={{ background: 'radial-gradient(700px 500px at 50% 0%, rgba(255,214,165,0.7), transparent 70%), radial-gradient(500px 400px at 80% 90%, rgba(239,167,184,0.5), transparent 70%)' }} aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="eyebrow-cine text-white/40">{proposalContent.intro}</p>
        <h2 className="mx-auto mt-4 max-w-lg whitespace-pre-line font-display text-[clamp(1.8rem,4vw,2.6rem)] font-light leading-tight">
          {proposalContent.question}
        </h2>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button onClick={(e)=>handle('yes',e)} className={`ghost-btn min-w-[150px] justify-center ${answer==='yes' ? 'scale-105' : ''}`}>
            {proposalContent.yes}
          </button>
          <button onClick={(e)=>handle('obviously',e)} className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3 text-[11px] tracking-[0.16em] uppercase text-white backdrop-blur hover:bg-white/10">
            {proposalContent.obviously}
          </button>
        </div>
        <button onClick={(e)=>handle('think',e)} className="mt-3 rounded-full border border-white/10 px-6 py-2 text-[10px] tracking-[0.16em] uppercase text-white/50 hover:bg-white/[0.04] hover:text-white/75">
          {proposalContent.think}
        </button>

        <AnimatePresence>
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
              className="mx-auto mt-6 max-w-lg rounded-[18px] border border-white/10/12 bg-white/[0.04]/6 px-6 py-4 backdrop-blur"
            >
              <p className="font-display text-[15px] italic leading-relaxed text-white">
                “{answer==='yes' ? proposalContent.responses.yes : answer==='obviously' ? proposalContent.responses.obviously : proposalContent.responses.think}”
              </p>
              {(answer==='yes' || answer==='obviously') && (
                <p className="mt-3 text-[11px] tracking-[0.16em] uppercase text-white/50">scroll down for one last surprise ↓</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-4 text-[10px] tracking-[0.18em] uppercase text-white/22">all answers lead to us ❤️ — no traps, just love</p>
      </div>
    </section>
  )
}
