'use client'

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'

const SERVICES = [
  {
    number: '01',
    title: 'Brokerage',
    description:
      'Expert representation for buyers, sellers, landlords, and tenants across every commercial property type.',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop',
    bullets: [
      'Buyer & tenant representation',
      'Listing & disposition',
      'Lease negotiation',
    ],
  },
  {
    number: '02',
    title: 'Investment Sales',
    description:
      'Data-driven cap rate analysis and strategic disposition — engineered for maximum return on capital.',
    image:
      'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?w=1200&h=800&fit=crop',
    bullets: ['Portfolio analysis', 'Underwriting', 'Dispositions & acquisitions'],
  },
  {
    number: '03',
    title: 'Consulting',
    description:
      'Market research, site selection, highest-and-best-use studies, and long-horizon portfolio strategy.',
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
    bullets: ['Market & feasibility studies', 'Site selection', 'Strategic planning'],
  },
  {
    number: '04',
    title: 'Property Management',
    description:
      'End-to-end asset management, tenant relations, and lease administration that protects long-term value.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop',
    bullets: ['Asset management', 'Tenant relations', 'Lease administration'],
  },
]

/**
 * Smooth piecewise: 0 outside the slot, ramps to 1 over a small fade window
 * centered on the slot boundaries so adjacent slides cross-fade cleanly.
 */
function computeOpacity(progress: number, index: number, total: number) {
  const slot = 1 / total
  const half = slot * 0.1
  const start = index / total
  const end = (index + 1) / total
  const isFirst = index === 0
  const isLast = index === total - 1

  // Below the slide entirely
  if (progress < start - half) return isFirst ? 1 : 0
  // Fading in (centered on `start`)
  if (progress < start + half) {
    if (isFirst) return 1
    return (progress - (start - half)) / (2 * half)
  }
  // Fully visible
  if (progress < end - half) return 1
  // Fading out (centered on `end`)
  if (progress < end + half) {
    if (isLast) return 1
    return 1 - (progress - (end - half)) / (2 * half)
  }
  // Above the slide entirely
  return isLast ? 1 : 0
}

function computeYPercent(progress: number, index: number, total: number) {
  const slot = 1 / total
  const half = slot * 0.1
  const start = index / total
  const end = (index + 1) / total
  const isFirst = index === 0
  const isLast = index === total - 1

  if (progress < start - half) return isFirst ? 0 : 15
  if (progress < start + half) {
    if (isFirst) return 0
    const t = (progress - (start - half)) / (2 * half)
    return 15 - 15 * t // 15 → 0
  }
  if (progress < end - half) return 0
  if (progress < end + half) {
    if (isLast) return 0
    const t = (progress - (end - half)) / (2 * half)
    return -12 * t // 0 → -12
  }
  return isLast ? 0 : -12
}

