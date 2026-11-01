import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { moodMap } from '../../data/websiteContent'

const moods = Object.entries(moodMap)

export function MoodButtons({ onBurst, onDiscover }: { onBurst?: (e:any)=>void; onDiscover?: ()=>void }) {
  const [active, setActive] = useState<string|null>(null)

  return (
    <section className="relative overflow-hidden bg-[#FFF9F3] px-4 py-14 text-[#44213d] md:px-6 md:py-20">
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,214,165,0.28), transparent 70%), radial-gradient(ellipse 60% 40% at 85% 80%, rgba(239,167,184,0.16), transparent 70%)' }} aria-hidden="true" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow-cine text-[#DC7897]">how are you feeling today?</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#44213D]">Tell me <span className="italic text-[#E85D8C]">how you feel</span></h2>
        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-[#99758B]">Pick a mood — I have a reply for each one. Made for exactly this moment.</p>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {moods.map(([key, m])=> (
            <motion.button
              type="button"
              key={key}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e)=>{ setActive(key); onBurst?.(e); onDiscover?.() }}
              className={`flex flex-col items-center gap-2 rounded-[18px] border p-4 transition ${active===key ? 'border-[#EF5687] bg-gradient-to-br from-[#EF5687] to-[#FF8C70] shadow-[0_10px_28px_rgba(239,86,135,0.24)]' : 'border-[#F1D8E1] bg-white shadow-[0_8px_24px_rgba(90,24,50,0.06)] hover:border-[#EFA7B8]/60 hover:bg-[#FFF7F8]'}`}
            >
              <span className="text-[28px]">{m.emoji}</span>
              <span className={`text-[10px] font-medium tracking-[0.12em] uppercase ${active===key ? 'text-white' : 'text-[#5A1832]'}`}>{m.label}</span>
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
              className="mx-auto mt-6 max-w-xl rounded-[18px] border border-[#F1D8E1] bg-white/85 px-6 py-5 shadow-[0_12px_32px_rgba(90,24,50,0.08)] backdrop-blur"
            >
              <p className="text-[22px]">{moodMap[active].emoji}</p>
              <p className="mt-2 font-display text-[15px] italic leading-relaxed text-[#5A1832]">“{moodMap[active].response}”</p>
              <button type="button" onClick={()=>setActive(null)} className="mt-3 text-[11px] tracking-[0.14em] uppercase text-[#A45A78] hover:text-[#5A1832]">pick another mood →</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
