import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the Stewardship CRE team — experienced commercial real estate professionals serving Northwest Indiana.',
}

// `published: false` hides a member from the public site without deleting
// the record — flip back to true when ready to introduce them publicly.
const TEAM = [
  {
    slug: 'john-mathewson',
    name: 'John Mathewson',
    title: 'Founder & Principal Broker',
    bio: 'Founder of Stewardship Asset Group with deep expertise in commercial brokerage, investment analysis, and property management across Northwest Indiana.',
    specialties: ['Office', 'Industrial', 'Land', 'Investment Sales'],
    deals: 200,
    volume: '$50M+',
    image: '/team/john.jpg',
    published: true,
  },
  {
    slug: 'amanda-mathewson',
    name: 'Amanda Mathewson',
    title: 'Director of Strategy',
    bio: 'Strategic leader driving growth initiatives and client relationships. Specializes in retail and multifamily market positioning.',
    specialties: ['Retail', 'Multifamily', 'Strategy'],
    deals: 85,
    volume: '$20M+',
    image: '/team/amanda.jpg',
    published: false,
  },
  {
    slug: 'tim-operations',
    name: 'Tim Peters',
    title: 'Operations Manager',
    bio: 'Oversees day-to-day property management operations, tenant relations, and maintenance coordination across the portfolio.',
    specialties: ['Property Management', 'Operations'],
    deals: 50,
    volume: '$10M+',
    image: '/team/tim.jpg',
    published: false,
  },
].filter((m) => m.published)

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal-950 pt-32 pb-20">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-coral-500" />
              <span className="text-coral-500 text-xs tracking-[0.3em] uppercase font-semibold">Our People</span>
            </div>
            <h1
              className="font-heading text-cream-100 mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              The <span className="text-coral-500">Team</span>
            </h1>
            <p className="text-xl text-charcoal-400 max-w-xl leading-relaxed">
              Experienced professionals committed to stewarding your commercial
              real estate investments with integrity and expertise.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Team Grid */}
      <section className="py-section bg-cream-100">
        <Container>
          <StaggerChildren className="space-y-16">
            {TEAM.map((member, i) => (
              <StaggerItem key={member.slug}>
                <Link href={`/team/${member.slug}`} className="block group">
                  <div className={`grid lg:grid-cols-5 gap-8 items-center ${i % 2 === 1 ? '' : ''}`}>
                    {/* Photo */}
                    <div className={`lg:col-span-2 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                      <div className="relative h-96 overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 to-transparent" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className={`lg:col-span-3 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <h2 className="font-heading text-xl tracking-[0.1em] uppercase text-charcoal-900 group-hover:text-coral-500 transition-colors mb-1">
                        {member.name}
                      </h2>
                      <p className="text-coral-500 text-sm mb-4">{member.title}</p>
                      <p className="text-charcoal-600 leading-relaxed mb-6 max-w-lg">{member.bio}</p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {member.specialties.map((s) => (
                          <span key={s} className="text-[10px] tracking-[0.1em] uppercase text-coral-500 bg-coral-50 px-3 py-1 border border-coral-200">
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex gap-8 pt-4 border-t border-cream-300">
                        <div>
                          <span className="font-mono text-2xl text-charcoal-900 font-bold">{member.deals}+</span>
                          <p className="text-xs text-charcoal-500 tracking-[0.1em] uppercase mt-1">Deals Closed</p>
                        </div>
                        <div>
                          <span className="font-mono text-2xl text-charcoal-900 font-bold">{member.volume}</span>
                          <p className="text-xs text-charcoal-500 tracking-[0.1em] uppercase mt-1">Transaction Volume</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      <CTASection />
    </>
  )
}
