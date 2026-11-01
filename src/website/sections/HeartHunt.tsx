import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onBurst?: (e:any)=>void
  onDiscover?: ()=>void
  onHeartFound?: (count:number)=>void
}

export function HeartHunt({ onBurst, onDiscover, onHeartFound }: Props) {
  const [found, setFound] = useState<Set<number>>(new Set())
  const [toast, setToast] = useState<string|null>(null)

  const hearts = [
    { id: 1, top: '18%', left: '12%', size: 14 },
    { id: 2, top: '42%', left: '88%', size: 12 },
    { id: 3, top: '68%', left: '22%', size: 16 },
    { id: 4, top: '22%', left: '72%', size: 13 },
    { id: 5, top: '78%', left: '68%', size: 14 },
  ]

  const clickHeart = (id:number, e:any) => {
    if(found.has(id)) return
    const next = new Set([...found, id])
    setFound(next)
    const count = next.size
    onBurst?.(e)
    onHeartFound?.(count)
    if(count===1) setToast('SECRET HEART FOUND ❤️')
    else if(count===2) setToast('Another one! You’re good at this ✨')
    else if(count===3) setToast('Wait… you’ve found 3 secrets.')
    else if(count===4) setToast('You’re obsessed… and I love it 😂')
    else if(count===5){
      setToast('You’ve found them all. Something new has unlocked… 🔓')
      onDiscover?.()
    }
    setTimeout(()=>setToast(null), 2200)
  }

  return (
    <section className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow-cine text-[#F8C8D4]/40">hidden heart hunt</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-light text-[#FFE8EE]">Find the <span className="italic text-[#EFA7B8]">hearts</span> I hid ✨</h2>
        <p className="mx-auto mt-2 max-w-lg text-[13px] leading-relaxed text-white/50">They’re tiny. They’re shy. They’re hidden in this section — try clicking around. Don’t miss the faint ones.</p>
        <p className="mt-3 text-[10px] tracking-[0.18em] uppercase text-white/30">{found.size} / 5 hidden hearts found</p>
      </div>

      <div className="relative mx-auto mt-8 max-w-3xl overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl md:p-8">
        {/* hunt area */}
        <div className="relative h-[280px] w-full overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-br from-[#1A0A14]/60 via-[#0F040A] to-[#1A0A14]/40 md:h-[320px]">
          {/* subtle background dots */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ background: 'radial-gradient(circle at 20% 30%, #7A2945 1px, transparent 1px), radial-gradient(circle at 80% 70%, #EFA7B8 1px, transparent 1px)' }} />
          <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-display text-[12px] italic text-white/18">tap the faint hearts — they’re here… somewhere 👀</p>

          {hearts.map(h=> {
            const isFound = found.has(h.id)
            return (
              <button
                key={h.id}
                onClick={(e)=>clickHeart(h.id, e)}
                className={`absolute flex items-center justify-center rounded-full transition-all ${isFound ? 'bg-white/[0.06] border border-[#EFA7B8]/20 scale-110 opacity-100' : 'opacity-[0.14] hover:opacity-[0.72] hover:scale-110 bg-white/[0.03] border border-white/10'}`}
                style={{ top: h.top, left: h.left, width: h.size+16, height: h.size+16, fontSize: h.size }}
                aria-label={`heart ${h.id}`}
              >
                <span className={isFound ? 'text-[#EFA7B8]' : 'text-white/70'}>{isFound ? '💖' : '❤️'}</span>
              </button>
            )
          })}

          {/* found overlay */}
          {found.size===5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-3 left-3 right-3 rounded-[14px] border border-[#EFA7B8]/20 bg-white/[0.08] px-4 py-3 text-center shadow backdrop-blur"
            >
              <p className="font-display text-[13px] italic text-[#FFE8EE]">All hearts found! You’re officially my favourite explorer ❤️</p>
              <p className="mt-1 text-[10px] tracking-[0.14em] uppercase text-white/30">secret room clue unlocked →</p>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 text-center font-display text-[13px] italic text-[#FFE8EE]"
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
