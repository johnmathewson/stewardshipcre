import type { Metadata } from 'next'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { CountUp } from '@/components/motion/CountUp'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Stewardship CRE — our mission, values, and commitment to commercial real estate excellence in Northwest Indiana.',
}

const VALUES = [
  {
    title: 'Stewardship',
    description: 'We treat every property and client relationship as a trust to be carefully managed — not just a transaction to close.',
  },
  {
    title: 'Integrity',
    description: 'Transparent communication, honest counsel, and ethical practice in every deal, every time.',
  },
  {
    title: 'Expertise',
    description: 'Deep market knowledge, analytical rigor, and strategic thinking that delivers measurable results.',
  },
  {
    title: 'Partnership',
    description: 'We succeed when you succeed. Our long-term approach means we are invested in your outcomes, not just our fees.',
  },
]

const TIMELINE = [
  { year: '2015', event: 'Stewardship Asset Group founded in Northwest Indiana' },
  { year: '2018', event: 'Expanded into commercial brokerage services' },
  { year: '2020', event: 'Launched property management division' },
  { year: '2023', event: 'Surpassed $50M in total transaction volume' },
  { year: '2026', event: 'Stewardship CRE established as dedicated brokerage brand' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal-950 pt-32 pb-20">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold">About Us</span>
            </div>
            <h1
              className="font-heading text-cream-100 mb-6 max-w-3xl"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              Built on <span className="text-gold-500">Stewardship</span>,
              Driven by Results
            </h1>
            <p className="text-xl text-charcoal-400 max-w-2xl leading-relaxed">
              Stewardship CRE is the brokerage arm of Stewardship Asset Group — a
              full-service commercial real estate firm rooted in the belief that
              managing real estate is an act of stewardship, not speculation.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-section-sm bg-cream-100">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <h2 className="font-heading text-charcoal-900 mb-6" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}>
                Our Mission
              </h2>
              <p className="text-charcoal-600 leading-relaxed mb-4">
                To provide exceptional commercial real estate services that honor
                the trust our clients place in us. We believe that every property
                represents more than square footage — it represents livelihoods,
                communities, and legacies.
              </p>
              <p className="text-charcoal-600 leading-relaxed">
                We approach every engagement with the same care and diligence
                we would apply to our own assets, ensuring that the interests of
                our clients always come first.
              </p>
            </FadeIn>
            <FadeIn delay={0.2} direction="left">
              <div className="relative h-96 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
                  alt="Modern office building"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/30 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-section bg-charcoal-950">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold">Core Values</span>
            </div>
            <h2 className="font-heading text-cream-100 mb-12" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              What Guides Us
            </h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((value) => (
              <StaggerItem key={value.title}>
                <div className="border border-charcoal-800 p-8 hover:border-gold-500/30 transition-colors duration-500">
                  <h3 className="font-heading text-sm tracking-[0.15em] uppercase text-gold-500 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-charcoal-400 leading-relaxed">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-section bg-cream-100">
        <Container narrow>
          <FadeIn>
            <h2 className="font-heading text-charcoal-900 text-center mb-16" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Our Journey
            </h2>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gold-500/20 -translate-x-1/2" />
            {TIMELINE.map((item, i) => (
              <FadeIn key={item.year} delay={i * 0.1} direction={i % 2 === 0 ? 'right' : 'left'}>
                <div className={`flex items-center gap-6 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-16 md:pl-0`}>
                    <span className="font-mono text-2xl text-gold-500 font-bold">{item.year}</span>
                    <p className="text-charcoal-600 mt-1">{item.event}</p>
                  </div>
                  <div className="absolute left-8 md:relative md:left-auto w-4 h-4 bg-gold-500 rotate-45 shrink-0" />
                  <div className="flex-1 hidden md:block" />
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-20 bg-forest-600">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { end: 50, prefix: '$', suffix: 'M+', label: 'Transaction Volume' },
              { end: 200, suffix: '+', label: 'Deals Closed' },
              { end: 15, suffix: '+', label: 'Years Experience' },
              { end: 5, suffix: '', label: 'Property Types Served' },
            ].map((stat) => (
              <div key={stat.label}>
                <CountUp end={stat.end} prefix={stat.prefix} suffix={stat.suffix} className="font-mono text-4xl md:text-5xl font-bold text-cream-100" />
                <p className="text-xs tracking-[0.15em] uppercase text-cream-300/70 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  )
}
