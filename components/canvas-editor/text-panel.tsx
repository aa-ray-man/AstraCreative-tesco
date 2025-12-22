"use client"

import { useEffect, useState } from "react"
import type * as fabric from "fabric"
import { useCanvasStore } from "@/store/canvas-store"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TextPanel() {
  const { selectedObject, canvas } = useCanvasStore()
  const [textContent, setTextContent] = useState("")
  const [textColor, setTextColor] = useState("#000000")
  const [fontSize, setFontSize] = useState(32)

  // Check if selected object is text
  const isTextObject = selectedObject && (selectedObject.type === "i-text" || selectedObject.type === "text")

  // Update local state when selection changes
  useEffect(() => {
    if (isTextObject) {
      const textObj = selectedObject as fabric.IText
      setTextContent(textObj.text || "")
      setTextColor((textObj.fill as string) || "#000000")
      setFontSize(textObj.fontSize || 32)
    }
  }, [isTextObject, selectedObject])

  if (!isTextObject) {
    return <div className="text-sm text-muted-foreground">Select a text object to edit its properties</div>
  }

  const textObj = selectedObject as fabric.IText

  // Update text content
  const handleTextChange = (value: string) => {
    setTextContent(value)
    textObj.set({ text: value })
    canvas?.renderAll()
  }

  // Update text color
  const handleColorChange = (value: string) => {
    setTextColor(value)
    textObj.set({ fill: value })
    canvas?.renderAll()
  }

  // Update font size
  const handleFontSizeChange = (value: number) => {
    setFontSize(value)
    textObj.set({ fontSize: value })
    canvas?.renderAll()
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border">
      <div className="font-semibold text-sm">Text Properties</div>

      {/* Text Content */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="text-content" className="text-xs">
          Text Content
        </Label>
        <Input
          id="text-content"
          value={textContent}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Enter text..."
          className="text-sm"
        />
      </div>

      {/* Text Color */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="text-color" className="text-xs">
          Text Color
        </Label>
        <div className="flex gap-2 items-center">
          <Input
            id="text-color"
            type="color"
            value={textColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-10 w-16 cursor-pointer"
          />
          <Input
            type="text"
            value={textColor}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#000000"
            className="text-sm flex-1"
          />
        </div>
      </div>

      {/* Font Size */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="font-size" className="text-xs">
          Font Size
        </Label>
        <div className="flex gap-2 items-center">
          <Input
            id="font-size"
            type="range"
            min="12"
            max="120"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="flex-1"
          />
          <Input
            type="number"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="w-16 text-sm"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 pt-2 border-t">
        <Button size="sm" variant="outline" onClick={() => handleFontSizeChange(fontSize + 4)} className="flex-1">
          A+
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFontSizeChange(Math.max(12, fontSize - 4))}
          className="flex-1"
        >
          A-
        </Button>
      </div>
    </div>
  )
}
