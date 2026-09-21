/* ------------------------------------------------------------------ */
/*  SceneRouter — 5 cinematic scenes (simplified)                       */
/* ------------------------------------------------------------------ */

import { Suspense, lazy } from 'react'
import { useExperience } from '../state/experience'
import { Scene01Intro } from './Scene01Intro'
import { Scene02Universe } from './Scene02Universe'

const Scene03Memories = lazy(() =>
  import('./Scene04Memories').then((m) => ({ default: m.Scene04Memories })),
)
const Scene04Future = lazy(() => import('./Scene07Future').then((m) => ({ default: m.Scene07Future })))
const Scene05Final = lazy(() => import('./Scene09Finale').then((m) => ({ default: m.Scene09Finale })))

export function SceneRouter() {
  const loaded = useExperience((s) => s.loaded)
  const stage = useExperience((s) => s.stage)

  if (!loaded) return null

  return (
    <Suspense fallback={null}>
      {stage === 0 && <Scene01Intro />}
      {stage === 1 && <Scene02Universe />}
      {stage === 2 && <Scene03Memories />}
      {stage === 3 && <Scene04Future />}
      {stage === 4 && <Scene05Final />}
    </Suspense>
  )
}
