/* ------------------------------------------------------------------ */
/*  Cinematic Music Player — single file: /public/music/our-song.mp3    */
/*  Replace that file with your own song (keep same name). No code      */
/*  change needed. Play only after user gesture (Enter), loops across   */
/*  scenes, graceful error if missing, volume/mute/elegant indicator.   */
/* ------------------------------------------------------------------ */

import { story } from '../data/story'
import { withBase } from './paths'

class CinematicAudio {
  private el: HTMLAudioElement | null = null
  private started = false
  private enabled = true
  private hasErrorFlag = false
  private baseVolume: number = story.audio.volume ?? 0.62
  private currentVolume: number = story.audio.volume ?? 0.62

  get running(): boolean {
    return this.started && !!this.el
  }
  get isEnabled(): boolean {
    return this.enabled
  }
  get volume(): number {
    return this.currentVolume
  }
  get hasError(): boolean {
    return this.hasErrorFlag
  }

  async start(): Promise<void> {
    if (this.started && this.el) {
      await this.setEnabled(true)
      return
    }
    const src = story.audio.src
    if (!src) {
      this.hasErrorFlag = true
      return
    }
    const url = withBase(src)
    const el = new Audio(url)
    el.loop = true
    el.preload = 'auto'
    el.volume = this.currentVolume
    el.crossOrigin = 'anonymous'

    // graceful error handling
    el.addEventListener('error', () => {
      this.hasErrorFlag = true
      console.warn('[Aaru Music] Failed to load', url, el.error)
    })
    el.addEventListener('canplay', () => {
      this.hasErrorFlag = false
    })
    el.addEventListener('ended', () => {
      // loop handles this, but ensure
      if (this.enabled) el.play().catch(() => undefined)
    })

    this.el = el
    this.started = true
    this.enabled = true
    this.hasErrorFlag = false

    // must be called after user gesture
    try {
      await el.play()
    } catch (e) {
      // autoplay blocked — will retry on next toggle
      this.hasErrorFlag = true
      console.warn('[Aaru Music] Play blocked or failed', e)
    }

    // subtle fade-in
    const target = this.baseVolume
    el.volume = 0
    this.fadeVolume(target, 2.2)

    document.addEventListener('visibilitychange', this.onVisibility)
  }

  async setEnabled(on: boolean): Promise<void> {
    this.enabled = on
    if (!this.el) {
      if (on) await this.start()
      return
    }
    if (on) {
      try {
        await this.el.play()
        this.hasErrorFlag = false
      } catch {
        this.hasErrorFlag = true
      }
    } else {
      this.el.pause()
    }
  }

  setVolume(v: number, fadeSec = 0.6): void {
    const clamped = Math.max(0, Math.min(1, v))
    this.currentVolume = clamped
    if (!this.el) return
    if (fadeSec <= 0) {
      this.el.volume = clamped
      return
    }
    const el = this.el
    const start = el.volume
    const diff = clamped - start
    if (Math.abs(diff) < 0.01) {
      el.volume = clamped
      return
    }
    const steps = 20
    let tick = 0
    const iv = window.setInterval(() => {
      tick++
      el.volume = start + (diff * tick) / steps
      if (tick >= steps) {
        el.volume = clamped
        window.clearInterval(iv)
      }
    }, (fadeSec * 1000) / steps)
  }

  private fadeVolume(target: number, sec: number) {
    this.setVolume(target, sec)
  }

  /** Scene-aware gentle ducking — warmer/darker scenes slightly softer */
  fadeForScene(stage: number): void {
    if (!this.el) return
    let target = this.baseVolume
    // Opening / World slightly softer, dark scenes deeper
    if (stage === 0) target = this.baseVolume * 0.78
    else if (stage >= 2 && stage <= 4) target = this.baseVolume * 0.88
    else if (stage === 7) target = this.baseVolume * 0.72 // night ALWAYS
    else if (stage === 9) target = this.baseVolume * 0.86 // finale
    this.setVolume(target, 2.2)
  }

  dispose(): void {
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.el?.pause()
    this.el = null
  }

  private onVisibility = (): void => {
    if (!this.el) return
    if (document.hidden) {
      this.el.pause()
    } else if (this.enabled) {
      this.el.play().catch(() => undefined)
    }
  }
}

export const ambientAudio = new CinematicAudio()
export const cinematicAudio = ambientAudio
