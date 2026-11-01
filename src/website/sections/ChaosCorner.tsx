import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chaosQuestions } from '../../data/websiteContent'

export function ChaosCorner({ onBurst, onDiscover }: { onBurst?: (e:any)=>void; onDiscover?: ()=>void }) {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<'a'|'b'|null>(null)

  const q = chaosQuestions[idx]
  const pick = (choice: 'a'|'b', e:any) => {
    setPicked(choice)
    onBurst?.(e)
    onDiscover?.()
  }
  const next = () => {
    if(idx < chaosQuestions.length-1){ setIdx(i=>i+1); setPicked(null) }
    else { setIdx(0); setPicked(null) }
  }

  const response = picked ? q.responses[Math.floor(Math.random()*q.responses.length)] : null

  return (
    <section id="chaos" className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(239,167,184,0.08), transparent 70%)' }} aria-hidden="true" />
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow-cine text-[#F8C8D4]/40">chaos corner 😂</p>
          <h2 className="mt-3 font-display text-[clamp(1.6rem,4vw,2.6rem)] font-light leading-tight text-[#FFE8EE]">
            THE PART OF OUR RELATIONSHIP THAT <span className="italic text-[#EFA7B8]">SHOULD PROBABLY REMAIN CLASSIFIED.</span>
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/50">No wrong answers — just questionable confidence. Tap and see what the website thinks.</p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl md:p-8">
          <div className="flex items-center justify-between">
            <p className="text-[10px] tracking-[0.28em] uppercase text-[#EFA7B8]/50">{String(idx+1).padStart(2,'0')} / {String(chaosQuestions.length).padStart(2,'0')}</p>
            <div className="flex gap-1.5">
              {chaosQuestions.map((_,i)=>(
                <span key={i} className={`h-1.5 rounded-full transition-all ${i===idx ? 'w-6 bg-[#EFA7B8]' : i < idx ? 'w-1.5 bg-[#EFA7B8]/40' : 'w-1.5 bg-white/15'}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42 }}
              className="mt-6"
            >
              <h3 className="text-center font-display text-[18px] font-medium tracking-[0.04em] text-[#FFE8EE] md:text-[20px]">{q.q}</h3>
              <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
                <button
                  onClick={(e)=>pick('a',e)}
                  disabled={!!picked}
                  className={`rounded-full border px-5 py-3.5 text-center text-[13px] font-medium transition ${picked==='a' ? 'border-[#EFA7B8] bg-[#EFA7B8] text-[#1A0A14]' : picked ? 'border-white/10 bg-white/[0.02] text-white/30' : 'border-white/10 bg-white/[0.04] text-[#FFE8EE] hover:border-[#EFA7B8]/30 hover:bg-white/[0.06]'}`}
                >
                  {q.a}
                </button>
                <button
                  onClick={(e)=>pick('b',e)}
                  disabled={!!picked}
                  className={`rounded-full border px-5 py-3.5 text-center text-[13px] font-medium transition ${picked==='b' ? 'border-[#EFA7B8] bg-gradient-to-br from-[#7A2945] to-[#EFA7B8] text-white' : picked ? 'border-white/10 bg-white/[0.02] text-white/30' : 'border-white/10 bg-white/[0.04] text-[#FFE8EE] hover:border-[#EFA7B8]/30 hover:bg-white/[0.06]'}`}
                >
                  {q.b}
                </button>
              </div>

              <AnimatePresence>
                {picked && response && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto mt-6 max-w-lg rounded-[18px] border border-white/10 bg-white/[0.04] px-5 py-4 text-center backdrop-blur"
                  >
                    <p className="font-display text-[14px] italic leading-relaxed text-[#FFE8EE]">“{response}”</p>
                    <button onClick={next} className="mt-4 rounded-full bg-[#EFA7B8] px-6 py-2 text-[11px] tracking-[0.14em] uppercase text-[#1A0A14] font-medium">{idx === chaosQuestions.length-1 ? 'play again ↻' : 'next →'}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
