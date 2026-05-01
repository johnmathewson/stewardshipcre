/**
 * GET /api/debug/env
 *
 * Diagnostic-only. Reports which env vars are visible to the running
 * function and whether a Supabase query actually succeeds. Redacts
 * secrets but shows enough context to confirm correctness.
 *
 * Delete this route once Slice D is verified.
 */

import { NextResponse } from "next/server"
import { fetchPublishedListings } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  const crmUrl = process.env.NEXT_PUBLIC_CRM_API_URL || ""

  let querySucceeded = false
  let queryRowCount = 0
  let queryError: string | null = null
  try {
    const rows = await fetchPublishedListings()
    querySucceeded = true
    queryRowCount = rows.length
  } catch (err: any) {
    queryError = err?.message || String(err)
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: url ? `${url.slice(0, 30)}…(len=${url.length})` : "MISSING",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anon
        ? `${anon.slice(0, 12)}…(len=${anon.length}, starts_with_eyJ=${anon.startsWith("eyJ")})`
        : "MISSING",
      NEXT_PUBLIC_CRM_API_URL: crmUrl || "(unset, using default)",
    },
    supabase_query: {
      succeeded: querySucceeded,
      row_count: queryRowCount,
      error: queryError,
    },
  })
}
