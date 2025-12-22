export type ProductCategory =
  | "food-beverage"
  | "beauty-personal-care"
  | "electronics"
  | "home"
  | "fashion"
  | "baby-kids"
  | "beverage-alcohol"
  | "pet"

export type MoodTone =
  | "friendly"
  | "luxury"
  | "natural-earthy"
  | "energetic"
  | "minimal-modern"
  | "retro-vintage"
  | "playful"

export type TargetAudience = "mass-market" | "premium" | "kids" | "eco-conscious"

export type AccessibilityLevel = "off" | "wcag-aa" | "wcag-aaa"

export type PaletteStyle =
  | "monochrome"
  | "analogous"
  | "complementary"
  | "triadic"
  | "contrast-forward"
  | "pastel"
  | "vibrant"

export interface ColorRole {
  role: "background" | "primary" | "accent" | "support" | "cta"
  hex: string
  name?: string
}

export interface GeneratedPalette {
  id: string
  name: string
  colors: ColorRole[]
  tags: string[]
  contrastScores: {
    textOnBackground: number
    textOnPrimary: number
    ctaContrast: number
  }
}

export interface PaletteQuestionnaire {
  category: ProductCategory
  primaryColor: string
  mood: MoodTone
  targetAudience: TargetAudience[]
  accessibilityLevel: AccessibilityLevel
  style: PaletteStyle
}
