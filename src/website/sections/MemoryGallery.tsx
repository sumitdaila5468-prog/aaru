import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { memories } from '../../data/memories'
import { memoryMessages } from '../../data/websiteContent'
import { withBase } from '../../utils/paths'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function MemoryGallery() {
  const [openIdx, setOpenIdx] = useState<number|null>(null)

  return (
    <section id="memories" className="relative bg-[#FFFDFB] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-cine text-[#7A2945]/38">our memories</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#5A1832]">Every photo <span className="italic text-[#9E3D5C]">has a story</span></h2>
          <p className="mx-auto mt-3 max-w-xl text-[13px] leading-relaxed text-[#7A2945]/55">
            Never reordered. Never replaced. Your real photos, in the exact order they happened — tap any card to step inside the memory.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((m, i) => {
            const msg = memoryMessages[i]
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i*0.05 }}
                onClick={()=>setOpenIdx(i)}
                className="group relative overflow-hidden rounded-[18px] border border-white bg-white p-1.5 text-left shadow-[0_10px_32px_rgba(90,24,50,0.08)] transition hover:shadow-[0_16px_40px_rgba(90,24,50,0.14)]"
              >
                <div className="relative overflow-hidden rounded-[12px] bg-[#FFF7F8]">
                  <img src={withBase(m.src)} alt={msg.title} className="aspect-[4/5.2] w-full object-cover transition duration-700 group-hover:scale-[1.04]" style={{ objectPosition: m.objectPosition ?? '50% 28%' }} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5A1832]/52 via-[#5A1832]/0 to-transparent" />
                  <div className="absolute bottom-0 w-full p-4">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/80">{String(i+1).padStart(2,'0')} · {m.date}</p>
                    <p className="mt-1 font-display text-[17px] font-medium leading-tight text-white">{msg.title}</p>
                  </div>
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/86 text-[#7A2945] shadow backdrop-blur">↗</span>
                </div>
                <div className="px-2 pb-2 pt-3">
                  <p className="line-clamp-2 text-[12px] italic leading-relaxed text-[#7A2945]/60">{msg.message}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
        <p className="mt-6 text-center text-[10px] tracking-[0.2em] uppercase text-[#7A2945]/22">photo 1 = memory 1 · photo 6 = memory 6 — always paired ❤️</p>
      </div>

      {/* expanded modal gallery */}
      <AnimatePresence>
        {openIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 backdrop-blur-[18px]" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 42%, rgba(255,247,248,0.94) 0%, rgba(255,232,238,0.86) 36%, rgba(90,24,50,0.28) 100%)' }} onClick={()=>setOpenIdx(null)} />
            <motion.div
              key={openIdx}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.44, ease: [0.22,1,0.36,1] }}
              className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[22px] border border-white/40 bg-white/95 shadow-[0_24px_64px_rgba(90,24,50,0.22)] backdrop-blur-xl md:flex-row"
            >
              {(() => {
                const m = memories[openIdx]
                const msg = memoryMessages[openIdx]
                return (
                  <>
                    <div className="relative flex-1 bg-[#FFF7F8] md:max-w-[56%]">
                      <img src={withBase(m.src)} alt={msg.title} className="h-[48vh] w-full object-cover md:h-[78vh]" style={{ objectPosition: m.objectPosition ?? '50% 28%' }} />
                      <div className="absolute inset-0 md:hidden bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center px-6 py-6 md:px-8">
                      <p className="text-[10px] tracking-[0.28em] uppercase text-[#9E3D5C]/60">{String(openIdx+1).padStart(2,'0')} / {String(memories.length).padStart(2,'0')} · {m.date}</p>
                      <h3 className="mt-2 font-display text-[26px] font-light leading-tight text-[#5A1832]">{msg.title}</h3>
                      <p className="mt-1 text-[11px] tracking-[0.18em] uppercase text-white/40">{msg.subtitle}</p>
                      <div className="mt-4 h-px w-10 bg-[#EFA7B8]/40" />
                      <p className="mt-4 font-display text-[15px] italic leading-relaxed text-[#7A2945]/78">“{msg.message}”</p>
                      <p className="mt-4 text-[12px] leading-relaxed text-[#7A2945]/52">{m.description}</p>
                      <div className="mt-6 flex items-center gap-2">
                        <button onClick={()=>setOpenIdx(o=> o!==null ? (o-1+memories.length)%memories.length : 0)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white text-white/70 hover:bg-[#FFF7F8]"><ChevronLeft className="h-4 w-4"/></button>
                        <button onClick={()=>setOpenIdx(o=> o!==null ? (o+1)%memories.length : 0)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white text-white/70 hover:bg-[#FFF7F8]"><ChevronRight className="h-4 w-4"/></button>
                        <span className="ml-2 text-[11px] tracking-[0.2em] uppercase text-[#7A2945]/30">{openIdx+1} of {memories.length}</span>
                        <button onClick={()=>setOpenIdx(null)} className="ml-auto rounded-full bg-[#5A1832] px-5 py-2 text-[11px] tracking-[0.12em] uppercase text-white">close</button>
                      </div>
                    </div>
                    <button onClick={()=>setOpenIdx(null)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/80 text-[#7A2945]/60 backdrop-blur hover:text-[#5A1832]"><X className="h-4 w-4"/></button>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
