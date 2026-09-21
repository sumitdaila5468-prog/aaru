/* ------------------------------------------------------------------ */
/*  Experience — the composition root: stage, overlays, navigation      */
/* ------------------------------------------------------------------ */

import { lazy, Suspense, useEffect } from 'react'
import { CanvasRoot } from './CanvasRoot'
import { ErrorBoundary } from './ErrorBoundary'
import { LoadingScreen } from './ui/LoadingScreen'
import { TransitionVeil } from './ui/TransitionVeil'
import { ProgressRail } from './ui/ProgressRail'
import { AudioToggle } from './ui/AudioToggle'
import { Sections } from '../sections/Sections'
import { useExperienceNav } from '../hooks/useExperienceNav'
import { useEnvSync } from '../hooks/useEnvSync'
import { useExperience } from '../state/experience'
import { story } from '../data/story'
import { hexToRgbTriplet } from '../utils/theme'
import { ambientAudio } from '../utils/audio'

const Fallback2D = lazy(() => import('../scenes/Fallback2D'))

export function Experience() {
  const webgl = useExperience((s) => s.webgl)
  const stage = useExperience((s) => s.stage)
  const entered = useExperience((s) => s.entered)
  useExperienceNav()
  useEnvSync()

  // scene-aware audio fading — softer for letter, gentle crossfade
  useEffect(() => {
    if (!entered) return
    if (ambientAudio.running) ambientAudio.fadeForScene(stage)
  }, [stage, entered])

  /* the theme drives the whole DOM — romantic luxury palette */
  useEffect(() => {
    const root = document.documentElement
    const theme = story.theme
    root.style.setProperty('--ink-rgb', hexToRgbTriplet(theme.ink))
    root.style.setProperty('--ink-dark-rgb', hexToRgbTriplet((theme as any).inkDark ?? theme.burgundy))
    root.style.setProperty('--rose-rgb', hexToRgbTriplet(theme.rose))
    root.style.setProperty('--roseglow-rgb', hexToRgbTriplet(theme.roseGlow))
    root.style.setProperty('--blush-rgb', hexToRgbTriplet((theme as any).blush ?? theme.rose))
    root.style.setProperty('--cream-rgb', hexToRgbTriplet((theme as any).cream ?? '#FFFDFB'))
    root.style.setProperty('--wine-rgb', hexToRgbTriplet(theme.burgundy))
    root.style.setProperty('--wine-light-rgb', hexToRgbTriplet((theme as any).burgundyLight ?? theme.burgundy))
    root.style.setProperty('--gold-rgb', hexToRgbTriplet(theme.gold))
    root.style.setProperty('--lavender-rgb', hexToRgbTriplet((theme as any).lavender ?? '#E8D9FF'))
    root.style.setProperty('--night-rgb', hexToRgbTriplet(theme.background))
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-night">
      {webgl ? (
        <ErrorBoundary>
          <CanvasRoot />
        </ErrorBoundary>
      ) : (
        <Suspense fallback={null}>
          <Fallback2D />
        </Suspense>
      )}

      {/* cinematic DOM layers — minimal */}
      <Sections />
      <ProgressRail />
      <AudioToggle />

      {/* dreamy atmosphere — subtle */}
      <div className="bokeh-overlay" aria-hidden="true" />
      <div className="vignette-overlay" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

      <TransitionVeil />
      <LoadingScreen />
    </div>
  )
}
