import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import LeaseApplicationForm from '@/components/lease-application-form'

export const metadata: Metadata = {
  title: 'Commercial Lease Application',
  description: 'Apply to lease commercial space through Stewardship CRE. Submit your application and financial statements online.',
}

export default function LeaseApplicationPage() {
  return (
    <section className="bg-charcoal-950 min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(224,122,95,0.06),transparent_60%)]" />
      <Container className="relative z-10 max-w-[760px]">
        <LeaseApplicationForm />
      </Container>
    </section>
  )
}
