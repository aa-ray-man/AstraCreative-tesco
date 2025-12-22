import type { ComplianceRule, CanvasObjectData } from "@/types/compliance"

function doObjectsOverlap(obj1: CanvasObjectData, obj2: CanvasObjectData): boolean {
  const left1 = obj1.x
  const right1 = obj1.x + obj1.width
  const top1 = obj1.y
  const bottom1 = obj1.y + obj1.height

  const left2 = obj2.x
  const right2 = obj2.x + obj2.width
  const top2 = obj2.y
  const bottom2 = obj2.y + obj2.height

  return !(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2)
}

export function checkOverlapWithValueTile(objects: CanvasObjectData[]): ComplianceRule {
  // Identify value tiles, CTAs, and Tesco tags
  const specialObjects = objects.filter(
    (obj) => obj.id?.includes("value-tile") || obj.id?.includes("cta") || obj.id?.includes("tesco-tag"),
  )

  const regularObjects = objects.filter(
    (obj) =>
      !obj.id?.includes("value-tile") &&
      !obj.id?.includes("cta") &&
      !obj.id?.includes("tesco-tag") &&
      !obj.id?.includes("safe-zone"),
  )

  const violations: string[] = []

  specialObjects.forEach((special) => {
    regularObjects.forEach((regular) => {
      if (doObjectsOverlap(special, regular)) {
        violations.push(`Object overlaps with ${special.id || "special element"}`)
      }
    })
  })

  if (violations.length > 0) {
    return {
      rule: "Layer Overlaps",
      status: "fail",
      message: "Objects overlapping with value tiles, CTA, or Tesco tags detected.",
      details: violations.join("; "),
    }
  }

  return {
    rule: "Layer Overlaps",
    status: "pass",
    message: "No overlaps with critical elements detected.",
  }
}
