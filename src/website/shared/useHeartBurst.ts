import { useCallback, useState } from 'react'

export interface HeartBurst {
  id: number
  x: number
  y: number
}

export function useHeartBurst() {
  const [bursts, setBursts] = useState<HeartBurst[]>([])

  const trigger = useCallback((event?: React.MouseEvent | { clientX: number; clientY: number }) => {
    const x = event ? (event as any).clientX ?? window.innerWidth / 2 : window.innerWidth / 2
    const y = event ? (event as any).clientY ?? window.innerHeight / 2 : window.innerHeight / 2
    const id = Date.now() + Math.random()
    setBursts((previous) => [...previous, { id, x, y }])
    window.setTimeout(() => setBursts((previous) => previous.filter((burst) => burst.id !== id)), 1200)
  }, [])

  return { bursts, trigger }
}
