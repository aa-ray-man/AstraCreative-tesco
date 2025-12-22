import type { ComplianceRule, CanvasObjectData } from "@/types/compliance"

export function checkForPriceClaims(allText: string, objects: CanvasObjectData[]): ComplianceRule {
  const pricePatterns = [
    /£\d+(\.\d+)?/,
    /\d+%\s*(off|discount)/,
    /save/,
    /discount/,
    /deal/,
    /offer/,
    /sale/,
    /half price/,
    /now only/,
    /only £/,
    /reduced to/,
    /claim/,
    /guarantee/,
    /cashback/,
    /money.?back/,
  ]

  const violations: string[] = []

  for (const pattern of pricePatterns) {
    if (pattern.test(allText)) {
      violations.push(pattern.source)
    }
  }

  if (violations.length > 0) {
    return {
      rule: "Price Claims",
      status: "fail",
      message: "Price, discount, or claim terms detected. Tesco self-serve banners cannot include pricing.",
      details: `Detected patterns: ${violations.join(", ")}`,
    }
  }

  return {
    rule: "Price Claims",
    status: "pass",
    message: "No price or discount references found.",
  }
}
