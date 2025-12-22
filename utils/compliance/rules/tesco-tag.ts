import type { ComplianceRule } from "@/types/compliance"

export function checkTescoTagValidity(allText: string, tescoTag?: string): ComplianceRule {
  const allowedTags = [
    "only at tesco",
    "available at tesco",
    "selected stores. while stocks last.",
    "clubcard/app required. ends",
  ]

  // Extract potential Tesco tag text
  const tagText = (tescoTag || allText).toLowerCase()

  // Check if any allowed pattern is present
  const hasValidTag = allowedTags.some((tag) => tagText.includes(tag))

  // Look for common invalid tag patterns
  const invalidPatterns = ["exclusive", "limited time", "hurry", "today only"]
  const hasInvalidTag = invalidPatterns.some((pattern) => tagText.includes(pattern))

  if (hasInvalidTag) {
    return {
      rule: "Tesco Tag Restrictions",
      status: "fail",
      message: "Invalid Tesco tag text detected.",
      details:
        'Only approved tag phrases are allowed: "Only at Tesco", "Available at Tesco", "Selected stores. While stocks last.", or Clubcard disclaimers.',
    }
  }

  if (!hasValidTag && tagText.length > 0) {
    return {
      rule: "Tesco Tag Restrictions",
      status: "warning",
      message: "Could not verify Tesco tag compliance.",
      details: "Please ensure tag text matches approved phrases.",
    }
  }

  return {
    rule: "Tesco Tag Restrictions",
    status: "pass",
    message: "Tesco tag text is compliant.",
  }
}
