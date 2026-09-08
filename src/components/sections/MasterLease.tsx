'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/motion/MagneticButton'

/**
 * MasterLease — homepage pillar section.
 *
 * Positions the master-lease offering as a first-class service for owners
 * carrying vacancy: Stewardship becomes tenant of record on the facility,
 * pays fixed rent from signing, and brings its own tenant relationships to
 * fill the space. Voice is owner-to-owner — direct, concrete, no broker-speak.
 */

const SITUATIONS = [
  {
    label: 'Just closed',
    text: 'You bought the building for the basis, not the vacancy. There’s no leasing team in place and the carry starts on day one.',
  },
  {
    label: 'Underperforming',
    text: 'Stale space, rollover on the horizon, a sign that’s been up too long. The rent roll isn’t telling the story the asset could.',
  },
  {
    label: 'Out of market',
    text: 'You want the income from the property, not a leasing project in a market you don’t live in.',
  },
  {
    label: 'Lender · Servicer · REO',
    text: 'You’re holding an asset that needs a real rent roll before anyone will refinance it or buy it.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'We underwrite it',
    text: 'Corridor, layout, realistic rents, actual tenant demand. We read the building the way an owner reads it — because we are one.',
  },
  {
    n: '02',
    title: 'We sign the master lease',
    text: 'Stewardship becomes your tenant of record on the facility — fixed rent, fixed term, one counterparty.',
  },
  {
    n: '03',
    title: 'We fill it',
    text: 'Our tenant relationships. Our leasing. Our TI coordination and management. You collect rent while we do the work.',
  },
]

const OUTCOMES = [
  { metric: 'Day 1', label: 'Income starts at signing, not at stabilization.' },
  { metric: '1', label: 'Counterparty. One lease, one check, one relationship.' },
  { metric: '0', label: 'Lease-up risk left on your side. It moves to us.' },
]

export function MasterLease() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const glowY = useTransform(scrollYProgress, [0, 1], ['-4%', '6%'])

  return (
    <section
      ref={ref}
      id="master-lease"
      className="relative py-section overflow-hidden bg-charcoal-900 scroll-mt-24"
    >
      {/* Ambient accents */}
      <motion.div
        style={{ y: glowY }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(224,122,95,0.07),transparent_55%)] pointer-events-none"
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coral-400/40 to-transparent" />

      <Container className="relative z-10">
        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 lg:mb-20"
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-px bg-coral-400" />
              <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                Master Lease &middot; For Owners
              </span>
            </div>
            <h2
              className="font-display text-cream-50 leading-[0.95]"
              style={{ fontSize: 'clamp(2rem, 4.6vw, 4rem)' }}
            >
              We Lease the Building.
              <br />
              <span className="text-coral-400 coral-glow-text">You Collect the Rent.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="text-charcoal-300 text-lg leading-relaxed">
              A newly acquired building with vacancy. An asset that has been
              underperforming for a while. Either way, the problem is the same:
              you are carrying space that isn&apos;t paying. Stewardship signs a
              master lease on the facility, brings its own tenant relationships to
              fill it, and pays you a fixed rent while it does.
            </p>
            <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-charcoal-500 mt-6">
              Not every building fits. We underwrite first and tell you straight.
            </p>
          </div>
        </motion.div>

        {/* ── When it fits / How it works ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-charcoal-800/40">
          {/* Situations */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 bg-charcoal-900 p-8 md:p-10"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral-400 mb-8">
              When it fits
            </p>
            <ul className="space-y-7">
              {SITUATIONS.map((s, i) => (
                <motion.li
                  key={s.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                  className="border-l border-charcoal-800 hover:border-coral-400 pl-5 transition-colors duration-500"
                >
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-cream-100 mb-1.5">
                    {s.label}
                  </p>
                  <p className="text-sm text-charcoal-400 leading-relaxed">{s.text}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 bg-charcoal-900 p-8 md:p-10"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral-400 mb-8">
              How it works
            </p>
            <ol className="space-y-8">
              {STEPS.map((step, i) => (
                <motion.li
                  key={step.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
                  className="grid grid-cols-[auto_1fr] gap-5 md:gap-8 items-start"
                >
                  <span
                    className="font-display text-coral-400 leading-none pt-1"
                    style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
                  >
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-heading text-cream-50 text-lg md:text-xl mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-[15px] text-charcoal-400 leading-relaxed max-w-lg">
                      {step.text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>

        {/* ── Outcome strip ──────────────────────────────────────── */}
        <div className="mt-px grid grid-cols-1 md:grid-cols-3 gap-px bg-charcoal-800/40">
          {OUTCOMES.map((o, i) => (
            <motion.div
              key={o.metric}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              className="bg-charcoal-950/60 px-8 py-8 group"
            >
              <div
                className="font-display text-coral-400 leading-none mb-3 coral-glow-text"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)' }}
              >
                {o.metric}
              </div>
              <div className="w-8 h-px bg-coral-400/30 mb-3 group-hover:w-16 group-hover:bg-coral-400/60 transition-all duration-700" />
              <p className="text-sm text-charcoal-300 leading-relaxed">{o.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 flex flex-wrap items-center gap-4"
        >
          <MagneticButton>
            <Button href="/contact" size="lg">
              Discuss a Master Lease
            </Button>
          </MagneticButton>
          <Button href="/services#master-lease" variant="ghost" size="lg">
            How It Works
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}
