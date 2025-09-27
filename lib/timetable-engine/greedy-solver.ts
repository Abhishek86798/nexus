// Greedy algorithm for initial timetable generation

import type { TimeSlotAssignment, Constraint, OptimizationResult } from "./types"
import type { Program, Faculty, Classroom, TimeSlot } from "../types"

export class GreedySolver {
  private programs: Program[]
  private faculty: Faculty[]
  private classrooms: Classroom[]
  private timeSlots: TimeSlot[]
  private constraints: Constraint[]

  constructor(
    programs: Program[],
    faculty: Faculty[],
    classrooms: Classroom[],
    timeSlots: TimeSlot[],
    constraints: Constraint[] = [],
  ) {
    this.programs = programs
    this.faculty = faculty
    this.classrooms = classrooms
    this.timeSlots = timeSlots
    this.constraints = constraints
  }

  solve(): OptimizationResult {
    const startTime = Date.now()
    const assignments: TimeSlotAssignment[] = []
    const conflicts: any[] = []

    // Sort programs by priority (higher semester = higher priority)
    const sortedPrograms = [...this.programs].sort((a, b) => b.semester - a.semester)

    for (const program of sortedPrograms) {
      const assignment = this.assignProgramToSlot(program, assignments)
      if (assignment) {
        assignments.push(assignment)
      } else {
        conflicts.push({
          type: "assignment_failed",
          severity: "critical",
          description: `Could not assign ${program.code} to any time slot`,
          affected_entities: [program.id],
        })
      }
    }

    const generationTime = Date.now() - startTime
    const optimizationScore = this.calculateScore(assignments, conflicts)

    return {
      success: conflicts.length === 0,
      assignments,
      conflicts,
      optimization_score: optimizationScore,
      generation_time: generationTime,
      strategy_used: "greedy",
      iterations: 1,
    }
  }

  private assignProgramToSlot(program: Program, existingAssignments: TimeSlotAssignment[]): TimeSlotAssignment | null {
    // Find suitable faculty
    const suitableFaculty = this.findSuitableFaculty(program)
    if (!suitableFaculty) return null

    // Find suitable time slots based on faculty preferences
    const preferredSlots = this.getPreferredTimeSlots(suitableFaculty)

    for (const timeSlot of preferredSlots) {
      // Check if faculty is available
      if (this.isFacultyAvailable(suitableFaculty.id, timeSlot.id, existingAssignments)) {
        // Find suitable classroom
        const classroom = this.findSuitableClassroom(program, timeSlot, existingAssignments)
        if (classroom) {
          return {
            program_id: program.id,
            faculty_id: suitableFaculty.id,
            classroom_id: classroom.id,
            time_slot_id: timeSlot.id,
            day_of_week: timeSlot.day_of_week,
            start_time: timeSlot.start_time,
            end_time: timeSlot.end_time,
          }
        }
      }
    }

    return null
  }

  private findSuitableFaculty(program: Program): Faculty | null {
    // Simple matching based on department and specialization
    return (
      this.faculty.find(
        (f) =>
          f.department === program.department ||
          f.specialization?.toLowerCase().includes(program.name.toLowerCase().split(" ")[0]),
      ) || this.faculty[0]
    ) // Fallback to first faculty
  }

  private getPreferredTimeSlots(faculty: Faculty): TimeSlot[] {
    if (!faculty.preferred_time_slots || faculty.preferred_time_slots.length === 0) {
      return this.timeSlots
    }

    const preferred = this.timeSlots.filter((slot) => faculty.preferred_time_slots!.includes(slot.slot_name))

    return preferred.length > 0 ? preferred : this.timeSlots
  }

  private isFacultyAvailable(facultyId: number, timeSlotId: number, assignments: TimeSlotAssignment[]): boolean {
    return !assignments.some((a) => a.faculty_id === facultyId && a.time_slot_id === timeSlotId)
  }

  private findSuitableClassroom(
    program: Program,
    timeSlot: TimeSlot,
    assignments: TimeSlotAssignment[],
  ): Classroom | null {
    const availableRooms = this.classrooms.filter(
      (room) => !assignments.some((a) => a.classroom_id === room.id && a.time_slot_id === timeSlot.id),
    )

    // Prefer labs for programs that might need them
    if (program.name.toLowerCase().includes("lab") || program.name.toLowerCase().includes("practical")) {
      const lab = availableRooms.find((room) => room.type === "lab")
      if (lab) return lab
    }

    // Return first available classroom
    return availableRooms[0] || null
  }

  private calculateScore(assignments: TimeSlotAssignment[], conflicts: any[]): number {
    let score = 100

    // Deduct points for conflicts
    score -= conflicts.length * 10

    // Bonus for utilizing preferred time slots
    // This would be more sophisticated in a real implementation

    return Math.max(0, score)
  }
}
