/**
 * Site-wide switches.
 *
 * LISTINGS_ON_SITE — whether the public site shows listings at all.
 * Off (Nov 2026): John pulled every listing from the public site; the CRM
 * records are untouched. While off:
 *   • /properties and everything under it (listing pages, inquire, apply,
 *     data room) is a 404 — src/app/properties/layout.tsx;
 *   • the listing fetchers in src/lib/supabase.ts return nothing without
 *     querying, so no listing data is fetched or rendered anywhere;
 *   • home-page Featured Listings and the property search are hidden, and
 *     every "Properties" link, button and sitemap entry is removed.
 * Set to true to bring listings back exactly as they were.
 */
export const LISTINGS_ON_SITE = false
