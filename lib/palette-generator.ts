import chroma from "chroma-js"
import type {
  ProductCategory,
  MoodTone,
  PaletteStyle,
  AccessibilityLevel,
  GeneratedPalette,
  PaletteQuestionnaire,
  ColorRole,
} from "@/types/color-palette"

// Category hue biases
const CATEGORY_HUE_RANGES: Record<ProductCategory, [number, number][]> = {
  "food-beverage": [
    [0, 20],
    [10, 60],
  ],
  "beauty-personal-care": [
    [280, 330],
    [300, 350],
  ],
  electronics: [[180, 220]],
  home: [[30, 50]],
  fashion: [
    [0, 360],
    [0, 360],
  ],
  "baby-kids": [
    [0, 360],
    [0, 360],
  ],
  "beverage-alcohol": [
    [0, 30],
    [320, 360],
  ],
  pet: [
    [80, 140],
    [180, 220],
  ],
}

// Mood saturation and lightness mappings
const MOOD_ADJUSTMENTS: Record<
  MoodTone,
  { saturation: [number, number]; lightness: [number, number]; contrast: "low" | "medium" | "high" }
> = {
  friendly: { saturation: [0.6, 0.8], lightness: [0.5, 0.7], contrast: "medium" },
  luxury: { saturation: [0.2, 0.5], lightness: [0.2, 0.9], contrast: "high" },
  "natural-earthy": { saturation: [0.3, 0.6], lightness: [0.4, 0.7], contrast: "medium" },
  energetic: { saturation: [0.7, 1.0], lightness: [0.6, 0.8], contrast: "high" },
  "minimal-modern": { saturation: [0.1, 0.3], lightness: [0.7, 0.95], contrast: "low" },
  "retro-vintage": { saturation: [0.4, 0.7], lightness: [0.45, 0.65], contrast: "medium" },
  playful: { saturation: [0.7, 0.95], lightness: [0.4, 0.85], contrast: "high" },
}

// Get random value in range
function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// Get hue based on category
function getCategoryHue(category: ProductCategory, baseHue?: number): number {
  const ranges = CATEGORY_HUE_RANGES[category]
  if (baseHue !== undefined && ranges.length > 0) {
    // Try to fit base hue into category range
    for (const [min, max] of ranges) {
      if (baseHue >= min && baseHue <= max) {
        return baseHue
      }
    }
  }
  // Pick random range and generate hue
  const range = ranges[Math.floor(Math.random() * ranges.length)]
  return randomInRange(range[0], range[1])
}

// Adjust color for accessibility
function adjustForAccessibility(
  foreground: chroma.Color,
  background: chroma.Color,
  targetRatio: number,
  maxIterations = 20,
): chroma.Color {
  let adjusted = foreground
  let currentRatio = chroma.contrast(adjusted, background)

  for (let i = 0; i < maxIterations && currentRatio < targetRatio; i++) {
    const [h, s, l] = adjusted.hsl()
    // Adjust lightness to improve contrast
    const newL = background.luminance() > 0.5 ? Math.max(0, l - 0.05) : Math.min(1, l + 0.05)
    adjusted = chroma.hsl(h, s, newL)
    currentRatio = chroma.contrast(adjusted, background)
  }

  return adjusted
}

// Generate monochrome palette
function generateMonochrome(baseHue: number, mood: MoodTone): chroma.Color[] {
  const { lightness } = MOOD_ADJUSTMENTS[mood]
  const colors: chroma.Color[] = []

  // Generate 5 shades
  for (let i = 0; i < 5; i++) {
    const l = lightness[0] + (lightness[1] - lightness[0]) * (i / 4)
    const s = 0.2 + Math.random() * 0.3
    colors.push(chroma.hsl(baseHue, s, l))
  }

  return colors
}

