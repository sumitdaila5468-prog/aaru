import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'about', label: 'Us', icon: '💗' },
  { id: 'memories', label: 'Memories', icon: '📸' },
  { id: 'letters', label: 'Love Letters', icon: '💌' },
  { id: 'surprises', label: 'Surprises', icon: '🎁' },
  { id: 'future', label: 'Our Future', icon: '✨' },
]

export function Navbar({ onSecretClick }: { onSecretClick?: () => void }) {
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('website-scroll')
      const scrollTop = el ? el.scrollTop : window.scrollY
      setScrolled(scrollTop > 10)
      let current = 'home'
      for (const l of links) {
        const sec = document.getElementById(l.id)
        if (!sec) continue
        const rect = sec.getBoundingClientRect()
        if (rect.top <= 160) current = l.id
      }
      const extra = ['future','proposal','final']
      for(const id of extra){
        const sec = document.getElementById(id)
        if(sec){
          const r = sec.getBoundingClientRect()
          if(r.top <= 200) current = id === 'proposal' || id==='final' ? 'future' : id
        }
      }
      setActive(current)
    }
    const scroller = document.getElementById('website-scroll')
    scroller?.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      scroller?.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollTo = (id: string) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22,1,0.36,1] }}
        className={`fixed left-1/2 top-4 z-40 flex max-w-[min(96vw,720px)] -translate-x-1/2 items-center justify-between gap-2 rounded-full border px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all md:top-6 ${scrolled ? 'border-white/10 bg-[#1A0A14]/80' : 'border-white/10 bg-[#1A0A14]/60'} w-[96vw] md:w-auto`}
      >
        <button onClick={()=>scrollTo('home')} className="flex items-center gap-2 pl-3 pr-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#7A2945] to-[#EFA7B8] text-[13px] text-white shadow">❤️</span>
          <span className="hidden font-display text-[13px] font-medium tracking-[0.08em] text-[#FFE8EE] md:inline">AARU UNIVERSE</span>
          <span className="font-display italic text-[12px] text-white/60 md:hidden">Aaru</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(l => (
            <button
              key={l.id}
              onClick={()=>scrollTo(l.id)}
              className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium tracking-[0.08em] uppercase transition ${active===l.id ? 'bg-[#EFA7B8] text-[#1A0A14] shadow' : 'text-white/60 hover:bg-white/[0.06] hover:text-[#FFE8EE]'}`}
            >
              <span className="mr-1.5">{l.icon}</span>{l.label}
            </button>
          ))}
        </div>

        <button
          onClick={()=>setOpen(v=>!v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 hover:bg-white/[0.08] md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-4 w-4"/> : <Menu className="h-4 w-4"/>}
        </button>
        <button onClick={onSecretClick} className="ml-1 hidden h-2 w-2 rounded-full bg-[#EFA7B8]/30 hover:bg-[#EFA7B8]/60 md:block" aria-label="secret" title="psst" />
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed left-4 right-4 top-[68px] z-40 rounded-[22px] border border-white/10 bg-[#1A0A14]/95 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.42)] backdrop-blur-xl md:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {links.map(l=> (
                <button
                  key={l.id}
                  onClick={()=>scrollTo(l.id)}
                  className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-left transition ${active===l.id ? 'bg-[#EFA7B8] text-[#1A0A14]' : 'bg-white/[0.04] text-white/70 border border-white/10'}`}
                >
                  <span>{l.icon}</span>
                  <span className="text-[11px] font-medium tracking-[0.08em] uppercase">{l.label}</span>
                </button>
              ))}
            </div>
            <button onClick={onSecretClick} className="mt-2 w-full rounded-full border border-dashed border-white/15 py-2 text-center text-[10px] tracking-[0.2em] uppercase text-white/30">psst — secret here 👀</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
