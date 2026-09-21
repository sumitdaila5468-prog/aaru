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
      {/* blur layer — cinematic blur + warm wash */}
      <div
        ref={blurLayer}
        data-transition-blur
        className="fixed inset-0 z-[59] bg-[#FFF7F8]/12 pointer-events-none backdrop-blur-[0px]"
        style={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        aria-hidden="true"
      />
      {/* fade veil — deep burgundy warm, not harsh black */}
      <div
        ref={veil}
        data-transition-veil
        className="fixed inset-0 z-[60] pointer-events-none"
        style={{
          opacity: 0,
          background:
            'radial-gradient(ellipse 90% 70% at 50% 42%, #1A0A1F 0%, #2A0E1E 36%, #5A1832 72%, #1A0A1F 100%)',
        }}
        aria-hidden="true"
      >
        {/* subtle warm lens glow during veil */}
        <div className="absolute left-1/2 top-1/2 h-[60vh] w-[80vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(ellipse at center, rgba(255,214,165,0.32), transparent 68%)' }} aria-hidden="true" />
        {/* particle transition — extremely subtle */}
        <div className="absolute inset-0 overflow-hidden opacity-20" aria-hidden="true">
          <div className="veil-particles" />
        </div>
      </div>
    </>
  )
}
