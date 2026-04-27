'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { Button } from '@/components/ui/Button'

interface CaseStudy {
  slug: string
  asset: string
  city: string
  problem: string
  approach: string
  outcomeMetric: string
  outcomeLabel: string
  outcomeNote: string
  image: string
}

const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'westville-industrial-flex',
    asset: '156 S Flynn Rd · Industrial',
    city: 'Westville, IN',
    problem: 'Owner needed to exit a vacant 12,000 SF industrial building in 60 days.',
    approach: 'Repositioned the listing as flex space; ran a tight off-market outreach to regional operators.',
    outcomeMetric: '14',
    outcomeLabel: 'days to 3 buyers',
    outcomeNote: 'Closed at full ask · No price reduction',
    image: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?w=1600&h=1200&fit=crop',
  },
  {
    slug: 'crown-point-medical',
    asset: '420 N Main St · Medical Office',
    city: 'Crown Point, IN',
    problem: '14,000 SF medical office stagnant on market for 9 months at the previous broker.',
    approach: 'Re-underwrote the asset, repositioned to a healthcare investor pool, sourced an off-market buyer.',
    outcomeMetric: '+9%',
    outcomeLabel: 'over appraisal',
    outcomeNote: 'Sold at $2.4M · Off-market deal',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&h=1200&fit=crop',
  },
  {
    slug: 'merrillville-industrial-park',
    asset: '8500 Industrial Pkwy · Industrial',
    city: 'Merrillville, IN',
    problem: 'Family owner had a 42,000 SF facility with one anchor lease expiring; risk of sudden vacancy.',
    approach: 'Negotiated a 7-year renewal with a 4% annual escalator while courting a backup tenant.',
    outcomeMetric: '7yr',
    outcomeLabel: 'NNN renewal',
    outcomeNote: 'Full-building lease · $8.50/SF NNN secured',
    image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1600&h=1200&fit=crop',
  },
]

export function CaseStudies() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])

  return (
    <section ref={sectionRef} className="relative py-section overflow-hidden bg-charcoal-900">
      <motion.div style={{ y: bgY }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(78,205,196,0.05),transparent_60%)]" />

      <Container className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-teal-400" />
              <span className="text-teal-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                Selected Work
              </span>
            </div>
            <h2
              className="font-display text-cream-50"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              How We Get to Yes
            </h2>
          </div>
          <p className="text-charcoal-400 text-lg leading-relaxed lg:pt-12">
            Every market has its difficult assets. Here&apos;s how we turn vacant
            buildings, expiring leases, and stale listings into closed deals.
          </p>
        </motion.div>

        {/* Case Studies — alternating zigzag */}
        <div className="space-y-px bg-charcoal-800/40">
          {CASE_STUDIES.map((cs, i) => {
            const reverse = i % 2 === 1
            return (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative bg-charcoal-900 group"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-0 ${reverse ? 'lg:[direction:rtl]' : ''}`}>
                  {/* Image */}
                  <div className="lg:col-span-5 relative h-72 md:h-96 lg:h-auto lg:min-h-[420px] overflow-hidden lg:[direction:ltr]">
                    <ImageReveal
                      src={cs.image}
                      alt={cs.asset}
                      className="absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                      parallaxAmount={0.08}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 to-transparent pointer-events-none" />
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-center lg:[direction:ltr]">
                    {/* Asset header */}
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-teal-400">
                        Case · {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-charcoal-700">·</span>
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-charcoal-500">
                        {cs.city}
                      </span>
                    </div>

                    <h3
                      className="font-display text-cream-50 mb-8 leading-tight"
                      style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}
                    >
                      {cs.asset}
                    </h3>

                    {/* Problem / Approach */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-2">
                          The Problem
                        </p>
                        <p className="text-sm text-charcoal-300 leading-relaxed">
                          {cs.problem}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-2">
                          What We Did
                        </p>
                        <p className="text-sm text-charcoal-300 leading-relaxed">
                          {cs.approach}
                        </p>
                      </div>
                    </div>

                    {/* Outcome — the hero metric */}
                    <div className="border-t border-charcoal-800 pt-8 flex items-end justify-between flex-wrap gap-6">
                      <div className="flex items-baseline gap-4">
                        <span
                          className="font-display text-teal-400 leading-none teal-glow-text"
                          style={{ fontSize: 'clamp(2.5rem, 4.5vw, 4rem)' }}
                        >
                          {cs.outcomeMetric}
                        </span>
                        <div>
                          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-teal-400">
                            Outcome
                          </p>
                          <p className="text-sm text-cream-100 mt-1">{cs.outcomeLabel}</p>
                        </div>
                      </div>
                      <p className="text-xs font-mono text-charcoal-500 tracking-wider max-w-xs">
                        {cs.outcomeNote}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 text-center"
        >
          <Button href="/contact" variant="outline">
            Discuss Your Asset
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}
