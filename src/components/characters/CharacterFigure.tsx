/* ------------------------------------------------------------------ */
/*  CharacterFigure — premium cinematic stylised human                  */
/*                                                                      */
/*  Elegant, film-quality figures with realistic proportions, soft      */
/*  skin shading, detailed hair, subtle micro-animation (breathing,     */
/*  sway, blink) and configurable appearance via characters.ts.         */
/*  Not a photoreal likeness — fictional artistic representation.       */
/*                                                                      */
/*  Design goals: remove plastic skin, avoid creepy / uncanny faces,   */
/*  keep everything soft, elegant, believable as a high-budget         */
/*  romantic animated short.                                            */
/* ------------------------------------------------------------------ */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { CharacterPose } from './poses'
import { BASE_POSE } from './poses'
import { damp } from '../../utils/math'
import { useExperience } from '../../state/experience'
import { story } from '../../data/story'
import { charactersConfig, resolveOutfit } from '../../data/characters'
import type { CharacterAppearance } from '../../data/characters'

export type CharacterVariant = 'male' | 'female'

interface CharacterFigureProps {
  variant: CharacterVariant
  pose: CharacterPose
  position?: [number, number, number]
  rotationY?: number
  phase?: number
  castShadow?: boolean
  /** override appearance (otherwise reads from charactersConfig) */
  appearance?: CharacterAppearance
}

interface Proportions {
  hipY: number
  torsoHeight: number
  shoulderY: number
  shoulderX: number
  headY: number
  headR: number
  armR: number
  armLen: number
  legR: number
  legLen: number
  neckY: number
}

const PROPS: Record<CharacterVariant, Proportions> = {
  female: {
    hipY: 0.86,
    torsoHeight: 0.62,
    shoulderY: 0.52,
    shoulderX: 0.155,
    headY: 0.62,
    headR: 0.086,
    armR: 0.026,
    armLen: 0.4,
    legR: 0.034,
    legLen: 0.76,
    neckY: 0.56,
  },
  male: {
    hipY: 0.95,
    torsoHeight: 0.68,
    shoulderY: 0.58,
    shoulderX: 0.195,
    headY: 0.68,
    headR: 0.095,
    armR: 0.03,
    armLen: 0.46,
    legR: 0.04,
    legLen: 0.82,
    neckY: 0.62,
  },
}

function latheProfile(
  controls: Array<[number, number]>,
  height: number,
  downward = false,
): THREE.LatheGeometry {
  const curve = new THREE.CatmullRomCurve3(
    controls.map(([t, r]) => new THREE.Vector3(r, (downward ? -1 : 1) * t * height, 0)),
    false,
    'catmullrom',
    0.5,
  )
  const points = curve.getPoints(22).map((p) => new THREE.Vector2(Math.max(p.x, 0.012), Math.abs(p.y)))
  const geo = new THREE.LatheGeometry(points, 28)
  geo.computeVertexNormals()
  return geo
}

