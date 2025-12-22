"use client"

import * as fabric from "fabric"
import { useCanvasStore } from "@/store/canvas-store"
import { Button } from "@/components/ui/button"
import { Type, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef, useState } from "react"

export function TextTools() {
  const { canvas, addObject, customFonts, addCustomFont } = useCanvasStore()
  const headlineFontInputRef = useRef<HTMLInputElement>(null)
  const subheadFontInputRef = useRef<HTMLInputElement>(null)
  const [headlineCustomFont, setHeadlineCustomFont] = useState<string>("Arial")
  const [subheadCustomFont, setSubheadCustomFont] = useState<string>("Arial")

  const handleFontUpload = async (file: File, type: "headline" | "subhead") => {
    if (!file) return

    const fontName = file.name.replace(/\.[^/.]+$/, "")
    const fontUrl = URL.createObjectURL(file)

    // Load the font using CSS Font Loading API
    const fontFace = new FontFace(fontName, `url(${fontUrl})`)

    try {
      await fontFace.load()
      document.fonts.add(fontFace)

      // Store in canvas store
      addCustomFont(fontName, fontUrl)

      // Update the selected custom font
      if (type === "headline") {
        setHeadlineCustomFont(fontName)
      } else {
        setSubheadCustomFont(fontName)
      }
    } catch (error) {
      console.error("Failed to load font:", error)
    }
  }

  const addText = (type: "headline" | "subhead") => {
    if (!canvas) return

    const textContent = type === "headline" ? "Headline Text" : "Subhead Text"
    const fontSize = type === "headline" ? 48 : 32
    const fontFamily = type === "headline" ? headlineCustomFont : subheadCustomFont

    const text = new fabric.IText(textContent, {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: "#000000",
      originX: "center",
      originY: "center",
    })

    addObject(text)
    canvas.setActiveObject(text)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Headline Section */}
      <div className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/30">
        <Label className="text-xs font-semibold">Headline</Label>
        <Button onClick={() => addText("headline")} variant="outline" className="w-full justify-start gap-2">
          <Type className="w-4 h-4" />
          Add Headline
        </Button>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="headline-font" className="text-xs text-muted-foreground">
            Custom Font
          </Label>
          <div className="flex gap-2">
            <Input
              id="headline-font"
              ref={headlineFontInputRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFontUpload(file, "headline")
              }}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => headlineFontInputRef.current?.click()}
              className="flex-1 gap-2"
            >
              <Upload className="w-3 h-3" />
              Upload Font
            </Button>
          </div>
          {headlineCustomFont !== "Arial" && (
            <p className="text-xs text-muted-foreground">Current: {headlineCustomFont}</p>
          )}
        </div>
      </div>

      {/* Subheadline Section */}
      <div className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/30">
        <Label className="text-xs font-semibold">Subheadline</Label>
        <Button onClick={() => addText("subhead")} variant="outline" className="w-full justify-start gap-2">
          <Type className="w-4 h-4" />
          Add Subhead
        </Button>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="subhead-font" className="text-xs text-muted-foreground">
            Custom Font
          </Label>
          <div className="flex gap-2">
            <Input
              id="subhead-font"
              ref={subheadFontInputRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFontUpload(file, "subhead")
              }}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => subheadFontInputRef.current?.click()}
              className="flex-1 gap-2"
            >
              <Upload className="w-3 h-3" />
              Upload Font
            </Button>
          </div>
          {subheadCustomFont !== "Arial" && (
            <p className="text-xs text-muted-foreground">Current: {subheadCustomFont}</p>
          )}
        </div>
      </div>
    </div>
  )
}
