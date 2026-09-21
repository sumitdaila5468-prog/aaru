import { useState } from 'react'
import { motion } from 'framer-motion'
import { finalContent } from '../../data/websiteContent'
import { memories } from '../../data/memories'
import { withBase } from '../../utils/paths'
import { Modal } from '../shared/Modal'

export function FinalSurprise({ onBurst }: { onBurst?: (e:any)=>void }) {
  const [showLast, setShowLast] = useState(false)
  const src = withBase(memories[0].src)

  const handleRestart = () => {
    const el = document.getElementById('home')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="final" className="relative overflow-hidden bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.04]" style={{ background: 'radial-gradient(600px 400px at 50% 20%, #7A2945, transparent 70%)' }} />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22,1,0.36,1] }}
          className="relative w-full max-w-[560px] overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] p-2 shadow-[0_20px_60px_rgba(90,24,50,0.14)]"
        >
          <div className="relative overflow-hidden rounded-[16px] border border-[#EFA7B8]/16">
            <img src={src} alt="Aaru — final" className="aspect-[4/5.2] w-full object-cover" style={{ objectPosition: memories[0].objectPosition ?? '50% 28%' }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5A1832]/34 via-transparent to-transparent" />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#5A1832]/42 to-transparent p-6">
              <p className="font-display text-[22px] font-light italic text-white">Aaru ❤️</p>
              <p className="mt-1 max-w-md whitespace-pre-line text-[12px] leading-relaxed text-white/85">{finalContent.line2}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 max-w-xl text-center"
        >
          <p className="font-display text-[22px] font-light italic text-[#FFE8EE]">{finalContent.line3}</p>
          <p className="mt-2 font-display text-[18px] tracking-[0.18em] uppercase text-[#EFA7B8]">{finalContent.always}</p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button onClick={(e)=>{ handleRestart(); onBurst?.(e) }} className="ghost-btn w-full justify-center sm:w-auto">💗 START AGAIN</button>
            <button onClick={()=>setShowLast(true)} className="w-full rounded-full border border-white/20 bg-white/[0.08] px-6 py-3 text-[11px] font-medium tracking-[0.16em] uppercase text-white backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.22)] hover:bg-white/[0.12] hover:border-[#EFA7B8]/30 hover:text-[#FFE8EE] sm:w-auto">💌 READ ONE LAST MESSAGE</button>
          </div>
          <p className="mt-4 text-[10px] tracking-[0.16em] uppercase text-white/22">you reached the end — but our story doesn’t end here ♡</p>
        </motion.div>
      </div>

      <Modal open={showLast} onClose={()=>setShowLast(false)} title={finalContent.lastMessageTitle} maxWidth="max-w-lg">
        <p className="whitespace-pre-line font-display text-[14px] italic leading-relaxed text-[#2A0E1E]">{finalContent.lastMessage}</p>
        <div className="mt-6 flex gap-2">
          <button onClick={()=>setShowLast(false)} className="rounded-full bg-[#5A1832] px-6 py-2 text-[11px] tracking-[0.12em] uppercase text-white">close ❤️</button>
          <button onClick={()=>{ setShowLast(false); const el=document.getElementById('home'); el?.scrollIntoView({behavior:'smooth'}) }} className="rounded-full border border-[#EFA7B8]/20 bg-white px-6 py-2 text-[11px] tracking-[0.12em] uppercase text-[#5A1832]/70 hover:bg-[#FFF7F8]">back to top ↑</button>
        </div>
      </Modal>
    </section>
  )
}
