'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Barba-style curtain cover that sweeps across the viewport between route changes.
 * Covers in from bottom, brief hold, then uncovers upward — with a centered
 * teal wordmark during the hold.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isInitial, setIsInitial] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIsInitial(false), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={isInitial ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`curtain-${pathname}`}
          className="fixed inset-0 z-[9998] pointer-events-none bg-charcoal-950 flex items-center justify-center"
          initial={isInitial ? { y: '-100%' } : { y: '0%' }}
          animate={{ y: '-100%' }}
          exit={{ y: '0%' }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
        >
          <motion.span
            className="font-heading text-teal-400 text-xl md:text-2xl tracking-[0.35em]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0, y: -20 }}
            exit={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            STEWARDSHIP
          </motion.span>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
