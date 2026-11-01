import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gift, Music, Sparkles } from 'lucide-react'

const confetti = Array.from({ length: 18 }).map((_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  delay: `${(index % 7) * 0.35}s`,
  duration: `${6 + (index % 5)}s`,
  color: ['#f26a91', '#ffd36e', '#a58bff', '#7fd6c2', '#ff9a76'][index % 5],
  rotate: `${(index * 29) % 180}deg`,
}))

export function BirthdayIntro({ open, onEnter }: { open: boolean; onEnter: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return
      const target = event.target as HTMLElement | null
      if (target?.closest('button, a, input, textarea, select')) return
      event.preventDefault()
      onEnter()
    }
    const scroller = document.getElementById('website-scroll')
    const previous = scroller?.style.overflowY ?? ''
    if (scroller) scroller.style.overflowY = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (scroller) scroller.style.overflowY = previous
    }
  }, [open, onEnter])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="birthday-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.035 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Open Aarju's birthday surprise"
        >
          <div className="birthday-intro-confetti" aria-hidden="true">
            {confetti.map((piece, index) => (
              <i
                key={index}
                style={{
                  left: piece.left,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                  background: piece.color,
                  transform: `rotate(${piece.rotate})`,
                }}
              />
            ))}
          </div>
          <div className="birthday-intro-glow" aria-hidden="true" />

          <motion.div
            className="birthday-intro-card"
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <p className="birthday-intro-eyebrow"><Sparkles size={13} /> A LITTLE SOMETHING FOR YOU</p>

            <motion.div
              className="birthday-intro-seal"
              animate={{ y: [0, -9, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>💌</span>
              <i aria-hidden="true" />
            </motion.div>

            <p className="birthday-intro-script">For Aarju</p>
            <h1>A birthday universe<br /><em>made just for you.</em></h1>
            <p className="birthday-intro-copy">
              Six memories, a hundred reasons, a few secrets and one very big wish.
              Take your time — this whole little world is yours.
            </p>

            <button type="button" className="birthday-intro-button" onClick={onEnter}>
              OPEN YOUR SURPRISE <Gift size={18} />
            </button>

            <div className="birthday-intro-meta">
              <span><Music size={12} /> MUSIC STARTS WITH A TAP</span>
              <span className="birthday-intro-dot" />
              <span>03 NOVEMBER</span>
            </div>
            <p className="birthday-intro-made">made with a lot of love by Sumit</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
