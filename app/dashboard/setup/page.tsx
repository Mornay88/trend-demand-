"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DatabaseSetupPage() {
  const [status, setStatus] = useState<{
    tables: "pending" | "checking" | "success" | "error"
    message?: string
  }>({ tables: "pending" })

  const checkDatabaseSetup = async () => {
    setStatus({ tables: "checking" })

    try {
      const response = await fetch("/api/setup/check-database")
      const data = await response.json()

      if (data.success) {
        setStatus({ tables: "success", message: "All tables are set up correctly!" })
      } else {
        setStatus({ tables: "error", message: data.error || "Database setup incomplete" })
      }
    } catch (error) {
      setStatus({ tables: "error", message: "Failed to check database status" })
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance mb-2">Database Setup</h1>
        <p className="text-muted-foreground text-pretty">
          Set up your Supabase database tables and verify the connection
        </p>
      </div>

      <div className="space-y-6">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Verify Connection</CardTitle>
            <CardDescription>Make sure your Supabase environment variables are configured</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL</span>
              </div>
              <div className="flex items-center gap-2">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Run Scripts */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Run Database Scripts</CardTitle>
            <CardDescription>Execute the SQL scripts to create tables and security policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                You need to run these scripts in order. You can find them in the{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">scripts</code> folder:
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>01-create-tables.sql</li>
                  <li>02-enable-rls.sql</li>
                  <li>03-create-functions.sql</li>
                </ol>
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground">
              Click the "Run" button on each script file in the v0 interface, or copy and paste them into your Supabase
              SQL Editor.
            </p>
          </CardContent>
        </Card>

        {/* Verify Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Verify Setup</CardTitle>
            <CardDescription>Check if all database tables were created successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkDatabaseSetup} disabled={status.tables === "checking"} className="w-full sm:w-auto">
              {status.tables === "checking" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Check Database Status
            </Button>

            {status.message && (
              <Alert variant={status.tables === "success" ? "default" : "destructive"}>
                <AlertDescription className="flex items-center gap-2">
                  {status.tables === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {status.message}
                </AlertDescription>
              </Alert>
            )}

            {status.tables === "success" && (
              <div className="pt-4">
                <Button asChild>
                  <a href="/dashboard/analyze">Start Analyzing Keywords →</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
