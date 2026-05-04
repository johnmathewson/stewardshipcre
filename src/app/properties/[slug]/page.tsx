import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/motion/FadeIn'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  fetchListingBySlug,
  primaryImageUrl,
  type Listing,
} from '@/lib/supabase'
import PageViewTracker from '@/components/page-view-tracker'

export const revalidate = 30

interface Props {
  // Next.js 16 made params async — must be awaited inside the function body.
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const listing = await fetchListingBySlug(slug)
  if (!listing) return { title: 'Property Not Found · Stewardship CRE' }
  const title = listing.headline || listing.name || listing.address || 'Listing'
  const location = listing.locationLabel || ''
  const hero = primaryImageUrl(listing)
  return {
    title: `${title}${location ? ` — ${location}` : ''} · Stewardship CRE`,
    description:
      listing.description?.slice(0, 160) ||
      `Commercial real estate listing${location ? ` in ${location}` : ''}.`,
    openGraph: {
      title,
      description: listing.description?.slice(0, 200) || '',
      images: hero ? [hero] : [],
    },
  }
}

function statusVariant(status: string | null | undefined): 'teal' | 'navy' | 'default' {
  if (!status) return 'default'
  const s = status.toLowerCase()
  if (s.includes('lease') || s.includes('coming')) return 'teal'
  if (s.includes('contract') || s.includes('pending')) return 'navy'
  return 'default'
}

function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return ''
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function formatPercent(n: number | null | undefined): string {
  if (n === null || n === undefined) return ''
  return `${n.toFixed(2).replace(/\.00$/, '')}%`
}

