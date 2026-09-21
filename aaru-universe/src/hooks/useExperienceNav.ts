/* ------------------------------------------------------------------ */
/*  Global navigation — wheel, touch swipe and keyboard                 */
/* ------------------------------------------------------------------ */

import { useEffect } from 'react'
import { useExperience } from '../state/experience'
import { story } from '../data/story'

const WHEEL_COOLDOWN_MS = 1250
const WHEEL_THRESHOLD_PX = 70
const SWIPE_THRESHOLD_PX = 64
const STAGE_LAST = 4
const MEMORIES_LENGTH = story.memories.length

/**
 * Advances the experience with scroll / swipe / arrow keys.
 * Never fires while a transition is running or the photo lightbox
 * is open, and stays quiet during the pre-enter intro.
 */
export function useExperienceNav(): void {
  useEffect(() => {
    let accum = 0
    let lastNav = 0
    let touchStartX = 0
    let touchStartY = 0
    let tracking = false

    const canNavigate = (): boolean => {
      const s = useExperience.getState()
      return s.entered && !s.transitioning && s.memory === null
    }

    const go = (delta: number): void => {
      const s = useExperience.getState()
      if (delta > 0) s.nextStage()
      else s.prevStage()
      accum = 0
      lastNav = performance.now()
      if (!s.hintDismissed) s.dismissHint()
    }

    const onWheel = (e: WheelEvent): void => {
      if (!canNavigate()) return
      const now = performance.now()
      if (now - lastNav < WHEEL_COOLDOWN_MS) {
        accum = 0
        return
      }
      accum += e.deltaY
      if (Math.abs(accum) > WHEEL_THRESHOLD_PX) go(accum > 0 ? 1 : -1)
    }

    const onTouchStart = (e: TouchEvent): void => {
      if (!canNavigate() || e.touches.length !== 1) {
        tracking = false
        return
      }
      tracking = true
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent): void => {
      if (!tracking || !canNavigate()) {
        tracking = false
        return
      }
      tracking = false
      const touch = e.changedTouches[0]
      if (!touch) return
      const dx = touch.clientX - touchStartX
      const dy = touch.clientY - touchStartY
      if (Math.abs(dy) > SWIPE_THRESHOLD_PX && Math.abs(dx) < Math.abs(dy)) {
        go(dy < 0 ? 1 : -1)
      }
    }

    const onKey = (e: KeyboardEvent): void => {
      const s = useExperience.getState()
      if (e.key === 'Escape') {
        if (s.memory !== null) s.setMemory(null)
        return
      }
      if (e.key === 'm' || e.key === 'M') {
        s.toggleAudio()
        return
      }
      if (e.key === 'r' || e.key === 'R') {
        if (s.entered && s.stage === STAGE_LAST) s.replay()
        return
      }
      const target = e.target as HTMLElement | null
      const onControl =
        target !== null &&
        target !== document.body &&
        ['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (onControl) return
      if (s.memory !== null) {
        if (e.key === 'ArrowRight') s.setMemory((s.memory + 1) % MEMORIES_LENGTH)
        if (e.key === 'ArrowLeft') {
          s.setMemory((s.memory - 1 + MEMORIES_LENGTH) % MEMORIES_LENGTH)
        }
        return
      }
      if (!s.entered || s.transitioning) return
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault()
          s.nextStage()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          s.prevStage()
          break
        default:
          break
      }
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
    }
  }, [])
}
