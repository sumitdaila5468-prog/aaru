import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { moodMap } from '../../data/websiteContent'

const moods = Object.entries(moodMap)

export function MoodButtons({ onBurst, onDiscover }: { onBurst?: (e:any)=>void; onDiscover?: ()=>void }) {
  const [active, setActive] = useState<string|null>(null)

  return (
    <section className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow-cine text-[#F8C8D4]/40">how are you feeling today?</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#FFE8EE]">Tell me <span className="italic text-[#EFA7B8]">how you feel</span></h2>
        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/50">Pick a mood — I have a reply for each one. Made for exactly this moment.</p>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {moods.map(([key, m])=> (
            <motion.button
              key={key}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e)=>{ setActive(key); onBurst?.(e); onDiscover?.() }}
              className={`flex flex-col items-center gap-2 rounded-[18px] border p-4 transition ${active===key ? 'border-[#EFA7B8]/40 bg-[#EFA7B8] shadow-[0_8px_24px_rgba(239,167,184,0.22)]' : 'border-white/10 bg-white/[0.04] shadow-[0_8px_24px_rgba(0,0,0,0.24)] hover:border-[#EFA7B8]/20'}`}
            >
              <span className="text-[28px]">{m.emoji}</span>
              <span className={`text-[10px] font-medium tracking-[0.12em] uppercase ${active===key ? 'text-[#1A0A14]' : 'text-[#FFE8EE]'}`}>{m.label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.44, ease: [0.22,1,0.36,1] }}
              className="mx-auto mt-6 max-w-xl rounded-[18px] border border-[#EFA7B8]/18 bg-white/[0.04] px-6 py-5 shadow backdrop-blur"
            >
              <p className="text-[22px]">{moodMap[active].emoji}</p>
              <p className="mt-2 font-display text-[15px] italic leading-relaxed text-[#FFE8EE]">“{moodMap[active].response}”</p>
              <button onClick={()=>setActive(null)} className="mt-3 text-[11px] tracking-[0.14em] uppercase text-white/40 hover:text-[#FFE8EE]">pick another mood →</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
