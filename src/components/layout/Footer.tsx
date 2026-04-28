'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Container } from './Container'

const FOOTER_LINKS = {
  Properties: [
    { href: '/properties?type=office', label: 'Office' },
    { href: '/properties?type=retail', label: 'Retail' },
    { href: '/properties?type=industrial', label: 'Industrial' },
    { href: '/properties?type=multifamily', label: 'Multifamily' },
    { href: '/properties?type=land', label: 'Land' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/team', label: 'Our Team' },
    { href: '/services', label: 'Services' },
    { href: '/insights', label: 'Insights' },
    { href: '/contact', label: 'Contact' },
  ],
  Services: [
    { href: '/services#brokerage', label: 'Brokerage' },
    { href: '/services#consulting', label: 'Consulting' },
    { href: '/services#management', label: 'Property Management' },
    { href: '/services#investment', label: 'Investment Sales' },
  ],
  Markets: [
    { href: '/markets/commercial-real-estate-nw-indiana/', label: 'Northwest Indiana' },
    { href: '/counties/commercial-real-estate-lake-county-in/', label: 'Lake County' },
    { href: '/cities/commercial-real-estate-crown-point/', label: 'Crown Point' },
    { href: '/cities/commercial-real-estate-merrillville/', label: 'Merrillville' },
    { href: '/investments/investment-property-nw-indiana/', label: 'Investment Property' },
    { href: '/services/broker-opinion-of-value-nw-indiana/', label: 'Broker Opinion of Value' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-charcoal-950 text-cream-300 border-t border-charcoal-800/50">
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <span className="font-display text-xl tracking-[0.3em] text-coral-400 font-semibold block">
                STEWARDSHIP
              </span>
              <span className="text-[10px] tracking-[0.35em] text-charcoal-500 block mt-1 uppercase group-hover:text-coral-400/50 transition-colors duration-500 font-mono">
                Commercial Real Estate
              </span>
            </Link>
            <p className="text-sm text-charcoal-500 leading-relaxed max-w-sm mb-6">
              Full-service commercial real estate brokerage serving Northwest Indiana
              and the greater Chicagoland area. Office, retail, industrial, multifamily,
              and land — we handle it all.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/stewardship-asset-group"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-charcoal-700 hover:border-coral-400 hover:text-coral-400 transition-all duration-300 text-charcoal-500"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading text-xs tracking-[0.25em] uppercase text-cream-100 mb-5 font-semibold">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="animated-underline text-sm text-charcoal-500 hover:text-coral-400 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal-800/50">
        <Container className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-charcoal-600">
            &copy; {new Date().getFullYear()} Stewardship Asset Group. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-charcoal-600 hover:text-coral-400 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-charcoal-600 hover:text-coral-400 transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}
