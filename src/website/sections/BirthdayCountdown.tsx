import { useEffect, useState } from 'react'

type BirthdayClock = { isBirthday: boolean; days: number; hours: number; minutes: number; seconds: number }

function getBirthdayClock(now: Date): BirthdayClock {
  const birthday = new Date(now.getFullYear(), 10, 3, 0, 0, 0, 0)
  const isBirthday = now.getMonth() === 10 && now.getDate() === 3
  if (!isBirthday && birthday.getTime() < now.getTime()) birthday.setFullYear(birthday.getFullYear() + 1)
  const remaining = Math.max(0, birthday.getTime() - now.getTime())
  const totalSeconds = Math.floor(remaining / 1000)
  return {
    isBirthday,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

export function BirthdayCountdown() {
  const [clock, setClock] = useState<BirthdayClock>(() => getBirthdayClock(new Date()))

  useEffect(() => {
    const update = () => setClock(getBirthdayClock(new Date()))
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (clock.isBirthday) {
    return (
      <div className="mt-6 inline-flex flex-col items-center rounded-2xl border border-[#FFD6A5]/25 bg-[#FFD6A5]/[0.08] px-6 py-3 text-center shadow-[0_8px_30px_rgba(255,214,165,0.08)]">
        <span className="text-[10px] tracking-[0.24em] uppercase text-[#FFD6A5]/75">the day we celebrate you</span>
        <span className="mt-1 font-display text-xl italic text-[#FFE8EE]">Happy Birthday, Aarju! 🎂</span>
      </div>
    )
  }

  const units = [
    { label: 'days', value: clock.days },
    { label: 'hours', value: clock.hours },
    { label: 'minutes', value: clock.minutes },
    { label: 'seconds', value: clock.seconds },
  ]

  return (
    <div className="mt-6 w-full max-w-[360px] rounded-2xl border border-[#FFD6A5]/15 bg-white/[0.045] px-4 py-3 backdrop-blur-xl">
      <p className="mb-2 text-center text-[9px] tracking-[0.24em] uppercase text-[#FFD6A5]/70">counting down to your special day · 3 November</p>
      <div className="grid grid-cols-4 gap-2">
        {units.map(unit => (
          <div key={unit.label} className="rounded-xl border border-white/[0.07] bg-black/10 px-1 py-2 text-center">
            <span className="block font-display text-2xl tabular-nums text-[#FFE8EE]">{String(unit.value).padStart(2, '0')}</span>
            <span className="mt-0.5 block text-[8px] tracking-[0.13em] uppercase text-white/40">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
