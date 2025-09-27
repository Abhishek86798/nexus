"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home } from "lucide-react"

export function DemoNav() {
  return (
    <div className="fixed top-4 left-4 z-50 flex space-x-2">
      <Button asChild variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
        <Link href="/">
          <Home className="w-4 h-4 mr-2" />
          Home
        </Link>
      </Button>
    </div>
  )
}
