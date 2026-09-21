/* ------------------------------------------------------------------ */
/*  Ambient audio — generative piano / pad / nature hybrid              */
/*  Volume control, scene-aware fading, loop smoothing, no auto-play    */
/*  before user gesture. Supports custom src via story.audio.src.       */
/* ------------------------------------------------------------------ */

import { story } from '../data/story'

const CHORDS: number[][] = [
  [45, 52, 57, 60, 64],
  [41, 48, 53, 57, 60],
  [43, 50, 55, 59, 62],
  [45, 52, 57, 62, 66],
]

const CHIME_NOTES = [69, 72, 76, 79, 81, 84]

const midiToFreq = (m: number): number => 440 * Math.pow(2, (m - 69) / 12)

interface Voice {
  oscs: OscillatorNode[]
  gain: GainNode
}

class AmbientAudio {
  private ctx: AudioContext | null = null
  private bus: GainNode | null = null
  private htmlAudio: HTMLAudioElement | null = null
  private chordTimer: number | null = null
  private chimeTimer: number | null = null
  private voice: Voice | null = null
  private chordIndex = 0
  private enabled = true
  private started = false
  private baseVolume: number = story.audio.volume
  private currentVolume: number = story.audio.volume

  get running(): boolean {
    return this.started
  }

  get isEnabled(): boolean {
    return this.enabled
  }

  get volume(): number {
    return this.currentVolume
  }

  async start(): Promise<void> {
    if (this.started) {
      await this.setEnabled(true)
      return
    }
    this.started = true
    this.enabled = true
    this.baseVolume = story.audio.volume
    this.currentVolume = story.audio.volume

    if (story.audio.src) {
      const el = new Audio(story.audio.src)
      el.loop = true
      el.volume = this.currentVolume
      this.htmlAudio = el
      try {
        await el.play()
      } catch {
        /* retry on next toggle */
      }
      return
    }

    const Ctx = window.AudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    this.ctx = ctx

    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    const delay = ctx.createDelay(2)
    delay.delayTime.value = 0.42
    const feedback = ctx.createGain()
    feedback.gain.value = 0.34
    const wet = ctx.createGain()
    wet.gain.value = 0.28
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(wet)
    wet.connect(master)

    const bus = ctx.createGain()
    bus.gain.value = this.currentVolume
    bus.connect(master)
    bus.connect(delay)
    this.bus = bus

    master.gain.linearRampToValueAtTime(1, ctx.currentTime + 5)

    this.startNoiseBed()
    this.playChord()
    this.chordTimer = window.setInterval(() => this.playChord(), 9000)
    this.scheduleChime()
    document.addEventListener('visibilitychange', this.onVisibility)
  }

  async setEnabled(on: boolean): Promise<void> {
    this.enabled = on
    if (this.htmlAudio) {
      if (on) {
        try {
          await this.htmlAudio.play()
        } catch {
          /* ignore */
        }
      } else {
        this.htmlAudio.pause()
      }
      return
    }
    if (!this.ctx) return
    try {
      if (on) await this.ctx.resume()
      else await this.ctx.suspend()
    } catch {
      /* ignore */
    }
  }

  /** Smooth volume control 0–1 */
  setVolume(v: number, fadeSec = 0.6): void {
    const clamped = Math.max(0, Math.min(1, v))
    this.currentVolume = clamped
    if (this.htmlAudio) {
      // smooth fade for html audio via interval
      const el = this.htmlAudio
      const start = el.volume
      const diff = clamped - start
      if (Math.abs(diff) < 0.001 || fadeSec <= 0) {
        el.volume = clamped
        return
      }
      const steps = 24
      let tick = 0
      const iv = window.setInterval(() => {
        tick++
        el.volume = start + (diff * tick) / steps
        if (tick >= steps) window.clearInterval(iv)
      }, (fadeSec * 1000) / steps)
      return
    }
    if (!this.ctx || !this.bus) return
    const now = this.ctx.currentTime
    this.bus.gain.cancelScheduledValues(now)
    this.bus.gain.setValueAtTime(this.bus.gain.value, now)
    this.bus.gain.linearRampToValueAtTime(clamped, now + fadeSec)
  }

  /** Scene-aware fading: softer for letter/dark moments */
  fadeForScene(stage: number): void {
    // stage 7 = letter (calm, softer), stage 0-1 = gentle, finale slightly lifted
    let target = this.baseVolume
    if (stage === 7) target = this.baseVolume * 0.62
    else if (stage === 8) target = this.baseVolume * 0.92
    else if (stage === 0) target = this.baseVolume * 0.78
    this.setVolume(target, 2.2)
  }

  dispose(): void {
    if (this.chordTimer !== null) window.clearInterval(this.chordTimer)
    if (this.chimeTimer !== null) window.clearTimeout(this.chimeTimer)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.ctx?.close().catch(() => undefined)
  }

  private startNoiseBed(): void {
    const ctx = this.ctx
    const bus = this.bus
    if (!ctx || !bus) return
    const seconds = 4
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.2
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 420
    const gain = ctx.createGain()
    gain.gain.value = 0.05
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(bus)
    noise.start()
  }

  private playChord(): void {
    const ctx = this.ctx
    const bus = this.bus
    if (!ctx || !bus) return
    const notes = CHORDS[this.chordIndex % CHORDS.length]
    this.chordIndex++

    const gain = ctx.createGain()
    gain.gain.value = 0
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900
    filter.Q.value = 0.4
    gain.connect(filter)
    filter.connect(bus)

    const oscs: OscillatorNode[] = []
    notes.forEach((note, i) => {
      for (const detune of [0, 5]) {
        const osc = ctx.createOscillator()
        osc.type = i === 0 ? 'sine' : 'triangle'
        osc.frequency.value = midiToFreq(note)
        osc.detune.value = detune
        const oscGain = ctx.createGain()
        oscGain.gain.value = i === 0 ? 0.15 : 0.07
        osc.connect(oscGain)
        oscGain.connect(gain)
        osc.start()
        oscs.push(osc)
      }
    })

    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.05
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 240
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()
    oscs.push(lfo)

    const now = ctx.currentTime
    gain.gain.linearRampToValueAtTime(0.9, now + 3.4)

    if (this.voice) {
      const previous = this.voice
      previous.gain.gain.cancelScheduledValues(now)
      previous.gain.gain.setValueAtTime(previous.gain.gain.value, now)
      previous.gain.gain.linearRampToValueAtTime(0, now + 3.6)
      previous.oscs.forEach((osc) => osc.stop(now + 3.8))
    }
    this.voice = { oscs, gain }
  }

  private scheduleChime(): void {
    this.chimeTimer = window.setTimeout(
      () => {
        const ctx = this.ctx
        const bus = this.bus
        if (ctx && bus && this.enabled) {
          const note = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)]
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          osc.frequency.value = midiToFreq(note)
          const gain = ctx.createGain()
          const now = ctx.currentTime
          gain.gain.setValueAtTime(0, now)
          gain.gain.linearRampToValueAtTime(0.045, now + 0.08)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 4)
          osc.connect(gain)
          gain.connect(bus)
          osc.start(now)
          osc.stop(now + 4.2)
        }
        this.scheduleChime()
      },
      6000 + Math.random() * 9000,
    )
  }

  private onVisibility = (): void => {
    if (!this.ctx) return
    if (document.hidden) {
      this.ctx.suspend().catch(() => undefined)
    } else if (this.enabled) {
      this.ctx.resume().catch(() => undefined)
    }
  }
}

export const ambientAudio = new AmbientAudio()
