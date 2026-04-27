import type { Metadata } from 'next'
import { Cinzel, Inter, JetBrains_Mono, DM_Sans } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { PageTransition } from '@/components/motion/PageTransition'
import './globals.css'

// Cinzel: reserved for the wordmark + hero "DONE RIGHT" + display numbers ONLY
const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

// DM Sans: modern grotesk for everything that's "premium serious" — section
// headings, card titles. Replaces the all-caps Cinzel for working text.
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Stewardship CRE | Commercial Real Estate Brokerage',
    template: '%s | Stewardship CRE',
  },
  description:
    'Full-service commercial real estate brokerage serving Northwest Indiana and the greater Chicagoland area.',
  openGraph: {
    type: 'website',
    siteName: 'Stewardship CRE',
    title: 'Stewardship CRE | Commercial Real Estate Brokerage',
    description:
      'Full-service commercial real estate brokerage serving Northwest Indiana and the greater Chicagoland area.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${dmSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain-overlay">
        <SmoothScroll>
          <ScrollProgress />
          <Header />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
