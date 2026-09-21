import { useState } from 'react'
import { motion } from 'framer-motion'
import { loveRoomCards } from '../../data/websiteContent'
import { Modal } from '../shared/Modal'

export function AboutUs({ onBurst, onDiscover }: { onBurst?: (e:any)=>void; onDiscover?: ()=>void }) {
  const [active, setActive] = useState<typeof loveRoomCards[0] | null>(null)

  return (
    <section id="about" className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(90,24,50,0.14), transparent 70%)' }} aria-hidden="true" />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-cine text-[#F8C8D4]/40">love room — our little world</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light leading-tight text-[#FFE8EE]">
            OUR LITTLE WORLD <span className="italic text-[#EFA7B8]">❤️</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl font-display text-[14px] italic leading-relaxed text-[#F8C8D4]/55">
            Six cards. Every one hides something I don’t say often enough. Click them — none are the same.
          </p>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#EFA7B8]/22 to-transparent" />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loveRoomCards.map((card, i) => (
            <motion.button
              key={card.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22,1,0.36,1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e)=>{ setActive(card); onBurst?.(e); onDiscover?.() }}
              className="group relative flex flex-col items-start gap-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:border-[#EFA7B8]/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.36)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1A0A14] to-[#2A0E1E] text-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] border border-white/10">
                {card.icon}
              </div>
              <div>
                <h3 className="font-display text-[13px] font-medium leading-tight tracking-[0.04em] text-[#FFE8EE]">{card.title}</h3>
                <p className="mt-1 text-[10px] tracking-[0.18em] uppercase text-[#EFA7B8]/60">{card.subtitle}</p>
                <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-white/45">Tap to open — there’s something inside ♡</p>
              </div>
              <span className="absolute bottom-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#EFA7B8] text-[11px] text-[#1A0A14] font-medium opacity-90 transition group-hover:opacity-100">→</span>
              <div className="pointer-events-none absolute -inset-px -z-10 rounded-[20px] bg-gradient-to-br from-[#FFD6A5]/0 via-[#EFA7B8]/0 to-[#FFD6A5]/0 opacity-0 transition group-hover:opacity-100 group-hover:from-[#FFD6A5]/10 group-hover:via-[#EFA7B8]/8" />
            </motion.button>
          ))}
        </div>

        <p className="mt-6 text-center text-[10px] tracking-[0.2em] uppercase text-white/22">6 cards — all different, all for you ✨</p>
      </div>

      <Modal open={!!active} onClose={()=>setActive(null)} title={active ? `${active.icon} ${active.title}` : undefined}>
        {active && (
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#9E3D5C]/60">{active.subtitle}</p>
            <p className="font-display text-[16px] italic leading-relaxed text-[#5A1832]">“{active.message}”</p>
            <div className="pt-2">
              <button onClick={()=>setActive(null)} className="rounded-full border border-[#EFA7B8]/20 bg-white px-5 py-2 text-[11px] tracking-[0.14em] uppercase text-white/70 hover:bg-[#FFF7F8]">close ♡</button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}
