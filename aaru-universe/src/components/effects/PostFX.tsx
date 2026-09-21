/* ------------------------------------------------------------------ */
/*  PostFX — cinematic post processing                                  */
/*  Bloom + ACES tone mapping + vignette everywhere; depth of field     */
/*  only on capable desktop setups (and dropped if perf degrades).      */
/* ------------------------------------------------------------------ */

import { EffectComposer, Bloom, Vignette, DepthOfField, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useExperience } from '../../state/experience'

export function PostFX() {
  const quality = useExperience((s) => s.quality)
  const degraded = useExperience((s) => s.degraded)
  const isMobile = useExperience((s) => s.isMobile)

  const depthOfField = quality === 'high' && !degraded && !isMobile

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={0.62}
        luminanceThreshold={0.34}
        luminanceSmoothing={0.62}
        radius={0.58}
      />
      {depthOfField ? (
        <DepthOfField focusDistance={0.055} focalLength={0.032} bokehScale={1.15} />
      ) : (
        <></>
      )}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.28} darkness={0.42} />
    </EffectComposer>
  )
}
