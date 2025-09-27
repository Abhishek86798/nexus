// Type definitions for the AI Timetable Generation System

export interface Program {
  id: number
  name: string
  code: string
  department: string
  semester: number
  credits: number
  created_at?: string
}

export interface Faculty {
  id: number
  name: string
  email: string
  department: string
  specialization?: string
  max_hours_per_week: number
  preferred_time_slots?: string[]
  created_at?: string
}

export interface Student {
  id: number
  name: string
  email: string
  student_id: string
  program_id: number
  semester: number
  created_at?: string
}

export interface Classroom {
  id: number
  name: string
  type: "classroom" | "lab" | "auditorium"
  capacity: number
  equipment?: string[]
  building?: string
  floor?: number
  created_at?: string
}

export interface TimeSlot {
  id: number
  day_of_week: number // 1=Monday, 7=Sunday
  start_time: string
  end_time: string
  slot_name: string
}

export interface TimetableEntry {
  id: number
  program_id: number
  faculty_id: number
  classroom_id: number
  time_slot_id: number
  week_number: number
  academic_year: string
  status: "active" | "cancelled" | "rescheduled"
  created_at?: string
  // Populated fields
  program?: Program
  faculty?: Faculty
  classroom?: Classroom
  time_slot?: TimeSlot
}

export interface Preference {
  id: number
  entity_type: "faculty" | "program" | "classroom"
  entity_id: number
  preference_text: string
  constraint_type: string
  priority: number // 1-10 scale
  is_hard_constraint: boolean
  created_at?: string
}

export interface DisruptionEvent {
  id: number
  event_type: string
  affected_entity_type: string
  affected_entity_id: number
  start_time: string
  end_time?: string
  description?: string
  status: "active" | "resolved"
  created_at?: string
}

// Timetable generation types
export interface TimetableConstraint {
  type: "hard" | "soft"
  description: string
  priority: number
  entity_type: string
  entity_id: number
}

export interface GenerationResult {
  success: boolean
  timetable: TimetableEntry[]
  conflicts: string[]
  optimization_score: number
  generation_time: number
}

// Analytics types
export interface WorkloadAnalytics {
  faculty_id: number
  faculty_name: string
  total_hours: number
  utilization_percentage: number
  preferred_slots_used: number
}

export interface ClassroomUtilization {
  classroom_id: number
  classroom_name: string
  total_slots: number
  occupied_slots: number
  utilization_percentage: number
}

// Dashboard filter types
export interface TimetableFilters {
  program_id?: number
  faculty_id?: number
  classroom_id?: number
  day_of_week?: number
  academic_year?: string
}
