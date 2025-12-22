import type { ComplianceRule } from "@/types/compliance"

export function checkForCompetitions(allText: string): ComplianceRule {
  const competitionTerms = [
    "win",
    "contest",
    "giveaway",
    "sweepstake",
    "enter to win",
    "competition",
    "chance to win",
    "prize",
  ]

  const found = competitionTerms.filter((term) => allText.includes(term))

  if (found.length > 0) {
    return {
      rule: "Competitions",
      status: "fail",
      message: "Competition or giveaway references detected. Not allowed in self-serve banners.",
      details: `Found terms: ${found.join(", ")}`,
    }
  }

  return {
    rule: "Competitions",
    status: "pass",
    message: "No competition references detected.",
  }
}
