import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import VaultView from '@/components/vault-view'

export const metadata: Metadata = {
  title: 'Property Vault · Stewardship CRE',
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function VaultPage({ params }: Props) {
  const { slug } = await params
  return (
    <section className="bg-charcoal-950 min-h-screen pt-32 pb-24">
      <Container className="max-w-[860px]">
        <VaultView slug={slug} />
      </Container>
    </section>
  )
}
