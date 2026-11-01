/* ------------------------------------------------------------------ */
/*  SceneRouter — 16 cinematic scenes: premium romantic short film          */
/* ------------------------------------------------------------------ */

import { Suspense, lazy } from 'react'
import { useExperience } from '../state/experience'
import { Scene01Intro } from './Scene01Intro'
import { Scene02Universe } from './Scene02Universe'
import { MemoryStage } from './MemoryStage'
import { CinematicStage } from './CinematicStage'

const SceneFuture = lazy(() => import('./Scene07Future').then((m) => ({ default: m.Scene07Future })))

export function SceneRouter() {
  const loaded = useExperience((s) => s.loaded)
  const stage = useExperience((s) => s.stage)

  if (!loaded) return null

  return (
    <Suspense fallback={null}>
      {stage === 0 && <Scene01Intro />}
      {stage === 1 && <CinematicStage preset="sunset" groundColor="#E8D4B8" keyIntensity={0.82} shotIndex={1} />}
      {stage === 2 && <MemoryStage index={0} />}
      {stage === 3 && <MemoryStage index={1} />}
      {stage === 4 && <MemoryStage index={2} />}
      {stage === 5 && <MemoryStage index={3} />}
      {stage === 6 && <MemoryStage index={4} />}
      {stage === 7 && <MemoryStage index={5} />}
      {stage === 8 && <Scene02Universe />}
      {stage === 9 && <SceneFuture />}
      {stage === 10 && <CinematicStage preset="night" groundColor="#1A0A1F" keyIntensity={0.62} showStars shotIndex={2} />}
      {stage === 11 && <CinematicStage preset="night" groundColor="#2A0E1E" keyIntensity={0.72} showStars shotIndex={1} />}
      {stage === 12 && <CinematicStage preset="dream" groundColor="#1A0A1F" keyIntensity={0.78} showStars showParticles shotIndex={0} />}
      {stage === 13 && <CinematicStage preset="sunset" groundColor="#E8D4B8" keyIntensity={0.80} shotIndex={3} />}
      {stage === 14 && <CinematicStage preset="night" groundColor="#1A0A1F" keyIntensity={0.68} showStars shotIndex={0} />}
      {stage === 15 && <CinematicStage preset="night" groundColor="#0A040A" keyIntensity={0.58} showStars shotIndex={1} />}
    </Suspense>
  )
}
