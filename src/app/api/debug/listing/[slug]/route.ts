/**
 * GET /api/debug/listing/[slug]
 *
 * Returns the raw enriched listing object so we can see what shape the
 * detail page is trying to render. Diagnostic only — delete after
 * Slice D verification.
 */

import { NextResponse } from "next/server"
import { fetchListingBySlug, primaryImageUrl } from "@/lib/supabase"

export const dynamic = "force-dynamic"

interface Ctx {
  params: Promise<{ slug: string }>
}

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { slug } = await params
    const listing = await fetchListingBySlug(slug)
    if (!listing) {
      return NextResponse.json({ found: false, slug })
    }
    return NextResponse.json({
      found: true,
      slug,
      hero: primaryImageUrl(listing),
      gallery_image_count: Array.isArray(listing.images) ? listing.images.length : null,
      images_type: typeof listing.images,
      listing,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        found: false,
        error: err?.message || String(err),
        stack: err?.stack?.split("\n").slice(0, 6),
      },
      { status: 500 }
    )
  }
}
