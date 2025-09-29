import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Scheduler - Timetable Generation System",
  description: "AI-powered timetable generation system aligned with NEP 2020",
  generator: "v0.app",
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<LoadingFallback />}>
          <AuthProvider>
            <Navbar />
            <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
          </AuthProvider>
        </Suspense>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
