import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { fetchOwnerDashboard } from '@/lib/owner-client'
import OwnerDashboard from '@/components/owner-dashboard'

export const metadata: Metadata = {
  title: 'Owner Dashboard · Stewardship CRE',
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ token: string }>
}

export default async function OwnerPage({ params }: Props) {
  const { token } = await params
  const result = await fetchOwnerDashboard(token)

  if (!result.ok) {
    return (
      <section className="bg-charcoal-950 min-h-screen pt-32 pb-24">
        <Container className="max-w-[640px] text-center">
          <div className="text-[40px] mb-3 opacity-30">🔒</div>
          <h1 className="font-heading text-2xl text-cream-100 mb-3">
            {result.status === 401 ? 'Link expired or revoked' : 'Could not load dashboard'}
          </h1>
          <p className="text-charcoal-400 text-sm mb-6">
            {result.status === 401
              ? 'This dashboard link is no longer active. Reach out to John at Stewardship CRE for a fresh one.'
              : `Something went wrong: ${result.error}`}
          </p>
          <a
            href="mailto:inquiries@stewardshipcre.com?subject=Need%20a%20fresh%20dashboard%20link"
            className="text-coral-400 hover:underline text-sm"
          >
            inquiries@stewardshipcre.com
          </a>
        </Container>
      </section>
    )
  }

  return (
    <section className="bg-charcoal-950 min-h-screen pt-24 pb-24">
      <Container className="max-w-[1100px]">
        <OwnerDashboard data={result.data} />
      </Container>
    </section>
  )
}
