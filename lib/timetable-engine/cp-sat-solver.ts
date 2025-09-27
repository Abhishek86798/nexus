// Constraint Programming SAT solver (simplified implementation)
// In production, this would use OR-Tools or similar

import type { TimeSlotAssignment, Constraint, OptimizationResult } from "./types"
import type { Program, Faculty, Classroom, TimeSlot, Student } from "../types"

export class CPSATSolver {
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

  solve(timeLimitSeconds = 30): OptimizationResult {
    const startTime = Date.now()

    // This is a simplified CP-SAT implementation
    // In production, you would use OR-Tools CP-SAT solver

    const assignments = this.solveWithConstraints()
    const conflicts = this.validateAssignments(assignments)

    const generationTime = Date.now() - startTime
    const optimizationScore = this.calculateOptimizationScore(assignments, conflicts)

    return {
      success: conflicts.length === 0,
      assignments,
      conflicts,
      optimization_score: optimizationScore,
      generation_time: generationTime,
      strategy_used: "cp_sat",
      iterations: 1,
    }
  }

  private solveWithConstraints(): TimeSlotAssignment[] {
    // Create decision variables for each possible assignment
    const variables = this.createDecisionVariables()

    // Apply hard constraints
    const feasibleAssignments = this.applyHardConstraints(variables)

    // Optimize with soft constraints and build a conflict-free selection
    const optimizedAssignments = this.optimizeWithSoftConstraints(feasibleAssignments)

    return optimizedAssignments
  }

  private createDecisionVariables(): TimeSlotAssignment[] {
    const variables: TimeSlotAssignment[] = []

    // Generate all possible combinations
    for (const program of this.programs) {
      for (const faculty of this.faculty) {
        for (const classroom of this.classrooms) {
          for (const timeSlot of this.timeSlots) {
            variables.push({
              program_id: program.id,
              faculty_id: faculty.id,
              classroom_id: classroom.id,
              time_slot_id: timeSlot.id,
              day_of_week: timeSlot.day_of_week,
              start_time: timeSlot.start_time,
              end_time: timeSlot.end_time,
            })
          }
        }
      }
    }

    return variables
  }

  private applyHardConstraints(variables: TimeSlotAssignment[]): TimeSlotAssignment[] {
    let feasible = variables

    // Enforce department matching
    feasible = this.applyDepartmentConstraints(feasible)

    // Enforce faculty availability mask
    feasible = feasible.filter((a) => this.isFacultyAvailableByMask(a))

    // Enforce room constraints (lab requirement, capacity)
    feasible = feasible.filter((a) => this.roomSatisfiesConstraints(a))

    // No faculty double-booking
    feasible = this.eliminateFacultyConflicts(feasible)

    // No room double-booking
    feasible = this.eliminateRoomConflicts(feasible)

    return feasible
  }

  private eliminateFacultyConflicts(assignments: TimeSlotAssignment[]): TimeSlotAssignment[] {
    const selected: TimeSlotAssignment[] = []
    const facultyTimeSlots = new Set<string>()

    for (const assignment of assignments) {
      const key = `${assignment.faculty_id}-${assignment.time_slot_id}`
      if (!facultyTimeSlots.has(key)) {
        selected.push(assignment)
        facultyTimeSlots.add(key)
      }
    }

    return selected
  }

  private eliminateRoomConflicts(assignments: TimeSlotAssignment[]): TimeSlotAssignment[] {
    const selected: TimeSlotAssignment[] = []
    const roomTimeSlots = new Set<string>()

    for (const assignment of assignments) {
      const key = `${assignment.classroom_id}-${assignment.time_slot_id}`
      if (!roomTimeSlots.has(key)) {
        selected.push(assignment)
        roomTimeSlots.add(key)
      }
    }

    return selected
  }

  private applyDepartmentConstraints(assignments: TimeSlotAssignment[]): TimeSlotAssignment[] {
    return assignments.filter((assignment) => {
      const program = this.programs.find((p) => p.id === assignment.program_id)
      const faculty = this.faculty.find((f) => f.id === assignment.faculty_id)

      return program && faculty && program.department === faculty.department
    })
  }

  private optimizeWithSoftConstraints(assignments: TimeSlotAssignment[]): TimeSlotAssignment[] {
    // Score each assignment based on soft constraints
    const scoredAssignments = assignments.map((assignment) => ({
      assignment,
      score: this.scoreAssignment(assignment),
    }))

    // Sort by score and select best assignments for each program without student/teacher/room conflicts
    scoredAssignments.sort((a, b) => b.score - a.score)

    const selected: TimeSlotAssignment[] = []
    const assignedPrograms = new Set<number>()

    for (const { assignment } of scoredAssignments) {
      if (assignedPrograms.has(assignment.program_id)) continue

      const hasFacultyConflict = selected.some(
        (a) => a.faculty_id === assignment.faculty_id && a.time_slot_id === assignment.time_slot_id,
      )
      if (hasFacultyConflict) continue

      const hasRoomConflict = selected.some(
        (a) => a.classroom_id === assignment.classroom_id && a.time_slot_id === assignment.time_slot_id,
      )
      if (hasRoomConflict) continue

      const studentOk = this.isStudentConflictFree(assignment, selected)
      if (!studentOk) continue

      selected.push(assignment)
      assignedPrograms.add(assignment.program_id)
    }

    return selected
  }

