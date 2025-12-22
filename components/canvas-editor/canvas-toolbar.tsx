"use client"

import { useState } from "react"
import { useCanvasStore } from "@/store/canvas-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RotateCcw, Palette } from "lucide-react"
import { ExportModal } from "@/components/canvas-editor/export-modal"
import { MultiExportModal } from "@/components/canvas-editor/multi-export-modal"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormatSwitcher } from "@/components/canvas-editor/format-switcher"
import type { CanvasFormat } from "@/types/canvas-format"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CanvasToolbarProps {
  onFormatChange: (format: CanvasFormat) => void
}

export function CanvasToolbar({ onFormatChange }: CanvasToolbarProps) {
  const { backgroundColor, setBackgroundColor, canvas } = useCanvasStore()
  const [colorInput, setColorInput] = useState(backgroundColor)

  const handleColorChange = (color: string) => {
    setColorInput(color)
    setBackgroundColor(color)
  }

  const handleReset = () => {
    if (canvas) {
      // Remove all objects
      canvas.clear()
      // Reset background color
      setBackgroundColor("#FFFFFF")
      setColorInput("#FFFFFF")
    }
  }

  return (
    <div className="flex items-center gap-4">
      {/* Format Switcher */}
      <FormatSwitcher onFormatChange={onFormatChange} />

      <div className="w-px h-6 bg-border" />

      {/* Background Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Palette className="w-4 h-4" />
            Background
            <div className="w-5 h-5 rounded border border-border" style={{ backgroundColor }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="flex flex-col gap-3">
            <div className="font-semibold text-sm">Background Color</div>

            <div className="flex gap-2 items-center">
              <Input
                type="color"
                value={colorInput}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-10 w-16 cursor-pointer"
              />
              <Input
                type="text"
                value={colorInput}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#FFFFFF"
                className="text-sm flex-1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Presets</Label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  "#FFFFFF",
                  "#F5F5F5",
                  "#E5E5E5",
                  "#FF6B6B",
                  "#4ECDC4",
                  "#45B7D1",
                  "#FFA07A",
                  "#98D8C8",
                  "#6C5CE7",
                  "#FFD93D",
                  "#95E1D3",
                  "#C7CEEA",
                ].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-full aspect-square rounded border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Reset Canvas with confirmation dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            Reset Canvas
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all objects on the canvas and reset the background color. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>Reset Canvas</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center gap-2">
        <ExportModal />
        <MultiExportModal />
      </div>
    </div>
  )
}
