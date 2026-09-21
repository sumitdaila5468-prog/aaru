import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { memories } from '../../data/memories'
import { memoryMessages } from '../../data/websiteContent'
import { withBase } from '../../utils/paths'

const picks = [0,1,3,5] // 4 photos for game — keep order

export function PhotoGame({ onBurst }: { onBurst?: (e:any)=>void }) {
  const [selected, setSelected] = useState<number|null>(null)

  return (
    <section className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="eyebrow-cine text-[#F8C8D4]/40">pick a memory</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#FFE8EE]">Pick a memory <span className="italic text-[#EFA7B8]">❤️</span></h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/50">Choose one — each photo hides a different note. You can’t choose wrong.</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {picks.map((memIdx) => {
            const m = memories[memIdx]
            const msg = memoryMessages[memIdx]
            const isSel = selected === memIdx
            return (
              <motion.button
                key={memIdx}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e)=> { setSelected(memIdx); onBurst?.(e) }}
                className={`relative overflow-hidden rounded-[18px] border p-1.5 text-left shadow-[0_10px_32px_rgba(0,0,0,0.24)] backdrop-blur-xl transition ${isSel ? 'border-[#EFA7B8]/30 bg-[#1A0A14] shadow-[0_12px_32px_rgba(0,0,0,0.32)]' : 'border-white/10 bg-white/[0.04] hover:border-[#EFA7B8]/20'}`}
              >
                <div className="relative overflow-hidden rounded-[12px]">
                  <img src={withBase(m.src)} alt={msg.title} className="aspect-[16/11] w-full object-cover" style={{ objectPosition: m.objectPosition ?? '50% 28%' }} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5A1832]/44 via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-3">
                    <p className="text-[11px] tracking-[0.16em] uppercase text-white/80">{String(memIdx+1).padStart(2,'0')} · {m.date}</p>
                    <p className="font-display text-[15px] font-medium text-white">{msg.title}</p>
                  </div>
                  {isSel && <span className="absolute right-3 top-3 rounded-full bg-[#EFA7B8] px-3 py-1 text-[10px] tracking-[0.12em] uppercase text-[#1A0A14] font-medium">chosen ❤️</span>}
                </div>
                {isSel && <p className="px-2 pb-2 pt-3 font-display text-[13px] italic leading-relaxed text-[#FFE8EE]/70">“{msg.message}”</p>}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-6 max-w-2xl rounded-[18px] border border-white/10 bg-white/[0.04] px-6 py-4 text-center shadow backdrop-blur-xl">
              <p className="font-display text-[14px] italic text-[#FFE8EE]">That one was special.</p>
              <p className="mt-1 text-[12px] text-white/50">Every memory with you is my favourite — but that one hits different. ❤️</p>
              <button onClick={()=>setSelected(null)} className="mt-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-[11px] tracking-[0.12em] uppercase text-white/60 hover:bg-white/[0.06]">Choose another →</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
