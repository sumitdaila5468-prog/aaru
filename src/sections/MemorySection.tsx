/* ------------------------------------------------------------------ */
/*  MemorySection — each photo its own cinematic chapter                 */
/*  Distinct composition per index: full-screen, floating, mask, etc.    */
/* ------------------------------------------------------------------ */

import { motion } from 'framer-motion'
import { useExperience } from '../state/experience'
import { SceneLabel } from '../components/ui/SceneLabel'
import { ContinueCue } from '../components/ui/ContinueCue'
import { Lightbox } from '../components/ui/Lightbox'
import { memories } from '../data/memories'
import { story } from '../data/story'
import { withBase } from '../utils/paths'
import { useState } from 'react'

interface Props {
  index: number // 0..5
  stage: number // global stage 2..7
}

function usePhoto(idx: number) {
  return memories[idx]
}

export function MemorySection({ index, stage }: Props) {
  const memory = useExperience((s) => s.memory)
  const setMemory = useExperience((s) => s.setMemory)
  const photo = usePhoto(index)
  const scene = story.photoScenes[index]
  const [failed, setFailed] = useState(false)
  const src = withBase(photo.src)

  const isLightboxOpen = memory === index

  return (
    <section className="absolute inset-0 z-10 flex flex-col overflow-hidden">
      {/* cinematic depth: enlarged blurred background + darkened */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {!failed && (
          <img src={src} alt="" className="h-full w-full object-cover opacity-[0.22] blur-[28px] scale-110" style={{ objectPosition: photo.objectPosition ?? '50% 28%' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0A1F]/16 via-[#1A0A1F]/10 to-[#1A0A1F]/32" />
        <div className="absolute inset-0 bg-[#FFF7F8]/18" />
      </div>
      <SceneLabel index={stage} label={scene.label} />

      {/* Layout switch per index */}
      {index === 0 && (
        // 01 — THE BEGINNING: full-screen cinematic photo with subtle zoom
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[880px]"
          >
            <div className="photo-frame-cream pointer-events-auto cursor-pointer" onClick={() => setMemory(index)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setMemory(index)} aria-label={`Open ${photo.title}`}>
              <div className="photo-frame-cream-inner overflow-hidden">
                <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden md:h-[68vh] md:min-h-[520px]">
                  {!failed ? (
                    <img
                      src={src}
                      alt={photo.title}
                      className="h-full w-full object-cover transition-transform duration-[2.2s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
                      style={{ objectPosition: photo.objectPosition ?? '50% 28%' }}
                      onError={() => setFailed(true)}
                      loading="eager"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFE8EE] to-[#F8C8D4]"><span className="font-display italic text-[#7A2945]/42">{photo.title}</span></div>
                  )}
                  <div className="photo-film-grain opacity-[0.06]" aria-hidden="true" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5A1832]/12 via-transparent to-transparent" />
                </div>
              </div>
            </div>
            <div className="photo-glow" aria-hidden="true" />
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.6 }} className="mt-6 text-center">
              <p className="eyebrow-cine text-[#7A2945]/42">{scene.subtitle} — 01</p>
              <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-light italic text-[#5A1832]">{photo.title}</h2>
              <p className="mx-auto mt-3 max-w-md font-display text-[14px] italic leading-relaxed text-[#7A2945]/62">{photo.description}</p>
            </motion.div>
          </motion.div>
          {!isLightboxOpen && <ContinueCue delay={2.8} />}
        </div>
      )}

      {index === 1 && (
        // 02 — THAT SMILE: large portrait floating naturally in 3D environment
        <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8">
          <div className="grid w-full max-w-[1080px] gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-12">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="relative order-1">
              <div className="photo-frame-cream pointer-events-auto cursor-pointer" onClick={() => setMemory(index)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setMemory(index)}>
                <div className="photo-frame-cream-inner overflow-hidden">
                  <div className="photo-cinematic aspect-[4/5.2]">
                    {!failed ? (
                      <img src={src} alt={photo.title} className="h-full w-full object-cover" style={{ objectPosition: photo.objectPosition ?? '50% 22%' }} onError={() => setFailed(true)} loading="eager" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFE8EE] to-[#F8C8D4]"><span className="font-display italic text-[#7A2945]/42">{photo.title}</span></div>
                    )}
                    <div className="photo-film-grain opacity-[0.07]" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="photo-glow" aria-hidden="true" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.0, delay: 0.28 }} className="order-2 flex flex-col justify-center px-2 md:px-4">
              <p className="eyebrow-cine text-[#EFA7B8]">{scene.subtitle} — 02</p>
              <h2 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-light leading-tight text-[#5A1832]">That Smile <br /><span className="italic font-light text-[#7A2945]/72">we keep</span></h2>
              <div className="mt-4 h-px w-10 bg-[#EFA7B8]/45" />
              <p className="mt-4 font-display text-[15px] italic leading-relaxed text-[#7A2945]/70">{photo.description}</p>
              <p className="mt-6 max-w-sm text-[13px] leading-relaxed text-[#7A2945]/54">Every time I see this, I remember why this little universe feels so warm.</p>
            </motion.div>
          </div>
          {!isLightboxOpen && <ContinueCue delay={3.0} />}
        </div>
      )}

      {index === 2 && (
        // 03 — OUR LITTLE MOMENTS: photo revealed through cinematic mask
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="relative">
            {/* mask reveal — rounded luxury */}
            <div className="pointer-events-auto relative cursor-pointer overflow-hidden rounded-[28px] bg-[#FFFDFB] p-[8px] shadow-[0_18px_56px_rgba(90,24,50,0.18)]" onClick={() => setMemory(index)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setMemory(index)}>
              <div className="relative overflow-hidden rounded-[20px] border border-[#EFA7B8]/25">
                {!failed ? (
                  <img src={src} alt={photo.title} className="h-[58vh] max-h-[560px] w-[88vw] max-w-[420px] object-cover md:h-[62vh] md:w-[440px]" style={{ objectPosition: photo.objectPosition ?? '50% 30%' }} onError={() => setFailed(true)} loading="eager" />
                ) : (
                  <div className="flex h-[58vh] max-h-[560px] w-[88vw] max-w-[420px] items-center justify-center bg-gradient-to-br from-[#FFE8EE] to-[#F8C8D4]"><span className="font-display italic text-[#7A2945]/42">{photo.title}</span></div>
                )}
                <div className="photo-film-grain opacity-[0.07]" aria-hidden="true" />
                <div className="absolute inset-0 rounded-[20px] border border-white/40 pointer-events-none" />
              </div>
            </div>
            <div className="photo-glow" aria-hidden="true" />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.5 }} className="mt-7 text-center">
              <p className="eyebrow-cine text-[#7A2945]/40">{scene.subtitle} — 03</p>
              <h2 className="mt-2 font-display text-[clamp(1.7rem,3.5vw,2.4rem)] font-light italic text-[#5A1832]">{photo.title}</h2>
              <p className="mx-auto mt-2 max-w-sm text-[14px] italic leading-relaxed text-[#7A2945]/62">{photo.description}</p>
            </motion.div>
          </motion.div>
          {!isLightboxOpen && <ContinueCue delay={3.0} />}
        </div>
      )}

      {index === 3 && (
        // 04 — THE MEMORY: large image with foreground depth and text beside
        <div className="absolute inset-0 flex items-center justify-center px-4 md:px-10">
          <div className="grid w-full max-w-[1100px] gap-8 md:grid-cols-[0.9fr_1.15fr] md:items-center md:gap-10">
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.0 }} className="flex flex-col justify-center px-2 md:px-6">
              <p className="eyebrow-cine text-[#EFA7B8]">{scene.subtitle} — 04</p>
              <h2 className="mt-3 font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-light leading-tight text-[#5A1832]">The Memory <br /><span className="italic text-[#7A2945]/72">a soft day</span></h2>
              <div className="mt-4 h-px w-10 bg-[#EFA7B8]/45" />
              <p className="mt-4 font-display text-[15px] italic leading-relaxed text-[#7A2945]/70">{photo.description}</p>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-[#7A2945]/52">Slower, brighter — the kind of light that makes everything feel like it will stay.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.18 }} className="relative">
              <div className="photo-frame-cream pointer-events-auto cursor-pointer" onClick={() => setMemory(index)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setMemory(index)}>
                <div className="photo-frame-cream-inner overflow-hidden">
                  <div className="photo-cinematic aspect-[4/5]">
                    {!failed ? <img src={src} alt={photo.title} className="h-full w-full object-cover" style={{ objectPosition: photo.objectPosition ?? '50% 28%' }} onError={() => setFailed(true)} loading="eager" /> : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFE8EE] to-[#F8C8D4]"><span className="font-display italic text-[#7A2945]/42">{photo.title}</span></div>}
                    <div className="photo-film-grain opacity-[0.06]" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="photo-glow" aria-hidden="true" />
            </motion.div>
          </div>
          {!isLightboxOpen && <ContinueCue delay={3.0} />}
        </div>
      )}

      {index === 4 && (
        // 05 — US: dark/warm atmospheric with backlight
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }} className="relative flex w-full max-w-[760px] flex-col items-center">
            <div className="pointer-events-auto relative cursor-pointer overflow-hidden rounded-[12px] bg-[#FFFDFB] p-[10px] shadow-[0_20px_60px_rgba(90,24,50,0.20)]" onClick={() => setMemory(index)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setMemory(index)}>
              <div className="relative overflow-hidden rounded-[8px] border border-[#7A2945]/15">
                {!failed ? <img src={src} alt={photo.title} className="h-[56vh] max-h-[520px] w-[84vw] max-w-[560px] object-cover" style={{ objectPosition: photo.objectPosition ?? '50% 24%' }} onError={() => setFailed(true)} loading="eager" /> : <div className="flex h-[56vh] max-h-[520px] w-[84vw] max-w-[560px] items-center justify-center bg-gradient-to-br from-[#FFE8EE] to-[#F8C8D4]"><span className="font-display italic text-[#7A2945]/42">{photo.title}</span></div>}
                <div className="photo-film-grain opacity-[0.07]" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5A1832]/18 via-transparent to-transparent" />
              </div>
            </div>
            {/* warm backlight behind */}
            <div className="absolute -inset-6 -z-10 rounded-[24px] bg-gradient-to-br from-[#FFD6A5]/18 via-[#EFA7B8]/10 to-transparent blur-2xl" aria-hidden="true" />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.5 }} className="mt-7 text-center">
              <p className="eyebrow-cine text-[#7A2945]/42">{scene.subtitle} — 05</p>
              <h2 className="mt-2 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-light text-[#5A1832]">{photo.title} <span className="italic font-light text-[#7A2945]/72">· recent</span></h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] italic leading-relaxed text-[#7A2945]/62">{photo.description}</p>
            </motion.div>
          </motion.div>
          {!isLightboxOpen && <ContinueCue delay={3.0} />}
        </div>
      )}

      {index === 5 && (
        // 06 — ALWAYS: final emotional full-screen photo
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <div className="pointer-events-auto relative cursor-pointer overflow-hidden rounded-[16px] bg-[#FFFDFB] p-[10px] shadow-[0_24px_64px_rgba(90,24,50,0.22)]" onClick={() => setMemory(index)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setMemory(index)}>
              <div className="relative overflow-hidden rounded-[10px] border border-[#EFA7B8]/20">
                {!failed ? <img src={src} alt={photo.title} className="h-[64vh] max-h-[620px] w-[86vw] max-w-[520px] object-cover" style={{ objectPosition: photo.objectPosition ?? '50% 32%' }} onError={() => setFailed(true)} loading="eager" /> : <div className="flex h-[64vh] max-h-[620px] w-[86vw] max-w-[520px] items-center justify-center bg-gradient-to-br from-[#FFE8EE] to-[#F8C8D4]"><span className="font-display italic text-[#7A2945]/42">{photo.title}</span></div>}
                <div className="photo-film-grain opacity-[0.06]" aria-hidden="true" />
              </div>
            </div>
            <div className="absolute -inset-8 -z-10 rounded-[28px] bg-gradient-to-br from-[#FFD6A5]/22 via-[#EFA7B8]/14 to-[#7A2945]/12 blur-2xl" aria-hidden="true" />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, delay: 0.6 }} className="mt-6 text-center">
              <p className="eyebrow-cine text-[#7A2945]/40">always — 06</p>
              <h2 className="mt-2 font-display text-[clamp(1.9rem,4vw,2.8rem)] font-light italic text-[#5A1832]">{photo.title}</h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] italic leading-relaxed text-[#7A2945]/60">{photo.description}</p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-[#7A2945]/28">our little universe</p>
            </motion.div>
          </motion.div>
          {!isLightboxOpen && <ContinueCue delay={3.0} />}
        </div>
      )}

      {isLightboxOpen && <Lightbox items={memories as any} index={index} onClose={() => setMemory(null)} onNavigate={(i) => setMemory(i)} />}
    </section>
  )
}
