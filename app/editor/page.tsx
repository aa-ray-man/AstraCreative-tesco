"use client"

import Image from "next/image";
import { Canvas } from "@/components/canvas-editor/canvas"
import { ImageUpload } from "@/components/canvas-editor/image-upload"
import { TextTools } from "@/components/canvas-editor/text-tools"
import { TextPanel } from "@/components/canvas-editor/text-panel"
import { ImagePanel } from "@/components/canvas-editor/image-panel"
import { LayersPanel } from "@/components/canvas-editor/layers-panel"
import { CanvasToolbar } from "@/components/canvas-editor/canvas-toolbar"
import { CompliancePanel } from "@/components/canvas-editor/compliance-panel"
import { ColorPalettePanel } from "@/components/canvas-editor/color-palette-panel"
import { useFormatSwitcher } from "@/hooks/use-format-switcher"
import { useCompliance } from "@/hooks/use-compliance"

export default function EditorPage() {
  const { switchFormat } = useFormatSwitcher()
  const { report, isChecking, checkCompliance } = useCompliance()

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="fixed-zoom border-b bg-background px-6 py-3 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">AstraCreative</h1>
        </div>

        <CanvasToolbar onFormatChange={switchFormat} />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="fixed-zoom w-64 border-r bg-background p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Tools</h2>
            <div className="flex flex-col gap-2">
              <ImageUpload />
              <TextTools />
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Properties</h2>
            <ImagePanel />
            <div className="mt-4">
              <TextPanel />
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 overflow-auto">
          <Canvas />
        </main>

        {/* Right Sidebar - Layers & Compliance */}
        <aside className="fixed-zoom w-80 border-l bg-background p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Layers</h2>
            <LayersPanel />
          </div>

          <div className="border-t pt-4">
            <CompliancePanel onCheckCompliance={checkCompliance} report={report} isChecking={isChecking} />
          </div>

          <div className="border-t pt-4">
            {/* <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Color Palette</h2> */}
            <ColorPalettePanel />
          </div>
        </aside>
      </div>
    </div>
  )
}
