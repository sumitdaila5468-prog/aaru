/* ------------------------------------------------------------------ */
/*  Lightbox — a memory, fullscreen                                     */
/* ------------------------------------------------------------------ */

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { MemoryItem } from '../../types'
import { story } from '../../data/story'
import { withBase } from '../../utils/paths'

interface LightboxProps {
  items: MemoryItem[]
  index: number
  onClose: () => void
  onNavigate: (i: number) => void
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const total = items.length

  useEffect(() => {
    closeRef.current?.focus()
  }, [index])

  const item = items[Math.max(0, Math.min(index, total - 1))]
  if (!item) return null

  /* portaled to <body> so it escapes the section's stacking context and
     sits above the progress rail / grain, below the transition veil */
  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — memory ${index + 1} of ${total}`}
    >
      <div
        className="absolute inset-0 backdrop-blur-[22px]"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 42%, rgba(255,247,248,0.88) 0%, rgba(255,232,238,0.78) 38%, rgba(255,232,199,0.62) 72%, rgba(90,24,50,0.42) 100%)',
        }}
        onClick={onClose}
      />
      {/* warm light behind photo */}
      <div
        className="absolute left-1/2 top-1/2 h-[62vh] w-[72vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-[24px] blur-3xl"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,214,165,0.42), transparent 72%)' }}
        aria-hidden="true"
      />

      <motion.figure
        key={index}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-w-[88vw] flex-col items-center"
        onTouchStart={(e) => {
          const t = e.touches[0]
          touchStart.current = { x: t.clientX, y: t.clientY }
        }}
        onTouchEnd={(e) => {
          if (!touchStart.current) return
          const t = e.changedTouches[0]
          const dx = t.clientX - touchStart.current.x
          if (Math.abs(dx) > 60) {
            const step = dx > 0 ? 1 : -1
            onNavigate((index - step + total) % total)
          }
          touchStart.current = null
        }}
      >
        <div className="relative rounded-[6px] bg-[#FFFDFB] p-[8px] shadow-[0_12px_50px_rgba(90,24,50,0.18),0_2px_12px_rgba(90,24,50,0.10)]">
          <div className="rounded-[4px] border border-[#EFA7B8]/40 p-[6px]">
            <img
              src={withBase(item.src)}
              alt={item.title}
              draggable={false}
              className="max-h-[58vh] max-w-full rounded-[3px] object-contain md:max-h-[64vh]"
              loading="eager"
              onError={(e) => {
                const t = e.target as HTMLImageElement
                t.style.display = 'none'
                const parent = t.parentElement
                if (parent && !parent.querySelector('.fallback')) {
                  const div = document.createElement('div')
                  div.className = 'fallback flex h-[42vh] w-[68vw] max-w-[420px] items-center justify-center rounded-[3px] bg-gradient-to-br from-[#FFE8EE] to-[#F8C8D4] text-[#7A2945]/42 text-sm font-display italic'
                  div.textContent = 'memory — image not available'
                  parent.appendChild(div)
                }
              }}
            />
          </div>
        </div>
        <figcaption className="mt-6 rounded-2xl bg-white/72 px-7 py-5 text-center backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(90,24,50,0.08)]">
          <p className="font-display text-2xl font-light tracking-tight text-[#5A1832] md:text-[1.7rem]">{item.title}</p>
          <p className="mt-1.5 text-[10px] tracking-[0.32em] uppercase text-[#9E3D5C]/70">{item.date}</p>
          <p className="mx-auto mt-2.5 max-w-md font-display text-[15px] italic leading-relaxed text-[#7A2945]/80">
            {item.description}
          </p>
        </figcaption>
      </motion.figure>

      {/* controls — luxury glass */}
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/75 text-[#5A1832]/70 backdrop-blur-xl transition-colors duration-400 hover:border-[#EFA7B8]/50 hover:text-[#5A1832] shadow-[0_4px_20px_rgba(90,24,50,0.08)] md:right-7 md:top-7"
        aria-label="Close memory"
      >
        <X className="h-4.5 w-4.5" />
      </button>
      <button
        onClick={() => onNavigate((index - 1 + total) % total)}
        className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/75 text-[#5A1832]/70 backdrop-blur-xl transition-colors duration-400 hover:border-[#EFA7B8]/50 hover:text-[#5A1832] shadow-[0_4px_20px_rgba(90,24,50,0.08)] md:left-7"
        aria-label="Previous memory"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => onNavigate((index + 1) % total)}
        className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/75 text-[#5A1832]/70 backdrop-blur-xl transition-colors duration-400 hover:border-[#EFA7B8]/50 hover:text-[#5A1832] shadow-[0_4px_20px_rgba(90,24,50,0.08)] md:right-7"
        aria-label="Next memory"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <p className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-[10px] tracking-[0.32em] uppercase text-[#5A1832]/45">
        {String(index + 1).padStart(2, '0')} · {String(total).padStart(2, '0')} — {story.meta.eyebrow}
      </p>
    </motion.div>,
    document.body,
  )
}
