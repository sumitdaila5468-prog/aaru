import { useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  maxWidth?: string
}

export function Modal({ open, onClose, children, title, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="absolute inset-0 backdrop-blur-[16px]" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 42%, rgba(255,247,248,0.92) 0%, rgba(255,232,238,0.86) 36%, rgba(255,232,199,0.68) 68%, rgba(90,24,50,0.36) 100%)' }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full ${maxWidth} max-h-[86vh] overflow-auto overscroll-contain rounded-[22px] border border-white/40 bg-[#FFFDFB]/95 p-[10px] shadow-[0_24px_64px_rgba(90,24,50,0.22),0_4px_16px_rgba(90,24,50,0.10)] backdrop-blur-xl`}
          >
            <div className="rounded-[14px] border border-[#EFA7B8]/22 bg-gradient-to-b from-[#FFFDFB] via-[#FFF7F8] to-[#FFFDFB] p-6 md:p-7">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#7A2945]/10 bg-white/70 text-[#7A2945]/60 backdrop-blur-md transition hover:border-[#EFA7B8]/30 hover:text-[#5A1832]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              {title && <h3 className="pr-8 font-display text-[22px] font-light italic text-[#5A1832]">{title}</h3>}
              <div className={title ? 'mt-3' : ''}>{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
