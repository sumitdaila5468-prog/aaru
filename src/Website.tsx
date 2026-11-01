import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Cake, Camera, Gift, PartyPopper, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { Navbar } from './website/sections/Navbar'
import { AboutUs } from './website/sections/AboutUs'
import { UniverseHub } from './website/sections/UniverseHub'
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
import { BirthdayCountdown } from './website/sections/BirthdayCountdown'
import { HeartBurstOverlay, useHeartBurst } from './website/shared/HeartBurst'
import { Modal } from './website/shared/Modal'
import { memories } from './data/memories'
import { withBase } from './utils/paths'
import { ambientAudio } from './utils/audio'

const worlds = [
  { icon: '📸', title: 'Our memories', text: 'Little moments, big feelings.', target: 'memories', tone: 'peach' },
  { icon: '💌', title: 'A letter for you', text: 'Words I want you to keep.', target: 'letters', tone: 'pink' },
  { icon: '🎁', title: 'Birthday surprises', text: 'A few gifts are waiting.', target: 'surprises', tone: 'yellow' },
  { icon: '✨', title: 'A little future', text: 'Dreams with you in them.', target: 'future', tone: 'lilac' },
]

function BirthdayHero({ onBurst }: { onBurst: (event?: any) => void }) {
  const [photo, setPhoto] = useState<number | null>(null)
  const [giftOpen, setGiftOpen] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const [party, setParty] = useState(false)

  const toggleMusic = async () => {
    if (musicOn) {
      await ambientAudio.setEnabled(false)
      setMusicOn(false)
      return
    }
    try {
      await ambientAudio.start()
      setMusicOn(true)
    } catch {
      setMusicOn(false)
    }
  }

  const launchParty = (event: any) => {
    setParty(true)
    onBurst(event)
    window.setTimeout(() => setParty(false), 2600)
  }

  return (
    <section id="home" className={`birthday-hero relative isolate overflow-hidden ${party ? 'party-mode' : ''}`}>
      <div className="birthday-sunburst" aria-hidden="true" />
      <div className="birthday-confetti" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
      <div className="birthday-topline">
        <span><Sparkles size={13} /> A VERY SPECIAL DAY</span>
        <button onClick={toggleMusic} className="music-pill" aria-label={musicOn ? 'Pause music' : 'Play birthday music'}>
          {musicOn ? <Volume2 size={15} /> : <VolumeX size={15} />} {musicOn ? 'MUSIC ON' : 'PLAY MUSIC'}
        </button>
      </div>

      <div className="birthday-hero-grid">
        <div className="birthday-copy">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="birthday-kicker">
            <span className="kicker-star">✦</span> THIS WHOLE DAY IS ABOUT YOU <span className="kicker-star">✦</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .85 }}>
            HAPPY<br /><em>BIRTHDAY</em><br /><span className="birthday-name">AARJU!</span>
          </motion.h1>
          <motion.p className="birthday-lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45 }}>
            Today, tomorrow, and every day — you deserve all the magic in the world. I made this little celebration just for you. 💖
          </motion.p>
          <div className="birthday-date-sticker"><Cake size={18} /><span><b>03 NOVEMBER</b><small>THE DAY THE WORLD GOT BRIGHTER</small></span></div>
          <BirthdayCountdown />
          <div className="birthday-actions">
            <button className="birthday-primary" onClick={(e) => { document.getElementById('birthday-worlds')?.scrollIntoView({ behavior: 'smooth' }); launchParty(e) }}>
              LET'S CELEBRATE <PartyPopper size={17} />
            </button>
            <button className="birthday-secondary" onClick={() => setGiftOpen(true)}><Gift size={17} /> OPEN YOUR FIRST GIFT</button>
          </div>
          <div className="birthday-madeby"><span>♡</span> MADE WITH A LOT OF LOVE BY SUMIT</div>
        </div>

        <div className="birthday-photo-stage">
          <div className="photo-sparkle sparkle-a">✦</div><div className="photo-sparkle sparkle-b">✧</div><div className="photo-sparkle sparkle-c">✦</div>
          <div className="birthday-photo-main" onClick={() => setPhoto(0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setPhoto(0)}>
            <img src={withBase(memories[0].src)} alt="Aarju birthday portrait" />
            <div className="photo-caption"><span>THE BIRTHDAY GIRL</span><b>Our favourite person ✨</b></div>
          </div>
          <div className="birthday-mini-photo mini-one" onClick={() => setPhoto(1)} role="button" tabIndex={0}><img src={withBase(memories[1].src)} alt="Aarju memory" /></div>
          <div className="birthday-mini-photo mini-two" onClick={() => setPhoto(2)} role="button" tabIndex={0}><img src={withBase(memories[2].src)} alt="Aarju memory" /></div>
          <div className="birthday-round-sticker"><span>♥</span><b>YOU ARE<br />THE MAGIC</b></div>
          <div className="birthday-cake" aria-hidden="true"><div className="cake-candle" /><div className="cake-top" /><div className="cake-middle" /><div className="cake-bottom" /><div className="cake-plate" /></div>
        </div>
      </div>
      <button className="birthday-scroll-cue" onClick={() => document.getElementById('birthday-worlds')?.scrollIntoView({ behavior: 'smooth' })}>
        SCROLL FOR YOUR SURPRISES <ArrowDown size={14} />
      </button>

      <Modal open={giftOpen} onClose={() => setGiftOpen(false)} title="Your first birthday gift 🎁" maxWidth="max-w-md">
        <div className="birthday-gift-message">
          <div className="gift-big">💝</div>
          <p className="gift-script">Dear Aarju,</p>
          <p>Before all the surprises begin, I just want you to know this: your smile makes ordinary days feel special. I hope this new year brings you laughter, confidence, beautiful adventures and every little thing your heart wishes for.</p>
          <b>Happy Birthday in advance, meri favourite person! ❤️</b>
          <button className="birthday-primary w-full" onClick={() => { setGiftOpen(false); document.getElementById('birthday-worlds')?.scrollIntoView({ behavior: 'smooth' }) }}>SHOW ME MORE <ArrowUpRight size={16} /></button>
        </div>
      </Modal>
      <Modal open={photo !== null} onClose={() => setPhoto(null)} title="A little moment worth keeping" maxWidth="max-w-lg">
        {photo !== null && <img src={withBase(memories[photo]?.src ?? memories[0].src)} alt={memories[photo]?.title ?? 'Aarju'} className="w-full rounded-2xl" />}
      </Modal>
    </section>
  )
}

