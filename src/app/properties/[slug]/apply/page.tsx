import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { fetchListingBySlug } from '@/lib/supabase'
import LeaseApplicationForm from '@/components/lease-application-form'

export const revalidate = 30

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const listing = await fetchListingBySlug(slug)
  return {
    title: listing
      ? `Lease Application — ${listing.headline || listing.name} · Stewardship CRE`
      : 'Lease Application · Stewardship CRE',
    robots: { index: false, follow: false },
  }
}

export default async function ApplyPage({ params }: Props) {
  const { slug } = await params
  const listing = await fetchListingBySlug(slug)
  if (!listing) notFound()

  return (
    <section className="bg-charcoal-950 min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(224,122,95,0.06),transparent_60%)]" />
      <Container className="relative z-10 max-w-[760px]">
        <LeaseApplicationForm
          propertySlug={slug}
          propertyName={listing.headline || listing.name || listing.address || 'this property'}
          propertyLocation={[listing.city, listing.state].filter(Boolean).join(', ')}
        />
      </Container>
    </section>
  )
}
