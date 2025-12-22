"use client"

import { useCanvasStore } from "@/store/canvas-store"
import { CANVAS_FORMATS, type CanvasFormat } from "@/types/canvas-format"
import { Button } from "@/components/ui/button"
import { Maximize2 } from "lucide-react"

interface FormatSwitcherProps {
  onFormatChange: (format: CanvasFormat) => void
}

export function FormatSwitcher({ onFormatChange }: FormatSwitcherProps) {
  const { currentFormat } = useCanvasStore()

  const handleFormatClick = (format: CanvasFormat) => {
    if (format !== currentFormat) {
      onFormatChange(format)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Maximize2 className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground">Format:</span>
      <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
        {(Object.keys(CANVAS_FORMATS) as CanvasFormat[]).map((format) => {
          const formatInfo = CANVAS_FORMATS[format]
          const isActive = currentFormat === format

          return (
            <Button
              key={format}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleFormatClick(format)}
              className={`
                flex flex-col items-center gap-0.5 h-auto py-2 px-3 min-w-[80px]
                ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
              `}
            >
              <span className="text-xs font-semibold">{formatInfo.aspectRatio}</span>
              <span className="text-[10px] opacity-70">{formatInfo.label}</span>
              <span className="text-[9px] opacity-50 font-mono">
                {formatInfo.width}×{formatInfo.height}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
