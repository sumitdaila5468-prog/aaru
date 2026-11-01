import { useEffect, useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export function ShareButton({ className = '' }: { className?: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(id)
  }, [copied])

  const share = async () => {
    const url = window.location.href
    const data = {
      title: 'Happy Birthday, Aarju! ❤️',
      text: 'A little birthday universe, made with love by Sumit.',
      url,
    }
    try {
      if (navigator.share) {
        await navigator.share(data)
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
      } catch {
        setCopied(false)
      }
    }
  }

  return (
    <button type="button" onClick={share} className={`share-button ${className}`}>
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? 'LINK COPIED' : 'SHARE THIS LITTLE UNIVERSE'}
    </button>
  )
}
