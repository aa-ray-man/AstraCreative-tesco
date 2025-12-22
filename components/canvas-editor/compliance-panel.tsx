"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react"
import type { ComplianceReport, ComplianceRule } from "@/types/compliance"

interface CompliancePanelProps {
  onCheckCompliance: () => Promise<void>
  report: ComplianceReport | null
  isChecking: boolean
}

export function CompliancePanel({ onCheckCompliance, report, isChecking }: CompliancePanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Link
            href="/tesco-guidelines.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h2 className="text-lg font-semibold hover:underline cursor-pointer">
              Compliance Check 
            </h2>
          </Link>
        </h2>
        <Button onClick={onCheckCompliance} disabled={isChecking} size="sm">
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              {/* <ShieldCheck className="mr-2 h-4 w-4" /> */}
              Check Compliance
            </>
          )}
        </Button>
      </div>

      {report && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            {report.overallStatus === "pass" && (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-600">All Checks Passed</span>
              </>
            )}
            {report.overallStatus === "warning" && (
              <>
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-600">Warnings Detected</span>
              </>
            )}
            {report.overallStatus === "fail" && (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-600">Compliance Failed</span>
              </>
            )}
          </div>

          <Accordion type="single" collapsible className="w-full">
            {/* Violations */}
            {report.violations.length > 0 && (
              <AccordionItem value="violations">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="rounded-full">
                      {report.violations.length}
                    </Badge>
                    <span>Violations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {report.violations.map((violation, index) => (
                      <ComplianceRuleItem key={index} rule={violation} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Warnings */}
            {report.warnings.length > 0 && (
              <AccordionItem value="warnings">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full bg-yellow-100 text-yellow-800">
                      {report.warnings.length}
                    </Badge>
                    <span>Warnings</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {report.warnings.map((warning, index) => (
                      <ComplianceRuleItem key={index} rule={warning} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Passed Checks */}
            <AccordionItem value="passed">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-full bg-green-100 text-green-800">
                    {10 - report.violations.length - report.warnings.length}
                  </Badge>
                  <span>Passed Checks</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {/* Show all rules that passed */}
                  {[
                    "Price Claims",
                    "Sustainability Claims",
                    "Competitions",
                    "Charity Partnership",
                    "Drinkaware Lock-up",
                    "Safe Zone Compliance",
                    "Minimum Font Size",
                    "Contrast Check",
                    "Tesco Tag Restrictions",
                    "Layer Overlaps",
                  ]
                    .filter(
                      (ruleName) =>
                        !report.violations.some((v) => v.rule === ruleName) &&
                        !report.warnings.some((w) => w.rule === ruleName),
                    )
                    .map((ruleName, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-green-900">{ruleName}</div>
                          <div className="text-sm text-green-700 mt-1">Check passed</div>
                        </div>
                      </div>
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-4 text-xs text-muted-foreground">
            Last checked: {new Date(report.timestamp).toLocaleString()}
          </div>
        </Card>
      )}

      {!report && !isChecking && (
        <Card className="p-8 text-center text-muted-foreground">
          <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Click "Check Compliance" to validate your creative against Tesco guidelines.</p>
        </Card>
      )}
    </div>
  )
}

function ComplianceRuleItem({ rule }: { rule: ComplianceRule }) {
  const getIcon = () => {
    switch (rule.status) {
      case "pass":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getBgColor = () => {
    switch (rule.status) {
      case "pass":
        return "bg-green-50 border-green-200"
      case "fail":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
    }
  }

  const getTextColor = () => {
    switch (rule.status) {
      case "pass":
        return "text-green-900"
      case "fail":
        return "text-red-900"
      case "warning":
        return "text-yellow-900"
    }
  }

  const getDetailColor = () => {
    switch (rule.status) {
      case "pass":
        return "text-green-700"
      case "fail":
        return "text-red-700"
      case "warning":
        return "text-yellow-700"
    }
  }

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${getBgColor()}`}>
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <div className={`font-medium ${getTextColor()}`}>{rule.rule}</div>
        <div className={`text-sm mt-1 ${getDetailColor()}`}>{rule.message}</div>
        {rule.details && <div className={`text-xs mt-2 ${getDetailColor()} opacity-80`}>{rule.details}</div>}
      </div>
    </div>
  )
}
