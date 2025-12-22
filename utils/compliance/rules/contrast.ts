import type { ComplianceRule, CanvasObjectData } from "@/types/compliance"
import ColorContrastChecker from "color-contrast-checker"

const ccc = new ColorContrastChecker()

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

export function checkContrast(objects: CanvasObjectData[], backgroundColor: string): ComplianceRule {
  const MIN_CONTRAST_RATIO = 4.5 // WCAG AA
  const violations: string[] = []

  const textObjects = objects.filter((obj) => obj.type === "text" && obj.fill)

  textObjects.forEach((obj) => {
    const textColor = obj.fill || "#000000"

    try {
      const isAccessible = ccc.isLevelAA(textColor, backgroundColor, obj.fontSize || 20)

      if (!isAccessible) {
        violations.push(
          `Text "${obj.text?.substring(0, 20)}..." (${textColor}) has insufficient contrast against background (${backgroundColor})`,
        )
      }
    } catch (error) {
      console.error("Contrast check error:", error)
    }
  })

  if (violations.length > 0) {
    return {
      rule: "Contrast Check",
      status: "fail",
      message: `Insufficient contrast detected (minimum ${MIN_CONTRAST_RATIO}:1 required).`,
      details: violations.join("; "),
    }
  }

  return {
    rule: "Contrast Check",
    status: "pass",
    message: "All text meets WCAG AA contrast requirements.",
  }
}
