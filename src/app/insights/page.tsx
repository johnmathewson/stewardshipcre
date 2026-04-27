import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Market reports, research, and CRE insights from Stewardship CRE — your source for Northwest Indiana commercial real estate intelligence.',
}

const POSTS = [
  {
    slug: 'q1-2026-nwi-market-report',
    title: 'Q1 2026 NWI Commercial Market Report',
    excerpt: 'Vacancy rates, absorption trends, and cap rate movements across office, retail, and industrial sectors in Northwest Indiana.',
    category: 'Market Report',
    date: 'March 15, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
  },
  {
    slug: 'cre-investment-guide-2026',
    title: 'The Complete CRE Investment Guide for 2026',
    excerpt: 'Everything you need to know about evaluating commercial real estate investments — from cap rates and NOI to due diligence and financing.',
    category: 'Research',
    date: 'February 28, 2026',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop',
  },
  {
    slug: 'industrial-boom-nwi',
    title: 'NWI Industrial Boom: What It Means for Investors',
    excerpt: 'The logistics and distribution sector continues to drive demand for industrial space in Northwest Indiana, creating new opportunities for investors.',
    category: 'News',
    date: 'February 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=500&fit=crop',
  },
  {
    slug: 'deal-spotlight-flynn-rd',
    title: 'Deal Spotlight: 156 S Flynn Road',
    excerpt: 'A closer look at the acquisition and repositioning of this 12,000 SF industrial property in Westville, Indiana.',
    category: 'Deal Spotlight',
    date: 'January 22, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1565610222536-ef125c59da2e?w=800&h=500&fit=crop',
  },
]

const CATEGORIES = ['All', 'Market Report', 'Research', 'News', 'Deal Spotlight']

export default function InsightsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-charcoal-950 pt-32 pb-20">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-gold-500" />
              <span className="text-gold-500 text-xs tracking-[0.3em] uppercase font-semibold">Insights</span>
            </div>
            <h1
              className="font-heading text-cream-100 mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              Market <span className="text-gold-500">Intelligence</span>
            </h1>
            <p className="text-xl text-charcoal-400 max-w-xl leading-relaxed">
              Data-driven market reports, research articles, and deal spotlights
              from the Stewardship CRE team.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Category Filter */}
      <section className="bg-charcoal-900 border-y border-charcoal-800 py-4">
        <Container>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 text-xs tracking-[0.1em] uppercase font-semibold transition-all duration-300 ${
                  i === 0
                    ? 'bg-gold-500 text-charcoal-950'
                    : 'text-charcoal-400 hover:text-cream-100 border border-charcoal-700 hover:border-charcoal-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Posts Grid */}
      <section className="py-section bg-cream-100">
        <Container>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {POSTS.map((post) => (
              <StaggerItem key={post.slug}>
                <Link href={`/insights/${post.slug}`} className="block group">
                  <Card hover className="overflow-hidden h-full">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="teal">{post.category}</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-charcoal-500 mb-3">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 bg-charcoal-400 rounded-full" />
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="font-heading text-sm tracking-[0.08em] uppercase text-charcoal-900 group-hover:text-gold-600 transition-colors mb-2 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-sm text-charcoal-500 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </Container>
      </section>
    </>
  )
}
