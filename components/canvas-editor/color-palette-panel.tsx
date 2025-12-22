"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, Palette, Save, Sparkles } from "lucide-react"
import { generatePalettes } from "@/lib/palette-generator"
import { savePalette, getSavedPalettes, removePalette } from "@/lib/palette-storage"
import { useCanvasStore } from "@/store/canvas-store"
import { useToast } from "@/hooks/use-toast"
import type {
  ProductCategory,
  MoodTone,
  TargetAudience,
  AccessibilityLevel,
  PaletteStyle,
  PaletteQuestionnaire,
  GeneratedPalette,
} from "@/types/color-palette"

export function ColorPalettePanel() {
  const { canvas } = useCanvasStore()
  const { toast } = useToast()

  // Questionnaire state
  const [category, setCategory] = useState<ProductCategory>("food-beverage")
  const [primaryColor, setPrimaryColor] = useState("#FF6B6B")
  const [mood, setMood] = useState<MoodTone>("friendly")
  const [targetAudience, setTargetAudience] = useState<TargetAudience[]>(["mass-market"])
  const [accessibilityLevel, setAccessibilityLevel] = useState<AccessibilityLevel>("off")
  const [style, setStyle] = useState<PaletteStyle>("analogous")

  // Generated palettes
  const [generatedPalettes, setGeneratedPalettes] = useState<GeneratedPalette[]>([])
  const [savedPalettes, setSavedPalettes] = useState<GeneratedPalette[]>(getSavedPalettes())
  const [copiedColorKey, setCopiedColorKey] = useState<string | null>(null)

  const handleGeneratePalettes = () => {
    const questionnaire: PaletteQuestionnaire = {
      category,
      primaryColor,
      mood,
      targetAudience,
      accessibilityLevel,
      style,
    }

    const palettes = generatePalettes(questionnaire, 4)
    setGeneratedPalettes(palettes)

    toast({
      title: "Palettes Generated",
      description: `Created ${palettes.length} color palettes based on your preferences.`,
    })
  }

  const handleCopyColor = (paletteId: string, colorIndex: number, hex: string) => {
    navigator.clipboard.writeText(hex)
    const key = `${paletteId}-${colorIndex}`
    setCopiedColorKey(key)

    setTimeout(() => setCopiedColorKey(null), 1500)

    toast({
      title: "Copied",
      description: `${hex} copied to clipboard`,
    })
  }

  const handleSavePalette = (palette: GeneratedPalette) => {
    savePalette(palette)
    setSavedPalettes(getSavedPalettes())

    toast({
      title: "Palette Saved",
      description: "Palette added to your collection",
    })
  }

  const handleRemovePalette = (paletteId: string) => {
    removePalette(paletteId)
    setSavedPalettes(getSavedPalettes())

    toast({
      title: "Palette Removed",
      description: "Palette removed from your collection",
    })
  }

  const handleApplyPalette = (palette: GeneratedPalette) => {
    if (!canvas) return

    // Apply background color
    const background = palette.colors.find((c) => c.role === "background")
    if (background) {
      canvas.backgroundColor = background.hex
    }

    // Update text objects with primary color
    const primary = palette.colors.find((c) => c.role === "primary")
    if (primary) {
      canvas.getObjects().forEach((obj) => {
        if (obj.type === "i-text" || obj.type === "text") {
          obj.set({ fill: primary.hex })
        }
      })
    }

    canvas.renderAll()

    toast({
      title: "Palette Applied",
      description: "Colors applied to canvas elements",
    })
  }

  const toggleAudience = (value: TargetAudience) => {
    setTargetAudience((prev) => (prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5" />
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Color Palettes</h2>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="saved">Saved ({savedPalettes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4 mt-4">
          {/* Questionnaire */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Palette Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Category */}
              <div className="space-y-2">
                <Label className="text-xs">Product Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                    <SelectItem value="beauty-personal-care">Beauty/Personal Care</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="baby-kids">Baby/Kids</SelectItem>
                    <SelectItem value="beverage-alcohol">Beverage/Alcohol</SelectItem>
                    <SelectItem value="pet">Pet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Color */}
              <div className="space-y-2">
                <Label className="text-xs">Primary Packaging Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-16 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="text-sm flex-1"
                  />
                </div>
              </div>

              {/* Mood / Tone */}
              <div className="space-y-2">
                <Label className="text-xs">Mood / Tone</Label>
                <RadioGroup value={mood} onValueChange={(v) => setMood(v as MoodTone)} className="gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="friendly" id="friendly" />
                    <Label htmlFor="friendly" className="text-xs font-normal cursor-pointer">
                      Friendly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="luxury" id="luxury" />
                    <Label htmlFor="luxury" className="text-xs font-normal cursor-pointer">
                      Luxury
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="natural-earthy" id="natural" />
                    <Label htmlFor="natural" className="text-xs font-normal cursor-pointer">
                      Natural/Earthy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="energetic" id="energetic" />
                    <Label htmlFor="energetic" className="text-xs font-normal cursor-pointer">
                      Energetic
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal-modern" id="minimal" />
                    <Label htmlFor="minimal" className="text-xs font-normal cursor-pointer">
                      Minimal/Modern
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="retro-vintage" id="retro" />
                    <Label htmlFor="retro" className="text-xs font-normal cursor-pointer">
                      Retro/Vintage
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="playful" id="playful" />
                    <Label htmlFor="playful" className="text-xs font-normal cursor-pointer">
                      Playful
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label className="text-xs">Target Audience</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mass-market"
                      checked={targetAudience.includes("mass-market")}
                      onCheckedChange={() => toggleAudience("mass-market")}
                    />
                    <Label htmlFor="mass-market" className="text-xs font-normal cursor-pointer">
                      Mass Market
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="premium"
                      checked={targetAudience.includes("premium")}
                      onCheckedChange={() => toggleAudience("premium")}
                    />
                    <Label htmlFor="premium" className="text-xs font-normal cursor-pointer">
                      Premium
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="kids"
                      checked={targetAudience.includes("kids")}
                      onCheckedChange={() => toggleAudience("kids")}
                    />
                    <Label htmlFor="kids" className="text-xs font-normal cursor-pointer">
                      Kids
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="eco"
                      checked={targetAudience.includes("eco-conscious")}
                      onCheckedChange={() => toggleAudience("eco-conscious")}
                    />
                    <Label htmlFor="eco" className="text-xs font-normal cursor-pointer">
                      Eco-conscious
                    </Label>
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="space-y-2">
                <Label className="text-xs">Accessibility Priority</Label>
                <Select
                  value={accessibilityLevel}
                  onValueChange={(v) => setAccessibilityLevel(v as AccessibilityLevel)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Off</SelectItem>
                    <SelectItem value="wcag-aa">WCAG AA (4.5:1)</SelectItem>
                    <SelectItem value="wcag-aaa">WCAG AAA (7:1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Palette Style */}
              <div className="space-y-2">
                <Label className="text-xs">Palette Style</Label>
                <Select value={style} onValueChange={(v) => setStyle(v as PaletteStyle)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monochrome">Monochrome</SelectItem>
                    <SelectItem value="analogous">Analogous</SelectItem>
                    <SelectItem value="complementary">Complementary</SelectItem>
                    <SelectItem value="triadic">Triadic</SelectItem>
                    <SelectItem value="contrast-forward">Contrast-forward (ColorHunt-like)</SelectItem>
                    <SelectItem value="pastel">Pastel</SelectItem>
                    <SelectItem value="vibrant">Vibrant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGeneratePalettes} className="w-full">
                Generate Palettes
              </Button>
            </CardContent>
          </Card>

          {/* Generated Palettes */}
          {generatedPalettes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Generated Palettes</h3>
              {generatedPalettes.map((palette) => (
                <PaletteCard
                  key={palette.id}
                  palette={palette}
                  onCopyColor={handleCopyColor}
                  onSave={handleSavePalette}
                  onApply={handleApplyPalette}
                  copiedColorKey={copiedColorKey}
                  isSaved={savedPalettes.some((p) => p.id === palette.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-3 mt-4">
          {savedPalettes.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No saved palettes yet</div>
          ) : (
            savedPalettes.map((palette) => (
              <PaletteCard
                key={palette.id}
                palette={palette}
                onCopyColor={handleCopyColor}
                onRemove={handleRemovePalette}
                onApply={handleApplyPalette}
                copiedColorKey={copiedColorKey}
                isSaved={true}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Palette Card Component
interface PaletteCardProps {
  palette: GeneratedPalette
  onCopyColor: (paletteId: string, colorIndex: number, hex: string) => void
  onSave?: (palette: GeneratedPalette) => void
  onRemove?: (paletteId: string) => void
  onApply: (palette: GeneratedPalette) => void
  copiedColorKey: string | null
  isSaved: boolean
}

function PaletteCard({ palette, onCopyColor, onSave, onRemove, onApply, copiedColorKey, isSaved }: PaletteCardProps) {
  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        {/* Palette Name */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-sm">{palette.name}</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {palette.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex gap-1 rounded overflow-hidden h-16">
          {palette.colors.map((color, idx) => {
            const swatchKey = `${palette.id}-${idx}`
            const isCopied = copiedColorKey === swatchKey

            return (
              <button
                key={idx}
                className="flex-1 group relative cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                style={{ backgroundColor: color.hex }}
                onClick={() => onCopyColor(palette.id, idx, color.hex)}
                title={`${color.role}: ${color.hex} - Click to copy`}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                {isCopied && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Contrast Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Text on BG:</span>
            <span className="font-mono">{palette.contrastScores.textOnBackground.toFixed(1)}:1</span>
          </div>
          <div className="flex justify-between">
            <span>CTA Contrast:</span>
            <span className="font-mono">{palette.contrastScores.ctaContrast.toFixed(1)}:1</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onApply(palette)} className="flex-1">
            Apply
          </Button>
          {!isSaved && onSave && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSave(palette)}
              className="aspect-square p-0"
              title="Save palette"
            >
              <Save className="w-4 h-4" />
            </Button>
          )}
          {isSaved && onRemove && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemove(palette.id)}
              className="aspect-square p-0"
              title="Remove palette"
            >
              ×
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
