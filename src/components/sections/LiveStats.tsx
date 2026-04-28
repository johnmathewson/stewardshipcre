'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '@/components/layout/Container'

interface Stat {
  label: string
  value: string
  sublabel: string
  pulse?: boolean
}

const STATS: Stat[] = [
  { label: 'Active', value: '12', sublabel: 'Listings on market', pulse: true },
  { label: 'Available', value: '$14.8M', sublabel: 'Listed value' },
  { label: 'Closed Q1', value: '3', sublabel: 'Transactions' },
  { label: 'Tours · 30D', value: '18', sublabel: 'Property tours' },
]

const TICKS: { label: string; value: string }[] = [
  { label: 'NWI · OFFICE', value: '$22.40 SF/YR' },
  { label: 'NWI · INDUSTRIAL', value: '$8.50 SF NNN' },
  { label: 'NWI · RETAIL', value: '$18.00 SF/YR' },
  { label: 'NWI · LAND', value: '$2.40 / SF' },
  { label: 'CHICAGOLAND · OFFICE', value: '$28.10 SF/YR' },
  { label: 'CHICAGOLAND · INDUSTRIAL', value: '$11.20 SF NNN' },
]

export function LiveStats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const [tickIndex, setTickIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setTickIndex((i) => (i + 1) % TICKS.length)
    }, 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <section ref={ref} className="relative bg-charcoal-900 border-t border-b border-charcoal-800/60">
      {/* Top status bar */}
      <div className="border-b border-charcoal-800/60 bg-charcoal-950/40">
        <Container className="py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-400" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal-400">
              Live Inventory · Northwest Indiana &amp; Chicagoland
            </span>
          </div>
          <div className="flex items-center gap-4 overflow-hidden font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-charcoal-500">MARKET</span>
            <motion.div
              key={tickIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="text-charcoal-400">{TICKS[tickIndex].label}</span>
              <span className="text-coral-400">{TICKS[tickIndex].value}</span>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Big stat grid */}
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-charcoal-800/40">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              className="bg-charcoal-900 px-6 py-8 md:px-8 md:py-10 group"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal-500">
                  {stat.label}
                </span>
                {stat.pulse && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral-400" />
                  </span>
                )}
              </div>
              <div
                className="font-display text-coral-400 leading-none mb-3"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                {stat.value}
              </div>
              <div className="w-8 h-px bg-coral-400/30 mb-3 group-hover:w-16 group-hover:bg-coral-400/60 transition-all duration-700" />
              <p className="text-xs text-charcoal-400 tracking-wide">
                {stat.sublabel}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Last updated stamp */}
        <div className="mt-6 flex items-center justify-end font-mono text-[10px] tracking-[0.2em] uppercase text-charcoal-600">
          <span>Last updated · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </Container>
    </section>
  )
}
