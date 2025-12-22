import type { ComplianceRule } from "@/types/compliance"

export function checkForSustainabilityClaims(allText: string): ComplianceRule {
  const sustainabilityTerms = [
    "eco",
    "green",
    "sustainable",
    "carbon",
    "biodegradable",
    "recyclable",
    "planet-friendly",
    "planet friendly",
    "environment",
    "earth friendly",
    "earth-friendly",
  ]

  const found = sustainabilityTerms.filter((term) => allText.includes(term))

  if (found.length > 0) {
    return {
      rule: "Sustainability Claims",
      status: "fail",
      message: "Sustainability or green claims detected. Not allowed in self-serve banners.",
      details: `Found terms: ${found.join(", ")}`,
    }
  }

  return {
    rule: "Sustainability Claims",
    status: "pass",
    message: "No sustainability claims detected.",
  }
}
