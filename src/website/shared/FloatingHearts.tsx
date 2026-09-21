import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const messages = [
  'you’re adorable ❤️',
  'hi cutie ✨',
  'mine 💗',
  'psst — loved you today',
  'you + me = always',
]

export function FloatingHearts({ onHeartClick }: { onHeartClick?: (msg: string, pos: {x:number;y:number})=>void }) {
  const [hearts, setHearts] = useState<{id:number; left:number; delay:number; dur:number; size:number}[]>([])
  const [toast, setToast] = useState<string|null>(null)

  useEffect(() => {
    const arr = Array.from({length: 6}).map((_,i)=>({ id:i, left: 8 + Math.random()*84, delay: Math.random()*6, dur: 8 + Math.random()*6, size: 14+Math.random()*10 }))
    setHearts(arr)
  }, [])

  useEffect(() => {
    if(!toast) return
    const t = setTimeout(()=>setToast(null), 2200)
    return ()=>clearTimeout(t)
  },[toast])

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {hearts.map(h=> (
          <motion.button
            key={h.id}
            className="pointer-events-auto absolute bottom-0 select-none border-0 bg-transparent p-2 text-[18px] opacity-30 hover:opacity-70"
            style={{ left: `${h.left}%`, fontSize: h.size }}
            initial={{ y: 0, opacity: 0.22 }}
            animate={{ y: -520, opacity: [0.22,0.42,0] }}
            transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: 'linear' }}
            onClick={(e)=>{
              const msg = messages[Math.floor(Math.random()*messages.length)]
              setToast(msg)
              onHeartClick?.(msg, {x: e.clientX, y: e.clientY})
            }}
            aria-label="Heart surprise"
          >
            ❤️
          </motion.button>
        ))}
      </div>
      {toast && (
        <div className="pointer-events-none absolute left-1/2 top-[22%] z-20 -translate-x-1/2">
          <div className="rounded-full border border-white/40 bg-white/80 px-4 py-2 text-center text-[13px] font-medium text-[#7A2945] shadow-[0_8px_32px_rgba(90,24,50,0.12)] backdrop-blur-xl animate-[pop_0.5s_ease]">
            {toast}
          </div>
          <style>{`@keyframes pop{0%{transform:scale(0.86);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>
        </div>
      )}
    </>
  )
}
