import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Linkbird - Lead Management Platform",
  description: "Manage your leads and campaigns with Linkbird - the modern lead generation platform",
  generator: "v0.app",
  keywords: ["lead management", "CRM", "campaigns", "lead generation", "outreach"],
  authors: [{ name: "Linkbird Team" }],
  creator: "Linkbird",
  publisher: "Linkbird",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linkbird.ai",
    title: "Linkbird - Lead Management Platform",
    description: "Manage your leads and campaigns with Linkbird - the modern lead generation platform",
    siteName: "Linkbird",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkbird - Lead Management Platform",
    description: "Manage your leads and campaigns with Linkbird - the modern lead generation platform",
    creator: "@linkbird",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`h-full ${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans h-full antialiased">
        <div className="min-h-screen bg-background text-foreground">
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            {children}
          </Suspense>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
