/* ------------------------------------------------------------------ */
/*  GardenElements — premium atmospheric depth (NO primitive trees)      */
/*  Replaces low-poly spheres/cylinders with layered depth:             */
/*  soft haze, distant bokeh lights, subtle ground shimmer.             */
/*  3D enhances photos, never competes — as per cinematic direction.    */
/* ------------------------------------------------------------------ */

import { Float } from '@react-three/drei'
import { GlowSprite } from './GlowSprite'

export function GardenElements({ variant = 'sparse' }: { variant?: 'sparse' | 'dense' }) {
  const lanterns: Array<[number, number, number]> =
    variant === 'sparse'
      ? [
          [-3.2, 1.6, -6.2],
          [2.8, 1.4, -5.8],
          [0.5, 1.3, -7.5],
        ]
      : [
          [-3.4, 1.65, -6.4],
          [2.9, 1.45, -5.9],
          [0.6, 1.35, -7.8],
          [-5.4, 1.25, -4.2],
          [5.0, 1.15, -4.6],
        ]

  return (
    <group>
      {/* distant bokeh lanterns — warm, subtle, not game-like */}
      {lanterns.map((p, i) => (
        <Float key={`light-${i}`} speed={0.55 + i * 0.1} rotationIntensity={0.04} floatIntensity={0.35}>
          <group position={p}>
            <mesh>
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshBasicMaterial color="#FFD6A5" transparent opacity={0.72} depthWrite={false} />
            </mesh>
            <pointLight color="#FFD6A5" intensity={0.85} distance={2.8} decay={2} />
          </group>
        </Float>
      ))}
      {/* atmospheric haze layers — depth without geometry */}
      <GlowSprite position={[0, 4.2, -18]} scale={28} color="#FFE8C7" opacity={0.06} />
      <GlowSprite position={[-5, 2.8, -12]} scale={18} color="#FFE8EE" opacity={0.05} />
      <GlowSprite position={[5, 3.0, -14]} scale={16} color="#FFD6A5" opacity={0.04} />
      {/* soft ground shimmer — premium, not flat */}
      <group position={[0, 0.015, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[11, 48]} />
          <meshStandardMaterial color="#A8C0A8" roughness={0.98} metalness={0.02} transparent opacity={0.42} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <ringGeometry args={[11, 12.4, 48]} />
          <meshStandardMaterial color="#FFE8C7" transparent opacity={0.13} roughness={1} depthWrite={false} />
        </mesh>
        {/* inner highlight */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <circleGeometry args={[3.2, 32]} />
          <meshBasicMaterial color="#FFFDFB" transparent opacity={0.06} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}
