import type { ComplianceCheckRequest, ComplianceReport, ComplianceRule } from "@/types/compliance"
import { extractTextFromImage, extractTextFromObjects } from "./ocr-utils"
import { checkForPriceClaims } from "./rules/price-claims"
import { checkForSustainabilityClaims } from "./rules/sustainability"
import { checkForCompetitions } from "./rules/competitions"
import { checkForCharityReferences } from "./rules/charity"
import { checkDrinkawarePresence } from "./rules/drinkaware"
import { checkSafeZoneViolations } from "./rules/safe-zones"
import { checkMinimumFontSize } from "./rules/font-size"
import { checkContrast } from "./rules/contrast"
import { checkTescoTagValidity } from "./rules/tesco-tag"
import { checkOverlapWithValueTile } from "./rules/overlaps"

export async function runComplianceChecks(request: ComplianceCheckRequest): Promise<ComplianceReport> {
  const { canvasData, screenshot, productType, tescoTag } = request

  // Extract text from both OCR and canvas objects
  let ocrText = ""
  if (screenshot) {
    ocrText = await extractTextFromImage(screenshot)
  }

  const objectText = extractTextFromObjects(canvasData.objects)
  const allText = (ocrText + " " + objectText).toLowerCase()

  // Run all compliance rules
  const results: ComplianceRule[] = [
    checkForPriceClaims(allText, canvasData.objects),
    checkForSustainabilityClaims(allText),
    checkForCompetitions(allText),
    checkForCharityReferences(allText),
    checkDrinkawarePresence(canvasData.objects, productType, canvasData.backgroundColor),
    checkSafeZoneViolations(canvasData.objects, canvasData.height, canvasData.format),
    checkMinimumFontSize(canvasData.objects),
    checkContrast(canvasData.objects, canvasData.backgroundColor),
    checkTescoTagValidity(allText, tescoTag),
    checkOverlapWithValueTile(canvasData.objects),
  ]

  // Separate violations and warnings
  const violations = results.filter((r) => r.status === "fail")
  const warnings = results.filter((r) => r.status === "warning")

  const overallStatus = violations.length > 0 ? "fail" : warnings.length > 0 ? "warning" : "pass"

  return {
    overallStatus,
    violations,
    warnings,
    timestamp: new Date().toISOString(),
  }
}
