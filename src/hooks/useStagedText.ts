/* ------------------------------------------------------------------ */
/*  Staged text — cinematic lines that appear one at a time             */
/* ------------------------------------------------------------------ */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useExperience } from '../state/experience'
import type { StagedLine } from '../types'

interface Options {
  /** ms before the first line appears */
  startDelay?: number
  /** ms added to hold — covers the exit fade */
  transitionBudget?: number
  /** default hold when a line doesn't define one */
  defaultHold?: number
  /** stop after the last line (stay visible) instead of clearing */
  keepLast?: boolean
  onDone?: () => void
}

/**
 * Drives a sequence of staged lines. Lines auto-advance after their
 * `hold` time; `next()` skips forward immediately (used for click /
 * tap-to-advance).
 */
export function useStagedText(lines: StagedLine[], opts: Options = {}) {
  const {
    startDelay = 400,
    transitionBudget = 1150,
    defaultHold = 1500,
    keepLast = false,
    onDone,
  } = opts

  const paused = useExperience((s) => s.paused)

  const [index, setIndex] = useState(-1)
  const [done, setDone] = useState(false)

  const linesRef = useRef(lines)
  linesRef.current = lines
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone
  const optsRef = useRef({ transitionBudget, defaultHold, keepLast })
  optsRef.current = { transitionBudget, defaultHold, keepLast }

  const indexRef = useRef(-1)
  const timer = useRef<number | null>(null)

  const clearTimer = (): void => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  const goTo = useCallback(
    (i: number): void => {
      clearTimer()
      indexRef.current = i
      setIndex(i)
      const ls = linesRef.current
      if (i >= ls.length) {
        setDone(true)
        onDoneRef.current?.()
        return
      }
      const { transitionBudget: budget, defaultHold: hold, keepLast: keep } = optsRef.current
      const isLast = i === ls.length - 1
      if (keep && isLast) return // last line stays on screen
      if (useExperience.getState().paused) return // frozen while paused
      const stay = (ls[i].hold ?? hold) + budget
      timer.current = window.setTimeout(() => goTo(i + 1), stay)
    },
    [],
  )

  const next = useCallback((): void => {
    const ls = linesRef.current
    const current = indexRef.current
    if (current < 0 || current >= ls.length) return
    goTo(current + 1)
  }, [goTo])

  const reset = useCallback((): void => {
    clearTimer()
    indexRef.current = -1
    setIndex(-1)
    setDone(false)
  }, [])

  // pause / resume handling — freeze timers while paused
  useEffect(() => {
    if (!paused) {
      // resume: if we have a current line and no timer, restart its hold
      const idx = indexRef.current
      const ls = linesRef.current
      if (idx >= 0 && idx < ls.length && !done) {
        const { transitionBudget: budget, defaultHold: hold, keepLast: keep } = optsRef.current
        const isLast = idx === ls.length - 1
        if (keep && isLast) return
        if (timer.current === null) {
          const stay = (ls[idx].hold ?? hold) + budget
          timer.current = window.setTimeout(() => goTo(idx + 1), stay)
        }
      }
    } else {
      clearTimer()
    }
  }, [paused, done, goTo])

  useEffect(() => {
    const kickoff = window.setTimeout(() => goTo(0), startDelay)
    return () => {
      window.clearTimeout(kickoff)
      clearTimer()
    }
  }, [goTo, startDelay])

  useEffect(() => clearTimer, [])

  const current: StagedLine | null = index >= 0 && index < lines.length ? lines[index] : null

  return { index, current, done, next, reset }
}
