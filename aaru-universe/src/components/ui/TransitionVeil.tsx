/* ------------------------------------------------------------------ */
/*  TransitionVeil — reusable cinematic transition                     */
/*  Combines: fade + blur + particle drift + light change (via env)    */
/*  Camera moves are handled by CameraDirector; particles by overlay.  */
/*  Hides loading / swaps behind veil so no flash.                     */
/* ------------------------------------------------------------------ */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useExperience } from '../../state/experience'

export function TransitionVeil() {
  const transitioning = useExperience((s) => s.transitioning)
  const commitStage = useExperience((s) => s.commitStage)
  const finishTransition = useExperience((s) => s.finishTransition)
  const reduced = useExperience((s) => s.reducedMotion)

  const veil = useRef<HTMLDivElement>(null)
  const blurLayer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!transitioning || !veil.current) return
    const el = veil.current
    const blurEl = blurLayer.current
    const tl = gsap.timeline()
    tl.set(el, { pointerEvents: 'auto' })
    // fade + blur in
    tl.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: reduced ? 0.15 : 0.55, ease: 'power2.in' },
    )
    if (blurEl && !reduced) {
      tl.fromTo(
        blurEl,
        { opacity: 0, backdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(10px)', duration: reduced ? 0.15 : 0.55, ease: 'power2.in' },
        0,
      )
    }
    tl.call(() => commitStage())
    tl.to(el, { opacity: 1, duration: 0.32 }) // hold black + blurred frame so swaps are hidden
    // particle subtle drift is CSS-animated, no extra JS needed
    // fade + blur out
    tl.to(el, { opacity: 0, duration: reduced ? 0.15 : 0.9, ease: 'power2.out' })
    if (blurEl && !reduced) {
      tl.to(blurEl, { opacity: 0, backdropFilter: 'blur(0px)', duration: reduced ? 0.15 : 0.9, ease: 'power2.out' }, '-=0.9')
    }
    tl.set(el, { pointerEvents: 'none' })
    if (blurEl) tl.set(blurEl, { pointerEvents: 'none' })
    tl.call(() => finishTransition())
    return () => {
      tl.kill()
      gsap.set(el, { pointerEvents: 'none' })
      if (blurEl) gsap.set(blurEl, { pointerEvents: 'none' })
    }
  }, [transitioning, commitStage, finishTransition, reduced])

  return (
    <>
      {/* blur layer — sits just behind the black veil */}
      <div
        ref={blurLayer}
        data-transition-blur
        className="fixed inset-0 z-[59] bg-[#050406]/40 pointer-events-none backdrop-blur-[0px]"
        style={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        aria-hidden="true"
      />
      {/* fade veil */}
      <div
        ref={veil}
        data-transition-veil
        className="fixed inset-0 z-[60] bg-[#020103] pointer-events-none"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        {/* particle transition — subtle drifting motes during veil */}
        <div className="absolute inset-0 overflow-hidden opacity-30" aria-hidden="true">
          <div className="veil-particles" />
        </div>
      </div>
    </>
  )
}
