import { notFound } from 'next/navigation'
import { LISTINGS_ON_SITE } from '@/lib/site-flags'

/**
 * Gate for every /properties route. With listings off the public site
 * (src/lib/site-flags.ts) the whole subtree is a 404 — no listing page,
 * inquire, apply or data-room URL renders anything.
 */
export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  if (!LISTINGS_ON_SITE) notFound()
  return <>{children}</>
}
