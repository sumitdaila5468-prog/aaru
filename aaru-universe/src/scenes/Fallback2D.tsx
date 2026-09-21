/* ------------------------------------------------------------------ */
/*  Fallback2D — when WebGL is unavailable, the story still plays       */
/*                                                                      */
/*  The DOM overlays (Sections) are shared with the 3D experience;      */
/*  this component paints the world behind them with pure CSS:          */
/*  drifting stars, soft glows, a dawn horizon, a particle bloom.       */
/* ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { useExperience } from '../state/experience'

export default function Fallback2D() {
  const stage = useExperience((s) => s.stage)

  const stars = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        left: `${(i * 37.7 + 13) % 100}%`,
        top: `${(i * 23.3 + 7) % 72}%`,
        size: 1 + ((i * 7) % 3) * 0.7,
        dur: `${3 + ((i * 13) % 40) / 10}s`,
        delay: `${((i * 17) % 30) / 10}s`,
      })),
    [],
  )

  const isDawn = stage === 6
  const isVoid = stage === 7
  const isFinale = stage === 8

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ background: '#FFF7F8' }} aria-hidden="true">
      {/* dreamy luxury sky */}
      <div
        className="absolute inset-0 transition-all duration-[2500ms]"
        style={{
          background: isDawn
            ? 'radial-gradient(ellipse 120% 70% at 50% 105%, rgba(255,214,165,0.42), rgba(255,232,238,0.85) 55%, #FFF7F8 100%)'
            : isVoid
              ? 'radial-gradient(ellipse 60% 40% at 50% 42%, rgba(122,41,69,0.18), rgba(255,247,248,1) 70%)'
              : isFinale
                ? 'radial-gradient(ellipse 90% 60% at 50% 115%, rgba(122,41,69,0.22), rgba(232,217,255,0.35) 45%, #FFFDFB 72%, #5A1832 100%)'
                : 'radial-gradient(ellipse 90% 60% at 50% 115%, rgba(239,167,184,0.18), rgba(255,232,199,0.32) 42%, #FFF7F8 72%, #FFE8EE 100%)',
        }}
      />

      {/* stars */}
      {!isDawn && !isVoid &&
        stars.map((s, i) => (
          <span
            key={i}
            className="css-star"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              ['--dur' as string]: s.dur,
              ['--delay' as string]: s.delay,
            }}
          />
        ))}

      {/* the single soft light of the letter scene */}
      {isVoid && (
        <div
          className="absolute left-1/2 top-[38%] h-24 w-24 -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(232,168,189,0.85), rgba(138,58,82,0.35) 45%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />
      )}

      {/* the heart glow of the finale + particle bloom */}
      {isFinale && (
        <>
          <div
            className="absolute left-1/2 top-[30%] h-[42vmin] w-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(138,58,82,0.4), rgba(90,31,48,0.18) 45%, transparent 70%)',
            }}
          />
          <BurstDots />
        </>
      )}

      {/* vignette handled globally by .vignette-overlay */}
    </div>
  )
}

/* soft particle bloom for the finale — subtle, not a firework */
function BurstDots() {
  const dots = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const angle = (i / 26) * Math.PI * 2 + (i % 3) * 0.2
        const dist = 120 + ((i * 53) % 180)
        return {
          bx: `${Math.cos(angle) * dist}px`,
          by: `${Math.sin(angle) * dist * 0.7}px`,
          delay: `${((i * 11) % 20) / 10}s`,
          dur: `${2.2 + ((i * 7) % 12) / 10}s`,
        }
      }),
    [],
  )
  return (
    <div className="absolute left-1/2 top-1/2">
      {dots.map((d, i) => (
        <span
          key={i}
          className="css-burst-dot"
          style={{
            ['--bx' as string]: d.bx,
            ['--by' as string]: d.by,
            ['--bdelay' as string]: d.delay,
            ['--bdur' as string]: d.dur,
          }}
        />
      ))}
    </div>
  )
}
