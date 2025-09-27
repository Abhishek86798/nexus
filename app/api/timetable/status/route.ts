import { NextResponse } from "next/server"

// Mock status data - in production this would track actual generation jobs
const mockStatus = {
  current_job: null,
  last_generation: {
    id: "gen_001",
    status: "completed",
    strategy: "hybrid_greedy",
    started_at: "2024-01-15T10:30:00Z",
    completed_at: "2024-01-15T10:30:02Z",
    assignments_count: 5,
    conflicts_count: 0,
    optimization_score: 85,
  },
  system_stats: {
    total_generations: 12,
    success_rate: 0.92,
    average_score: 78.5,
    average_generation_time: 2.3,
  },
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockStatus,
  })
}
