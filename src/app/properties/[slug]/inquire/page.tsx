import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { fetchListingBySlug } from '@/lib/supabase'
import InquireFlow from '@/components/inquire-flow'

export const revalidate = 300

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const listing = await fetchListingBySlug(params.slug)
  return {
    title: listing
      ? `Request Information — ${listing.headline || listing.name} · Stewardship CRE`
      : 'Request Information · Stewardship CRE',
    robots: { index: false, follow: false }, // gated content path; don't index
  }
}

export default async function InquirePage({ params }: { params: { slug: string } }) {
  const listing = await fetchListingBySlug(params.slug)
  if (!listing) notFound()

  return (
    <section className="bg-charcoal-950 min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(224,122,95,0.06),transparent_60%)]" />
      <Container className="relative z-10 max-w-[640px]">
        <InquireFlow
          slug={params.slug}
          propertyName={listing.headline || listing.name || 'Listing'}
          propertyLocation={[listing.city, listing.state].filter(Boolean).join(', ')}
        />
      </Container>
    </section>
  )
}
