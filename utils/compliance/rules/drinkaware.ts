import type { ComplianceRule, CanvasObjectData } from "@/types/compliance"

export function checkDrinkawarePresence(
  objects: CanvasObjectData[],
  productType?: string,
  backgroundColor?: string,
): ComplianceRule {
  // Check if this is an alcohol product
  const isAlcohol =
    productType === "alcohol" ||
    objects.some((obj) => obj.imageName && /beer|wine|vodka|rum|whiskey|gin|alcohol|spirit/i.test(obj.imageName))

  if (!isAlcohol) {
    return {
      rule: "Drinkaware Lock-up",
      status: "pass",
      message: "Not an alcohol product, Drinkaware not required.",
    }
  }

  // Find drinkaware logo
  const drinkawareLogo = objects.find((obj) => obj.isDrinkaware || (obj.imageName && /drinkaware/i.test(obj.imageName)))

  if (!drinkawareLogo) {
    return {
      rule: "Drinkaware Lock-up",
      status: "fail",
      message: "Alcohol product detected but Drinkaware logo is missing.",
      details: "Drinkaware logo is required for all alcohol products.",
    }
  }

  // Check size (minimum 20px)
  const minSize = Math.min(drinkawareLogo.width || 0, drinkawareLogo.height || 0)
  if (minSize < 20) {
    return {
      rule: "Drinkaware Lock-up",
      status: "fail",
      message: "Drinkaware logo is too small.",
      details: `Current size: ${minSize}px. Minimum required: 20px.`,
    }
  }

  // Check if it's pure black or white
  const fill = drinkawareLogo.fill?.toLowerCase()
  if (fill && fill !== "#000000" && fill !== "#ffffff" && fill !== "black" && fill !== "white") {
    return {
      rule: "Drinkaware Lock-up",
      status: "fail",
      message: "Drinkaware logo must be pure black or white.",
      details: `Current color: ${fill}`,
    }
  }

  return {
    rule: "Drinkaware Lock-up",
    status: "pass",
    message: "Drinkaware logo present and compliant.",
  }
}
