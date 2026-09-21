import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { compatibilityGame } from '../../data/websiteContent'

export function CompatibilityGame({ onBurst, onDiscover }: { onBurst?: (e:any)=>void; onDiscover?: ()=>void }) {
  const [step, setStep] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [result, setResult] = useState<string|null>(null)

  const current = compatibilityGame.steps[step]

  const pick = (label: string, e:any) => {
    const nextChoices = [...choices, label]
    setChoices(nextChoices)
    onBurst?.(e)
    if(step < compatibilityGame.steps.length-1){
      setStep(s=>s+1)
    } else {
      const res = compatibilityGame.results[Math.floor(Math.random()*compatibilityGame.results.length)]
      setResult(res)
      onDiscover?.()
    }
  }

  const reset = () => {
    setStep(0)
    setChoices([])
    setResult(null)
  }

  return (
    <section className="relative bg-[#1A0A14] px-4 py-14 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow-cine text-[#F8C8D4]/40">love compatibility mini game</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#FFE8EE]">Are we <span className="italic text-[#EFA7B8]">compatible?</span> 😏</h2>
          <p className="text-[13px] text-white/50">Pick one each — result is scientifically questionable but romantically accurate.</p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl md:p-8">
          {!result ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[10px] tracking-[0.28em] uppercase text-[#EFA7B8]/50">question {step+1} / {compatibilityGame.steps.length}</p>
                <div className="flex gap-1.5">
                  {compatibilityGame.steps.map((_,i)=>(
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i===step ? 'w-6 bg-[#EFA7B8]' : i < step ? 'w-1.5 bg-[#EFA7B8]/40' : 'w-1.5 bg-white/15'}`} />
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.42 }}
                  className="mt-6"
                >
                  <h3 className="text-center font-display text-[18px] italic text-[#FFE8EE]">“{current.q}”</h3>
                  <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
                    {current.options.map(opt=>(
                      <button
                        key={opt.label}
                        onClick={(e)=>pick(opt.label, e)}
                        className="rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-4 text-center shadow-sm transition hover:border-[#EFA7B8]/20 hover:bg-white/[0.06]"
                      >
                        <span className="text-[22px]">{opt.icon}</span>
                        <span className="mt-1 block text-[11px] font-medium tracking-[0.12em] uppercase text-[#FFE8EE]">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <p className="eyebrow-cine text-[#EFA7B8]/60">compatibility result ❤️</p>
              <h3 className="mt-3 font-display text-[22px] font-light italic text-[#FFE8EE]">{result}</h3>
              <p className="mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-white/45">
                Picks: {choices.join(' → ')} — verified by the universe. No refunds.
              </p>
              <button onClick={reset} className="mt-6 rounded-full bg-[#EFA7B8] px-6 py-2 text-[11px] tracking-[0.14em] uppercase text-[#1A0A14] font-medium">play again ↻</button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
