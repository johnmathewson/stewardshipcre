'use client'

import { useEffect, useRef } from 'react'
import { logPageView } from '@/lib/owner-client'

/**
 * Fires a single page-view ping on mount. Lives as a client component so
 * the parent (server component) can pass the slug down without becoming
 * client itself.
 */
export default function PageViewTracker({ slug }: { slug: string }) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    logPageView(slug)
  }, [slug])
  return null
}
