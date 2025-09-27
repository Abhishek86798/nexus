// Greedy algorithm for initial timetable generation

import type { TimeSlotAssignment, Constraint, OptimizationResult } from "./types"
import type { Program, Faculty, Classroom, TimeSlot, Student } from "../types"

export class GreedySolver {
  private programs: Program[]
  private faculty: Faculty[]
  private classrooms: Classroom[]
  private timeSlots: TimeSlot[]
  private constraints: Constraint[]
  private students?: Student[]
  private courseConflictMap: Map<number, Set<number>>

  constructor(
    programs: Program[],
    faculty: Faculty[],
    classrooms: Classroom[],
    timeSlots: TimeSlot[],
    constraints: Constraint[] = [],
    students?: Student[],
  ) {
    this.programs = programs
    this.faculty = faculty
    this.classrooms = classrooms
    this.timeSlots = timeSlots
    this.constraints = constraints
    this.students = students
    this.courseConflictMap = this.buildCourseConflictMap(students)
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
      // Check if faculty is free and available by mask
      if (
        this.isFacultyFreeAtSlot(suitableFaculty.id, timeSlot.id, existingAssignments) &&
        this.isFacultyAvailableByMask(suitableFaculty, timeSlot)
      ) {
        // Find suitable classroom
        const classroom = this.findSuitableClassroom(program, timeSlot, existingAssignments)
        if (classroom) {
          const tentative: TimeSlotAssignment = {
            program_id: program.id,
            faculty_id: suitableFaculty.id,
            classroom_id: classroom.id,
            time_slot_id: timeSlot.id,
            day_of_week: timeSlot.day_of_week,
            start_time: timeSlot.start_time,
            end_time: timeSlot.end_time,
          }
          // Ensure no student conflicts at the same time slot
          if (this.isStudentConflictFree(tentative, existingAssignments)) {
            return tentative
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

  private isFacultyFreeAtSlot(facultyId: number, timeSlotId: number, assignments: TimeSlotAssignment[]): boolean {
    return !assignments.some((a) => a.faculty_id === facultyId && a.time_slot_id === timeSlotId)
  }

  private isFacultyAvailableByMask(faculty: Faculty, timeSlot: TimeSlot): boolean {
    if (!faculty.availability_mask) return true
    const dayMap: Record<number, string> = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday" }
    const dayName = dayMap[timeSlot.day_of_week]
    const allowed = faculty.availability_mask[dayName]
    if (!allowed) return true
    if (Array.isArray(allowed) && allowed.length === 0) return false

    const match = timeSlot.slot_name.match(/(\d+)/)
    const slotIndex = match ? Number.parseInt(match[1], 10) : undefined

    if (slotIndex && allowed.includes(slotIndex)) return true

    return true
  }

  private findSuitableClassroom(
    program: Program,
    timeSlot: TimeSlot,
    assignments: TimeSlotAssignment[],
  ): Classroom | null {
    const availableRooms = this.classrooms.filter(
      (room) => !assignments.some((a) => a.classroom_id === room.id && a.time_slot_id === timeSlot.id),
    )

    const requiresLab = !!program.needs_lab || /\b(lab|practical)\b/i.test(program.name)
    const capacityNeeded = program.expected_enrollment ?? 0

    const roomOk = (room: Classroom) => {
      const isLab = room.is_lab || room.type === "lab"
      if (requiresLab && !isLab) return false
      if (capacityNeeded && room.capacity < capacityNeeded) return false
      return true
    }

    const filtered = availableRooms.filter(roomOk)
    if (filtered.length > 0) return filtered[0]

    return availableRooms[0] || null
  }

  private calculateScore(assignments: TimeSlotAssignment[], conflicts: any[]): number {
    let score = 100

    // Deduct points for conflicts
    score -= conflicts.length * 10

    // Bonus for utilizing preferred time slots

    return Math.max(0, score)
  }

  private buildCourseConflictMap(students?: Student[]): Map<number, Set<number>> {
    const map = new Map<number, Set<number>>()
    if (!students) return map
    for (const s of students) {
      const courses = s.enrolled_courses || []
      for (let i = 0; i < courses.length; i++) {
        for (let j = i + 1; j < courses.length; j++) {
          const a = courses[i]
          const b = courses[j]
          if (!map.has(a)) map.set(a, new Set())
          if (!map.has(b)) map.set(b, new Set())
          map.get(a)!.add(b)
          map.get(b)!.add(a)
        }
      }
    }
    return map
  }

  private isStudentConflictFree(candidate: TimeSlotAssignment, existing: TimeSlotAssignment[]): boolean {
    const conflictsWith = this.courseConflictMap.get(candidate.program_id)
    if (!conflictsWith || conflictsWith.size === 0) return true
    return !existing.some((a) => a.time_slot_id === candidate.time_slot_id && conflictsWith.has(a.program_id))
  }
}
