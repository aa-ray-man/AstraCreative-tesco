import type { ComplianceRule, CanvasObjectData } from "@/types/compliance"

export function checkMinimumFontSize(objects: CanvasObjectData[]): ComplianceRule {
  const MIN_FONT_SIZE = 20
  const textObjects = objects.filter((obj) => obj.type === "text")

  const violations = textObjects
    .filter((obj) => (obj.fontSize || 0) < MIN_FONT_SIZE)
    .map((obj) => `Text "${obj.text?.substring(0, 20)}..." has size ${obj.fontSize}px`)

  if (violations.length > 0) {
    return {
      rule: "Minimum Font Size",
      status: "fail",
      message: `Text below minimum font size (${MIN_FONT_SIZE}px) detected.`,
      details: violations.join("; "),
    }
  }

  return {
    rule: "Minimum Font Size",
    status: "pass",
    message: "All text meets minimum font size requirements.",
  }
}
