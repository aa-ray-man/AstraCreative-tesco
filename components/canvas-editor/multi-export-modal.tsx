"use client"

import { useState } from "react"
import { useCanvasStore } from "@/store/canvas-store"
import { exportAllFormats, downloadAllExports, type ExportResult } from "@/utils/multi-format-export"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, CheckCircle2, Layers } from "lucide-react"
import { CANVAS_FORMATS } from "@/types/canvas-format"

export function MultiExportModal() {
  const { canvas, currentFormat } = useCanvasStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportResults, setExportResults] = useState<ExportResult[]>([])

  const handleExportAll = async (fileFormat: "png" | "jpeg") => {
    if (!canvas) return

    setIsExporting(true)
    setExportResults([])

    try {
      const results = await exportAllFormats(canvas, currentFormat, fileFormat)
      setExportResults(results)

      // Auto-download all formats
      downloadAllExports(results)

      // Show success state briefly then close
      setTimeout(() => {
        setIsOpen(false)
        setExportResults([])
      }, 2000)
    } catch (error) {
      console.error("Multi-export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const resetModal = () => {
    setExportResults([])
    setIsExporting(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetModal()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Layers className="w-4 h-4" />
          Export All Formats
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export All Formats</DialogTitle>
          <DialogDescription>Export your design in all three social media formats at once.</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Format Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Formats to export:</p>
            <div className="grid grid-cols-3 gap-2">
              {(["1:1", "9:16", "1.91:1"] as const).map((format) => {
                const info = CANVAS_FORMATS[format]
                const isExported = exportResults.some((r) => r.format === format)

                return (
                  <div key={format} className="flex flex-col items-center p-3 rounded-lg border bg-muted/30 relative">
                    {isExported && <CheckCircle2 className="w-4 h-4 text-green-600 absolute top-2 right-2" />}
                    <div className="text-sm font-semibold">{info.aspectRatio}</div>
                    <div className="text-xs text-muted-foreground">{info.label}</div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">
                      {info.width}×{info.height}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Export Options */}
          {!isExporting && exportResults.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Choose export format:</p>

              <Button onClick={() => handleExportAll("png")} className="w-full justify-start gap-3" size="lg">
                <div className="flex-1 text-left">
                  <div className="font-semibold">PNG (Recommended)</div>
                  <div className="text-xs opacity-80">High quality, supports transparency</div>
                </div>
              </Button>

              <Button
                onClick={() => handleExportAll("jpeg")}
                variant="outline"
                className="w-full justify-start gap-3 bg-transparent"
                size="lg"
              >
                <div className="flex-1 text-left">
                  <div className="font-semibold">JPEG</div>
                  <div className="text-xs opacity-80">Compressed, smaller file size (&lt;500KB)</div>
                </div>
              </Button>
            </div>
          )}

          {/* Exporting State */}
          {isExporting && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Exporting all formats...</p>
              <p className="text-xs text-muted-foreground">This may take a few seconds</p>
            </div>
          )}

          {/* Success State */}
          {exportResults.length === 3 && !isExporting && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
              <p className="text-sm font-medium">All formats exported successfully!</p>
              <p className="text-xs text-muted-foreground">Check your downloads folder</p>
            </div>
          )}
        </div>

        {!isExporting && exportResults.length === 0 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            All formats will be downloaded automatically
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
