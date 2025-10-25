import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("[Sign Out] Error:", error)
      return NextResponse.json({ error: "Failed to sign out" }, { status: 500 })
    }

    return NextResponse.json({ message: "Signed out successfully" })
  } catch (error: any) {
    console.error("[Sign Out] API error:", error)
    return NextResponse.json(
      {
        error: "Failed to sign out",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
