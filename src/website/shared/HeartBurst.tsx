import type { HeartBurst } from './useHeartBurst'

export function HeartBurstOverlay({ bursts }: { bursts: HeartBurst[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {bursts.map(b => (
        <span key={b.id} className="absolute select-none">
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = (i / 7) * 360
            const tx = Math.cos((angle * Math.PI) / 180) * (40 + Math.random() * 36)
            const ty = Math.sin((angle * Math.PI) / 180) * (40 + Math.random() * 36) - 20
            return (
              <span
                key={i}
                className="absolute text-[18px]"
                style={{
                  left: b.x,
                  top: b.y,
                  animation: `heart-burst 900ms cubic-bezier(0.22,1,0.36,1) forwards`,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore css var
                  '--tx': `${tx}px`,
                  '--ty': `${ty}px`,
                  animationDelay: `${i * 38}ms`,
                } as any}
              >
                {['❤️','💗','💖','✨','💕'][i % 5]}
              </span>
            )
          })}
        </span>
      ))}
      <style>{`@keyframes heart-burst { 0%{transform:translate(-50%,-50%) scale(0.4);opacity:1} 60%{opacity:1} 100%{transform:translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.2) rotate(12deg);opacity:0} }`}</style>
    </div>
  )
}
