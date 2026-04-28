'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { CountUp } from '@/components/motion/CountUp'
import { FadeIn } from '@/components/motion/FadeIn'

const STATS = [
  { value: 50, prefix: '$', suffix: 'M+', label: 'Total Transaction Volume' },
  { value: 200, suffix: '+', label: 'Deals Closed' },
  { value: 15, suffix: '+', label: 'Years Combined Experience' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
]

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section ref={ref} className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal-900" />

      {/* Subtle gradient accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(78,205,196,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(78,205,196,0.04),transparent_50%)]" />

      {/* Border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coral-400/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coral-400/20 to-transparent" />

      <Container className="relative z-10">
        <motion.div style={{ y }}>
          <FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <CountUp
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="font-mono text-4xl md:text-5xl font-bold text-coral-400"
                  />
                  <div className="w-8 h-px bg-coral-400/30 mx-auto my-3 group-hover:w-16 group-hover:bg-coral-400/60 transition-all duration-700" />
                  <p className="text-xs tracking-[0.2em] uppercase text-charcoal-400">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </motion.div>
      </Container>
    </section>
  )
}
