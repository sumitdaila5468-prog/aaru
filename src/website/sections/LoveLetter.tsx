import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loveLetter } from '../../data/websiteContent'

export function LoveLetter({ onBurst }: { onBurst?: (e:any)=>void }) {
  const [open, setOpen] = useState(false)
  const [reveal, setReveal] = useState(0)
  const [hidden, setHidden] = useState(0)

  const visibleParas = open ? Math.min(loveLetter.paragraphs.length, reveal) : 0

  return (
    <section id="letters" className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(90,24,50,0.16), transparent 70%)' }} aria-hidden="true" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow-cine text-[#F8C8D4]/40">my letter to you</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#FFE8EE]">A letter <span className="italic text-[#EFA7B8]">I actually wrote</span> 💌</h2>
        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/50">Not a template. Tap the envelope — read it like you found it on your pillow.</p>
      </div>

      <div className="mx-auto mt-10 max-w-[560px]">
        {!open ? (
          <motion.button
            onClick={()=>{ setOpen(true); setTimeout(()=>setReveal(1), 600); onBurst?.(null as any) }}
            whileHover={{ scale: 1.02, rotate: -0.4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex w-full flex-col items-center gap-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-10 shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl"
          >
            <div className="relative">
              <div className="flex h-[120px] w-[160px] items-center justify-center rounded-[14px] border border-[#EFA7B8]/16 bg-gradient-to-br from-[#1A0A14] to-[#2A0E1E] shadow-[0_8px_24px_rgba(0,0,0,0.32)] md:h-[140px] md:w-[200px]">
                <span className="text-[56px] transition-transform group-hover:scale-110">💌</span>
              </div>
              <div className="absolute -right-3 -top-3 rounded-full bg-[#EFA7B8] px-2.5 py-1 text-[10px] tracking-[0.12em] uppercase text-[#1A0A14] font-medium shadow">for Aaru</div>
            </div>
            <span className="ghost-btn">OPEN MY LETTER</span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">tap to unfold — slowly ♡</span>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
            className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#1A0A14]/80 p-[10px] shadow-[0_20px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl"
          >
            <div className="rounded-[14px] border border-[#EFA7B8]/15 bg-[#FFFDFB] px-6 py-8 md:px-8">
              <p className="text-center font-display text-[22px] italic text-[#5A1832]">{loveLetter.greeting}</p>
              <div className="mx-auto mt-4 h-px w-12 bg-gradient-to-r from-transparent via-[#EFA7B8]/30 to-transparent" />

              <div className="mt-6 space-y-4">
                {loveLetter.paragraphs.slice(0, visibleParas).map((p, i)=> (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i*0.08 }}
                    className="font-display text-[15px] leading-relaxed text-[#5A1832]/85"
                  >
                    {p}
                  </motion.p>
                ))}
                {visibleParas < loveLetter.paragraphs.length && (
                  <button onClick={()=> setReveal(r=> r+1)} className="mx-auto mt-2 block rounded-full border border-[#EFA7B8]/20 bg-white px-5 py-2 text-[11px] tracking-[0.14em] uppercase text-[#5A1832]/70 hover:bg-[#FFE8EE]">continue reading →</button>
                )}
              </div>

              <AnimatePresence>
                {visibleParas === loveLetter.paragraphs.length && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-3 border-t border-[#EFA7B8]/14 pt-6">
                    {hidden >= 1 && (
                      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[14px] border border-[#EFA7B8]/14 bg-[#FFE8EE]/60 px-4 py-3 font-display text-[13px] italic leading-relaxed text-[#5A1832]/80">
                        {loveLetter.hiddenOne}
                      </motion.p>
                    )}
                    {hidden >= 2 && (
                      <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[14px] border border-[#FFD6A5]/20 bg-[#FFF7F8] px-4 py-3 font-display text-[13px] italic leading-relaxed text-[#5A1832]/80">
                        {loveLetter.hiddenTwo}
                      </motion.p>
                    )}

                    {hidden === 0 && <button onClick={()=>setHidden(1)} className="w-full rounded-full bg-[#5A1832] py-3 text-[11px] tracking-[0.16em] uppercase text-white hover:bg-[#7A2945]">ONE MORE THING…</button>}
                    {hidden === 1 && <button onClick={()=>setHidden(2)} className="w-full rounded-full border border-white/10 bg-white py-3 text-[11px] tracking-[0.16em] uppercase text-[#5A1832] hover:bg-[#FFE8EE]">Okay, last thing…</button>}
                    {hidden === 2 && <p className="text-center text-[11px] italic text-[#7A2945]/45">That’s really it. For now. ❤️</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex justify-center gap-2">
                <button onClick={()=>{ setOpen(false); setReveal(0); setHidden(0) }} className="rounded-full border border-[#EFA7B8]/15 bg-white px-5 py-2 text-[11px] tracking-[0.12em] uppercase text-[#5A1832]/60 hover:bg-[#FFE8EE]">fold & close</button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
