/* ------------------------------------------------------------------ */
/*  HeartConstellation — a constellation drawn subtly like a heart      */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { heartCurve, heartPoints } from '../../utils/math'
import { useExperience } from '../../state/experience'
import { story } from '../../data/story'

interface HeartConstellationProps {
  /** world scale of the heart */
  scale?: number
  position?: [number, number, number]
  opacity?: number
  nodeCount?: number
}

export function HeartConstellation({
  scale = 0.34,
  position = [0, 6.4, -9],
  opacity = 0.9,
  nodeCount = 26,
}: HeartConstellationProps) {
  const group = useRef<THREE.Group>(null)
  const reduced = useExperience((s) => s.reducedMotion)

  const { line, nodePositions } = useMemo(() => {
    // smooth outline
    const outline = heartPoints(180).map(([x, y]) => new THREE.Vector3(x * scale, y * scale, 0))
    const geometry = new THREE.BufferGeometry().setFromPoints(outline)
    const line = new THREE.LineLoop(
      geometry,
      new THREE.LineBasicMaterial({
        color: new THREE.Color(story.theme.rose),
        transparent: true,
        opacity: 0.28 * opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    // glowing nodes, evenly spaced along the curve
    const nodePositions: Array<[number, number, number]> = []
    for (let i = 0; i < nodeCount; i++) {
      const t = (i / nodeCount) * Math.PI * 2
      const [hx, hy] = heartCurve(t)
      nodePositions.push([hx * scale, hy * scale, 0])
    }
    return { line, nodePositions }
  }, [scale, opacity, nodeCount])

  useEffect(() => {
    return () => {
      line.geometry.dispose()
      ;(line.material as THREE.Material).dispose()
    }
  }, [line])

  const nodeGeo = useMemo(() => new THREE.SphereGeometry(1, 10, 10), [])
  const nodeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(story.theme.roseGlow),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [opacity],
  )
  useEffect(() => {
    return () => {
      nodeGeo.dispose()
      nodeMat.dispose()
    }
  }, [nodeGeo, nodeMat])

  useFrame((state) => {
    if (!group.current) return
    const t = reduced ? 0 : state.clock.elapsedTime
    // slow, almost-imperceptible sway
    group.current.rotation.z = Math.sin(t * 0.07) * 0.03
    group.current.rotation.y = Math.sin(t * 0.05) * 0.06
    const pulse = 0.9 + 0.1 * Math.sin(t * 0.9)
    group.current.children.forEach((child, i) => {
      if (i === 0) return // the line
      const mesh = child as THREE.Mesh
      const k = 0.055 + 0.03 * Math.sin(t * 1.4 + i * 0.9)
      mesh.scale.setScalar(k * pulse)
    })
  })

  return (
    <group ref={group} position={position} rotation={[0.12, 0, 0]}>
      <primitive object={line} />
      {nodePositions.map((p, i) => (
        <mesh key={i} geometry={nodeGeo} material={nodeMat} position={p} />
      ))}
    </group>
  )
}
