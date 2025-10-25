import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    if (!supabase) {
      return NextResponse.json({ success: false, error: "Supabase client not configured" }, { status: 500 })
    }

    // Check if tables exist by trying to query them
    const tables = ["searches", "keywords", "user_preferences"]
    const results = []

    for (const table of tables) {
      const { error } = await supabase.from(table).select("id").limit(1)

      results.push({
        table,
        exists: !error,
        error: error?.message,
      })
    }

    const allTablesExist = results.every((r) => r.exists)

    if (allTablesExist) {
      return NextResponse.json({
        success: true,
        tables: results,
      })
    } else {
      const missingTables = results.filter((r) => !r.exists).map((r) => r.table)
      return NextResponse.json({
        success: false,
        error: `Missing tables: ${missingTables.join(", ")}`,
        tables: results,
      })
    }
  } catch (error) {
    console.error("[v0] Database check error:", error)
    return NextResponse.json({ success: false, error: "Failed to check database" }, { status: 500 })
  }
}
