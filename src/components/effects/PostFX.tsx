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
        intensity={0.72}
        luminanceThreshold={0.28}
        luminanceSmoothing={0.58}
        radius={0.62}
      />
      {depthOfField ? (
        <DepthOfField focusDistance={0.048} focalLength={0.028} bokehScale={1.32} />
      ) : (
        <></>
      )}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.32} darkness={0.48} />
    </EffectComposer>
  )
}