// Generate analogous palette
function generateAnalogous(baseHue: number, mood: MoodTone): chroma.Color[] {
  const { saturation, lightness } = MOOD_ADJUSTMENTS[mood]
  const colors: chroma.Color[] = []

  const hues = [baseHue - 30, baseHue, baseHue + 30]

  for (const hue of hues) {
    const s = randomInRange(saturation[0], saturation[1])
    const l = randomInRange(lightness[0], lightness[1])
    colors.push(chroma.hsl((hue + 360) % 360, s, l))
  }

  // Add a neutral
  colors.push(chroma.hsl(baseHue, 0.1, 0.85))
  colors.push(chroma.hsl(baseHue, 0.15, 0.3))

  return colors
}

// Generate complementary palette
function generateComplementary(baseHue: number, mood: MoodTone): chroma.Color[] {
  const { saturation, lightness } = MOOD_ADJUSTMENTS[mood]
  const colors: chroma.Color[] = []

  // Base color
  colors.push(
    chroma.hsl(baseHue, randomInRange(saturation[0], saturation[1]), randomInRange(lightness[0], lightness[1])),
  )

  // Complement
  const complementHue = (baseHue + 180) % 360
  colors.push(
    chroma.hsl(complementHue, randomInRange(saturation[0], saturation[1]), randomInRange(lightness[0], lightness[1])),
  )

  // Neutrals
  colors.push(chroma.hsl(baseHue, 0.1, 0.9))
  colors.push(chroma.hsl(baseHue, 0.15, 0.25))
  colors.push(chroma.hsl(complementHue, randomInRange(0.5, 0.7), randomInRange(0.5, 0.7)))

  return colors
}

// Generate triadic palette
function generateTriadic(baseHue: number, mood: MoodTone): chroma.Color[] {
  const { saturation, lightness } = MOOD_ADJUSTMENTS[mood]
  const colors: chroma.Color[] = []

  const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360]

  for (const hue of hues) {
    const s = randomInRange(saturation[0], saturation[1])
    const l = randomInRange(lightness[0], lightness[1])
    colors.push(chroma.hsl(hue, s, l))
  }

  // Add neutrals
  colors.push(chroma.hsl(baseHue, 0.1, 0.85))
  colors.push(chroma.hsl(baseHue, 0.15, 0.35))

  return colors
}

// Generate contrast-forward (ColorHunt-like) palette
function generateContrastForward(baseHue: number, mood: MoodTone): chroma.Color[] {
  const colors: chroma.Color[] = []

  // Dark background
  colors.push(chroma.hsl(baseHue, 0.2, 0.15))

  // Primary (product color)
  colors.push(chroma.hsl(baseHue, 0.7, 0.55))

  // Bold accent
  const accentHue = (baseHue + 180) % 360
  colors.push(chroma.hsl(accentHue, 0.9, 0.6))

  // Light neutral
  colors.push(chroma.hsl(baseHue, 0.1, 0.92))

  // Supporting color
  colors.push(chroma.hsl((baseHue + 60) % 360, 0.6, 0.5))

  return colors
}

// Generate pastel palette
function generatePastel(baseHue: number): chroma.Color[] {
  const colors: chroma.Color[] = []

  const hues = [baseHue, (baseHue + 60) % 360, (baseHue + 120) % 360, (baseHue + 240) % 360, (baseHue + 300) % 360]

  for (const hue of hues) {
    colors.push(chroma.hsl(hue, randomInRange(0.3, 0.5), randomInRange(0.75, 0.9)))
  }

  return colors
}

// Generate vibrant palette
function generateVibrant(baseHue: number, mood: MoodTone): chroma.Color[] {
  const colors: chroma.Color[] = []

  const hues = [baseHue, (baseHue + 45) % 360, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360]

  for (const hue of hues) {
    colors.push(chroma.hsl(hue, randomInRange(0.8, 1.0), randomInRange(0.45, 0.65)))
  }

  return colors
}

