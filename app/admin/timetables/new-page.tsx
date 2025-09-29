"use client"

import { useState } from "react"
import { TimetableDisplay } from "@/components/timetable-display"
import type { OptimizationResult } from "@/lib/timetable-engine/types"

export default function TimetablesPage() {
  const [currentResult, setCurrentResult] = useState<OptimizationResult | null>(null)

  // In a real implementation, this would fetch the latest timetable result
  // For now, we'll show the display component without data
  
  return <TimetableDisplay result={currentResult || undefined} />
}