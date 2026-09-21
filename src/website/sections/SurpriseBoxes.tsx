import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { surpriseBoxes } from '../../data/websiteContent'

export function SurpriseBoxes({ onBurst, onDiscover }: { onBurst?: (e:any)=>void; onDiscover?: ()=>void }) {
  const [opened, setOpened] = useState<number|null>(null)
  const [openedSet, setOpenedSet] = useState<Set<number>>(new Set())

  const handleOpen = (id:number, e:any) => {
    setOpened(id)
    setOpenedSet(prev => new Set([...prev, id]))
    onBurst?.(e)
    onDiscover?.()
  }

  return (
    <section id="surprises" className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(90,24,50,0.12), transparent 70%)' }} aria-hidden="true" />
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="eyebrow-cine text-[#F8C8D4]/40">surprise room — 5 mystery boxes</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#FFE8EE]">5 MYSTERY <span className="italic text-[#EFA7B8]">BOXES</span> 🎁</h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/50">Every box is different — photo, promise, compliment, or hidden clue. Try them all.</p>
          <p className="mt-2 text-[10px] tracking-[0.18em] uppercase text-white/30">{openedSet.size} / 5 opened</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {surpriseBoxes.map((box, i)=> {
            const isOpen = opened === box.id
            return (
              <motion.button
                key={box.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i*0.08 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e)=> handleOpen(box.id, e)}
                className={`group relative flex flex-col items-center gap-4 rounded-[20px] border p-6 text-center backdrop-blur-xl transition shadow-[0_10px_32px_rgba(0,0,0,0.24)]
                  ${isOpen ? 'border-[#EFA7B8]/20 bg-gradient-to-br from-[#1A0A14] to-[#2A0E1E]' : 'border-white/10 bg-white/[0.04] hover:border-[#EFA7B8]/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.32)]'}`}
              >
                <div className={`flex h-20 w-20 items-center justify-center rounded-[18px] border text-[36px] shadow-inner transition ${isOpen ? 'border-[#EFA7B8]/15 bg-white/[0.04]' : 'border-white/10 bg-gradient-to-br from-[#1A0A14] to-[#0F040A] group-hover:scale-105'}`}>
                  {isOpen ? '💖' : box.emoji}
                </div>
                {isOpen ? (
                  <div>
                    <p className="font-display text-[15px] font-medium text-[#FFE8EE]">{box.title}</p>
                    <p className="mt-2 text-[12px] leading-relaxed text-white/60">{box.message}</p>
                    <p className="mt-3 text-[10px] tracking-[0.16em] uppercase text-white/25">tap another gift ↓</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-display text-[15px] font-medium text-[#FFE8EE]">{box.label}</p>
                    <p className="mt-1 text-[10px] tracking-[0.18em] uppercase text-[#EFA7B8]/50">{box.hint}</p>
                    <span className="mt-3 inline-flex rounded-full bg-[#EFA7B8] px-4 py-1.5 text-[10px] tracking-[0.14em] uppercase text-[#1A0A14] font-medium">open →</span>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {opened && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center font-display text-[12px] italic text-white/35">
              You’ve opened {surpriseBoxes.find(b=>b.id===opened)?.label} — {openedSet.size===5 ? 'All 5 discovered! Something feels different… ✨' : `${openedSet.size} / 5 — keep going, one of them hides a clue 🔍`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
