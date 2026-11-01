import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, RotateCcw, Sparkles, Wind } from 'lucide-react'

const CANDLES = [0, 1, 2, 3, 4, 5]
const CONFETTI_COLORS = ['#f26a91', '#ffd36e', '#a58bff', '#7fd6c2', '#ff9a76']

function readWish(): string {
  try {
    return localStorage.getItem('aarju-wish-v1') ?? ''
  } catch {
    return ''
  }
}

export function BirthdayCake({ onBurst }: { onBurst?: (event?: { clientX: number; clientY: number }) => void }) {
  const [lit, setLit] = useState<boolean[]>(() => CANDLES.map(() => true))
  const [wish, setWish] = useState(readWish)
  const [sealed, setSealed] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const timeouts = useRef<number[]>([])
  const onBurstRef = useRef(onBurst)
  const allOut = lit.every((value) => !value)
  const stillLit = lit.filter(Boolean).length

  useEffect(() => {
    onBurstRef.current = onBurst
  }, [onBurst])

  useEffect(() => {
    try {
      const trimmed = wish.trim()
      if (trimmed) localStorage.setItem('aarju-wish-v1', trimmed)
      else localStorage.removeItem('aarju-wish-v1')
    } catch (error) {
      void error
    }
  }, [wish])

  useEffect(() => {
    if (!allOut) return
    setSealed(true)
    setBurstKey((key) => key + 1)
    const id = window.setTimeout(() => {
      onBurstRef.current?.({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 })
    }, 260)
    return () => window.clearTimeout(id)
  }, [allOut])

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
      timeouts.current = []
    }
  }, [])

  const blow = (index: number, event?: { clientX: number; clientY: number }) => {
    if (!lit[index]) return
    setLit((previous) => previous.map((value, candle) => (candle === index ? false : value)))
    onBurst?.(event)
  }

  const blowAll = (event?: { clientX: number; clientY: number }) => {
    if (allOut) return
    onBurst?.(event)
    lit.forEach((value, index) => {
      if (!value) return
      const id = window.setTimeout(() => {
        setLit((previous) => previous.map((candleLit, candle) => (candle === index ? false : candleLit)))
      }, index * 120)
      timeouts.current.push(id)
    })
  }

  const reset = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id))
    timeouts.current = []
    setLit(CANDLES.map(() => true))
    setSealed(false)
  }

  return (
    <section id="wish" className="wish-section">
      <div className="wish-heading">
        <p className="section-overline">A BIRTHDAY RITUAL</p>
        <h2>Make a <em>wish</em>, Aarju</h2>
        <p>Six candles, one wish, and a whole universe waiting to hear it. Tap the candles or blow them all out at once.</p>
      </div>

      <div className="wish-card">
        <div className="wish-copy">
          <div className="wish-counter">
            <Flame size={15} />
            <span>{stillLit} / {CANDLES.length} candles still glowing</span>
          </div>

          <label className="wish-label" htmlFor="birthday-wish">Leave your wish here (optional)</label>
          <input
            id="birthday-wish"
            className="wish-input"
            value={wish}
            onChange={(event) => setWish(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !sealed) blowAll()
            }}
            maxLength={120}
            placeholder="I wish for…"
            autoComplete="off"
          />

          <div className="wish-actions">
            {!sealed ? (
              <button type="button" className="birthday-primary" onClick={(event) => blowAll(event)}>
                BLOW ALL CANDLES <Wind size={17} />
              </button>
            ) : (
              <button type="button" className="birthday-secondary" onClick={reset}>
                LIGHT THEM AGAIN <RotateCcw size={16} />
              </button>
            )}
            <span className="wish-hint">or tap each candle — make it count</span>
          </div>

          <AnimatePresence mode="wait">
            {sealed && (
              <motion.div
                key="sealed"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="wish-sealed"
                aria-live="polite"
              >
                <Sparkles size={17} />
                <p>Wish sealed, birthday girl.</p>
                <strong>{wish.trim() ? `“${wish.trim()}”` : 'Your wish is safe with me — and the universe.'}</strong>
                <small>Kept only on this device. No one else can see it.</small>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="wish-cake-stage">
          <div className="wish-cake-glow" aria-hidden="true" />
          <span className="wish-sparkle wish-sparkle-a" aria-hidden="true">✦</span>
          <span className="wish-sparkle wish-sparkle-b" aria-hidden="true">✧</span>
          <span className="wish-sparkle wish-sparkle-c" aria-hidden="true">✦</span>

          <div className="wish-cake" aria-label="A birthday cake with six candles">
            <div className="wish-candle-row">
              {CANDLES.map((candle) => (
                <button
                  key={candle}
                  type="button"
                  className={`wish-candle ${lit[candle] ? 'is-lit' : 'is-out'}`}
                  onClick={(event) => blow(candle, event)}
                  disabled={!lit[candle]}
                  aria-label={lit[candle] ? `Blow out candle ${candle + 1}` : `Candle ${candle + 1} is out`}
                >
                  <span className="wish-flame" aria-hidden="true" />
                  <span className="wish-wick" aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="wish-tier wish-tier-top" />
            <div className="wish-tier wish-tier-middle" />
            <div className="wish-tier wish-tier-bottom" />
            <div className="wish-plate" />
          </div>

          <p className="wish-cake-caption">
            {sealed ? 'The candles are out. The wish is in the universe. ✨' : 'A little cake, a big wish, all for you.'}
          </p>
        </div>
      </div>

      {sealed && (
        <div key={burstKey} className="wish-confetti" aria-hidden="true">
          {Array.from({ length: 26 }).map((_, index) => (
            <i
              key={index}
              style={{
                left: `${(index * 29 + 7) % 100}%`,
                animationDelay: `${(index % 9) * 0.07}s`,
                background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
                transform: `rotate(${index * 31}deg)`,
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
