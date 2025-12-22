import type { ComplianceRule } from "@/types/compliance"

export function checkForCharityReferences(allText: string): ComplianceRule {
  const charityTerms = ["donate", "charity", "foundation", "supports"]

  const found = charityTerms.filter((term) => allText.includes(term))

  if (found.length > 0) {
    return {
      rule: "Charity Partnership",
      status: "fail",
      message: "Charity partnership references detected. Not allowed in self-serve banners.",
      details: `Found terms: ${found.join(", ")}`,
    }
  }

  return {
    rule: "Charity Partnership",
    status: "pass",
    message: "No charity references detected.",
  }
}
