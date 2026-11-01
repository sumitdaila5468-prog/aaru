import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { quizQuestions } from '../../data/websiteContent'

export function QuizGame({ onBurst }: { onBurst?: (e:any)=>void }) {
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState<null | 'a' | 'b'>(null)

  const q = quizQuestions[idx]
  const response = answered ? (answered === 'a' ? q.responseA : q.responseB) : null

  const pick = (choice: 'a'|'b', e: any) => {
    setAnswered(choice)
    onBurst?.(e)
  }

  const next = () => {
    if (idx < quizQuestions.length - 1) {
      setIdx(i=>i+1)
      setAnswered(null)
    } else {
      // restart
      setIdx(0)
      setAnswered(null)
    }
  }

  return (
    <section id="quiz" className="relative bg-gradient-to-b from-[#FFF7F8] via-[#FFE8EE]/60 to-[#FFF7F8] px-4 py-14 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="eyebrow-cine text-[#7A2945]/38">how well do you know us?</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#5A1832]">A cute little <span className="italic text-[#9E3D5C]">quiz game</span> 👀</h2>
          <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-[#7A2945]/50">No wrong answers. Every tap gets a different playful reply. You can’t lose — you’re already my favourite answer.</p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[24px] border border-white/50 bg-white/80 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl md:p-8">
          <div className="flex items-center justify-between">
            <p className="text-[10px] tracking-[0.28em] uppercase text-[#9E3D5C]/50">question {idx+1} / {quizQuestions.length}</p>
            <div className="flex gap-1.5">
              {quizQuestions.map((_, i)=> (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i===idx ? 'w-6 bg-[#EFA7B8]' : i < idx ? 'w-1.5 bg-[#EFA7B8]/40' : 'w-1.5 bg-[#7A2945]/12'}`} />
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
              <h3 className="text-center font-display text-[22px] font-light italic text-[#5A1832] md:text-[26px]">{q.q}</h3>

              <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
                <button
                  onClick={(e)=>pick('a',e)}
                  disabled={!!answered}
                  className={`rounded-full border px-5 py-3.5 text-center text-[13px] font-medium tracking-wide transition ${answered==='a' ? 'border-[#5A1832] bg-[#5A1832] text-white shadow' : answered ? 'border-white/10 bg-white/60 text-white/40' : 'border-white/10 bg-white text-[#5A1832] hover:border-[#EFA7B8]/40 hover:shadow'}`}
                >
                  {q.a}
                </button>
                <button
                  onClick={(e)=>pick('b',e)}
                  disabled={!!answered}
                  className={`rounded-full border px-5 py-3.5 text-center text-[13px] font-medium tracking-wide transition ${answered==='b' ? 'border-[#EFA7B8] bg-gradient-to-br from-[#7A2945] to-[#EFA7B8] text-white shadow' : answered ? 'border-white/10 bg-white/60 text-white/40' : 'border-white/10 bg-white text-[#5A1832] hover:border-[#EFA7B8]/40 hover:shadow'}`}
                >
                  {q.b}
                </button>
              </div>

              <AnimatePresence>
                {answered && response && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
                    className="mx-auto mt-6 max-w-lg rounded-[18px] border border-[#EFA7B8]/18 bg-gradient-to-br from-[#FFE8EE] to-[#FFF7F8] px-5 py-4 text-center"
                  >
                    <p className="font-display text-[15px] italic leading-relaxed text-[#5A1832]">“{response}”</p>
                    <button onClick={next} className="mt-4 rounded-full bg-[#5A1832] px-6 py-2 text-[11px] tracking-[0.16em] uppercase text-white hover:bg-[#7A2945]">
                      {idx === quizQuestions.length - 1 ? 'play again ↻' : 'next →'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="mt-4 text-center text-[11px] italic text-[#7A2945]/30">every answer is correct when it’s you ❤️</p>
      </div>
    </section>
  )
}
