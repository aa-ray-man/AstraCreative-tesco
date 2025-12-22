export type ComplianceStatus = "pass" | "fail" | "warning"

export interface ComplianceRule {
  rule: string
  status: ComplianceStatus
  message: string
  details?: string
  affectedObjects?: string[]
}

export interface ComplianceReport {
  overallStatus: ComplianceStatus
  violations: ComplianceRule[]
  warnings: ComplianceRule[]
  timestamp: string
}

export interface ComplianceCheckRequest {
  canvasData: {
    objects: CanvasObjectData[]
    backgroundColor: string
    width: number
    height: number
    format: string
  }
  screenshot?: string // base64 PNG
  productType?: "alcohol" | "non-alcohol"
  tescoTag?: string
}

export interface CanvasObjectData {
  type: "image" | "text"
  id: string
  x: number
  y: number
  width: number
  height: number
  text?: string
  fontSize?: number
  fill?: string
  fontFamily?: string
  imageName?: string
  isDrinkaware?: boolean
  zIndex?: number
}
