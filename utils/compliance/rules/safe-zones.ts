import type { ComplianceRule, CanvasObjectData } from "@/types/compliance"

export function checkSafeZoneViolations(
  objects: CanvasObjectData[],
  canvasHeight: number,
  format: string,
): ComplianceRule {
  // Only applies to 9:16 Story format
  if (format !== "9:16") {
    return {
      rule: "Safe Zone Compliance",
      status: "pass",
      message: "Safe zones only apply to 9:16 Story format.",
    }
  }

  const TOP_SAFE_ZONE = 200
  const BOTTOM_SAFE_ZONE = 250

  const violations: string[] = []

  objects.forEach((obj) => {
    // Skip safe zone overlays themselves
    if (obj.id?.includes("safe-zone")) return

    const objTop = obj.y
    const objBottom = obj.y + obj.height

    // Check top safe zone
    if (objTop < TOP_SAFE_ZONE) {
      violations.push(`Object at y=${objTop}px violates top safe zone (0-${TOP_SAFE_ZONE}px)`)
    }

    // Check bottom safe zone
    const bottomZoneStart = canvasHeight - BOTTOM_SAFE_ZONE
    if (objBottom > bottomZoneStart) {
      violations.push(`Object at y=${objBottom}px violates bottom safe zone (${bottomZoneStart}-${canvasHeight}px)`)
    }
  })

  if (violations.length > 0) {
    return {
      rule: "Safe Zone Compliance",
      status: "fail",
      message: "Objects detected in safe zones.",
      details: violations.join("; "),
    }
  }

  return {
    rule: "Safe Zone Compliance",
    status: "pass",
    message: "All objects are outside safe zones.",
  }
}
