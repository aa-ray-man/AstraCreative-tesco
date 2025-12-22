export async function extractTextFromImage(imageData: string): Promise<string> {
  try {
    // Call the Node.js API route that handles tesseract properly
    const response = await fetch("/api/ocr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: imageData,
      }),
    })

    if (!response.ok) {
      console.error("OCR API request failed:", response.statusText)
      return ""
    }

    const result = await response.json()
    return result.text?.toLowerCase().trim() || ""
  } catch (error) {
    console.error("OCR extraction failed:", error)
    return ""
  }
}

export function extractTextFromObjects(objects: Array<{ type: string; text?: string }>): string {
  return objects
    .filter((obj) => obj.type === "text" && obj.text)
    .map((obj) => obj.text?.toLowerCase() || "")
    .join(" ")
}
