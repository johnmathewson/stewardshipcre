'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { MagneticButton } from '@/components/motion/MagneticButton'
import type { Listing } from '@/lib/supabase'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusVariant(status: string | null | undefined): 'teal' | 'navy' | 'default' {
  if (!status) return 'default'
  const s = status.toLowerCase()
  if (s.includes('lease') || s.includes('coming')) return 'teal'
  if (s.includes('contract') || s.includes('pending')) return 'navy'
  return 'default'
}

// Get a display image: use stored image URL if available, otherwise a deterministic Unsplash fallback
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1280&fit=crop',
  'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?w=1920&h=1280&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1280&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1280&fit=crop',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&h=1280&fit=crop',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1280&fit=crop',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=1280&fit=crop',
]

function getImage(listing: Listing & { _image?: string }, index: number): string {
  return listing._image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  listings: (Listing & { _image?: string })[]
}

export function FeaturedListingsClient({ listings }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const headerY = useTransform(scrollYProgress, [0, 0.5], [60, 0])

  if (listings.length === 0) return null

  const FEATURE = listings[0]
  const SUPPORTING = listings.slice(1, 7)

  return (
    <section ref={sectionRef} className="py-section bg-charcoal-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,122,95,0.03),transparent_70%)]" />
      <Container className="relative z-10">
        {/* Section header */}
        <motion.div
          style={{ y: headerY }}
          className="flex items-end justify-between mb-12 flex-wrap gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-coral-400" />
              <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                Featured · Active Listings
              </span>
            </div>
            <h2
              className="font-display text-cream-50"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              On the Market
            </h2>
          </div>
          <Button href="/properties" variant="outline" size="sm">
            View All ({listings.length})
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </motion.div>

        {/* HERO LISTING */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-6"
        >
          <Link href={`/properties/${FEATURE.slug}`} className="block group">
            <div className="relative bg-charcoal-900 border border-charcoal-800 hover:border-coral-400/30 transition-all duration-700 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Image */}
                <div className="lg:col-span-3 relative h-80 md:h-96 lg:h-[520px] overflow-hidden">
                  <ImageReveal
                    src={getImage(FEATURE, 0)}
                    alt={FEATURE.address || FEATURE.name || 'Featured listing'}
                    className="absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                    parallaxAmount={0.08}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-950/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <Badge variant={statusVariant(FEATURE.statusLabel)}>{FEATURE.statusLabel}</Badge>
                    <Badge>{FEATURE.typeLabel}</Badge>
                  </div>
                  {/* Address overlay (mobile) */}
                  <div className="absolute bottom-6 left-6 right-6 lg:hidden">
                    <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-coral-400 mb-1">
                      {FEATURE.city?.toUpperCase()}, {FEATURE.state}
                    </p>
                    <h3 className="font-display text-cream-50 text-xl tracking-wide">
                      {FEATURE.name || FEATURE.address}
                    </h3>
                  </div>
                </div>

                {/* Details panel */}
                <div className="lg:col-span-2 p-8 md:p-10 lg:p-12 flex flex-col justify-between gap-8">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral-400 mb-3 hidden lg:block">
                      {FEATURE.city?.toUpperCase()}, {FEATURE.state}
                    </p>
                    <h3
                      className="font-display text-cream-50 leading-[1.05] mb-6 tracking-wide hidden lg:block"
                      style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)' }}
                    >
                      {FEATURE.name || FEATURE.address}
                    </h3>

                    <div className="grid grid-cols-2 gap-px bg-charcoal-800/80 mb-8">
                      <div className="bg-charcoal-900 px-5 py-4">
                        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-1.5">Price</p>
                        <p className="font-mono text-lg text-coral-400 font-semibold">{FEATURE.priceLabel}</p>
                      </div>
                      <div className="bg-charcoal-900 px-5 py-4">
                        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-1.5">Size</p>
                        <p className="font-mono text-lg text-cream-100">{FEATURE.sizeLabel || '—'}</p>
                      </div>
                      <div className="bg-charcoal-900 px-5 py-4">
                        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-1.5">Type</p>
                        <p className="text-sm text-cream-100">{FEATURE.typeLabel}</p>
                      </div>
                      <div className="bg-charcoal-900 px-5 py-4">
                        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-1.5">Status</p>
                        <p className="text-sm text-cream-100">{FEATURE.statusLabel}</p>
                      </div>
                      {FEATURE.cap_rate && (
                        <div className="bg-charcoal-900 px-5 py-4 col-span-2">
                          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-charcoal-500 mb-1.5">Cap Rate</p>
                          <p className="font-mono text-lg text-coral-400 font-semibold">{FEATURE.cap_rate}%</p>
                        </div>
                      )}
                    </div>

                    {FEATURE.description && (
                      <p className="text-sm text-charcoal-400 italic leading-relaxed border-l-2 border-coral-400/40 pl-4 line-clamp-3">
                        &ldquo;{FEATURE.description}&rdquo;
                      </p>
                    )}
                  </div>

                  <div>
                    <MagneticButton>
                      <span className="inline-flex items-center gap-3 bg-coral-400 group-hover:bg-coral-300 text-charcoal-950 px-6 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold transition-all duration-500">
                        View Listing
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </MagneticButton>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* SUPPORTING GRID */}
        {SUPPORTING.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-charcoal-800/50">
            {SUPPORTING.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="bg-charcoal-900"
              >
                <Link href={`/properties/${item.slug}`} className="block group">
                  <div className="relative h-48 overflow-hidden">
                    <ImageReveal
                      src={getImage(item, i + 1)}
                      alt={item.address || item.name || 'Listing'}
                      className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                      parallaxAmount={0.04}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/30 to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant={statusVariant(item.statusLabel)}>{item.statusLabel}</Badge>
                    </div>
                  </div>
                  <div className="px-5 py-5">
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-coral-400/80 mb-1.5">
                      {item.city?.toUpperCase()}, {item.state} · {item.typeLabel}
                    </p>
                    <h4 className="text-sm text-cream-100 font-medium mb-3 group-hover:text-coral-400 transition-colors duration-500 line-clamp-2">
                      {item.name || item.address}
                    </h4>
                    <div className="flex items-center justify-between pt-3 border-t border-charcoal-800/80">
                      <span className="font-mono text-sm text-coral-400 font-semibold">
                        {item.priceLabel}
                      </span>
                      <span className="font-mono text-[11px] text-charcoal-500">
                        {item.sizeLabel || '—'}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
