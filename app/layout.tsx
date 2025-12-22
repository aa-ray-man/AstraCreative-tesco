import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// <CHANGE> Updated metadata for AstraCreative
export const metadata: Metadata = {
  title: "AstraCreative - AI-Powered Creative Builder",
  description: "Build stunning retail media ads with AI-powered creative tools",
  icons: {
    icon: [
      {
        url: "/astracreative-logo.png",
        media: "(prefers-color-scheme: light)",
      }
    ],
    apple: "/astracreative-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
