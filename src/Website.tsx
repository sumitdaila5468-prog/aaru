import { useEffect, useState, useCallback } from 'react'
import { Navbar } from './website/sections/Navbar'
import { HomeHero } from './website/sections/HomeHero'
import { UniverseHub } from './website/sections/UniverseHub'
import { AboutUs } from './website/sections/AboutUs'
import { MemoryVault } from './website/sections/MemoryVault'
import { ChaosCorner } from './website/sections/ChaosCorner'
import { CompatibilityGame } from './website/sections/CompatibilityGame'
import { HundredReasons } from './website/sections/HundredReasons'
import { LoveLetter } from './website/sections/LoveLetter'
import { SurpriseBoxes } from './website/sections/SurpriseBoxes'
import { PhotoGame } from './website/sections/PhotoGame'
import { ComplimentMachine } from './website/sections/ComplimentMachine'
import { MoodButtons } from './website/sections/MoodButtons'
import { HeartHunt } from './website/sections/HeartHunt'
import { SecretRoom } from './website/sections/SecretRoom'
import { OurFuture } from './website/sections/OurFuture'
import { Proposal } from './website/sections/Proposal'
import { FinalSurprise } from './website/sections/FinalSurprise'
import { useHeartBurst, HeartBurstOverlay } from './website/shared/HeartBurst'
import { AudioToggle } from './components/ui/AudioToggle'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { useExperience } from './state/experience'
import { ambientAudio } from './utils/audio'

