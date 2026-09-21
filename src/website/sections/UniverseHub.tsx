import { motion } from 'framer-motion'
import { universeHub } from '../../data/websiteContent'

interface HubProps {
  discovered: Record<string, boolean>
  onNavigate: (target: string) => void
  secretUnlocked: boolean
  heartsFound?: number
}

export function UniverseHub({ discovered, onNavigate, secretUnlocked, heartsFound = 0 }: HubProps) {
  const total = 7
  const progress = Object.values(discovered).filter(Boolean).length

  return (
    <section id="hub" className="relative bg-[#0F040A] px-4 py-14 md:px-6 md:py-20">
      <div className="absolute inset-0 -z-10" style={{ background: 'radial-gradient(ellipse 90% 60% at 50% 0%, rgba(90,24,50,0.18), transparent 70%), radial-gradient(ellipse 70% 50% at 85% 30%, rgba(255,214,165,0.07), transparent 70%)' }} aria-hidden="true" />
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-cine text-[#F8C8D4]/40">main universe hub</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-tight text-[#FFE8EE]">
            {universeHub.title} <span className="italic text-[#EFA7B8]">✨</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-[#F8C8D4]/55">{universeHub.subtitle}</p>

          <div className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[#EFA7B8] animate-pulse" />
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#FFE8EE]">{progress} / {total} worlds discovered</span>
            </div>
            {heartsFound > 0 && (
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] tracking-[0.12em] uppercase text-white/60">❤️ {heartsFound} hearts</span>
            )}
          </div>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#EFA7B8]/20 to-transparent" />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universeHub.worlds.map((world, i) => {
            const isSecret = world.id === 'secret'
            const locked = isSecret ? !secretUnlocked : false
            const visited = !!discovered[world.id]
            return (
              <motion.button
                key={world.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileHover={locked ? {} : { y: -6, scale: 1.01 }}
                whileTap={locked ? {} : { scale: 0.98 }}
                onClick={() => {
                  if (locked) return
                  onNavigate(world.target)
                }}
                disabled={locked}
                className={`group relative flex flex-col items-start gap-3 rounded-[20px] border p-5 text-left shadow backdrop-blur-xl transition
                  ${locked
                    ? 'border-dashed border-white/10 bg-white/[0.03] opacity-60 cursor-not-allowed'
                    : visited
                    ? 'border-[#EFA7B8]/20 bg-gradient-to-br from-[#1E0A1A]/80 to-[#2A0E1E]/60 shadow-[0_12px_32px_rgba(0,0,0,0.32)]'
                    : 'border-white/10 bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.24)] hover:border-[#EFA7B8]/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.32)]'
                  }`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-full border text-[22px] ${locked ? 'border-white/10 bg-white/[0.04] grayscale' : 'border-[#EFA7B8]/15 bg-gradient-to-br from-[#2A0E1E] to-[#1A0A14]'}`}>
                  {locked ? '🔒' : world.icon}
                </div>
                <div>
                  <h3 className="font-display text-[15px] font-medium tracking-[0.04em] text-[#FFE8EE]">{world.title}</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/50">{locked ? 'Something is hiding here…' : world.desc}</p>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {locked ? (
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] tracking-[0.12em] uppercase text-white/30">locked</span>
                  ) : visited ? (
                    <span className="rounded-full bg-[#EFA7B8] px-3 py-1 text-[10px] tracking-[0.12em] uppercase text-[#1A0A14] font-medium">visited ✓</span>
                  ) : (
                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] tracking-[0.12em] uppercase text-white/40 group-hover:bg-[#EFA7B8] group-hover:text-[#1A0A14] transition">enter →</span>
                  )}
                </div>
                {!locked && !visited && <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#EFA7B8]/0 group-hover:bg-[#EFA7B8] transition" />}
                {visited && <span className="absolute right-3 top-3 text-[10px] text-white/20">✨</span>}
              </motion.button>
            )
          })}
        </div>

        <p className="mt-6 text-center text-[10px] tracking-[0.18em] uppercase text-white/22">tap a world — some unlock more secrets as you explore ✨</p>
      </div>
    </section>
  )
}
