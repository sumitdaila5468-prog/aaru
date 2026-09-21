/* ------------------------------------------------------------------ */
/*  Environment sync — keeps the store in tune with the real device     */
/* ------------------------------------------------------------------ */

import { useEffect } from 'react'
import { useExperience } from '../state/experience'

/** Watches viewport size + reduced-motion preference and syncs the store. */
export function useEnvSync(): void {
  useEffect(() => {
    const store = useExperience.getState()

    const mobileQuery = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    let resizeTimer = 0
    const onResize = (): void => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        const isMobile = mobileQuery.matches
        if (isMobile !== useExperience.getState().isMobile) {
          store.setMobile(isMobile)
        }
      }, 250)
    }

    const onMotionChange = (): void => {
      store.setReducedMotion(motionQuery.matches)
    }

    onMotionChange()
    window.addEventListener('resize', onResize)

    const mobileHandler = (): void => onResize()
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', mobileHandler)
    if (motionQuery.addEventListener) motionQuery.addEventListener('change', onMotionChange)

    return () => {
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      if (mobileQuery.removeEventListener) mobileQuery.removeEventListener('change', mobileHandler)
      if (motionQuery.removeEventListener) motionQuery.removeEventListener('change', onMotionChange)
    }
  }, [])
}
