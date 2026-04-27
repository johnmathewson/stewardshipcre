import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Full-service commercial real estate solutions — brokerage, investment sales, consulting, and property management.',
}

const SERVICES = [
  {
    id: 'brokerage',
    title: 'Brokerage',
    subtitle: 'Buy, Sell & Lease',
    description: 'Expert representation for commercial real estate transactions across all property types. Whether you are acquiring your first investment property or disposing of a portfolio, our team provides strategic guidance through every stage of the process.',
    features: [
      'Buyer & Seller Representation',
      'Tenant & Landlord Representation',
      'Market Pricing & Positioning',
      'Transaction Management',
      'Due Diligence Coordination',
      'Contract Negotiation',
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    id: 'investment',
    title: 'Investment Sales',
    subtitle: 'Maximize Returns',
    description: 'Data-driven investment analysis and disposition strategies designed to maximize value. We evaluate cap rates, NOI, cash flow projections, and market comparables to position your investment for optimal returns.',
    features: [
      'Investment Property Analysis',
      'Cap Rate & NOI Evaluation',
      'Cash Flow Modeling',
      'Portfolio Optimization',
      'Disposition Strategy',
      '1031 Exchange Coordination',
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    id: 'consulting',
    title: 'Consulting',
    subtitle: 'Strategic Guidance',
    description: 'Market analysis, site selection, and strategic planning to support your commercial real estate decisions. Our consulting practice delivers actionable intelligence for developers, investors, and business owners.',
    features: [
      'Market Analysis & Research',
      'Site Selection & Feasibility',
      'Highest & Best Use Studies',
      'Zoning & Land Use Analysis',
      'Competitive Market Surveys',
      'Development Advisory',
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    id: 'management',
    title: 'Property Management',
    subtitle: 'Hands-On Operations',
    description: 'Comprehensive property management that maximizes asset value while maintaining tenant satisfaction. We handle the operational details so you can focus on your investment strategy.',
    features: [
      'Tenant Relations & Communication',
      'Lease Administration',
      'Rent Collection & Accounting',
      'Maintenance Coordination',
      'Vendor Management',
      'Financial Reporting',
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 3.18.14-5.994L2.423 8.35l5.99-.95L11.42 2l2.99 5.4 5.99.95-3.752 4.006.14 5.994-5.384-3.18z" />
      </svg>
    ),
  },
]

const PROPERTY_TYPES = [
  { name: 'Office', description: 'Class A, B, and C office buildings, co-working spaces, medical offices' },
  { name: 'Retail', description: 'Shopping centers, strip malls, standalone retail, restaurant spaces' },
  { name: 'Industrial', description: 'Warehouses, distribution centers, flex space, manufacturing' },
  { name: 'Multifamily', description: 'Apartment complexes, mixed-use residential, student housing' },
  { name: 'Land', description: 'Development sites, agricultural, infill, entitled parcels' },
  { name: 'Mixed-Use', description: 'Properties combining retail, office, and residential components' },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal-950 pt-32 pb-20">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold">Services</span>
            </div>
            <h1
              className="font-heading text-cream-100 mb-6 max-w-3xl"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              Full-Spectrum <span className="text-gold-500">CRE Solutions</span>
            </h1>
            <p className="text-xl text-charcoal-400 max-w-2xl leading-relaxed">
              From acquisition to disposition, leasing to management — we provide
              strategic guidance across the entire commercial real estate lifecycle.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Services Detail */}
      <section className="py-section bg-cream-100">
        <Container>
          <div className="space-y-20">
            {SERVICES.map((service, i) => (
              <FadeIn key={service.id} delay={0.1}>
                <div id={service.id} className="scroll-mt-24">
                  <div className={`grid lg:grid-cols-2 gap-12 items-start ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                      <div className="text-gold-500 mb-4">{service.icon}</div>
                      <span className="text-xs tracking-[0.2em] uppercase text-charcoal-500 mb-2 block">
                        {service.subtitle}
                      </span>
                      <h2 className="font-heading text-charcoal-900 mb-4" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                        {service.title}
                      </h2>
                      <p className="text-charcoal-600 leading-relaxed mb-8">
                        {service.description}
                      </p>
                      <Button href="/contact" size="sm" className="bg-charcoal-800 text-cream-100 hover:bg-charcoal-700">
                        Inquire About {service.title}
                      </Button>
                    </div>
                    <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                      <Card className="p-8">
                        <h4 className="font-heading text-xs tracking-[0.15em] uppercase text-charcoal-600 mb-6">
                          Capabilities
                        </h4>
                        <ul className="space-y-4">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-gold-500 rotate-45 mt-2 shrink-0" />
                              <span className="text-charcoal-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Property Types */}
      <section className="py-section bg-charcoal-950">
        <Container>
          <FadeIn>
            <div className="text-center mb-12">
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold block mb-4">
                Property Types
              </span>
              <h2 className="font-heading text-cream-100 mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                We Handle It All
              </h2>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPERTY_TYPES.map((type) => (
              <StaggerItem key={type.name}>
                <div className="border border-charcoal-800 p-6 hover:border-gold-500/30 transition-all duration-500 group">
                  <h3 className="font-heading text-sm tracking-[0.15em] uppercase text-cream-100 group-hover:text-gold-500 transition-colors mb-2">
                    {type.name}
                  </h3>
                  <p className="text-sm text-charcoal-500">{type.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      <CTASection />
    </>
  )
}
