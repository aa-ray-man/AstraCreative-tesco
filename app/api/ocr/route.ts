export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { createWorker } from "tesseract.js"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl required" }, { status: 400 })
    }

    const worker = await createWorker("eng")
    const { data } = await worker.recognize(imageUrl)
    await worker.terminate()

    return NextResponse.json({ text: data.text })
  } catch (err: any) {
    console.error("OCR failed:", err)
    return NextResponse.json({ error: "OCR failed", detail: err?.message || String(err) }, { status: 500 })
  }
}