function ServiceSlide({
  service,
  index,
  total,
  progress,
}: {
  service: (typeof SERVICES)[number]
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const opacity = useMotionValue(index === 0 ? 1 : 0)
  const y = useMotionValue(index === 0 ? 0 : 15)
  const start = index / total
  const end = (index + 1) / total
  const imageScale = useTransform(progress, [start, end], [1.08, 1])

  useMotionValueEvent(progress, 'change', (p) => {
    opacity.set(computeOpacity(p, index, total))
    y.set(computeYPercent(p, index, total))
  })

  // Sync initial value to current scroll position so direct-loads / hot reloads
  // don't show the wrong slide before the first scroll change event fires.
  useEffect(() => {
    const p = progress.get()
    opacity.set(computeOpacity(p, index, total))
    y.set(computeYPercent(p, index, total))
  }, [index, total, progress, opacity, y])

  // Convert numeric y → percentage string for transform
  const yPct = useTransform(y, (v) => `${v}%`)

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center pointer-events-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 w-full max-w-[1400px] mx-auto px-6 lg:px-8 pointer-events-auto">
        {/* Text */}
        <motion.div style={{ y: yPct }} className="relative z-10 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-coral-400 tracking-[0.3em]">{service.number}</span>
            <div className="w-12 h-px bg-coral-400/40" />
            <span className="text-coral-400 text-[10px] tracking-[0.3em] uppercase font-mono">
              Service {index + 1} / {total}
            </span>
          </div>
          <h3
            className="font-display text-cream-50 mb-6 leading-[0.95]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            {service.title}
          </h3>
          <p className="text-lg md:text-xl text-charcoal-300 mb-8 leading-relaxed max-w-xl">
            {service.description}
          </p>
          <ul className="space-y-3 mb-10">
            {service.bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-charcoal-400">
                <span className="w-6 h-px bg-coral-400/60" />
                <span className="tracking-wider uppercase text-[11px]">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Image */}
        <motion.div style={{ y: yPct }} className="relative hidden md:block">
          <div className="relative aspect-[4/5] overflow-hidden border border-coral-400/10">
            <motion.div style={{ scale: imageScale }} className="absolute inset-0">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent" />
            <div className="absolute top-6 left-6 font-mono text-[10px] tracking-[0.3em] text-coral-400/80">
              STEWARDSHIP / {service.title.toUpperCase()}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function ServicesPinned() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [activeSlide, setActiveSlide] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.min(SERVICES.length - 1, Math.max(0, Math.floor(p * SERVICES.length)))
    setActiveSlide(i)
  })

  const jumpToSlide = (i: number) => {
    if (!ref.current) return
    const sectionTop = ref.current.offsetTop
    const sectionHeight = ref.current.offsetHeight
    const innerH = window.innerHeight
    const scrollRange = sectionHeight - innerH
    // Aim for the middle of slide i so it's fully visible
    const slot = 1 / SERVICES.length
    const targetProgress = i * slot + slot / 2
    const target = sectionTop + scrollRange * targetProgress
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, opts?: { duration?: number }) => void } }).__lenis
    if (lenis) lenis.scrollTo(target, { duration: 1.2 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section
      ref={ref}
      className="relative bg-charcoal-950"
      // 60vh per slide ≈ 240vh for 4 services. Faster to scroll through,
      // respects user time, still feels cinematic.
      style={{ height: `${SERVICES.length * 60}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(224,122,95,0.05),transparent_60%)]" />

        {/* Top eyebrow */}
        <div className="pt-32 pb-8 relative z-20">
          <Container>
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-coral-400" />
                <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                  What We Do
                </span>
              </div>
              <h2
                className="font-display text-cream-50 whitespace-nowrap"
                style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.25rem)' }}
              >
                Full-Service CRE
              </h2>
            </div>
          </Container>
        </div>

        {/* Slide stage */}
        <div className="relative flex-1">
          {SERVICES.map((s, i) => (
            <ServiceSlide
              key={s.title}
              service={s}
              index={i}
              total={SERVICES.length}
              progress={scrollYProgress}
            />
          ))}

          {/* Side-rail jump nav — desktop only */}
          <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3">
            {SERVICES.map((s, i) => {
              const isActive = i === activeSlide
              return (
                <button
                  key={s.number}
                  onClick={() => jumpToSlide(i)}
                  aria-label={`Jump to ${s.title}`}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={`font-mono text-[10px] tracking-[0.3em] transition-colors duration-300 ${
                      isActive ? 'text-coral-400' : 'text-charcoal-600 group-hover:text-charcoal-300'
                    }`}
                  >
                    {s.number}
                  </span>
                  <span
                    className={`block h-px transition-all duration-500 ${
                      isActive ? 'w-12 bg-coral-400' : 'w-6 bg-charcoal-700 group-hover:w-9 group-hover:bg-charcoal-500'
                    }`}
                  />
                  <span
                    className={`text-[10px] tracking-[0.25em] uppercase transition-all duration-500 ${
                      isActive
                        ? 'text-coral-400 opacity-100'
                        : 'text-charcoal-600 opacity-0 group-hover:opacity-100 group-hover:text-charcoal-300'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom progress bar + CTA */}
        <div className="pb-10 pt-6 border-t border-charcoal-800/60 relative z-20">
          <Container>
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex items-center gap-4 flex-1">
                <span className="font-mono text-[10px] tracking-[0.3em] text-charcoal-500">SCROLL</span>
                <div className="relative flex-1 max-w-md h-px bg-charcoal-800 overflow-hidden">
                  <motion.div
                    style={{ width: progressWidth }}
                    className="absolute inset-y-0 left-0 bg-coral-400"
                  />
                </div>
              </div>
              <Button href="/services" variant="outline" size="sm">
                All Services
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}
