'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { Marquee } from '@/components/motion/Marquee'

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-charcoal-950">
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-[-10%] w-[120%] h-[120%]"
        style={{ y: bgY, scale }}
      >
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop"
          alt="Modern commercial building"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/70 via-charcoal-950/40 to-charcoal-950/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 via-transparent to-transparent" />

      {/* Animated teal accent lines */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 200 }}
        transition={{ delay: 1.5, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-[15%] right-[12%] w-px bg-gradient-to-b from-teal-400/40 to-transparent hidden lg:block"
      />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ delay: 1.8, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute top-[45%] right-[18%] h-px bg-gradient-to-r from-teal-400/30 to-transparent hidden lg:block"
      />
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 120 }}
        transition={{ delay: 2, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-[25%] left-[6%] w-px bg-gradient-to-b from-transparent via-teal-400/20 to-transparent hidden lg:block"
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity }}
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
              className="h-px bg-teal-400"
            />
            <span className="text-teal-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
              Northwest Indiana &amp; Chicagoland
            </span>
          </motion.div>

          {/* Main Headline — Character stagger */}
          <div className="overflow-hidden mb-4">
            <motion.h1
              className="font-heading text-cream-50 leading-[0.92] tracking-tight"
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
          <div className="overflow-hidden mb-4">
            <motion.h1
              className="font-heading text-cream-50 leading-[0.92] tracking-tight"
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
              className="font-heading leading-[0.92] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              {'Done Right'.split('').map((char, i) => (
                <motion.span
                  key={`d-${i}`}
                  className="inline-block text-teal-400 teal-glow-text"
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
                className="group inline-flex items-center gap-3 bg-teal-400 hover:bg-teal-300 text-charcoal-950 px-8 py-4 text-sm tracking-[0.15em] uppercase font-semibold transition-all duration-500 hover:shadow-lg hover:shadow-teal-400/20"
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
                className="inline-flex items-center gap-3 border border-cream-50/20 text-cream-100 hover:border-teal-400/50 hover:text-teal-400 px-8 py-4 text-sm tracking-[0.15em] uppercase font-semibold transition-all duration-500"
              >
                Connect With Us
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Stats row — bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-28 left-6 right-6 lg:left-8 lg:right-8 max-w-[1400px]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/10">
            {[
              { value: '10+', label: 'Years Experience' },
              { value: '$50M+', label: 'Transaction Volume' },
              { value: '200+', label: 'Deals Closed' },
              { value: 'NWI', label: 'Market Focus' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + i * 0.15 }}
              >
                <div className="font-mono text-2xl md:text-3xl text-teal-400 font-bold">
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-[0.15em] uppercase text-charcoal-500 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Marquee Bar */}
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
        <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal-500">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-teal-400/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}
