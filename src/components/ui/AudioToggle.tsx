/* ------------------------------------------------------------------ */
/*  AudioToggle — cinematic music control: play/pause, volume, mute,     */
/*  subtle indicator, graceful failure if /music/our-song.mp3 missing.   */
/*  Super-premium: warm glass pill, equalizer bars when playing.         */
/* ------------------------------------------------------------------ */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music2, Pause } from 'lucide-react'
import { useExperience } from '../../state/experience'
import { ambientAudio } from '../../utils/audio'

export function AudioToggle() {
  const loaded = useExperience((s) => s.loaded)
  const entered = useExperience((s) => s.entered)
  const audioOn = useExperience((s) => s.audioOn)
  const toggleAudio = useExperience((s) => s.toggleAudio)
  const audioVolume = useExperience((s) => s.audioVolume)
  const setAudioVolume = useExperience((s) => s.setAudioVolume)
  const stage = useExperience((s) => s.stage)
  const everStarted = useRef(false)
  const [hasError, setHasError] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!everStarted.current || !ambientAudio.running) return
    void ambientAudio.setEnabled(audioOn)
  }, [audioOn])

  useEffect(() => {
    if (!ambientAudio.running || !audioOn) return
    ambientAudio.fadeForScene(stage)
  }, [stage, audioOn])

  // poll error state
  useEffect(() => {
    const id = window.setInterval(() => {
      setHasError(ambientAudio.hasError)
    }, 800)
    return () => window.clearInterval(id)
  }, [])

  const handleToggle = async (): Promise<void> => {
    const next = !audioOn
    if (next && !ambientAudio.running) {
      await ambientAudio.start()
      everStarted.current = true
      setHasError(ambientAudio.hasError)
    } else if (ambientAudio.running) {
      everStarted.current = true
      await ambientAudio.setEnabled(next)
    }
    toggleAudio()
  }

  const handleVolume = (v: number) => {
    setAudioVolume(v)
    ambientAudio.setVolume(v, 0.4)
  }

  if (!loaded) return null

  // hide until entered? Keep subtle but show after entered for premium
  const visible = loaded

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="audio"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="fixed right-4 top-[76px] md:right-6 md:top-6 z-30 flex items-center gap-2"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
        >
          {/* volume slider — appears on hover / tap */}
          <AnimatePresence>
            {expanded && entered && !hasError && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 96 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="flex h-10 items-center rounded-full border border-white/30 bg-white/72 px-3 backdrop-blur-xl shadow-[0_4px_20px_rgba(90,24,50,0.08)]">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={audioVolume}
                    onChange={(e) => handleVolume(parseFloat(e.target.value))}
                    className="h-1 w-20 cursor-pointer accent-[#9E3D5C]"
                    aria-label="Volume"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => void handleToggle()}
            className={`group flex h-10 items-center justify-center gap-2 rounded-full border bg-white/72 px-3.5 text-[#7A2945]/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(90,24,50,0.08)] transition-colors hover:border-[#EFA7B8]/40 hover:bg-white/86 hover:text-[#5A1832] ${hasError ? 'border-amber-200/50' : 'border-white/35'}`}
            aria-label={hasError ? 'Music file not found' : audioOn ? 'Pause music' : 'Play music'}
            aria-pressed={audioOn}
            title={hasError ? 'Replace public/music/our-song.mp3 with your song' : audioOn ? 'Pause — M' : 'Play — M'}
          >
            {/* subtle music indicator */}
            <span className="relative flex h-4 w-4 items-center justify-center">
              {hasError ? (
                <Music2 className="h-4 w-4 text-amber-600/70" />
              ) : audioOn && ambientAudio.running ? (
                <span className="flex items-end gap-[2px]">
                  <span className="h-3 w-[3px] rounded-full bg-[#9E3D5C] animate-[eq_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
                  <span className="h-2 w-[3px] rounded-full bg-[#EFA7B8] animate-[eq_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.18s' }} />
                  <span className="h-3.5 w-[3px] rounded-full bg-[#FFD6A5] animate-[eq_0.9s_ease-in-out_infinite]" style={{ animationDelay: '0.34s' }} />
                </span>
              ) : audioOn ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4 opacity-60" />
              )}
            </span>
            <span className="hidden text-[10px] font-medium tracking-[0.18em] uppercase md:inline">
              {hasError ? 'no song' : audioOn && ambientAudio.running ? 'playing' : audioOn ? 'ready' : 'muted'}
            </span>
            {!hasError && audioOn && ambientAudio.running && (
              <Pause className="hidden h-3 w-3 opacity-40 group-hover:opacity-70 md:block" />
            )}
          </button>

          <style>{`@keyframes eq { 0%,100%{transform:scaleY(0.5)} 50%{transform:scaleY(1.2)} }`}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