function BirthdayWorldCards() {
  return <section id="birthday-worlds" className="birthday-worlds">
    <div className="birthday-section-heading"><span className="section-overline">YOUR BIRTHDAY PLAYLIST</span><h2>A day full of <em>little wonders</em></h2><p>Pick a door, follow the sparkles, and find the surprises I tucked away for you.</p></div>
    <div className="birthday-world-grid">
      {worlds.map((world, index) => <motion.button key={world.target} className={`birthday-world-card ${world.tone}`} onClick={() => document.getElementById(world.target)?.scrollIntoView({ behavior: 'smooth' })} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} whileHover={{ y: -7, rotate: index % 2 ? 1 : -1 }}>
        <span className="world-number">0{index + 1}</span><span className="world-emoji">{world.icon}</span><b>{world.title}</b><small>{world.text}</small><span className="world-arrow"><ArrowUpRight size={17} /></span>
      </motion.button>)}
    </div>
    <div className="birthday-photo-strip">
      <div className="strip-title"><Camera size={16} /> A FEW REASONS TO SMILE</div>
      {memories.slice(0, 6).map((memory, index) => <button key={memory.id} onClick={() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })} className="strip-photo"><img src={withBase(memory.src)} alt={memory.title} loading="lazy" /><span>{String(index + 1).padStart(2, '0')}</span></button>)}
    </div>
  </section>
}

