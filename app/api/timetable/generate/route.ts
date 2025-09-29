import { type NextRequest, NextResponse } from "next/server"
import { HybridTimetableEngine } from "@/lib/timetable-engine/hybrid-engine"
import { ORToolsCPSATSolver } from "@/lib/timetable-engine/ortools-cp-sat-solver"
import { samplePrograms, sampleFaculty, sampleClassrooms, sampleTimeSlots, sampleStudents } from "@/lib/sample-data"
import type { GenerationConfig } from "@/lib/timetable-engine/types"
import type { Preference } from "@/lib/types"

// Mock preferences data
const mockPreferences: Preference[] = [
  {
    id: 1,
    entity_type: "faculty",
    entity_id: 1,
    preference_text: "Prof. Sharma prefers morning slots",
    constraint_type: "time_preference",
    priority: 8,
    is_hard_constraint: false,
  },
  {
    id: 2,
    entity_type: "faculty",
    entity_id: 2,
    preference_text: "Prof. Patel needs lab access for database courses",
    constraint_type: "room_preference",
    priority: 9,
    is_hard_constraint: true,
  },
  {
    id: 3,
    entity_type: "faculty",
    entity_id: 4,
    preference_text: "Prof. Singh cannot teach on Friday afternoons",
    constraint_type: "time_preference",
    priority: 10,
    is_hard_constraint: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const config: GenerationConfig = {
      academic_year: body.academic_year || "2024-25",
      week_number: body.week_number || 1,
      optimization_strategy: body.optimization_strategy || "hybrid",
      max_iterations: body.max_iterations || 100,
      time_limit_seconds: body.time_limit_seconds || 30,
      allow_conflicts: body.allow_conflicts || false,
    }

    console.log("[v0] Starting timetable generation with config:", config)

    let result
    
    if (config.optimization_strategy === "or_tools") {
      // Use Google OR-Tools inspired CP-SAT solver
      console.log("[v0] Using OR-Tools CP-SAT solver")
      const solver = new ORToolsCPSATSolver(
        samplePrograms,
        sampleFaculty,
        sampleClassrooms,
        sampleTimeSlots,
        sampleStudents
      )
      
      // Configure solver parameters
      solver.setMaxSolveTime(config.time_limit_seconds)
      solver.enableLogging(true)
      
      result = await solver.solve()
    } else {
      // Use existing hybrid engine
      const engine = new HybridTimetableEngine()
      result = await engine.generateTimetable(
        samplePrograms,
        sampleFaculty,
        sampleClassrooms,
        sampleTimeSlots,
        mockPreferences,
        config,
        sampleStudents,
      )
    }

    console.log("[v0] Timetable generation complete:", {
      success: result.success,
      assignments: result.assignments.length,
      conflicts: result.conflicts.length,
      score: result.optimization_score,
      strategy: result.strategy_used,
      time: result.generation_time,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[v0] Timetable generation error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate timetable",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Timetable Generation API",
    endpoints: {
      "POST /api/timetable/generate": "Generate new timetable",
      "GET /api/timetable/status": "Get generation status",
    },
    strategies: ["greedy", "cp_sat", "ml_guided", "hybrid", "or_tools"],
  })
}
