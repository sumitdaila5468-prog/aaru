/* ------------------------------------------------------------------ */
/*  CanvasRoot — the WebGL stage                                        */
/* ------------------------------------------------------------------ */

import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { CameraDirector } from './CameraDirector'
import { SceneRouter } from '../scenes/SceneRouter'
import { PostFX } from './effects/PostFX'
import { useExperience } from '../state/experience'
import { story } from '../data/story'
import { withBase } from '../utils/paths'

/** Preload every photo so the loading screen tracks real work — withBase ensures GH Pages works. */
function TexturePreloader() {
  useEffect(() => {
    const urls = [
      ...story.chapters.map((c) => withBase(c.photo)),
      ...story.memories.map((m) => withBase(m.src)),
    ]
    urls.forEach((url) => useTexture.preload(url))
  }, [])
  return null
}

export function CanvasRoot() {
  const quality = useExperience((s) => s.quality)
  const setWebgl = useExperience((s) => s.setWebgl)

  const dprMax = quality === 'high' ? (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.8) : 1.8) : 1.4

  return (
    <div className="stage-canvas absolute inset-0 z-0">
      <Canvas
        camera={{ fov: 40, near: 0.1, far: 140, position: [0, 2.2, 15] }}
        dpr={[1, dprMax]}
        shadows={quality === 'high' ? 'soft' : false}
        gl={{
          antialias: quality === 'high',
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        }}
        onCreated={({ gl }) => {
          // tone mapping is handled by the ToneMapping effect in the composer
          gl.toneMapping = THREE.NoToneMapping
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            setWebgl(false) // graceful switch to the 2D experience
          })
        }}
      >
        <TexturePreloader />
        <CameraDirector />
        <SceneRouter />
        <PostFX />
      </Canvas>
    </div>
  )
}
