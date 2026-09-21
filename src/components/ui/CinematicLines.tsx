/* ------------------------------------------------------------------ */
/*  CinematicLines — staged lines of cinematic text                      */
/* ------------------------------------------------------------------ */

import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStagedText } from '../../hooks/useStagedText'
import { useExperience } from '../../state/experience'
import type { StagedLine } from '../../types'

interface CinematicLinesProps {
  lines: StagedLine[]
  onDone?: () => void
  startDelay?: number
  /** keep the final line on screen instead of fading it away */
  keepLast?: boolean
  /** click / tap advances to the next line */
  clickable?: boolean
  className?: string
  /** luxury variant: light = blush on dark wine, dark = wine on blush */
  variant?: 'light' | 'dark'
  children?: ReactNode
}

export function CinematicLines({
  lines,
  onDone,
  startDelay = 900,
  keepLast = false,
  clickable = true,
  className = '',
  variant = 'light',
  children,
}: CinematicLinesProps) {
  const reduced = useExperience((s) => s.reducedMotion)
  const { index, current, done, next } = useStagedText(lines, {
    startDelay,
    keepLast,
    onDone,
  })

  const variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24, filter: 'blur(10px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: reduced ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: {
      opacity: 0,
      y: reduced ? 0 : -16,
      filter: 'blur(6px)',
      transition: { duration: reduced ? 0.15 : 0.55, ease: 'easeIn' as const },
    },
  }

  return (
    <div
      className={`relative flex min-h-[7rem] w-full items-center justify-center ${
        clickable && !done ? 'cursor-pointer' : ''
      } ${clickable ? 'pointer-events-auto' : ''} ${className}`}
      onClick={() => {
        if (!done) next()
      }}
      role={clickable ? 'button' : undefined}
      aria-live="polite"
      tabIndex={clickable ? -1 : undefined}
    >
      <AnimatePresence mode="wait">
        {current && !done && (
          <motion.p
            key={index}
            variants={variants}
            initial="hidden"
            animate="show"
            exit="exit"
            className={`px-2 text-center font-display font-light ${
              variant === 'dark' ? 'text-glow-warm' : 'text-glow'
            } ${
              current.accent
                ? variant === 'dark'
                  ? 'italic text-[#9E3D5C] text-[clamp(1.9rem,5vw,3.6rem)]'
                  : 'italic text-rose text-[clamp(1.9rem,5vw,3.6rem)]'
                : variant === 'dark'
                  ? 'text-[#5A1832]/92 text-[clamp(1.4rem,4vw,3rem)]'
                  : 'text-ink/95 text-[clamp(1.4rem,4vw,3rem)]'
            }`}
          >
            {current.text}
          </motion.p>
        )}
      </AnimatePresence>
      {done && children}
    </div>
  )
}
