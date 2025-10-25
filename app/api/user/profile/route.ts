import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      created_at: user.created_at
    })
  } catch (error: any) {
    console.error("[User Profile] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user profile",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
