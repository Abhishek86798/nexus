// Core types for the timetable generation engine

export interface Constraint {
  id: string
  type: "hard" | "soft"
  priority: number // 1-10 scale
  description: string
  entity_type: "faculty" | "program" | "classroom" | "time_slot"
  entity_id: number
  constraint_data: any
}

export interface TimeSlotAssignment {
  program_id: number
  faculty_id: number
  classroom_id: number
  time_slot_id: number
  day_of_week: number
  start_time: string
  end_time: string
}

export interface GenerationConfig {
  academic_year: string
  week_number: number
  optimization_strategy: "greedy" | "cp_sat" | "ml_guided" | "hybrid" | "or_tools"
  max_iterations: number
  time_limit_seconds: number
  allow_conflicts: boolean
}

export interface OptimizationResult {
  success: boolean
  assignments: TimeSlotAssignment[]
  conflicts: ConflictInfo[]
  optimization_score: number
  generation_time: number
  strategy_used: string
  iterations: number
}

export interface ConflictInfo {
  type: "faculty_conflict" | "room_conflict" | "time_conflict" | "preference_violation"
  severity: "critical" | "major" | "minor"
  description: string
  affected_entities: number[]
  suggested_resolution?: string
}

export interface PreferenceConstraint {
  faculty_id?: number
  program_id?: number
  classroom_id?: number
  preference_text: string
  constraint_type: string
  priority: number
  is_hard_constraint: boolean
}
