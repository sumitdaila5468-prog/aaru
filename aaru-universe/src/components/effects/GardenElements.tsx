/* ------------------------------------------------------------------ */
/*  GardenElements — elegant trees, soft grass, distant lights for      */
/*  the main garden identity. Subtle, not game-like.                    */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { Float } from '@react-three/drei'

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const trunkH = 2.2 * scale
  const foliageR = 0.85 * scale
  return (
    <group position={position}>
      <mesh position={[0, trunkH / 2, 0]}>
        <cylinderGeometry args={[0.07 * scale, 0.11 * scale, trunkH, 8]} />
        <meshStandardMaterial color="#4A3A2E" roughness={0.92} />
      </mesh>
      <mesh position={[0, trunkH + 0.35 * scale, 0]}>
        <sphereGeometry args={[foliageR, 12, 10]} />
        <meshStandardMaterial color="#6A8A6A" roughness={0.85} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0.22 * scale, trunkH + 0.18 * scale, 0.12 * scale]}>
        <sphereGeometry args={[foliageR * 0.72, 10, 8]} />
        <meshStandardMaterial color="#7A9A7A" roughness={0.88} transparent opacity={0.88} />
      </mesh>
    </group>
  )
}

export function GardenElements({ variant = 'sparse' }: { variant?: 'sparse' | 'dense' }) {
  const trees = useMemo(() => {
    if (variant === 'sparse') {
      return [
        { pos: [-6.5, 0, -5.2] as [number, number, number], s: 1.15 },
        { pos: [6.8, 0, -4.8] as [number, number, number], s: 1.0 },
        { pos: [-4.2, 0, -7.8] as [number, number, number], s: 0.82 },
        { pos: [4.5, 0, -8.2] as [number, number, number], s: 0.88 },
      ]
    }
    return [
      { pos: [-7.2, 0, -4.5] as [number, number, number], s: 1.1 },
      { pos: [-5.0, 0, -6.8] as [number, number, number], s: 0.95 },
      { pos: [5.5, 0, -5.2] as [number, number, number], s: 1.05 },
      { pos: [7.0, 0, -6.5] as [number, number, number], s: 0.88 },
      { pos: [-3.2, 0, -9.0] as [number, number, number], s: 0.78 },
      { pos: [3.8, 0, -9.2] as [number, number, number], s: 0.82 },
    ]
  }, [variant])

  return (
    <group>
      {trees.map((t, i) => (
        <Tree key={i} position={t.pos} scale={t.s} />
      ))}
      {/* distant glowing lights — firefly lanterns */}
      {[
        [-3.2, 1.6, -6.2],
        [2.8, 1.4, -5.8],
        [0.5, 1.3, -7.5],
        [-5.8, 1.2, -3.8],
        [5.2, 1.1, -4.2],
      ].map((p, i) => (
        <Float key={`light-${i}`} speed={0.7 + i * 0.12} rotationIntensity={0.06} floatIntensity={0.4}>
          <group position={p as [number, number, number]}>
            <mesh>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshBasicMaterial color="#FFD6A5" transparent opacity={0.92} />
            </mesh>
            <pointLight color="#FFD6A5" intensity={1.2} distance={3} decay={2} />
          </group>
        </Float>
      ))}
      {/* soft grass tufts — hint of ground texture */}
      <group position={[0, 0.02, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[9, 32]} />
          <meshStandardMaterial color="#8BA888" roughness={0.92} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <ringGeometry args={[9, 10.2, 40]} />
          <meshStandardMaterial color="#FFE8C7" transparent opacity={0.22} roughness={1} />
        </mesh>
      </group>
    </group>
  )
}
