/* ------------------------------------------------------------------ */
/*  Camera shot sequencing — snap on mount, then timed cinematic moves  */
/* ------------------------------------------------------------------ */

import { useEffect } from 'react'
import gsap from 'gsap'
import type { TimedShot } from '../types'
import { useExperience } from '../state/experience'

/**
 * Applies a sequence of camera shots when the scene mounts (or when
 * the memoized `shots` array changes identity — e.g. a new chapter
 * was selected). The first shot is applied instantly; later shots
 * are scheduled with gsap.delayedCall so they can tween smoothly.
 */
export function useSceneShots(shots: TimedShot[]): void {
  const setShot = useExperience((s) => s.setShot)

  useEffect(() => {
    const timers: gsap.core.Tween[] = []
    shots.forEach(({ shot, at = 0 }, i) => {
      if (i === 0 || at <= 0) {
        setShot(shot)
      } else {
        timers.push(gsap.delayedCall(at, () => setShot(shot)))
      }
    })
    return () => {
      timers.forEach((t) => t.kill())
    }
  }, [shots, setShot])
}