export function Website() {
  const { bursts, trigger } = useHeartBurst()
  const [secretToast, setSecretToast] = useState<string|null>(null)
  const [discovered, setDiscovered] = useState<Record<string, boolean>>({})
  const [heartsFound, setHeartsFound] = useState(0)

  const markDiscovered = useCallback((id: string) => {
    setDiscovered(prev => (prev[id] ? prev : { ...prev, [id]: true }))
  }, [])

  const totalWorlds = 7
  const discoveredCount = Object.values(discovered).filter(Boolean).length
  const secretUnlocked = discoveredCount >= 4 || heartsFound >= 3

  // scroll observer to auto-mark worlds when they become visible
  useEffect(() => {
    const map: Record<string,string> = {
      love: 'about',
      memories: 'memories',
      chaos: 'chaos',
      letters: 'letters',
      surprises: 'surprises',
      future: 'future',
      secret: 'secret',
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if(e.isIntersecting){
            const secId = (e.target as HTMLElement).id
            // find world id that maps to this sec
            const world = Object.entries(map).find(([,v])=>v===secId)?.[0]
            if(world) markDiscovered(world)
          }
        })
      },
      { threshold: 0.28, root: document.getElementById('website-scroll') }
    )
    Object.values(map).forEach(id => {
      const el = document.getElementById(id)
      if(el) observer.observe(el)
    })
    return ()=> observer.disconnect()
  }, [markDiscovered])

  // keyboard secret: press "a a r u"
  useEffect(() => {
    let buf = ''
    const onKey = (e: KeyboardEvent) => {
      buf += e.key.toLowerCase()
      if(buf.length > 12) buf = buf.slice(-12)
      if(buf.endsWith('aaru')){
        setSecretToast('You typed “aaru” — you’re literally my favourite person ❤️')
        trigger({ clientX: window.innerWidth/2, clientY: window.innerHeight/2 } as any)
        setHeartsFound(c=> Math.min(5, c+1))
        setTimeout(()=>setSecretToast(null), 2800)
        buf=''
      }
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [trigger])

  useEffect(()=>{
    ambientAudio.setVolume(useExperience.getState().audioVolume, 0)
  },[])

  const handleHubNavigate = (target: string) => {
    const el = document.getElementById(target)
    if(el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // map target back to world
      const worldMap: Record<string,string> = { about:'love', memories:'memories', chaos:'chaos', letters:'letters', surprises:'surprises', future:'future', secret:'secret' }
      const w = worldMap[target]
      if(w) markDiscovered(w)
    }
  }

  const handleProposalYes = () => {
    const el = document.getElementById('final')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 90% at 50% 0%, #1A0A14 0%, #0F040A 42%, #1A0A14 72%, #1E0A1A 92%, #0F040A 100%)' }} />
        <div className="absolute inset-0 opacity-[0.32]" style={{ background: 'radial-gradient(700px 420px at 18% 18%, rgba(255,214,165,0.08), transparent 70%), radial-gradient(560px 380px at 88% 16%, rgba(239,167,184,0.10), transparent 70%), radial-gradient(640px 420px at 60% 88%, rgba(90,24,50,0.22), transparent 75%)' }} />
        {/* subtle dark vignette */}
        <div className="absolute inset-0 opacity-[0.55]" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 38%, transparent 42%, rgba(0,0,0,0.38) 82%)' }} />
      </div>

      <Navbar onSecretClick={()=>{ setSecretToast('psst — you found a secret dot ✨'); trigger({clientX: window.innerWidth-24, clientY: 28} as any); setHeartsFound(c=>Math.min(5,c+1)); setTimeout(()=>setSecretToast(null), 2200) }} />
      <AudioToggle />

      <div id="website-scroll" className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain pt-0">
        <HomeHero onBurst={trigger} discovered={discoveredCount} total={totalWorlds} />
        <UniverseHub discovered={discovered} onNavigate={handleHubNavigate} secretUnlocked={secretUnlocked} heartsFound={heartsFound} />

        {/* Love Room */}
        <AboutUs onBurst={trigger} onDiscover={()=>markDiscovered('love')} />

        {/* Memory Vault */}
        <MemoryVault onDiscover={()=>markDiscovered('memories')} />

        {/* Chaos Corner */}
        <ChaosCorner onBurst={trigger} onDiscover={()=>markDiscovered('chaos')} />
        <CompatibilityGame onBurst={trigger} onDiscover={()=>markDiscovered('chaos')} />

        {/* 100 Reasons */}
        <HundredReasons onBurst={trigger} />

        {/* Letter Room */}
        <LoveLetter onBurst={trigger} />

        {/* Surprise Room */}
        <SurpriseBoxes onBurst={trigger} onDiscover={()=>markDiscovered('surprises')} />

        {/* PhotoGame kept as extra delight */}
        <PhotoGame onBurst={trigger} />

        {/* Compliment + Mood */}
        <ComplimentMachine onBurst={trigger} />
        <MoodButtons onBurst={trigger} onDiscover={()=>markDiscovered('letters')} />

        {/* Heart Hunt */}
        <HeartHunt onBurst={trigger} onDiscover={()=>markDiscovered('secret')} onHeartFound={(c)=>{ setHeartsFound(c); if(c>=3) markDiscovered('secret') }} />

        {/* Secret Room */}
        <SecretRoom unlocked={secretUnlocked} onDiscover={()=>markDiscovered('secret')} onBurst={trigger} />

        {/* Future Room */}
        <OurFuture onBurst={trigger} />

        {/* One Last Question */}
        <Proposal onYes={handleProposalYes} onBurst={trigger} />

        {/* Final Surprise */}
        <FinalSurprise onBurst={trigger} />

        <footer className="border-t border-white/10 bg-[#0F040A]/80 px-4 py-10 text-center backdrop-blur-xl">
          <p className="font-display text-[13px] italic text-white/60">Made for Aaru — with love, with care, with a lot of clicking 💗</p>
          <p className="mt-2 text-[10px] tracking-[0.22em] uppercase text-white/25">Aaru Universe ❤️ — always · {discoveredCount}/{totalWorlds} worlds</p>
          <div className="mx-auto mt-4 flex max-w-xs justify-center gap-1.5">
            {Array.from({length: 7}).map((_,i)=> <span key={i} className={`h-1 w-1 rounded-full transition ${discoveredCount > i ? 'bg-[#EFA7B8]' : 'bg-white/15'}`} />)}
          </div>
        </footer>
      </div>

      <HeartBurstOverlay bursts={bursts} />

      {secretToast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="rounded-full border border-white/40 bg-white/90 px-5 py-3 text-center text-[13px] font-medium text-[#7A2945] shadow-[0_12px_40px_rgba(90,24,50,0.16)] backdrop-blur-xl">
            {secretToast}
          </div>
        </div>
      )}

      <LoadingScreen />
    </div>
  )
}
