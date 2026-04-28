'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { MagneticButton } from '@/components/motion/MagneticButton'

const INTENT = ['Buy', 'Lease', 'Sell', 'Invest'] as const
const TYPE = ['Office', 'Retail', 'Industrial', 'Multifamily', 'Land', 'Mixed-Use', 'Any'] as const
const LOCATION = [
  'Northwest Indiana',
  'Chicagoland',
  'Valparaiso, IN',
  'Crown Point, IN',
  'Merrillville, IN',
  'Michigan City, IN',
  'Joliet, IL',
] as const

export function PropertySearch() {
  const router = useRouter()
  const [intent, setIntent] = useState<(typeof INTENT)[number]>('Buy')
  const [type, setType] = useState<(typeof TYPE)[number]>('Office')
  const [location, setLocation] = useState<(typeof LOCATION)[number]>('Northwest Indiana')

  const handleSearch = () => {
    const params = new URLSearchParams({
      intent: intent.toLowerCase(),
      type: type.toLowerCase(),
      location,
    })
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative bg-charcoal-950 border-t border-charcoal-800/60">
      <Container className="py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-4 lg:gap-6 flex-wrap lg:flex-nowrap"
        >
          {/* Eyebrow */}
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral-400 hidden md:block whitespace-nowrap">
            Find a Property
          </span>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-px bg-charcoal-800/60 w-full">
            {/* Intent */}
            <SelectField
              label="I'm looking to"
              value={intent}
              onChange={(v) => setIntent(v as typeof intent)}
              options={[...INTENT]}
            />
            {/* Type */}
            <SelectField
              label="Property type"
              value={type}
              onChange={(v) => setType(v as typeof type)}
              options={[...TYPE]}
            />
            {/* Location */}
            <SelectField
              label="Location"
              value={location}
              onChange={(v) => setLocation(v as typeof location)}
              options={[...LOCATION]}
            />
          </div>

          {/* CTA */}
          <MagneticButton>
            <button
              onClick={handleSearch}
              className="group inline-flex items-center gap-3 bg-coral-400 hover:bg-coral-300 text-charcoal-950 px-7 py-4 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-500 whitespace-nowrap"
            >
              Search
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </MagneticButton>
        </motion.div>
      </Container>
    </section>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <label className="bg-charcoal-900 px-5 py-3 cursor-pointer block hover:bg-charcoal-900/80 transition-colors duration-300 group">
      <span className="block font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-1 group-hover:text-coral-400 transition-colors duration-300">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full bg-transparent text-cream-100 text-sm font-medium focus:outline-none pr-8 cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-charcoal-900 text-cream-100">
              {o}
            </option>
          ))}
        </select>
        <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-charcoal-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </label>
  )
}
