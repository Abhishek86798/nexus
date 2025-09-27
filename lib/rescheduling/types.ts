export interface DisruptionEvent {
  id: string
  type: DisruptionType
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  affectedResources: AffectedResource[]
  startTime: Date
  endTime?: Date
  status: "active" | "resolved" | "cancelled"
  createdAt: Date
  resolvedAt?: Date
  createdBy: string
}

export type DisruptionType =
  | "faculty_absence"
  | "room_unavailable"
  | "equipment_failure"
  | "emergency_closure"
  | "weather_disruption"
  | "maintenance"
  | "event_conflict"
  | "student_emergency"

export interface AffectedResource {
  type: "faculty" | "room" | "course" | "program"
  id: string
  name: string
  impact: "direct" | "indirect"
}

export interface ReschedulingOption {
  id: string
  title: string
  description: string
  impact: ImpactAssessment
  changes: ScheduleChange[]
  confidence: number
  estimatedTime: number
  stakeholdersAffected: number
}

export interface ScheduleChange {
  type: "move" | "cancel" | "split" | "merge" | "substitute"
  originalSlot: TimeSlot
  newSlot?: TimeSlot
  reason: string
  affectedStudents: number
  affectedFaculty: string[]
}

export interface ImpactAssessment {
  studentsAffected: number
  facultyAffected: number
  roomsAffected: number
  coursesAffected: number
  severity: "minimal" | "moderate" | "significant" | "major"
  estimatedDisruption: number // in hours
}

export interface TimeSlot {
  id: string
  courseId: string
  courseName: string
  facultyId: string
  facultyName: string
  roomId: string
  roomName: string
  startTime: Date
  endTime: Date
  studentCount: number
}

export interface ReschedulingResult {
  success: boolean
  optionSelected: ReschedulingOption
  executionTime: number
  conflictsResolved: number
  newConflicts: number
  rollbackPlan: RollbackPlan
}

export interface RollbackPlan {
  id: string
  changes: ScheduleChange[]
  createdAt: Date
  validUntil: Date
}
