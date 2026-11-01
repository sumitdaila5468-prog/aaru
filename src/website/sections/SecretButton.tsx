import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { secretInteractions } from '../../data/websiteContent'

export function SecretButton({ onBurst }: { onBurst?: (e:any)=>void; burstTrigger?: (e:any)=>void }) {
  const [step, setStep] = useState(0)
  const [secretHearts, setSecretHearts] = useState<number>(0)

  const handleMain = (e:any) => {
    if(step < 3) setStep(s=> s+1)
    onBurst?.(e)
  }

  return (
    <section className="relative bg-gradient-to-b from-[#FFFDFB] via-[#FFE8EE]/30 to-[#E8D9FF]/20 px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[24px] border border-dashed border-[#EFA7B8]/22 bg-white/60 p-8 shadow-[0_10px_32px_rgba(90,24,50,0.06)] backdrop-blur"
        >
          <p className="text-[11px] tracking-[0.24em] uppercase text-[#7A2945]/32">shh... secret zone</p>
          <h3 className="mt-2 font-display text-[22px] font-light italic text-[#5A1832]">There’s a secret here.</h3>

          <AnimatePresence mode="wait">
            {step===0 && (
              <motion.button
                key="s0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={handleMain}
                className="mx-auto mt-6 rounded-full border border-white/10 bg-white px-8 py-3 text-[11px] tracking-[0.18em] uppercase text-[#7A2945]/60 hover:border-[#EFA7B8]/30 hover:bg-[#FFF7F8] hover:text-[#5A1832]"
              >
                DO NOT CLICK THIS 👀
              </motion.button>
            )}
            {step===1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <p className="font-display text-[16px] italic text-[#5A1832]">Why did you listen? 😂</p>
                <button onClick={handleMain} className="mt-3 rounded-full bg-[#5A1832] px-6 py-2 text-[11px] tracking-[0.14em] uppercase text-white">okay, what’s next?</button>
              </motion.div>
            )}
            {step===2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <p className="text-[13px] text-[#7A2945]/60">{secretInteractions.reveal}</p>
                <button onClick={handleMain} className="mt-3 rounded-full border border-[#EFA7B8]/20 bg-white px-6 py-2 text-[11px] tracking-[0.12em] uppercase text-white/70">reveal it ❤️</button>
              </motion.div>
            )}
            {step===3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-[16px] border border-[#EFA7B8]/14 bg-gradient-to-br from-[#FFE8EE] to-[#FFF7F8] px-5 py-4">
                <p className="font-display text-[14px] italic leading-relaxed text-[#5A1832]">“{secretInteractions.loveNote}”</p>
                <p className="mt-2 text-[11px] text-white/40">You found the main secret. There are 2 more hidden around the site — little hearts that appear when you click the right spots. Go hunt ✨</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* secondary secrets */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <button
                onClick={(e)=>{ setSecretHearts(c=>c+1); onBurst?.(e) }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EFA7B8]/20 bg-white text-[12px] hover:bg-[#FFE8EE]"
                title="hidden heart 1"
              >
                ♡
              </button>
              <button
                onClick={(e)=>{ setSecretHearts(c=>c+1); onBurst?.(e) }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#EFA7B8]/20 bg-white text-[12px] hover:bg-[#FFE8EE]"
                title="hidden heart 2"
              >
                ♡
              </button>
              <span className="ml-2 text-[10px] tracking-[0.14em] uppercase text-[#7A2945]/22">hidden hearts: {secretHearts}/2</span>
            </div>
            {secretHearts >= 2 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-[12px] italic text-[#7A2945]/50">You found them all! You’re officially my favourite explorer ❤️</motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
