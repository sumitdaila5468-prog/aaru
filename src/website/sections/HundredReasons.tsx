import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hundredReasons } from '../../data/websiteContent'

export function HundredReasons({ onBurst }: { onBurst?: (e:any)=>void }) {
  const [idx, setIdx] = useState(0)

  const next = (e?: any) => {
    setIdx(i => (i + 1) % hundredReasons.length)
    onBurst?.(e)
  }
  const random = (e?: any) => {
    let r
    do { r = Math.floor(Math.random()*hundredReasons.length) } while (r===idx)
    setIdx(r)
    onBurst?.(e)
  }

  return (
    <section id="reasons" className="relative bg-[#5A1832] px-4 py-14 text-white md:px-6 md:py-20">
      {/* soft pattern overlay */}
      <div className="absolute inset-0 opacity-[0.08]" style={{ background: 'radial-gradient(600px 400px at 20% 20%, rgba(255,214,165,0.9), transparent 70%), radial-gradient(500px 360px at 85% 80%, rgba(239,167,184,0.7), transparent 70%)' }} aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="eyebrow-cine text-white/40">100 little reasons</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight">
          100 reasons <span className="italic text-[#EFA7B8]">I love you</span> ❤️
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/55">Don’t scroll them all — discover them one by one. Like little notes falling from a diary.</p>
      </div>

      <div className="relative mx-auto mt-8 max-w-[560px]">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06] p-[1px] backdrop-blur-xl">
          <div className="rounded-[23px] bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-8 md:p-10">
            <p className="text-center text-[10px] tracking-[0.32em] uppercase text-white/40">reason #{idx+1} · of 100</p>

            <div className="relative mt-6 min-h-[110px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                  transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
                  className="text-center font-display text-[18px] italic leading-relaxed text-white md:text-[20px]"
                >
                  “{hundredReasons[idx]}”
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mx-auto mt-6 flex max-w-xs items-center gap-1.5">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#EFA7B8] to-[#FFD6A5] transition-all duration-500" style={{ width: `${((idx+1)/hundredReasons.length)*100}%` }} />
              </div>
              <span className="text-[10px] tabular-nums text-white/40">{idx+1} / 100</span>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button onClick={next} className="ghost-btn w-full justify-center border-white/10 bg-gradient-to-br from-[#EFA7B8] to-[#FFD6A5] text-[#FFE8EE] sm:w-auto">
                NEXT REASON →
              </button>
              <button onClick={random} className="w-full rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-[11px] tracking-[0.16em] uppercase text-white/80 backdrop-blur hover:bg-white/10 sm:w-auto">
                Random reason ✨
              </button>
            </div>
          </div>
        </div>
        {/* glow */}
        <div className="absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br from-[#EFA7B8]/16 to-[#FFD6A5]/10 blur-2xl" aria-hidden="true" />
      </div>
      <p className="relative mt-4 text-center text-[10px] tracking-[0.18em] uppercase text-white/22">take your time — 100 is a lot of love ✨</p>
    </section>
  )
}
