import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import VaultView from '@/components/vault-view'

export const metadata: Metadata = {
  title: 'Property Vault · Stewardship CRE',
  robots: { index: false, follow: false },
}

export default function VaultPage({ params }: { params: { slug: string } }) {
  return (
    <section className="bg-charcoal-950 min-h-screen pt-32 pb-24">
      <Container className="max-w-[860px]">
        <VaultView slug={params.slug} />
      </Container>
    </section>
  )
}
