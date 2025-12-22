import { type NextRequest, NextResponse } from "next/server"
import type { ComplianceCheckRequest } from "@/types/compliance"
import { runComplianceChecks } from "@/utils/compliance/compliance-engine"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body: ComplianceCheckRequest = await request.json()

    // Run all compliance checks
    const report = await runComplianceChecks(body)

    return NextResponse.json(report)
  } catch (error) {
    console.error("Compliance check error:", error)
    return NextResponse.json({ error: "Failed to run compliance checks" }, { status: 500 })
  }
}
