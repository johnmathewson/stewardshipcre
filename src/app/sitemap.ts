import type { MetadataRoute } from 'next'
import { readdirSync, statSync, existsSync } from 'fs'
import path from 'path'

const SITE_URL = 'https://www.stewardshipcre.com'

// Main site routes (Next.js app routes)
const APP_ROUTES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
  { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE_URL}/services`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE_URL}/team`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${SITE_URL}/properties`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${SITE_URL}/insights`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.6 },
]

// SEO content categories living as static HTML in public/
const SEO_CATEGORIES = [
  { dir: 'markets', priority: 0.9 },
  { dir: 'counties', priority: 0.85 },
  { dir: 'cities', priority: 0.85 },
  { dir: 'property-types', priority: 0.8 },
  { dir: 'services', priority: 0.8 },
  { dir: 'investments', priority: 0.8 },
  { dir: 'insights', priority: 0.6 },
] as const

function readSeoSlugs(category: string): string[] {
  const base = path.join(process.cwd(), 'public', category)
  if (!existsSync(base)) return []
  try {
    return readdirSync(base)
      .filter((entry) => {
        const full = path.join(base, entry)
        if (!statSync(full).isDirectory()) return false
        return existsSync(path.join(full, 'index.html'))
      })
      .sort()
  } catch {
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const seoEntries: MetadataRoute.Sitemap = SEO_CATEGORIES.flatMap((cat) =>
    readSeoSlugs(cat.dir).map((slug) => ({
      url: `${SITE_URL}/${cat.dir}/${slug}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: cat.priority,
    }))
  )

  return [
    ...APP_ROUTES.map((entry) => ({ ...entry, lastModified })),
    ...seoEntries,
  ]
}