function formatCurrency(n: number | null | undefined): string {
  if (n === null || n === undefined) return ''
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.18em] uppercase text-charcoal-500 mb-1">{label}</div>
      <div className="font-mono text-sm text-charcoal-900 font-semibold">{value}</div>
    </div>
  )
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params
  const listing = await fetchListingBySlug(slug)
  if (!listing) notFound()

  const title = listing.headline || listing.name || listing.address || 'Listing'
  const location = listing.locationLabel || ''
  const heroImage = primaryImageUrl(listing)

  // Defensive: jsonb could come back as null, an array, or (in malformed
  // legacy rows) a non-array. Normalize before sorting.
  const safeImages = Array.isArray(listing.images) ? listing.images : []
  const galleryImages = safeImages
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(1) // hero is image 0

  const stats: Array<{ label: string; value: string }> = []
  if (listing.sizeLabel) stats.push({ label: 'Building Size', value: listing.sizeLabel })
  if (listing.acreage) stats.push({ label: 'Lot Size', value: `${listing.acreage} AC` })
  if (listing.year_built) stats.push({ label: 'Year Built', value: String(listing.year_built) })
  if (listing.occupancy_pct !== null && listing.occupancy_pct !== undefined)
    stats.push({ label: 'Occupancy', value: formatPercent(listing.occupancy_pct) })
  if (listing.cap_rate !== null && listing.cap_rate !== undefined)
    stats.push({ label: 'Cap Rate', value: formatPercent(listing.cap_rate) })
  if (listing.noi) stats.push({ label: 'NOI', value: formatCurrency(listing.noi) })
  if (listing.price_per_sf) stats.push({ label: 'Price / SF', value: `$${formatNumber(listing.price_per_sf)}` })
  if (listing.parking_spaces) stats.push({ label: 'Parking', value: `${formatNumber(listing.parking_spaces)} spaces` })
  if (listing.zoning) stats.push({ label: 'Zoning', value: listing.zoning })

  const inquirePath = `/properties/${slug}/inquire`

  return (
    <>
      <PageViewTracker slug={slug} />
      {/* Hero / breadcrumb / title */}
      <section className="pt-32 pb-12 bg-charcoal-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(224,122,95,0.06),transparent_60%)]" />
        <Container className="relative z-10">
          <FadeIn>
            <div className="mb-5">
              <Link
                href="/properties"
                className="text-xs tracking-[0.2em] uppercase text-charcoal-400 hover:text-coral-400 transition-colors"
              >
                ← All Listings
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {listing.statusLabel && (
                <Badge variant={statusVariant(listing.statusLabel)}>{listing.statusLabel}</Badge>
              )}
              {listing.typeLabel && <Badge>{listing.typeLabel}</Badge>}
            </div>

            <h1
              className="font-heading text-cream-100 mb-3"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {title}
            </h1>

            {(listing.address || location) && (
              <p className="text-charcoal-400 text-sm mb-1">
                {[listing.address, location].filter(Boolean).join(' · ')}
              </p>
            )}

            <div className="font-mono text-2xl text-coral-400 font-semibold mt-4">
              {listing.priceLabel}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Hero image */}
      <section className="bg-charcoal-950 pb-12">
        <Container>
          <div className="relative w-full overflow-hidden rounded-sm bg-charcoal-800" style={{ aspectRatio: '16/9' }}>
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-charcoal-800 to-charcoal-900">
                <span className="text-charcoal-500 text-xs tracking-[0.2em] uppercase">Photos coming soon</span>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Body */}
      <section className="py-section-sm bg-cream-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left col: stats + description + highlights + gallery */}
            <div className="lg:col-span-2 space-y-8">
              {stats.length > 0 && (
                <Card className="p-6">
                  <h2 className="font-heading text-xs tracking-[0.2em] uppercase text-coral-500 mb-4">
                    Key Details
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5">
                    {stats.map((stat) => (
                      <StatBlock key={stat.label} label={stat.label} value={stat.value} />
                    ))}
                  </div>
                </Card>
              )}

              {listing.description && (
                <Card className="p-6">
                  <h2 className="font-heading text-xs tracking-[0.2em] uppercase text-coral-500 mb-4">
                    Overview
                  </h2>
                  <p className="text-charcoal-700 text-sm leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </Card>
              )}

              {Array.isArray(listing.highlights) && listing.highlights.length > 0 && (
                <Card className="p-6">
                  <h2 className="font-heading text-xs tracking-[0.2em] uppercase text-coral-500 mb-4">
                    Highlights
                  </h2>
                  <ul className="space-y-2">
                    {listing.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 text-sm text-charcoal-700">
                        <span className="text-coral-400 mt-1 flex-shrink-0">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {galleryImages.length > 0 && (
                <Card className="p-6">
                  <h2 className="font-heading text-xs tracking-[0.2em] uppercase text-coral-500 mb-4">
                    Photos
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {galleryImages.map((img, i) => (
                      <div
                        key={img.url}
                        className="relative overflow-hidden rounded-sm bg-charcoal-200"
                        style={{ aspectRatio: '4/3' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.alt || `${title} photo ${i + 2}`}
                          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right col: contact CTA */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                <Card className="p-6">
                  <h2 className="font-heading text-xs tracking-[0.2em] uppercase text-coral-500 mb-3">
                    Interested?
                  </h2>
                  <p className="text-charcoal-700 text-sm leading-relaxed mb-5">
                    Get a complete information package — financials, floor plans, due diligence, and tour scheduling.
                  </p>

                  <Button href={inquirePath} className="w-full">
                    Request Information
                  </Button>
                  <p className="text-[10.5px] text-charcoal-500 mt-2 text-center leading-relaxed">
                    Quick form + brief NDA, then full financials &amp; due diligence.
                  </p>

                  <div className="mt-4 pt-4 border-t border-cream-300 text-xs text-charcoal-500 space-y-1">
                    <div className="font-semibold text-charcoal-700">John Mathewson</div>
                    <div>Stewardship CRE</div>
                    <a
                      href="mailto:inquiries@stewardshipcre.com"
                      className="text-coral-500 hover:underline"
                    >
                      inquiries@stewardshipcre.com
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
