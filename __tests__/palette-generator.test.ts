import { describe, it, expect } from "@jest/globals"
import { generatePalette, generatePalettes } from "@/lib/palette-generator"
import chroma from "chroma-js"
import type { PaletteQuestionnaire } from "@/types/color-palette"

describe("Palette Generator", () => {
  const baseQuestionnaire: PaletteQuestionnaire = {
    category: "food-beverage",
    primaryColor: "#FF6B6B",
    mood: "friendly",
    targetAudience: ["mass-market"],
    accessibilityLevel: "off",
    style: "analogous",
  }

  describe("generatePalette", () => {
    it("should generate a palette with 5 colors", () => {
      const palette = generatePalette(baseQuestionnaire)
      expect(palette.colors).toHaveLength(5)
    })

    it("should assign correct roles to colors", () => {
      const palette = generatePalette(baseQuestionnaire)
      const roles = palette.colors.map((c) => c.role)

      expect(roles).toContain("background")
      expect(roles).toContain("primary")
      expect(roles).toContain("accent")
      expect(roles).toContain("support")
      expect(roles).toContain("cta")
    })

    it("should generate valid hex colors", () => {
      const palette = generatePalette(baseQuestionnaire)

      palette.colors.forEach((color) => {
        expect(color.hex).toMatch(/^#[0-9A-F]{6}$/i)
        expect(() => chroma(color.hex)).not.toThrow()
      })
    })

    it("should include contrast scores", () => {
      const palette = generatePalette(baseQuestionnaire)

      expect(palette.contrastScores).toHaveProperty("textOnBackground")
      expect(palette.contrastScores).toHaveProperty("textOnPrimary")
      expect(palette.contrastScores).toHaveProperty("ctaContrast")
    })

    it("should generate different palettes for different styles", () => {
      const styles = ["monochrome", "analogous", "complementary", "triadic", "contrast-forward"] as const

      const palettes = styles.map((style) =>
        generatePalette({
          ...baseQuestionnaire,
          style,
        }),
      )

      // Check that palettes have different color sets
      const hexSets = palettes.map((p) =>
        p.colors
          .map((c) => c.hex)
          .sort()
          .join(","),
      )
      const uniqueHexSets = new Set(hexSets)
      expect(uniqueHexSets.size).toBeGreaterThan(1)
    })

    it("should respect accessibility requirements for WCAG AA", () => {
      const palette = generatePalette({
        ...baseQuestionnaire,
        accessibilityLevel: "wcag-aa",
      })

      const background = chroma(palette.colors.find((c) => c.role === "background")?.hex || "#fff")
      const cta = chroma(palette.colors.find((c) => c.role === "cta")?.hex || "#000")

      const contrast = chroma.contrast(cta, background)
      expect(contrast).toBeGreaterThanOrEqual(4.5)
    })

    it("should respect accessibility requirements for WCAG AAA", () => {
      const palette = generatePalette({
        ...baseQuestionnaire,
        accessibilityLevel: "wcag-aaa",
      })

      const background = chroma(palette.colors.find((c) => c.role === "background")?.hex || "#fff")
      const cta = chroma(palette.colors.find((c) => c.role === "cta")?.hex || "#000")

      const contrast = chroma.contrast(cta, background)
      expect(contrast).toBeGreaterThanOrEqual(7.0)
    })
  })

  describe("generatePalettes", () => {
    it("should generate multiple palettes", () => {
      const palettes = generatePalettes(baseQuestionnaire, 4)
      expect(palettes).toHaveLength(4)
    })

    it("should generate unique palettes", () => {
      const palettes = generatePalettes(baseQuestionnaire, 4)
      const hexSets = palettes.map((p) =>
        p.colors
          .map((c) => c.hex)
          .sort()
          .join(","),
      )
      const uniqueHexSets = new Set(hexSets)

      // At least some variation (due to randomness, not all may be unique)
      expect(uniqueHexSets.size).toBeGreaterThan(1)
    })

    it("should assign unique IDs to each palette", () => {
      const palettes = generatePalettes(baseQuestionnaire, 4)
      const ids = palettes.map((p) => p.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(4)
    })
  })

  describe("Category-based generation", () => {
    it("should generate appropriate palettes for different categories", () => {
      const categories = ["food-beverage", "electronics", "beauty-personal-care"] as const

      categories.forEach((category) => {
        const palette = generatePalette({
          ...baseQuestionnaire,
          category,
        })

        expect(palette.colors).toHaveLength(5)
        expect(palette.tags).toContain(category)
      })
    })
  })

  describe("Mood-based generation", () => {
    it("should generate palettes with appropriate characteristics for luxury mood", () => {
      const palette = generatePalette({
        ...baseQuestionnaire,
        mood: "luxury",
      })

      // Luxury should have high contrast
      expect(palette.contrastScores.ctaContrast).toBeGreaterThan(3)
    })

    it("should generate palettes for all moods", () => {
      const moods = [
        "friendly",
        "luxury",
        "natural-earthy",
        "energetic",
        "minimal-modern",
        "retro-vintage",
        "playful",
      ] as const

      moods.forEach((mood) => {
        const palette = generatePalette({
          ...baseQuestionnaire,
          mood,
        })

        expect(palette.colors).toHaveLength(5)
        expect(palette.name).toContain(
          mood
            .split("-")
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" "),
        )
      })
    })
  })
})
