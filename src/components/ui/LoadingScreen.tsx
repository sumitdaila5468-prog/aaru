/* ------------------------------------------------------------------ */
/*  LoadingScreen — the first seconds of the film                       */
/* ------------------------------------------------------------------ */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useProgress } from '@react-three/drei'
import { useExperience } from '../../state/experience'
import { story } from '../../data/story'

const MIN_TIME_MS = 2600

export function LoadingScreen() {
  const appLoaded = useExperience((s) => s.loaded)
  const setLoaded = useExperience((s) => s.setLoaded)
  const webgl = useExperience((s) => s.webgl)
  const { progress: textureProgress, loaded: texturesLoadedCount, total } = useProgress()
  const reduced = useReducedMotion()

  const [fontsReady, setFontsReady] = useState(false)
  const [elapsedOk, setElapsedOk] = useState(false)
  const [fakeProgress, setFakeProgress] = useState(0)

  // fonts
  useEffect(() => {
    let cancelled = false
    const ready = async (): Promise<void> => {
      try {
        await Promise.all([
          document.fonts.load('300 2em "Cormorant Garamond"'),
          document.fonts.load('400 2em "Cormorant Garamond"'),
          document.fonts.load('italic 400 2em "Cormorant Garamond"'),
          document.fonts.load('300 1em Inter'),
        ])
        await document.fonts.ready
      } catch {
        /* fonts are optional */
      }
      if (!cancelled) setFontsReady(true)
    }
    void ready()
    return () => {
      cancelled = true
    }
  }, [])

  // minimum cinematic duration
  useEffect(() => {
    const t = window.setTimeout(() => setElapsedOk(true), MIN_TIME_MS)
    return () => window.clearTimeout(t)
  }, [])

  // simulated progress when there is no WebGL to preload
  useEffect(() => {
    if (webgl) return
    const start = performance.now()
    let raf = 0
    const tick = (): void => {
      const t = Math.min((performance.now() - start) / 1800, 1)
      setFakeProgress(Math.round(t * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [webgl])

  // If there are no textures to load (website mode), consider done immediately
  const texturesDone = total === 0 ? true : texturesLoadedCount >= total
  const ready = fontsReady && elapsedOk && (!webgl || texturesDone)
  const progress = webgl ? (total === 0 ? 100 : Math.round(textureProgress)) : fakeProgress

  useEffect(() => {
    if (ready && !appLoaded) {
      const t = window.setTimeout(() => setLoaded(true), 500)
      return () => window.clearTimeout(t)
    }
  }, [ready, appLoaded, setLoaded])

  return (
    <AnimatePresence>
      {!appLoaded && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center"
          style={{
            background:
              'radial-gradient(ellipse 110% 80% at 50% 38%, #FFF7F8 0%, #FFE8EE 42%, #FFE8C7 78%, #F8C8D4 100%)',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.01 : 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.3 }}
            className="font-display italic text-[#7A2945]/80 text-lg md:text-xl"
          >
            {story.meta.eyebrow}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.9 }}
            className="mt-2 text-[10px] tracking-cine uppercase text-[#7A2945]/42"
          >
            {story.meta.loadingCaption}
          </motion.p>

          {/* progress line — rose-gold */}
          <div className="mt-10 h-px w-40 md:w-56 overflow-hidden bg-[#7A2945]/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[#9E3D5C] via-[#EFA7B8] to-[#FFD6A5]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-3 font-display text-sm text-[#7A2945]/48 tabular-nums">{progress}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
