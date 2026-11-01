import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock3, MousePointerClick, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { memories } from '../../data/memories'
import { memoryMessages } from '../../data/websiteContent'
import { withBase } from '../../utils/paths'

interface MatchCard {
  uid: number
  memoryIndex: number
}

const BEST_KEY = 'aarju-memory-best-v1'

function makeDeck(): MatchCard[] {
  const cards = memories.slice(0, 6).flatMap((_, index) => [
    { uid: index * 2, memoryIndex: index },
    { uid: index * 2 + 1, memoryIndex: index },
  ])
  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[cards[index], cards[swap]] = [cards[swap], cards[index]]
  }
  return cards
}

function readBest(): number | null {
  try {
    const stored = Number(localStorage.getItem(BEST_KEY))
    return Number.isFinite(stored) && stored > 0 ? stored : null
  } catch {
    return null
  }
}

function formatTime(milliseconds: number): string {
  const total = Math.max(0, Math.floor(milliseconds / 1000))
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

export function MemoryMatch({ onBurst }: { onBurst?: (event?: { clientX: number; clientY: number }) => void }) {
  const [deck, setDeck] = useState<MatchCard[]>(makeDeck)
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(() => new Set())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [best, setBest] = useState<number | null>(readBest)
  const [won, setWon] = useState(false)
  const [newBest, setNewBest] = useState(false)
  const timeouts = useRef<number[]>([])

  useEffect(() => {
    if (!startedAt || won) return
    const id = window.setInterval(() => setElapsed(Date.now() - startedAt), 250)
    return () => window.clearInterval(id)
  }, [startedAt, won])

  useEffect(() => {
    if (won || deck.length === 0 || matched.size !== deck.length) return
    const finalTime = startedAt ? Date.now() - startedAt : elapsed
    const record = best === null || moves < best
    setWon(true)
    setElapsed(finalTime)
    setNewBest(record)
    if (record) {
      setBest(moves)
      try {
        localStorage.setItem(BEST_KEY, String(moves))
      } catch (error) {
        void error
      }
    }
    onBurst?.({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 })
  }, [matched, deck.length, won, moves, best, startedAt, elapsed, onBurst])

  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id))
      timeouts.current = []
    }
  }, [])

  const flip = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (locked || won || flipped.length >= 2 || matched.has(index) || flipped.includes(index)) return
    if (!startedAt) setStartedAt(Date.now())

    const next = [...flipped, index]
    setFlipped(next)
    if (next.length < 2) return

    setMoves((value) => value + 1)
    const [first, second] = next

    if (deck[first].memoryIndex === deck[second].memoryIndex) {
      const id = window.setTimeout(() => {
        setMatched((previous) => {
          const updated = new Set(previous)
          updated.add(first)
          updated.add(second)
          return updated
        })
        setFlipped([])
        onBurst?.({ clientX: event.clientX, clientY: event.clientY })
      }, 460)
      timeouts.current.push(id)
    } else {
      setLocked(true)
      const id = window.setTimeout(() => {
        setFlipped([])
        setLocked(false)
      }, 880)
      timeouts.current.push(id)
    }
  }

  const reset = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id))
    timeouts.current = []
    setDeck(makeDeck())
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setLocked(false)
    setStartedAt(null)
    setElapsed(0)
    setWon(false)
    setNewBest(false)
  }

  return (
    <section id="game" className="match-section">
      <div className="match-heading">
        <p className="section-overline">PLAY WITH ME</p>
        <h2>Find every <em>memory</em></h2>
        <p>Six pairs, twelve little cards. Flip two at a time and reunite every photo with its twin.</p>
      </div>

      <div className="match-shell">
        <div className="match-stats">
          <span><MousePointerClick size={14} /> {moves} moves</span>
          <span><Clock3 size={14} /> {formatTime(elapsed)}</span>
          <span><Trophy size={14} /> {best === null ? 'no record yet' : `${best} move best`}</span>
        </div>

        <div className="match-grid" aria-live="polite">
          {deck.map((card, index) => {
            const isOpen = flipped.includes(index) || matched.has(index)
            const isMatched = matched.has(index)
            const memory = memories[card.memoryIndex]
            const message = memoryMessages[card.memoryIndex]
            return (
              <motion.button
                key={card.uid}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                onClick={(event) => flip(index, event)}
                disabled={isMatched || won}
                aria-label={isOpen ? `Memory card: ${message.title}` : 'Hidden memory card'}
                aria-pressed={isOpen}
                className={`match-card ${isOpen ? 'is-open' : ''} ${isMatched ? 'is-matched' : ''}`}
              >
                <span className="match-card-inner">
                  <span className="match-face match-back">
                    <span className="match-back-heart">💗</span>
                    <small>AARJU'S MEMORY</small>
                  </span>
                  <span className="match-face match-front">
                    <img
                      src={withBase(memory.src)}
                      alt={message.title}
                      loading="lazy"
                      style={{ objectPosition: memory.objectPosition ?? '50% 28%' }}
                    />
                    <span className="match-front-caption">
                      <small>{String(card.memoryIndex + 1).padStart(2, '0')}</small>
                      <b>{message.title}</b>
                    </span>
                    {isMatched && <span className="match-check">✓</span>}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <div className="match-footer">
          <p><Sparkles size={13} /> {won ? 'Every memory found — just like us, nothing gets lost.' : 'A little memory game, because your photos deserve to be played with.'}</p>
          <button type="button" className="match-reset" onClick={reset}>
            <RotateCcw size={14} /> {won ? 'PLAY AGAIN' : 'RESHUFFLE'}
          </button>
        </div>

        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="match-win"
              role="status"
            >
              <div className="match-win-stars" aria-hidden="true">✦ ✧ ✦</div>
              <p className="section-overline">ALL SIX MEMORIES FOUND</p>
              <h3>{newBest ? 'A new record, birthday girl!' : 'You found every memory.'}</h3>
              <p>Finished in <b>{moves} moves</b> and <b>{formatTime(elapsed)}</b>. You + me = always ❤️</p>
              <button type="button" className="birthday-primary" onClick={reset}>
                PLAY AGAIN <RotateCcw size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