export function CharacterFigure({
  variant,
  pose,
  position = [0, 0, 0],
  rotationY = 0,
  phase = 0,
  castShadow = true,
  appearance,
}: CharacterFigureProps) {
  const p = PROPS[variant]
  const isFemale = variant === 'female'
  const app: CharacterAppearance = appearance ?? (isFemale ? charactersConfig.aaru : charactersConfig.partner)
  const outfit = resolveOutfit(app)

  const root = useRef<THREE.Group>(null)
  const hips = useRef<THREE.Group>(null)
  const torso = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const legL = useRef<THREE.Group>(null)
  const legR = useRef<THREE.Group>(null)
  const gown = useRef<THREE.Group>(null)
  const eyelidL = useRef<THREE.Group>(null)
  const eyelidR = useRef<THREE.Group>(null)

  // blink state
  const blinkRef = useRef({ t: 0, next: 2.5 + Math.random() * 3, closing: 0 })

  /* ---------- geometry ---------- */
  const geo = useMemo(() => {
    const torsoGeo = isFemale
      ? latheProfile(
          [
            [0, 0.148],
            [0.25, 0.13],
            [0.55, 0.116],
            [0.8, 0.148],
            [1, 0.168],
          ],
          p.torsoHeight,
        )
      : latheProfile(
          [
            [0, 0.15],
            [0.3, 0.142],
            [0.6, 0.136],
            [0.85, 0.165],
            [1, 0.2],
          ],
          p.torsoHeight,
        )
    const gownGeo = isFemale
      ? latheProfile(
          [
            [0, 0.15],
            [0.3, 0.172],
            [0.65, 0.235],
            [1, 0.33],
          ],
          1.06,
          true,
        )
      : latheProfile(
          [
            [0, 0.152],
            [0.5, 0.172],
            [1, 0.215],
          ],
          0.62,
          true,
        )
    // head: slightly elongated for elegant proportions
    const headGeo = new THREE.SphereGeometry(p.headR, 28, 22)
    // hair cap — tailored by style later via scale / extra meshes
    const hairCap = new THREE.SphereGeometry(isFemale ? 0.094 : 0.1, 24, 18)
    const hairFall = new THREE.CapsuleGeometry(0.05, 0.3, 6, 12)
    const hairSide = new THREE.CapsuleGeometry(0.032, 0.22, 6, 10)
    const hairPonytail = new THREE.CapsuleGeometry(0.038, 0.34, 8, 12)
    const neckGeo = new THREE.CapsuleGeometry(0.028, 0.06, 4, 10)
    const armGeo = new THREE.CapsuleGeometry(p.armR, p.armLen, 6, 12)
    const handGeo = new THREE.SphereGeometry(p.armR + 0.004, 12, 10)
    const legGeo = new THREE.CapsuleGeometry(p.legR, p.legLen, 6, 12)
    const shoeGeo = new THREE.SphereGeometry(p.legR + 0.012, 12, 10)
    const shoulderCap = new THREE.SphereGeometry(isFemale ? 0.048 : 0.058, 14, 12)
    const pendantGeo = new THREE.SphereGeometry(0.012, 10, 8)
    const earringGeo = new THREE.SphereGeometry(0.006, 8, 8)

    // face details — soft, stylised, never uncanny
    const eyeWhiteGeo = new THREE.SphereGeometry(0.016, 12, 10)
    const irisGeo = new THREE.SphereGeometry(0.008, 12, 10)
    const eyelidGeo = new THREE.SphereGeometry(0.017, 12, 10)
    const browGeo = new THREE.CapsuleGeometry(0.003, 0.022, 4, 8)
    const lipGeo = new THREE.TorusGeometry(0.012, 0.0025, 6, 12, Math.PI)
    const noseGeo = new THREE.CapsuleGeometry(0.006, 0.018, 4, 8)

    return {
      torso: torsoGeo,
      gown: gownGeo,
      head: headGeo,
      hairCap,
      hairFall,
      hairSide,
      hairPonytail,
      neck: neckGeo,
      arm: armGeo,
      hand: handGeo,
      leg: legGeo,
      shoe: shoeGeo,
      shoulderCap,
      pendant: pendantGeo,
      earring: earringGeo,
      eyeWhite: eyeWhiteGeo,
      iris: irisGeo,
      eyelid: eyelidGeo,
      brow: browGeo,
      lip: lipGeo,
      nose: noseGeo,
    }
  }, [isFemale, p])

  useEffect(() => {
    return () => {
      Object.values(geo).forEach((g) => g.dispose())
    }
  }, [geo])

  /* ---------- materials — soft skin, velvet cloth, muted hair ---------- */
  const mats = useMemo(() => {
    const theme = story.theme
    const skinColor = new THREE.Color(app.skinTone)
    const hairColor = new THREE.Color(app.hairColor)
    const clothColor = new THREE.Color(outfit.color)
    const clothAccent = new THREE.Color(outfit.accent)

    return {
      skin: new THREE.MeshPhysicalMaterial({
        color: skinColor,
        roughness: 0.36,
        metalness: 0,
        sheen: 0.18,
        sheenColor: new THREE.Color('#f5d6cc').lerp(skinColor, 0.3),
        sheenRoughness: 0.65,
        clearcoat: 0.12,
        clearcoatRoughness: 0.55,
        envMapIntensity: 0.6,
      }),
      cloth: new THREE.MeshPhysicalMaterial({
        color: clothColor,
        roughness: isFemale ? 0.52 : 0.58,
        metalness: 0.04,
        sheen: 0.9,
        sheenColor: clothAccent,
        sheenRoughness: isFemale ? 0.45 : 0.55,
        clearcoat: 0.06,
        clearcoatRoughness: 0.8,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: hairColor,
        roughness: 0.72,
        metalness: 0.04,
        envMapIntensity: 0.3,
      }),
      hairHighlight: new THREE.MeshStandardMaterial({
        color: hairColor.clone().lerp(new THREE.Color('#3a2a3a'), 0.25),
        roughness: 0.68,
      }),
      eyeWhite: new THREE.MeshStandardMaterial({
        color: '#f7f0ed',
        roughness: 0.35,
        metalness: 0,
      }),
      iris: new THREE.MeshStandardMaterial({
        color: isFemale ? '#5a3a2a' : '#3a2e22',
        roughness: 0.4,
      }),
      eyelid: new THREE.MeshStandardMaterial({
        color: skinColor.clone().multiplyScalar(0.96),
        roughness: 0.42,
      }),
      brow: new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 }),
      lip: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#c98aa0').lerp(skinColor, 0.4),
        roughness: 0.5,
      }),
      pendant: new THREE.MeshBasicMaterial({ color: theme.roseGlow }),
      earring: new THREE.MeshBasicMaterial({ color: theme.roseGlow }),
    }
  }, [app.skinTone, app.hairColor, outfit.color, outfit.accent, isFemale])

  useEffect(() => {
    return () => {
      Object.values(mats).forEach((m) => m.dispose())
    }
  }, [mats])

  /* ---------- animation — respects pause & reduced motion ---------- */
  useFrame((state, rawDt) => {
    const paused = useExperience.getState().paused
    if (paused) return
    const dt = Math.min(rawDt, 0.05)
    const reduced = useExperience.getState().reducedMotion
    const idle = reduced ? 0.18 : 1
    const t = state.clock.elapsedTime + phase
    const target = { ...BASE_POSE, ...pose }
    const walking = (pose.animate ?? 'idle') === 'walk' && !reduced
    const walkPhase = walking ? Math.sin(t * 2.1) : 0

    // blink scheduler
    if (!reduced) {
      const b = blinkRef.current
      b.t += dt
      if (b.t > b.next && b.closing <= 0) {
        b.closing = 0.16 // seconds eyes stay closed
        b.t = 0
        b.next = 2.2 + Math.random() * 4.5
      }
      if (b.closing > 0) {
        b.closing -= dt
        const blinkProgress = 1 - Math.abs(b.closing - 0.08) / 0.08 // 0→1→0
        const scaleY = THREE.MathUtils.lerp(1, 0.04, blinkProgress)
        if (eyelidL.current) eyelidL.current.scale.y = scaleY
        if (eyelidR.current) eyelidR.current.scale.y = scaleY
      } else {
        if (eyelidL.current) eyelidL.current.scale.y = damp(eyelidL.current.scale.y, 1, 8, dt)
        if (eyelidR.current) eyelidR.current.scale.y = damp(eyelidR.current.scale.y, 1, 8, dt)
      }
    }

    if (root.current) {
      const [x, y, z] = position
      const targetY = y + (target.rootY ?? 0)
      root.current.position.x = damp(root.current.position.x, x, 2.2, dt)
      root.current.position.y = damp(root.current.position.y, targetY, 2.2, dt)
      root.current.position.z = damp(root.current.position.z, z, 2.2, dt)
      root.current.rotation.y = damp(
        root.current.rotation.y,
        rotationY + (target.rootRotY ?? 0),
        2.4,
        dt,
      )
      root.current.rotation.z = Math.sin(t * 0.33) * 0.01 * idle
    }

    if (hips.current) {
      hips.current.position.y = damp(hips.current.position.y, p.hipY + (target.hipsY ?? 0), 3, dt)
    }

    if (torso.current) {
      torso.current.rotation.x = damp(
        torso.current.rotation.x,
        (target.torsoRotX ?? 0) + Math.sin(t * 1.1) * 0.006 * idle,
        3,
        dt,
      )
      const breath = 1 + Math.sin(t * 1.05) * 0.009 * idle
      torso.current.scale.set(1, breath, 1)
      // subtle chest expansion also moves shoulders
      const breathSide = 1 + Math.sin(t * 1.05) * 0.004 * idle
      torso.current.scale.x = breathSide
      torso.current.scale.z = breathSide
    }

    if (head.current) {
      head.current.rotation.x = damp(
        head.current.rotation.x,
        (target.headRotX ?? 0) + Math.sin(t * 0.58 + 1.2) * 0.018 * idle,
        2.6,
        dt,
      )
      head.current.rotation.y = damp(
        head.current.rotation.y,
        (target.headRotY ?? 0) + Math.sin(t * 0.38) * 0.035 * idle,
        2.2,
        dt,
      )
      // tiny head bob with breathing
      head.current.position.y = p.headY + Math.sin(t * 1.05) * 0.006 * idle
    }

    if (armL.current) {
      armL.current.rotation.x = damp(
        armL.current.rotation.x,
        (target.armL?.x ?? 0) + walkPhase * 0.55 + Math.sin(t * 1.05) * 0.02 * idle,
        3.4,
        dt,
      )
      armL.current.rotation.z = damp(armL.current.rotation.z, target.armL?.z ?? 0.14, 3.4, dt)
    }
    if (armR.current) {
      armR.current.rotation.x = damp(
        armR.current.rotation.x,
        (target.armR?.x ?? 0) - walkPhase * 0.55 + Math.sin(t * 1.05 + 1) * 0.02 * idle,
        3.4,
        dt,
      )
      armR.current.rotation.z = damp(armR.current.rotation.z, target.armR?.z ?? -0.14, 3.4, dt)
    }

    if (legL.current) {
      legL.current.rotation.x = damp(
        legL.current.rotation.x,
        (target.legL ?? 0) + walkPhase * 0.48,
        4,
        dt,
      )
    }
    if (legR.current) {
      legR.current.rotation.x = damp(
        legR.current.rotation.x,
        (target.legR ?? 0) - walkPhase * 0.48,
        4,
        dt,
      )
    }

    if (gown.current) {
      const sway = walking ? Math.sin(t * 2.1) * 0.05 : Math.sin(t * 0.72) * 0.015 * idle
      gown.current.rotation.z = sway
      const windTwist = Math.sin(t * 0.41) * 0.01 * idle
      gown.current.rotation.y = windTwist
      gown.current.scale.y = damp(gown.current.scale.y, target.gownScaleY ?? 1, 3, dt)
      gown.current.scale.x = damp(
        gown.current.scale.x,
        (target.gownScaleY ?? 1) < 0.9 ? 1.18 : 1,
        3,
        dt,
      )
    }
  })

  const armCenterY = -(p.armLen / 2 + p.armR) - 0.01
  const legCenterY = -(p.legLen / 2 + p.legR) - 0.01

  // hair style resolver
  const renderHair = () => {
    const style = app.hairStyle
    if (isFemale) {
      if (style === 'ponytail') {
        return (
          <>
            <mesh geometry={geo.hairCap} position={[0, 0.06, -0.01]} scale={[1.1, 1.15, 1.08]} material={mats.hair} />
            <mesh geometry={geo.hairPonytail} position={[0, -0.14, -0.11]} rotation={[0.35, 0, 0]} material={mats.hair} />
            <mesh geometry={geo.hairSide} position={[0.07, -0.04, -0.02]} rotation={[0.15, 0, 0.25]} material={mats.hairHighlight} />
            <mesh geometry={geo.hairSide} position={[-0.07, -0.04, -0.02]} rotation={[0.15, 0, -0.25]} material={mats.hairHighlight} />
          </>
        )
      }
      if (style === 'shoulder-bob') {
        return (
          <>
            <mesh geometry={geo.hairCap} position={[0, 0.055, -0.008]} scale={[1.12, 1.12, 1.1]} material={mats.hair} />
            <mesh geometry={geo.hairSide} position={[0.078, -0.06, -0.02]} rotation={[0.12, 0, 0.32]} scale={[1.1, 0.9, 1]} material={mats.hairHighlight} />
            <mesh geometry={geo.hairSide} position={[-0.078, -0.06, -0.02]} rotation={[0.12, 0, -0.32]} scale={[1.1, 0.9, 1]} material={mats.hairHighlight} />
            <mesh geometry={geo.hairFall} position={[0, -0.06, -0.08]} rotation={[0.2, 0, 0]} scale={[0.9, 0.55, 0.9]} material={mats.hairHighlight} />
          </>
        )
      }
      // default long-wavy / long-straight
      const wavyScale = style === 'long-straight' ? [1, 1, 1] : [1.06, 1, 1.06]
      return (
        <>
          <mesh geometry={geo.hairCap} position={[0, 0.062, -0.01]} scale={[1.14, 1.18, 1.12]} material={mats.hair} />
          <mesh geometry={geo.hairFall} position={[0, -0.1, -0.082]} rotation={[0.24, 0, 0]} material={mats.hairHighlight} scale={wavyScale as unknown as number} />
          <mesh geometry={geo.hairSide} position={[0.075, -0.02, -0.03]} rotation={[0.18, 0, 0.28]} material={mats.hairHighlight} />
          <mesh geometry={geo.hairSide} position={[-0.075, -0.02, -0.03]} rotation={[0.18, 0, -0.28]} material={mats.hairHighlight} />
        </>
      )
    } else {
      // male
      if (style === 'short-cropped') {
        return <mesh geometry={geo.hairCap} position={[0, 0.045, -0.005]} scale={[1.02, 0.98, 1.02]} material={mats.hair} />
      }
      // short-modern / side-part — swept volume with slight side part
      return (
        <>
          <mesh geometry={geo.hairCap} position={[0, 0.052, -0.01]} scale={[1.06, 1.03, 1.05]} material={mats.hair} />
          <mesh geometry={geo.hairCap} position={[0.015, 0.068, 0.015]} scale={[0.45, 0.28, 0.62]} material={mats.hairHighlight} rotation={[0, 0, 0.15]} />
        </>
      )
    }
  }

  const showPendant = app.accessories.pendant && isFemale
  const showEarrings = app.accessories.earrings && isFemale

  return (
    <group ref={root}>
      <group ref={hips} position={[0, p.hipY, 0]}>
        {/* legs */}
        <group ref={legL} position={[isFemale ? 0.07 : 0.085, 0, 0]}>
          <mesh geometry={geo.leg} position={[0, legCenterY, 0]} material={mats.cloth} castShadow={castShadow} />
          <mesh
            geometry={geo.shoe}
            position={[0, legCenterY - p.legLen / 2 - p.legR - 0.01, 0.035]}
            scale={[1.05, 0.55, 1.65]}
            material={mats.hair}
            castShadow={castShadow}
          />
        </group>
        <group ref={legR} position={[isFemale ? -0.07 : -0.085, 0, 0]}>
          <mesh geometry={geo.leg} position={[0, legCenterY, 0]} material={mats.cloth} castShadow={castShadow} />
          <mesh
            geometry={geo.shoe}
            position={[0, legCenterY - p.legLen / 2 - p.legR - 0.01, 0.035]}
            scale={[1.05, 0.55, 1.65]}
            material={mats.hair}
            castShadow={castShadow}
          />
        </group>

        {/* torso */}
        <group ref={torso}>
          <mesh geometry={geo.torso} material={mats.cloth} castShadow={castShadow} />

          {/* gown / coat — elegant drape */}
          <group ref={gown} position={[0, isFemale ? 0.08 : 0, 0]}>
            <mesh geometry={geo.gown} material={mats.cloth} castShadow={castShadow} />
          </group>

          {/* shoulders — softer cap */}
          <mesh geometry={geo.shoulderCap} position={[p.shoulderX, p.shoulderY, 0]} material={mats.cloth} />
          <mesh geometry={geo.shoulderCap} position={[-p.shoulderX, p.shoulderY, 0]} material={mats.cloth} />

          {/* arms — skin tone matches character */}
          <group ref={armL} position={[p.shoulderX, p.shoulderY - 0.015, 0]}>
            <mesh geometry={geo.arm} position={[0, armCenterY, 0]} material={mats.skin} castShadow={castShadow} />
            <mesh geometry={geo.hand} position={[0, armCenterY - p.armLen / 2 - p.armR - 0.01, 0]} material={mats.skin} />
          </group>
          <group ref={armR} position={[-p.shoulderX, p.shoulderY - 0.015, 0]}>
            <mesh geometry={geo.arm} position={[0, armCenterY, 0]} material={mats.skin} castShadow={castShadow} />
            <mesh geometry={geo.hand} position={[0, armCenterY - p.armLen / 2 - p.armR - 0.01, 0]} material={mats.skin} />
          </group>

          {/* neck + head — premium skin shading */}
          <mesh geometry={geo.neck} position={[0, p.neckY, 0]} material={mats.skin} />
          <group ref={head} position={[0, p.headY, 0]}>
            {/* head — elegant oval, not sphere */}
            <mesh
              geometry={geo.head}
              position={[0, 0.088, 0.01]}
              scale={[1, 1.13, 1.04]}
              material={mats.skin}
              castShadow={castShadow}
            />
            {/* nose — barely-there, avoids flat face */}
            <mesh geometry={geo.nose} position={[0, 0.058, 0.083]} rotation={[0, 0, 0]} material={mats.skin} />

            {/* ---------- face: eyes, brows, lips ---------- */}
            {/* eye whites */}
            <mesh geometry={geo.eyeWhite} position={[0.022, 0.078, 0.072]} scale={[1, 0.72, 0.5]} material={mats.eyeWhite} />
            <mesh geometry={geo.eyeWhite} position={[-0.022, 0.078, 0.072]} scale={[1, 0.72, 0.5]} material={mats.eyeWhite} />
            {/* iris */}
            <mesh geometry={geo.iris} position={[0.022, 0.078, 0.081]} scale={[1, 1, 0.5]} material={mats.iris} />
            <mesh geometry={geo.iris} position={[-0.022, 0.078, 0.081]} scale={[1, 1, 0.5]} material={mats.iris} />
            {/* catchlight */}
            <mesh position={[0.024, 0.081, 0.086]} scale={[0.003, 0.003, 0.003]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </mesh>
            <mesh position={[-0.02, 0.081, 0.086]} scale={[0.003, 0.003, 0.003]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </mesh>
            {/* eyelids — scale Y drives blink */}
            <group ref={eyelidL} position={[0.022, 0.078, 0.074]}>
              <mesh geometry={geo.eyelid} scale={[1, 0.72, 0.5]} material={mats.eyelid} />
            </group>
            <group ref={eyelidR} position={[-0.022, 0.078, 0.074]}>
              <mesh geometry={geo.eyelid} scale={[1, 0.72, 0.5]} material={mats.eyelid} />
            </group>
            {/* brows — subtle arch, softens expression */}
            <mesh geometry={geo.brow} position={[0.022, 0.094, 0.071]} rotation={[0, 0, -0.08]} material={mats.brow} />
            <mesh geometry={geo.brow} position={[-0.022, 0.094, 0.071]} rotation={[0, 0, 0.08]} material={mats.brow} />
            {/* lips — subtle smile, not exaggerated */}
            <mesh geometry={geo.lip} position={[0, 0.042, 0.082]} rotation={[0, 0, 0]} material={mats.lip} />

            {/* hair — cinematic volume, per-style */}
            {renderHair()}

            {/* earrings — delicate, only if enabled */}
            {showEarrings && (
              <>
                <mesh geometry={geo.earring} position={[0.074, 0.052, 0.015]} material={mats.earring} />
                <mesh geometry={geo.earring} position={[-0.074, 0.052, 0.015]} material={mats.earring} />
              </>
            )}
          </group>

          {/* pendant — soft glow on chest */}
          {showPendant && (
            <mesh geometry={geo.pendant} position={[0, 0.33, 0.148]} material={mats.pendant} />
          )}
        </group>
      </group>
    </group>
  )
}
