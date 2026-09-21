import { useState } from 'react'
import { motion } from 'framer-motion'
import { futureCards } from '../../data/websiteContent'
import { Modal } from '../shared/Modal'

export function OurFuture({ onBurst }: { onBurst?: (e:any)=>void }) {
  const [active, setActive] = useState<typeof futureCards[0]|null>(null)

  return (
    <section id="future" className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-cine text-[#F8C8D4]/40">our future</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#FFE8EE]">More of <span className="italic text-[#EFA7B8]">everything</span> with you</h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-white/50">Click each future — each card hides what I want more of.</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {futureCards.map((card, i)=> (
            <motion.button
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i*0.05 }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e)=>{ setActive(card); onBurst?.(e) }}
              className="group relative flex flex-col items-start gap-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-5 text-left shadow-[0_8px_32px_rgba(90,24,50,0.06)] backdrop-blur hover:border-[#EFA7B8]/20 hover:shadow-[0_16px_40px_rgba(90,24,50,0.10)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1A0A14] to-[#2A0E1E] text-[20px] border border-white/10">
                {card.icon}
              </div>
              <h3 className="font-display text-[16px] font-medium leading-tight text-[#FFE8EE]">{card.title}</h3>
              <p className="text-[11px] leading-relaxed text-white/45">tap to reveal ♡</p>
              <span className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#EFA7B8] text-[11px] text-[#1A0A14] font-medium opacity-90 group-hover:opacity-100">→</span>
            </motion.button>
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={()=>setActive(null)} title={active ? `${active.icon} ${active.title}` : undefined}>
        {active && (
          <div>
            <p className="font-display text-[15px] italic leading-relaxed text-[#FFE8EE]">“{active.message}”</p>
            <button onClick={()=>setActive(null)} className="mt-4 rounded-full border border-[#EFA7B8]/20 bg-white/[0.04] px-5 py-2 text-[11px] tracking-[0.12em] uppercase text-white/60 hover:bg-[#0F040A]">close ♡</button>
          </div>
        )}
      </Modal>
    </section>
  )
}
