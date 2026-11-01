/* ------------------------------------------------------------------ */
/*  ProgressRail — the nine chapters of the experience                  */
/*  Desktop: dots on the right. Mobile: a thin line on top.             */
/* ------------------------------------------------------------------ */

import { useExperience, STAGE_COUNT } from '../../state/experience'
import { story } from '../../data/story'
import { motion, AnimatePresence } from 'framer-motion'

export function ProgressRail() {
  const entered = useExperience((s) => s.entered)
  const stage = useExperience((s) => s.stage)
  const requestStage = useExperience((s) => s.requestStage)
  const isMobile = useExperience((s) => s.isMobile)

  if (!entered) return null

  if (isMobile) {
    return (
      <div className="fixed left-0 right-0 top-0 z-30 pointer-events-none" aria-hidden="true">
        <div className="h-[2px] w-full bg-white/35 backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-[#7A2945] via-[#EFA7B8] to-[#FFD6A5] transition-all duration-700"
            style={{ width: `${((stage + 1) / STAGE_COUNT) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.nav
        key="rail"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="fixed right-5 md:right-7 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-3.5"
        aria-label="Chapters"
      >
        {story.navigation.map((item, i) => {
          const active = i === stage
          return (
            <button
              key={item.label}
              onClick={() => requestStage(i)}
              className="group relative flex items-center justify-end py-1"
              aria-label={`Go to chapter ${i + 1} — ${item.label}`}
              aria-current={active ? 'step' : undefined}
            >
              <span
                className={`pointer-events-none absolute right-6 whitespace-nowrap rounded-full border border-white/20 bg-white/72 px-2.5 py-1 text-[9px] tracking-[0.24em] uppercase backdrop-blur-xl transition-all duration-500 ${
                  active
                    ? 'text-[#5A1832] opacity-100 translate-x-0 shadow-[0_4px_16px_rgba(90,24,50,0.08)]'
                    : 'text-[#7A2945]/70 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block rounded-full border backdrop-blur-md transition-all duration-500 ${
                  active
                    ? 'h-2.5 w-2.5 border-[#EFA7B8]/80 bg-[#EFA7B8] shadow-[0_0_14px_rgba(239,167,184,0.62)]'
                    : 'h-1.5 w-1.5 border-white/45 bg-white/42 group-hover:border-[#EFA7B8]/50 group-hover:bg-white/68'
                }`}
              />
            </button>
          )
        })}
      </motion.nav>
    </AnimatePresence>
  )
}
