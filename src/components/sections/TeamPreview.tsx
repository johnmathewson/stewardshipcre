'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/Button'
import { ImageReveal } from '@/components/motion/ImageReveal'
import { WordFade } from '@/components/motion/WordFade'

// `published: false` hides a member from the public site without deleting
// the record — flip back to true when ready to introduce them publicly.
const TEAM_MEMBERS = [
  {
    slug: 'john-mathewson',
    name: 'John Mathewson',
    title: 'Founder & Principal Broker',
    specialties: ['Office', 'Industrial', 'Land'],
    image: '/team/john.jpg',
    quote: 'Pro formas tell most of the truth. The rest is in how the building&apos;s been treated.',
    published: true,
  },
  {
    slug: 'amanda-mathewson',
    name: 'Amanda Mathewson',
    title: 'Director of Strategy',
    specialties: ['Retail', 'Multifamily'],
    image: '/team/amanda.jpg',
    quote: 'The right tenant matters more than the highest rent.',
    published: false,
  },
  {
    slug: 'tim-operations',
    name: 'Tim Peters',
    title: 'Operations Manager',
    specialties: ['Property Management'],
    image: '/team/tim.jpg',
    quote: 'A managed building should never give the owner a 10pm phone call.',
    published: false,
  },
].filter((m) => m.published)

export function TeamPreview() {
  return (
    <section className="relative py-section overflow-hidden bg-charcoal-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(224,122,95,0.04),transparent_50%)]" />

      <Container className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-16 flex-wrap gap-6"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-coral-400" />
              <span className="text-coral-400 text-xs tracking-[0.3em] uppercase font-semibold font-mono">
                Our People
              </span>
            </div>
            <h2
              className="font-display text-cream-50"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Meet the Team
            </h2>
            <WordFade
              text="Experienced professionals dedicated to stewarding your real estate investments with integrity."
              className="text-charcoal-400 max-w-lg mt-4 text-lg"
            />
          </div>
          <Button href="/team" variant="outline" size="sm">
            Full Team
          </Button>
        </motion.div>

        {/* Team Grid — collapses to a centered single column when only one
            published member, so a solo card doesn't sit in 1/3 of an empty row. */}
        <div
          className={
            TEAM_MEMBERS.length === 1
              ? 'grid grid-cols-1 max-w-sm mx-auto gap-8'
              : 'grid grid-cols-1 md:grid-cols-3 gap-8'
          }
        >
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
            >
              <Link href={`/team/${member.slug}`} className="block group">
                {/* Photo — editorial B&W → color hover */}
                <div className="relative h-[440px] overflow-hidden mb-6 bg-charcoal-800">
                  <ImageReveal
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                    imgClassName="grayscale group-hover:grayscale-0 transition-all duration-700 object-[center_15%]"
                    parallaxAmount={0.06}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-transparent to-transparent pointer-events-none" />

                  {/* Name + title overlay */}
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral-400 mb-2">
                      {member.title}
                    </p>
                    <h3 className="font-display text-cream-50 text-xl tracking-wide leading-tight">
                      {member.name}
                    </h3>
                  </div>

                  <div className="absolute bottom-0 left-0 w-0 h-px bg-coral-400 group-hover:w-full transition-all duration-700 pointer-events-none" />
                </div>

                {/* Pull quote */}
                <blockquote
                  className="text-sm md:text-base text-charcoal-300 leading-snug border-l-2 border-coral-400/30 group-hover:border-coral-400 pl-4 italic transition-colors duration-500"
                  dangerouslySetInnerHTML={{ __html: `&ldquo;${member.quote}&rdquo;` }}
                />

                {/* Specialty tags */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {member.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] tracking-[0.2em] uppercase text-coral-400/70 bg-coral-400/5 px-2.5 py-1 border border-coral-400/10 font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
