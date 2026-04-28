'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { Marquee } from '@/components/motion/Marquee'
import { HERO_SLIDES } from '@/data/portfolio'

const SLIDE_MS = 6500

export function HeroSlideshow() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    const t = setInterval(() => {
      setActive((i) => (i + 1) % HERO_SLIDES.length)
    }, SLIDE_MS)
    return () => clearInterval(t)
  }, [])

  const slide = HERO_SLIDES[active]

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-charcoal-950">
      {/* Slideshow background — Ken Burns slow zoom on each frame */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-[-10%] w-[120%] h-[120%]"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.slug}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] },
              scale: { duration: SLIDE_MS / 1000 + 1.5, ease: 'linear' },
            }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.address}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/65 via-charcoal-950/45 to-charcoal-950/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/85 via-charcoal-950/30 to-transparent" />

      {/* Animated teal accent lines */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 200 }}
        transition={{ delay: 1.2, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-[15%] right-[12%] w-px bg-gradient-to-b from-coral-400/40 to-transparent hidden lg:block"
      />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ delay: 1.5, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-[45%] right-[18%] h-px bg-gradient-to-r from-coral-400/30 to-transparent hidden lg:block"
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: fadeOut }}
        className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-8 max-w-[1400px] mx-auto"
      >
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="h-px bg-coral-400"
            />
            <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
              Northwest Indiana &amp; Chicagoland
            </span>
          </motion.div>

          {/* Display headline */}
          <div className="overflow-hidden mb-3">
            <motion.h1
              className="font-display text-cream-50 leading-[0.92] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              {'Commercial'.split('').map((char, i) => (
                <motion.span
                  key={`c-${i}`}
                  className="inline-block"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.5 + i * 0.03,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-3">
            <motion.h1
              className="font-display text-cream-50 leading-[0.92] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              {'Real Estate'.split('').map((char, i) => (
                <motion.span
                  key={`r-${i}`}
                  className="inline-block"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.8 + i * 0.03,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10">
            <motion.h1
              className="font-display leading-[0.92] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              {'Done Right'.split('').map((char, i) => (
                <motion.span
                  key={`d-${i}`}
                  className="inline-block text-coral-400 coral-glow-text"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.1 + i * 0.03,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-lg md:text-xl text-charcoal-300 max-w-xl leading-relaxed mb-10 font-light"
          >
            Full-service brokerage for office, retail, industrial, multifamily,
            and land. Strategic guidance rooted in stewardship.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-wrap gap-4"
          >
            <MagneticButton>
              <Link
                href="/properties"
                className="group inline-flex items-center gap-3 bg-coral-400 hover:bg-coral-300 text-charcoal-950 px-8 py-4 text-sm tracking-[0.15em] uppercase font-semibold transition-all duration-500 hover:shadow-lg hover:shadow-coral-400/20"
              >
                View Properties
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 border border-cream-50/20 text-cream-100 hover:border-coral-400/50 hover:text-coral-400 px-8 py-4 text-sm tracking-[0.15em] uppercase font-semibold transition-all duration-500"
              >
                Connect With Us
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* DATA PLATE — bottom-right, real proof of work */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-28 right-6 lg:right-8 z-20 hidden md:block"
      >
        <Link
          href={`/properties/${slide.slug}`}
          className="block group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.slug}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="glass border-l-2 border-coral-400 px-5 py-4 max-w-[320px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] tracking-[0.25em] text-coral-400 uppercase">
                  {slide.status} · {slide.year}
                </span>
              </div>
              <div className="text-cream-50 text-sm font-medium leading-tight mb-1">
                {slide.address}
              </div>
              <div className="font-mono text-[11px] text-charcoal-400 tracking-wider mb-3">
                {slide.city.toUpperCase()}, {slide.state} · {slide.type.toUpperCase()}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-cream-50/10">
                <span className="font-mono text-base text-coral-400 font-semibold">
                  {slide.priceLabel}
                </span>
                <span className="font-mono text-[11px] text-charcoal-500">
                  {slide.size}
                </span>
              </div>
              {slide.outcome && (
                <div className="text-[11px] text-charcoal-400 mt-3 italic leading-snug">
                  &ldquo;{slide.outcome}&rdquo;
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Link>

        {/* Slide indicators */}
        <div className="flex items-center gap-2 mt-4">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group relative h-px overflow-hidden"
              style={{ width: 32 }}
            >
              <span className="absolute inset-0 bg-cream-50/20" />
              <motion.span
                key={`${active}-${i}`}
                initial={{ scaleX: i === active ? 0 : 0 }}
                animate={{ scaleX: i === active ? 1 : 0 }}
                transition={{
                  duration: i === active ? SLIDE_MS / 1000 : 0,
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-coral-400 origin-left"
              />
            </button>
          ))}
        </div>
      </motion.div>

      {/* Marquee */}
      <div className="absolute bottom-0 left-0 right-0 bg-charcoal-950/90 border-t border-white/5 py-4 z-20">
        <Marquee
          items={['Office', 'Retail', 'Industrial', 'Multifamily', 'Land', 'Mixed-Use', 'Investment Sales', 'Consulting']}
          className="text-[11px] tracking-[0.25em] uppercase text-charcoal-500 font-mono"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal-500 font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-coral-400/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}
