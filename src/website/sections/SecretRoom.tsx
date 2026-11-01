import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function SecretRoom({ unlocked, onDiscover, onBurst }: { unlocked: boolean; onDiscover?: ()=>void; onBurst?: (e:any)=>void }) {
  const [step, setStep] = useState(0)
  const [extraHeart, setExtraHeart] = useState(false)

  const handleNext = (e:any) => {
    setStep(s=>s+1)
    onBurst?.(e)
    if(step===1) onDiscover?.()
  }

  if(!unlocked){
    return (
      <section id="secret" className="relative bg-[#1A0A14] px-4 py-14 text-white md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-[11px] tracking-[0.24em] uppercase text-white/30">secret room</p>
            <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[28px]">🔒</div>
            <h2 className="mt-4 font-display text-[22px] font-light italic">Locked</h2>
            <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-white/50">Something is hiding here… Explore other worlds, open memories, find hearts — and watch this lock disappear ✨</p>
            <div className="mx-auto mt-6 flex max-w-xs items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#EFA7B8] to-[#FFD6A5]" />
              </div>
              <span className="text-[10px] tracking-[0.14em] uppercase text-white/30">locked</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="secret" className="relative bg-gradient-to-b from-[#1A0A14] via-[#2A0E1E] to-[#FFF7F8] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
          className="rounded-[24px] border border-white/20 bg-gradient-to-b from-white/10 to-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        >
          <p className="text-[11px] tracking-[0.24em] uppercase text-[#FFD6A5]/60">🔓 SECRET ROOM UNLOCKED</p>
          <h2 className="mt-3 font-display text-[26px] font-light italic text-white">One thing I never get tired of…</h2>

          <AnimatePresence mode="wait">
            {step===0 && (
              <motion.div key="s0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6">
                <button onClick={handleNext} className="rounded-full bg-white px-6 py-3 text-[11px] tracking-[0.14em] uppercase text-[#5A1832]">tell me →</button>
              </motion.div>
            )}
            {step===1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-6">
                <p className="font-display text-[22px] italic text-white">You.</p>
                <button onClick={handleNext} className="mt-4 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-[11px] tracking-[0.14em] uppercase text-white backdrop-blur">...</button>
              </motion.div>
            )}
            {step>=2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-3">
                <p className="text-[13px] leading-relaxed text-white/70">Okay that’s cheesy.</p>
                <p className="font-display text-[15px] italic text-[#FFD6A5]">Still true though. ❤️</p>
                <div className="mx-auto mt-4 h-px w-12 bg-white/10" />
                <button
                  onClick={(e)=>{ setExtraHeart(true); onBurst?.(e) }}
                  className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                >
                  {extraHeart ? '💖' : '♡'}
                </button>
                {extraHeart && <p className="font-display text-[12px] italic text-white/60">You found the hidden interaction inside the secret room ✨</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
