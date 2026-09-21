import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { complimentPool } from '../../data/websiteContent'

export function ComplimentMachine({ onBurst }: { onBurst?: (e:any)=>void }) {
  const [idx, setIdx] = useState(0)
  const [count, setCount] = useState(1)

  const next = (e:any) => {
    let r
    do { r = Math.floor(Math.random()*complimentPool.length) } while (r===idx && complimentPool.length>1)
    setIdx(r)
    setCount(c=>c+1)
    onBurst?.(e)
  }

  return (
    <section className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow-cine text-[#F8C8D4]/40">just for Aaru</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#FFE8EE]">AARU COMPLIMENT MACHINE <span className="italic text-[#EFA7B8]">✨</span></h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/50">Tap the button as many times as you want. It never runs out of compliments for you.</p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl md:p-8">
          <div className="flex items-center justify-center gap-2 text-[10px] tracking-[0.24em] uppercase text-[#EFA7B8]/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#EFA7B8]" /> compliments dispensed: {count}
          </div>

          <div className="relative mt-6 flex min-h-[120px] items-center justify-center rounded-[18px] border border-white/10 bg-gradient-to-br from-[#1A0A14] to-[#0F040A] px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, scale: 0.98, filter: 'blur(6px)' }}
                transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
                className="text-center font-display text-[18px] italic leading-relaxed text-[#FFE8EE] md:text-[20px]"
              >
                “{complimentPool[idx]}”
              </motion.p>
            </AnimatePresence>
            <span className="pointer-events-none absolute -right-1 -top-1 text-[22px] opacity-30">✨</span>
            <span className="pointer-events-none absolute -left-1 -bottom-1 text-[18px] opacity-20">💗</span>
          </div>

          <button onClick={next} className="ghost-btn mx-auto mt-6 flex w-full max-w-xs justify-center sm:w-auto">
            MAKE ME SMILE ✨
          </button>
          <p className="mt-3 text-center text-[11px] italic text-white/30">go on — spam it. I dare you 😂</p>
        </div>
      </div>
    </section>
  )
}
