import { useState } from 'react'
import { motion } from 'framer-motion'
import { FloatingHearts } from '../shared/FloatingHearts'
import { memories } from '../../data/memories'
import { withBase } from '../../utils/paths'
import { ambientAudio } from '../../utils/audio'
import { Modal } from '../shared/Modal'

export function HomeHero({ onBurst, discovered = 0, total = 7 }: { onBurst?: (e:any)=>void; discovered?: number; total?: number }) {
  const [surpriseOpen, setSurpriseOpen] = useState(false)
  const [playing, setPlaying] = useState(false)

  const primaryPhoto = withBase(memories[0].src)
  const secondaryPhotos = [1,2].map(i=> withBase(memories[i].src))

  const handleEnter = () => {
    const el = document.getElementById('hub')
    if(el) el.scrollIntoView({ behavior: 'smooth' })
    else document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    if(!playing){
      void ambientAudio.start().then(()=> setPlaying(true)).catch(()=>{})
    }
    onBurst?.(null as any)
  }

  const handleFound = () => {
    setSurpriseOpen(true)
    if(!playing){
      void ambientAudio.start().then(()=> setPlaying(true)).catch(()=>{})
    }
  }

  return (
    <section id="home" className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-[#0F040A] px-4 pb-10 pt-28 md:min-h-[100vh] md:px-6 md:pt-20">
      {/* dark background gradient */}
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, #1A0A14 0%, #0F040A 38%, #1E0A1A 62%, #0F040A 88%, #1A0A14 100%)' }} />
      {/* soft gold/rose glow behind — subtle on dark */}
      <div className="absolute left-1/2 top-[38%] -z-10 h-[560px] w-[900px] max-w-[96vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-2xl" style={{ background: 'radial-gradient(ellipse at center, rgba(255,214,165,0.18), rgba(239,167,184,0.12) 44%, transparent 70%)' }} aria-hidden="true" />

      <FloatingHearts onHeartClick={()=>onBurst?.(null as any)} />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.22,1,0.36,1] }}
        className="relative flex w-full max-w-6xl flex-col items-center"
      >
        {/* progress pill — dark glass */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.22)] backdrop-blur-xl"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#EFA7B8]" />
          <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#FFE8EE]/80">{discovered} / {total} worlds discovered</span>
          <span className="text-[11px]">✨</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="eyebrow-cine text-[#F8C8D4]/45"
        >
          — a tiny world made for my favorite person —
        </motion.p>

        <div className="mt-5 grid w-full items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-6">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.3, delay: 0.3, ease: [0.22,1,0.36,1] }}
              className="hero-serif text-[clamp(3.2rem,9vw,6.8rem)] leading-[0.9] text-glow-warm"
              style={{
                background: 'linear-gradient(135deg, #3A0E22 0%, #5A1832 18%, #7A2945 42%, #C98AA0 62%, #EFA7B8 78%, #FFD6A5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Aaru Universe <span className="not-italic">❤️</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.7 }}
              className="mt-3 max-w-[28rem] font-display text-[15px] italic leading-relaxed text-[#FFE8EE]/72 md:text-[16px]"
            >
              A tiny world made for my favorite person.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.85 }}
              className="mt-2 max-w-[28rem] text-[12px] leading-relaxed text-[#F8C8D4]/55 md:text-[13px]"
            >
              Explore it. Click everything. There are secrets everywhere.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95 }}
              className="mt-7 flex flex-col items-center gap-3 sm:flex-row md:items-start"
            >
              <button onClick={handleEnter} className="ghost-btn enter-halo pointer-events-auto min-w-[210px] justify-center">
                ENTER MY UNIVERSE ❤️
              </button>
              <button onClick={handleFound} className="pointer-events-auto rounded-full border border-white/10 bg-white/[0.06] px-6 py-[14px] text-[11px] font-medium tracking-[0.18em] uppercase text-white/80 backdrop-blur-xl transition hover:border-[#EFA7B8]/20 hover:bg-white/10 hover:text-white">
                I FOUND SOMETHING 👀
              </button>
            </motion.div>

            <p className="mt-4 text-[10px] tracking-[0.22em] uppercase text-white/22">click the floating hearts — they whisper ✨</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22,1,0.36,1] }}
            className="relative mx-auto w-full max-w-[420px] md:mx-0 md:ml-auto"
          >
            <div className="relative">
              <div className="photo-frame-cream rotate-[-1.2deg] transition-transform hover:rotate-[-0.6deg]">
                <div className="photo-frame-cream-inner overflow-hidden rounded-[5px]">
                  <div className="relative aspect-[4/5.1] overflow-hidden">
                    <img src={primaryPhoto} alt="Aaru — main" className="h-full w-full object-cover" style={{ objectPosition: memories[0].objectPosition ?? '50% 28%' }} loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#5A1832]/10 via-transparent to-transparent" />
                    <div className="photo-film-grain opacity-[0.05]" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-2 hidden w-32 rotate-[5deg] md:block">
                <div className="rounded-[12px] border border-white bg-white p-1.5 shadow-[0_10px_28px_rgba(90,24,50,0.14)]">
                  <img src={secondaryPhotos[0]} alt="" className="aspect-square rounded-[8px] object-cover" style={{ objectPosition: memories[1].objectPosition ?? '50% 22%' }} loading="lazy" />
                </div>
              </div>
              <div className="absolute -left-4 top-10 hidden w-28 rotate-[-6deg] md:block">
                <div className="rounded-[12px] border border-white bg-white p-1.5 shadow-[0_10px_28px_rgba(90,24,50,0.13)]">
                  <img src={secondaryPhotos[1]} alt="" className="aspect-[4/3.2] rounded-[8px] object-cover" style={{ objectPosition: memories[2].objectPosition ?? '50% 30%' }} loading="lazy" />
                </div>
              </div>
              <div className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-br from-[#FFD6A5]/20 via-[#EFA7B8]/14 to-transparent blur-2xl" aria-hidden="true" />
            </div>
            <p className="mt-7 text-center font-display text-[11px] italic tracking-wide text-white/32 md:text-left">real photos, real moments — every one has a story behind it. ↓</p>
          </motion.div>
        </div>

        <motion.button
          onClick={handleEnter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.0 }}
          className="pointer-events-auto mt-10 flex flex-col items-center gap-2 md:mt-8"
          aria-label="Scroll to explore"
        >
          <span className="text-[9px] tracking-[0.28em] uppercase text-white/28">explore</span>
          <span className="flex h-10 w-6 justify-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
            <motion.span className="h-2 w-1 rounded-full bg-[#EFA7B8]" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
          </span>
        </motion.button>
      </motion.div>

      <Modal open={surpriseOpen} onClose={()=>setSurpriseOpen(false)} title="You found something 👀" maxWidth="max-w-md">
        <div className="space-y-4">
          <p className="font-display text-[15px] italic leading-relaxed text-[#7A2945]/80">
            Of course you clicked “I found something” first — you’re curious like that. 😌
          </p>
          <p className="text-[13px] leading-relaxed text-[#7A2945]/64">
            This whole universe is built to be explored. Every card, every heart, every “don’t click this” is a tiny surprise. Go find them all — I’ll be watching how many you discover.
          </p>
          <p className="font-display italic text-[#5A1832]">Hint: the hub below shows 0/7 — watch it change as you explore ✨</p>
          <button onClick={()=>setSurpriseOpen(false)} className="ghost-btn w-full justify-center">Take me to the universe →</button>
        </div>
      </Modal>
    </section>
  )
}