  private scoreAssignment(assignment: TimeSlotAssignment): number {
    let score = 0

    // Check faculty preferences
    const faculty = this.faculty.find((f) => f.id === assignment.faculty_id)
    const timeSlot = this.timeSlots.find((t) => t.id === assignment.time_slot_id)

    if (faculty && timeSlot && faculty.preferred_time_slots?.includes(timeSlot.slot_name)) {
      score += 10
    }

    // Prefer rooms with enough capacity
    const program = this.programs.find((p) => p.id === assignment.program_id)
    const room = this.classrooms.find((r) => r.id === assignment.classroom_id)
    if (program && room && program.expected_enrollment && room.capacity >= program.expected_enrollment) {
      score += 5
    }

    // Apply constraint-based scoring
    for (const constraint of this.constraints) {
      if (constraint.type === "soft") {
        score += this.evaluateConstraint(constraint, assignment)
      }
    }

    return score
  }

  private evaluateConstraint(constraint: Constraint, assignment: TimeSlotAssignment): number {
    // Simplified constraint evaluation
    return constraint.priority
  }

  private validateAssignments(assignments: TimeSlotAssignment[]): any[] {
    const conflicts: any[] = []

    // Check for remaining conflicts
    const facultySlots = new Map<number, Set<number>>()
    const roomSlots = new Map<number, Set<number>>()

    for (const assignment of assignments) {
      // Faculty conflicts
      if (!facultySlots.has(assignment.faculty_id)) {
        facultySlots.set(assignment.faculty_id, new Set())
      }
      if (facultySlots.get(assignment.faculty_id)!.has(assignment.time_slot_id)) {
        conflicts.push({
          type: "faculty_conflict",
          severity: "critical",
          description: `Faculty ${assignment.faculty_id} double-booked`,
          affected_entities: [assignment.faculty_id],
        })
      }
      facultySlots.get(assignment.faculty_id)!.add(assignment.time_slot_id)

      // Room conflicts
      if (!roomSlots.has(assignment.classroom_id)) {
        roomSlots.set(assignment.classroom_id, new Set())
      }
      if (roomSlots.get(assignment.classroom_id)!.has(assignment.time_slot_id)) {
        conflicts.push({
          type: "room_conflict",
          severity: "critical",
          description: `Room ${assignment.classroom_id} double-booked`,
          affected_entities: [assignment.classroom_id],
        })
      }
      roomSlots.get(assignment.classroom_id)!.add(assignment.time_slot_id)

      // Student group conflicts
      const conflicting = this.courseConflictMap.get(assignment.program_id)
      if (conflicting) {
        for (const other of assignments) {
          if (
            other !== assignment &&
            other.time_slot_id === assignment.time_slot_id &&
            conflicting.has(other.program_id)
          ) {
            conflicts.push({
              type: "time_conflict",
              severity: "critical",
              description: `Courses ${assignment.program_id} and ${other.program_id} share students and overlap`,
              affected_entities: [assignment.program_id, other.program_id],
            })
          }
        }
      }
    }

    return conflicts
  }

  private calculateOptimizationScore(assignments: TimeSlotAssignment[], conflicts: any[]): number {
    let score = 100

    // Deduct for conflicts
    score -= conflicts.length * 15

    // Bonus for constraint satisfaction
    score += this.calculateConstraintSatisfaction(assignments)

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

  private calculateConstraintSatisfaction(assignments: TimeSlotAssignment[]): number {
    let satisfaction = 0

    for (const constraint of this.constraints) {
      if (constraint.type === "soft") {
        const satisfied = assignments.some((assignment) => this.evaluateConstraint(constraint, assignment) > 0)
        if (satisfied) {
          satisfaction += constraint.priority
        }
      }
    }

    return satisfaction
  }

  private isFacultyAvailableByMask(a: TimeSlotAssignment): boolean {
    const faculty = this.faculty.find((f) => f.id === a.faculty_id)
    const slot = this.timeSlots.find((t) => t.id === a.time_slot_id)
    if (!faculty || !slot) return true
    if (!faculty.availability_mask) return true
    const dayMap: Record<number, string> = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday" }
    const dayName = dayMap[slot.day_of_week]
    const allowed = faculty.availability_mask[dayName]
    if (!allowed) return true
    if (Array.isArray(allowed) && allowed.length === 0) return false
    const match = slot.slot_name.match(/(\d+)/)
    const slotIndex = match ? Number.parseInt(match[1], 10) : undefined
    if (slotIndex && allowed.includes(slotIndex)) return true
    return true
  }

  private roomSatisfiesConstraints(a: TimeSlotAssignment): boolean {
    const program = this.programs.find((p) => p.id === a.program_id)
    const room = this.classrooms.find((r) => r.id === a.classroom_id)
    if (!program || !room) return true
    const requiresLab = !!program.needs_lab || /\b(lab|practical)\b/i.test(program.name)
    const isLab = room.is_lab || room.type === "lab"
    if (requiresLab && !isLab) return false
    if (program.expected_enrollment && room.capacity < program.expected_enrollment) return false
    return true
  }
}