// Assign roles to colors
function assignColorRoles(colors: chroma.Color[], style: PaletteStyle): ColorRole[] {
  const roles: ColorRole[] = []

  // Sort by lightness
  const sorted = [...colors].sort((a, b) => a.luminance() - b.luminance())

  if (style === "contrast-forward") {
    // Pre-ordered for contrast
    roles.push({ role: "background", hex: colors[0].hex() })
    roles.push({ role: "primary", hex: colors[1].hex() })
    roles.push({ role: "accent", hex: colors[2].hex() })
    roles.push({ role: "support", hex: colors[3].hex() })
    roles.push({ role: "cta", hex: colors[4].hex() })
  } else {
    // Background - lightest
    roles.push({ role: "background", hex: sorted[sorted.length - 1].hex() })

    // Primary - mid-tone
    roles.push({ role: "primary", hex: sorted[Math.floor(sorted.length / 2)].hex() })

    // Accent - most saturated
    const mostSaturated = [...colors].sort((a, b) => {
      const [, sA] = a.hsl()
      const [, sB] = b.hsl()
      return sB - sA
    })[0]
    roles.push({ role: "accent", hex: mostSaturated.hex() })

    // Support - second lightest
    roles.push({ role: "support", hex: sorted[sorted.length - 2].hex() })

    // CTA - darkest or most contrasting
    roles.push({ role: "cta", hex: sorted[0].hex() })
  }

  return roles
}

// Calculate contrast scores
function calculateContrastScores(colors: ColorRole[]) {
  const background = chroma(colors.find((c) => c.role === "background")?.hex || "#fff")
  const primary = chroma(colors.find((c) => c.role === "primary")?.hex || "#000")
  const cta = chroma(colors.find((c) => c.role === "cta")?.hex || "#000")

  return {
    textOnBackground: chroma.contrast(background, chroma("#000")),
    textOnPrimary: chroma.contrast(primary, chroma("#fff")),
    ctaContrast: chroma.contrast(cta, background),
  }
}

// Apply accessibility adjustments
function applyAccessibility(colors: ColorRole[], level: AccessibilityLevel): ColorRole[] {
  if (level === "off") return colors

  const targetRatio = level === "wcag-aa" ? 4.5 : 7.0

  const background = chroma(colors.find((c) => c.role === "background")?.hex || "#fff")
  const textColor = chroma("#000")

  return colors.map((color) => {
    if (color.role === "cta" || color.role === "accent") {
      const adjusted = adjustForAccessibility(chroma(color.hex), background, targetRatio)
      return { ...color, hex: adjusted.hex() }
    }
    return color
  })
}

// Main palette generator
export function generatePalette(questionnaire: PaletteQuestionnaire): GeneratedPalette {
  const { category, primaryColor, mood, style, accessibilityLevel } = questionnaire

  // Get base hue from primary color
  const [baseHue] = chroma(primaryColor).hsl()
  const categoryHue = getCategoryHue(category, baseHue)

  // Generate colors based on style
  let colors: chroma.Color[]

  switch (style) {
    case "monochrome":
      colors = generateMonochrome(categoryHue, mood)
      break
    case "analogous":
      colors = generateAnalogous(categoryHue, mood)
      break
    case "complementary":
      colors = generateComplementary(categoryHue, mood)
      break
    case "triadic":
      colors = generateTriadic(categoryHue, mood)
      break
    case "contrast-forward":
      colors = generateContrastForward(categoryHue, mood)
      break
    case "pastel":
      colors = generatePastel(categoryHue)
      break
    case "vibrant":
      colors = generateVibrant(categoryHue, mood)
      break
    default:
      colors = generateAnalogous(categoryHue, mood)
  }

  // Assign roles
  let colorRoles = assignColorRoles(colors, style)

  // Apply accessibility
  colorRoles = applyAccessibility(colorRoles, accessibilityLevel)

  // Calculate contrast scores
  const contrastScores = calculateContrastScores(colorRoles)

  // Generate palette name
  const styleName = style
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
  const moodName = mood
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
  const name = `${moodName} ${styleName}`

  // Generate tags
  const tags = [mood, style, category]

  return {
    id: Math.random().toString(36).substring(2, 9),
    name,
    colors: colorRoles,
    tags,
    contrastScores,
  }
}

// Generate multiple palettes
export function generatePalettes(questionnaire: PaletteQuestionnaire, count = 4): GeneratedPalette[] {
  const palettes: GeneratedPalette[] = []

  for (let i = 0; i < count; i++) {
    palettes.push(generatePalette(questionnaire))
  }

  return palettes
}
