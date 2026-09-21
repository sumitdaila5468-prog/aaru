import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { memories } from '../../data/memories'
import { memoryMessages } from '../../data/websiteContent'
import { withBase } from '../../utils/paths'
import { X, ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react'

export function MemoryVault({ onDiscover }: { onDiscover?: ()=>void }) {
  const [unlocked, setUnlocked] = useState<Set<number>>(new Set())
  const [openIdx, setOpenIdx] = useState<number|null>(null)
  const [animating, setAnimating] = useState<number|null>(null)

  const unlock = (i:number) => {
    if(unlocked.has(i)) {
      setOpenIdx(i)
      return
    }
    setAnimating(i)
    setTimeout(()=>{
      setUnlocked(prev => new Set([...prev, i]))
      setAnimating(null)
      setOpenIdx(i)
      onDiscover?.()
    }, 600)
  }

  return (
    <section id="memories" className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(90,24,50,0.16), transparent 70%)' }} aria-hidden="true" />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-cine text-[#F8C8D4]/40">memory vault</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#FFE8EE]">MEMORY <span className="italic text-[#EFA7B8]">VAULT</span> 📸</h2>
          <p className="mx-auto mt-3 max-w-xl text-[13px] leading-relaxed text-white/55">
            6 locked memories — your real photos, in the exact order they happened. Tap to unlock. Photo 1 → Memory 1, always.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] tracking-[0.18em] uppercase text-white/30">
            <span>{unlocked.size} / {memories.length} unlocked</span>
            <span className="h-1 w-1 rounded-full bg-[#EFA7B8]/40" />
            <span>chronological</span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((m, i) => {
            const msg = memoryMessages[i]
            const isUnlocked = unlocked.has(i)
            const isAnimating = animating === i
            return (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i*0.05 }}
                onClick={()=> unlock(i)}
                className={`group relative overflow-hidden rounded-[18px] border text-left shadow backdrop-blur-xl transition
                  ${isUnlocked ? 'border-white/10 bg-white/[0.04] p-1.5 hover:border-[#EFA7B8]/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.32)]' : 'border-white/10 bg-white/[0.04] p-1.5 hover:border-[#EFA7B8]/15'}
                  ${isAnimating ? 'scale-[0.98]' : ''}`}
              >
                <div className="relative overflow-hidden rounded-[12px] bg-[#1A0A14]">
                  <img
                    src={withBase(m.src)}
                    alt={msg.title}
                    className={`aspect-[4/5.2] w-full object-cover transition duration-700 ${isUnlocked ? 'group-hover:scale-[1.04]' : 'blur-[6px] scale-105 opacity-60'}`}
                    style={{ objectPosition: m.objectPosition ?? '50% 28%' }}
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 transition ${isUnlocked ? 'bg-gradient-to-t from-black/60 via-black/0 to-transparent' : 'bg-[#0F040A]/45 backdrop-blur-[2px]'}`} />

                  {!isUnlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <motion.div
                        animate={isAnimating ? { scale: [1,1.18,0], rotate: [0,8,0], opacity: [1,1,0] } : {}}
                        transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[#F8C8D4] shadow backdrop-blur-xl"
                      >
                        <Lock className="h-5 w-5" />
                      </motion.div>
                      <p className="mt-3 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-medium tracking-[0.18em] uppercase text-[#FFE8EE] backdrop-blur-xl">🔒 MEMORY {String(i+1).padStart(2,'0')}</p>
                      <p className="mt-2 text-center text-[10px] tracking-[0.12em] uppercase text-white/40">tap to unlock</p>
                    </div>
                  )}

                  {isUnlocked && (
                    <>
                      <div className="absolute bottom-0 w-full p-4">
                        <p className="text-[10px] tracking-[0.18em] uppercase text-white/70">{String(i+1).padStart(2,'0')} · {m.date}</p>
                        <p className="mt-1 font-display text-[17px] font-medium leading-tight text-white">{msg.title}</p>
                        <p className="mt-1 text-[11px] italic text-white/60 line-clamp-1">{msg.caption}</p>
                      </div>
                      <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white shadow backdrop-blur-xl"><Unlock className="h-4 w-4" /></span>
                    </>
                  )}
                </div>
                {isUnlocked && (
                  <div className="px-2 pb-2 pt-3">
                    <p className="line-clamp-2 text-[12px] italic leading-relaxed text-white/55">“{msg.message}”</p>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
        <p className="mt-6 text-center text-[10px] tracking-[0.2em] uppercase text-white/22">tap any locked card — unlock animation + real photo inside ❤️</p>
      </div>

      <AnimatePresence>
        {openIdx !== null && unlocked.has(openIdx) && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 backdrop-blur-[18px]" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 42%, rgba(15,4,10,0.92) 0%, rgba(26,10,20,0.88) 36%, rgba(0,0,0,0.62) 100%)' }} onClick={()=>setOpenIdx(null)} />
            <motion.div
              key={openIdx}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.44, ease: [0.22,1,0.36,1] }}
              className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#1A0A14]/95 shadow-[0_24px_64px_rgba(0,0,0,0.52)] backdrop-blur-xl md:flex-row"
            >
              {(() => {
                const m = memories[openIdx]
                const msg = memoryMessages[openIdx]
                return (
                  <>
                    <div className="relative flex-1 bg-[#0F040A] md:max-w-[56%]">
                      <img src={withBase(m.src)} alt={msg.title} className="h-[48vh] w-full object-cover md:h-[78vh]" style={{ objectPosition: m.objectPosition ?? '50% 28%' }} />
                      <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#0F040A] via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center overflow-auto px-6 py-6 md:px-8">
                      <p className="text-[10px] tracking-[0.28em] uppercase text-[#EFA7B8]/60">{String(openIdx+1).padStart(2,'0')} / {String(memories.length).padStart(2,'0')} · {m.date}</p>
                      <h3 className="mt-2 font-display text-[26px] font-light leading-tight text-[#FFE8EE]">{msg.title}</h3>
                      <p className="mt-1 text-[11px] tracking-[0.18em] uppercase text-white/40">{msg.subtitle}</p>
                      <div className="mt-4 h-px w-10 bg-[#EFA7B8]/30" />
                      <p className="mt-4 font-display text-[15px] italic leading-relaxed text-white/75">“{msg.message}”</p>
                      <p className="mt-3 rounded-[12px] border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] italic leading-relaxed text-white/60">😂 {msg.caption}</p>
                      <p className="mt-4 text-[12px] leading-relaxed text-white/45">{m.description}</p>
                      <div className="mt-6 flex items-center gap-2">
                        <button onClick={()=>setOpenIdx(o=> o!==null ? (o-1+memories.length)%memories.length : 0)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10"><ChevronLeft className="h-4 w-4"/></button>
                        <button onClick={()=>setOpenIdx(o=> o!==null ? (o+1)%memories.length : 0)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10"><ChevronRight className="h-4 w-4"/></button>
                        <span className="ml-2 text-[11px] tracking-[0.2em] uppercase text-white/30">MEMORY {String(openIdx+1).padStart(2,'0')} / {String(memories.length).padStart(2,'0')}</span>
                        <button onClick={()=>setOpenIdx(null)} className="ml-auto rounded-full bg-[#EFA7B8] px-5 py-2 text-[11px] tracking-[0.12em] uppercase text-[#1A0A14] font-medium">close</button>
                      </div>
                    </div>
                    <button onClick={()=>setOpenIdx(null)} className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur-xl hover:text-white"><X className="h-4 w-4"/></button>
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