export function Website() {
  const { bursts, trigger } = useHeartBurst()
  const [secretToast, setSecretToast] = useState<string | null>(null)
  const [discovered, setDiscovered] = useState<Record<string, boolean>>({})
  const [heartsFound, setHeartsFound] = useState(0)
  const markDiscovered = useCallback((id: string) => setDiscovered((prev) => prev[id] ? prev : { ...prev, [id]: true }), [])
  const totalWorlds = 7
  const discoveredCount = Object.values(discovered).filter(Boolean).length
  const secretUnlocked = discoveredCount >= 4 || heartsFound >= 3

  useEffect(() => {
    const map: Record<string, string> = { love: 'about', memories: 'memories', chaos: 'chaos', letters: 'letters', surprises: 'surprises', future: 'future', secret: 'secret' }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const world = Object.entries(map).find(([, section]) => section === (entry.target as HTMLElement).id)?.[0]
        if (world) markDiscovered(world)
      }
    }), { threshold: .25, root: document.getElementById('website-scroll') })
    Object.values(map).forEach((id) => { const element = document.getElementById(id); if (element) observer.observe(element) })
    return () => observer.disconnect()
  }, [markDiscovered])

  useEffect(() => {
    let buffer = ''
    const onKey = (event: KeyboardEvent) => {
      buffer = (buffer + event.key.toLowerCase()).slice(-12)
      if (buffer.endsWith('aarju')) {
        setSecretToast('You found a secret — you are my favourite person! ❤️')
        trigger({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 } as any)
        setHeartsFound((count) => Math.min(5, count + 1))
        window.setTimeout(() => setSecretToast(null), 2600)
        buffer = ''
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [trigger])

  useEffect(() => { ambientAudio.setVolume(0.45, 0) }, [])

  const handleHubNavigate = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const map: Record<string, string> = { about: 'love', memories: 'memories', chaos: 'chaos', letters: 'letters', surprises: 'surprises', future: 'future', secret: 'secret' }
    if (map[target]) markDiscovered(map[target])
  }

  return <div className="birthday-site relative min-h-screen w-full overflow-hidden">
    <div className="birthday-page-glow" aria-hidden="true" />
    <Navbar onSecretClick={() => { setSecretToast('A tiny secret, just for you ✨'); trigger({ clientX: window.innerWidth - 24, clientY: 28 } as any); setHeartsFound((count) => Math.min(5, count + 1)); window.setTimeout(() => setSecretToast(null), 2200) }} />
    <div id="website-scroll" className="h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain pt-0">
      <BirthdayHero onBurst={trigger} />
      <BirthdayWorldCards />
      <UniverseHub discovered={discovered} onNavigate={handleHubNavigate} secretUnlocked={secretUnlocked} heartsFound={heartsFound} />
      <AboutUs onBurst={trigger} onDiscover={() => markDiscovered('love')} />
      <MemoryVault onDiscover={() => markDiscovered('memories')} />
      <ChaosCorner onBurst={trigger} onDiscover={() => markDiscovered('chaos')} />
      <CompatibilityGame onBurst={trigger} onDiscover={() => markDiscovered('chaos')} />
      <HundredReasons onBurst={trigger} />
      <LoveLetter onBurst={trigger} />
      <SurpriseBoxes onBurst={trigger} onDiscover={() => markDiscovered('surprises')} />
      <PhotoGame onBurst={trigger} />
      <ComplimentMachine onBurst={trigger} />
      <MoodButtons onBurst={trigger} onDiscover={() => markDiscovered('letters')} />
      <HeartHunt onBurst={trigger} onDiscover={() => markDiscovered('secret')} onHeartFound={(count) => { setHeartsFound(count); if (count >= 3) markDiscovered('secret') }} />
      <SecretRoom unlocked={secretUnlocked} onDiscover={() => markDiscovered('secret')} onBurst={trigger} />
      <OurFuture onBurst={trigger} />
      <Proposal onYes={() => document.getElementById('final')?.scrollIntoView({ behavior: 'smooth' })} onBurst={trigger} />
      <FinalSurprise onBurst={trigger} />
      <footer className="birthday-footer"><span>✦ MADE WITH LOVE ✦</span><p>Happy Birthday, Aarju. Keep shining, keep smiling, keep being wonderfully you. 💖</p><small>FROM SUMIT · 03 NOVEMBER · ALWAYS CHEERING FOR YOU</small><div>{discoveredCount} / {totalWorlds} little worlds explored</div></footer>
    </div>
    <HeartBurstOverlay bursts={bursts} />
    <AnimatePresence>{secretToast && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="birthday-toast">{secretToast}</motion.div>}</AnimatePresence>
  </div>
}

