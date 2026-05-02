'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { MagneticButton } from '@/components/motion/MagneticButton'

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={ref} className="relative py-section overflow-hidden">
      {/* Parallax background image */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-[-20%] w-[140%] h-[140%]"
      >
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
          alt="Modern office space"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-charcoal-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,122,95,0.08),transparent_60%)]" />

      {/* Border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coral-400/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-coral-400/30 to-transparent" />

      <Container className="relative z-10 text-center">
        <motion.div style={{ y: textY }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono block mb-6"
          >
            Ready to Start?
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-cream-50 mb-6 mx-auto max-w-3xl"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Let&apos;s Find Your Next
            <span className="text-coral-400 coral-glow-text"> Opportunity</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-charcoal-300 max-w-xl mx-auto mb-10"
          >
            Whether you&apos;re buying, selling, leasing, or investing — our team
            is ready to guide you with expertise and integrity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton>
              <Button href="/contact" size="lg">
                Schedule a Consultation
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button href="/properties" variant="ghost" size="lg">
                Browse Properties
              </Button>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
