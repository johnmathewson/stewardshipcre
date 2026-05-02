'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'

const SERVICES = [
  {
    number: '01',
    title: 'Brokerage',
    description: 'Expert representation for buyers, sellers, landlords, and tenants across all commercial property types.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Investment Sales',
    description: 'Data-driven investment analysis, cap rate evaluation, and strategic disposition for maximum returns.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Consulting',
    description: 'Market analysis, site selection, highest-and-best-use studies, and strategic planning for your portfolio.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Property Management',
    description: 'Comprehensive asset management, tenant relations, lease administration, and value optimization.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 3.18.14-5.994L2.423 8.35l5.99-.95L11.42 2l2.99 5.4 5.99.95-3.752 4.006.14 5.994-5.384-3.18z" />
      </svg>
    ),
  },
]

export function ServicesPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '5%'])

  return (
    <section ref={ref} className="relative py-section overflow-hidden">
      {/* Background */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-[-5%] bg-charcoal-950"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(224,122,95,0.04),transparent_60%)]" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-coral-400" />
              <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                What We Do
              </span>
            </div>
            <h2
              className="font-heading text-cream-50"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Full-Service CRE
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-end"
          >
            <p className="text-charcoal-400 text-lg leading-relaxed">
              From acquisition to disposition, we provide the strategic guidance
              your commercial real estate needs demand. Every service, one firm.
            </p>
          </motion.div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-charcoal-800/50">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="group bg-charcoal-950 p-10 md:p-12 relative overflow-hidden hover:bg-charcoal-900/50 transition-colors duration-700 cursor-pointer"
            >
              {/* Hover accent line */}
              <div className="absolute top-0 left-0 w-0 h-px bg-coral-400 group-hover:w-full transition-all duration-700" />

              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-xs text-charcoal-600 tracking-wider">{service.number}</span>
                <div className="text-charcoal-600 group-hover:text-coral-400 transition-colors duration-500">
                  {service.icon}
                </div>
              </div>

              <h3 className="font-heading text-xl md:text-2xl tracking-[0.08em] uppercase text-cream-100 mb-4 group-hover:text-coral-400 transition-colors duration-500">
                {service.title}
              </h3>
              <p className="text-sm text-charcoal-400 leading-relaxed max-w-sm">
                {service.description}
              </p>

              {/* Hover arrow */}
              <div className="mt-8 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <svg className="w-5 h-5 text-coral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Button href="/services" variant="outline">
            All Services
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}
