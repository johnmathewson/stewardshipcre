'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  links: { href: string; label: string }[]
}

export function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 lg:hidden"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-charcoal-950/98 backdrop-blur-xl" onClick={onClose} />

          {/* Nav Content */}
          <motion.nav
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative flex flex-col items-center justify-center h-full gap-8"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-heading text-2xl md:text-3xl tracking-[0.2em] uppercase text-cream-200 hover:text-gold-500 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Link
                href="/contact"
                onClick={onClose}
                className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 px-8 py-3 text-sm tracking-[0.15em] uppercase font-semibold transition-all duration-300"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
