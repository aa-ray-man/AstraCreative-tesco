# Color Palette Generator

A fully working questionnaire-driven color palette generator for AstraCreative that generates professional, ColorHunt-style palettes.

## Features

- **Smart Questionnaire**: Short set of design questions to capture user preferences
- **Professional Palettes**: Generates 4-5 color palettes with proper roles (background, primary, accent, support, CTA)
- **Multiple Algorithms**: Supports 7 palette styles (Monochrome, Analogous, Complementary, Triadic, Contrast-forward, Pastel, Vibrant)
- **Category Heuristics**: Tailored color generation based on product category
- **Mood-based Generation**: Colors adapted to mood/tone preferences
- **WCAG Accessibility**: Built-in contrast checking and adjustment (AA & AAA levels)
- **ColorHunt-style UI**: Beautiful palette cards with large swatches
- **Save & Apply**: Save favorite palettes and apply them directly to canvas elements

## Usage

### Basic Flow

1. Open the Color Palette panel in the right sidebar
2. Fill out the questionnaire:
   - **Product Category**: Food & Beverage, Beauty, Electronics, etc.
   - **Primary Packaging Color**: Pick your brand/product color
   - **Mood/Tone**: Friendly, Luxury, Natural, Energetic, etc.
   - **Target Audience**: Mass market, Premium, Kids, Eco-conscious
   - **Accessibility Priority**: Off, WCAG AA, or WCAG AAA
   - **Palette Style**: Choose from 7 algorithmic styles
3. Click "Generate Palettes"
4. Review generated palettes with:
   - Color swatches
   - Contrast scores
   - Tags
5. Actions available:
   - **Apply**: Apply palette to canvas (background + text colors)
   - **Copy**: Copy all HEX codes to clipboard
   - **Save**: Save to "My Palettes" collection

### Palette Styles

#### Monochrome
Generates 5 shades of a single hue with varying lightness.

#### Analogous
Uses colors adjacent on the color wheel (base hue ±30°) plus neutrals.

#### Complementary
Pairs the base color with its opposite (180° on color wheel) plus neutrals.

#### Triadic
Uses three colors evenly spaced around the color wheel (120° apart).

#### Contrast-forward (ColorHunt-like)
Creates bold, high-contrast palettes with:
- Dark background
- Primary product color
- Bold accent (complementary)
- Light neutral
- Supporting color

#### Pastel
Reduces saturation and increases lightness for soft, gentle palettes.

#### Vibrant
Maximizes saturation for bold, energetic palettes.

## Algorithm Details

### Category Hue Biases

Each product category has preferred hue ranges:

- **Food & Beverage**: Warm hues (0-60°) - reds, oranges, yellows
- **Beauty/Personal Care**: Pinks, purples (280-350°)
- **Electronics**: Cool blues, teals (180-220°)
- **Home**: Muted warm neutrals (30-50°)
- **Fashion**: Wide range, high saturation
- **Baby/Kids**: Bright saturated primaries
- **Beverage/Alcohol**: Deep jewel tones
- **Pet**: Earthy tones, green/blue accents

### Mood Adjustments

Each mood affects saturation, lightness, and contrast:

- **Friendly**: Medium-high saturation, medium lightness, medium contrast
- **Luxury**: Low saturation, high contrast (dark + bright accent)
- **Natural/Earthy**: Low-mid saturation, earthy lightness
- **Energetic**: High saturation + high lightness accents
- **Minimal/Modern**: Low saturation, high lightness neutrals
- **Retro/Vintage**: Slightly desaturated, warm midtones
- **Playful**: High saturation, varied brightness

### Color Roles

Each palette assigns 5 colors with specific roles:

1. **Background**: Usually lightest, low saturation for neutral base
2. **Primary**: Mid-tone representing product/brand color
3. **Accent**: Most saturated, used for highlights and emphasis
4. **Support**: Secondary neutral, supports primary
5. **CTA**: High contrast color for buttons and calls-to-action

### Accessibility

When WCAG compliance is requested, the generator:

1. Checks contrast ratios between foreground and background colors
2. Adjusts lightness iteratively to meet target ratios:
   - **WCAG AA**: 4.5:1 minimum
   - **WCAG AAA**: 7:1 minimum
3. Preserves hue and saturation while adjusting lightness
4. Focuses on CTA and accent colors for maximum legibility

## Technical Stack

- **chroma-js**: Color manipulation and conversion
- **Deterministic Algorithms**: No external AI APIs required
- **localStorage**: Palette persistence
- **React + TypeScript**: Type-safe component structure
- **Tailwind CSS**: Styling
- **Zustand**: Canvas state management

## API Reference

### Types

```typescript
type ProductCategory = "food-beverage" | "beauty-personal-care" | "electronics" | ...
type MoodTone = "friendly" | "luxury" | "natural-earthy" | ...
type PaletteStyle = "monochrome" | "analogous" | "complementary" | ...
type AccessibilityLevel = "off" | "wcag-aa" | "wcag-aaa"

interface ColorRole {
  role: "background" | "primary" | "accent" | "support" | "cta"
  hex: string
  name?: string
}

interface GeneratedPalette {
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
```

### Functions

```typescript
// Generate single palette
generatePalette(questionnaire: PaletteQuestionnaire): GeneratedPalette

// Generate multiple palettes
generatePalettes(questionnaire: PaletteQuestionnaire, count: number): GeneratedPalette[]

// Storage utilities
getSavedPalettes(): GeneratedPalette[]
savePalette(palette: GeneratedPalette): void
removePalette(paletteId: string): void
```

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- Palette generation for all styles
- Color role assignment
- WCAG contrast compliance
- Category-based hue selection
- Mood-based adjustments
- Multiple palette generation

## Future Enhancements

Potential improvements:
- Export palettes as JSON/CSS/Sass
- Import palettes from ColorHunt/Coolors
- Palette history/undo
- AI-powered palette naming
- Gradient generation
- Color blindness simulation
- Custom role definition
