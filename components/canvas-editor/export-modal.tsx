"use client"

import { useState } from "react"
import { useCanvasStore } from "@/store/canvas-store"
import { exportAsPNG, exportAsJPEG } from "@/utils/export-image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, FileImage } from "lucide-react"

export function ExportModal() {
  const { canvas } = useCanvasStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleExportPNG = () => {
    if (!canvas) return
    exportAsPNG(canvas)
    setIsOpen(false)
  }

  const handleExportJPEG = () => {
    if (!canvas) return
    exportAsJPEG(canvas)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
          <DialogDescription>Choose your preferred format to download your design.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          {/* PNG Export */}
          <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="p-2 rounded-md bg-background">
              <FileImage className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">PNG Format</h3>
              <p className="text-xs text-muted-foreground mb-3">
                High quality with transparency support. Best for web use and editing.
              </p>
              <Button onClick={handleExportPNG} size="sm" className="w-full">
                Download PNG
              </Button>
            </div>
          </div>

          {/* JPEG Export */}
          <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="p-2 rounded-md bg-background">
              <FileImage className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">JPEG Format</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Compressed format with smaller file size. Perfect for sharing and printing.
              </p>
              <Button onClick={handleExportJPEG} size="sm" variant="outline" className="w-full bg-transparent">
                Download JPEG
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Export resolution: 1080 × 1080 pixels
        </div>
      </DialogContent>
    </Dialog>
  )
}
