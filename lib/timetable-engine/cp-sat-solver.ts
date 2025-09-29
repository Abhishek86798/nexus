// Enhanced Constraint Programming SAT solver following workflow specifications
// Implements hard constraints as specified in the prototype design workflow

import type { TimeSlotAssignment, Constraint, OptimizationResult } from "./types"
import type { Program, Faculty, Classroom, TimeSlot, Student } from "../types"

interface DecisionVariable {
  program_id: number
  faculty_id: number
  classroom_id: number
  time_slot_id: number
  day_of_week: number
  is_assigned: boolean
  variable_id: string
}

interface ConflictGraph {
  [program_id: number]: Set<number> // Programs that share students
}

export class CPSATSolver {
  private programs: Program[]
  private faculty: Faculty[]
  private classrooms: Classroom[]
  private timeSlots: TimeSlot[]
  private students: Student[]
  private constraints: Constraint[]
  private conflictGraph: ConflictGraph
  private decisionVariables: DecisionVariable[]

  constructor(
    programs: Program[],
    faculty: Faculty[],
    classrooms: Classroom[],
    timeSlots: TimeSlot[],
    students: Student[] = [],
    constraints: Constraint[] = [],
  ) {
    this.programs = programs
    this.faculty = faculty
    this.classrooms = classrooms
    this.timeSlots = timeSlots
    this.students = students
    this.constraints = constraints
    this.conflictGraph = this.buildConflictGraph()
    this.decisionVariables = this.createDecisionVariables()
  }

  solve(timeLimitSeconds = 30): OptimizationResult {
    const startTime = Date.now()

    console.log(`[CP-SAT] Starting solver with ${this.programs.length} programs, ${this.faculty.length} faculty, ${this.classrooms.length} classrooms`)

    // Step 1: Apply hard constraints to find feasible solution
    const feasibleSolution = this.findFeasibleSolution()

    if (!feasibleSolution.success) {
      return {
        success: false,
        assignments: [],
        conflicts: feasibleSolution.conflicts,
        optimization_score: 0,
        generation_time: Date.now() - startTime,
        strategy_used: "cp_sat",
        iterations: feasibleSolution.iterations,
      }
    }

    // Step 2: Validate the solution
    const conflicts = this.validateAssignments(feasibleSolution.assignments)
    const optimizationScore = this.calculateOptimizationScore(feasibleSolution.assignments, conflicts)

    console.log(`[CP-SAT] Solution found with ${feasibleSolution.assignments.length} assignments, ${conflicts.length} conflicts`)

    return {
      success: conflicts.length === 0,
      assignments: feasibleSolution.assignments,
      conflicts,
      optimization_score: optimizationScore,
      generation_time: Date.now() - startTime,
      strategy_used: "cp_sat",
      iterations: feasibleSolution.iterations,
    }
  }

  private solveWithConstraints(): TimeSlotAssignment[] {
    const assignments: TimeSlotAssignment[] = []

    // Create decision variables for each possible assignment
    const variables = this.createDecisionVariables()

    // Apply hard constraints
    const feasibleAssignments = this.applyHardConstraints(variables)

    // Optimize with soft constraints
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

    // No faculty double-booking
    feasible = this.eliminateFacultyConflicts(feasible)

    // No room double-booking
    feasible = this.eliminateRoomConflicts(feasible)

    // Department matching
    feasible = this.applyDepartmentConstraints(feasible)

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

    // Sort by score and select best assignments for each program
    scoredAssignments.sort((a, b) => b.score - a.score)

    const selected: TimeSlotAssignment[] = []
    const assignedPrograms = new Set<number>()

    for (const { assignment } of scoredAssignments) {
      if (!assignedPrograms.has(assignment.program_id)) {
        selected.push(assignment)
        assignedPrograms.add(assignment.program_id)
      }
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
    // In production, this would be much more sophisticated
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

  private calculateConstraintSatisfaction(assignments: TimeSlotAssignment[]): number {
    let satisfaction = 0

    for (const constraint of this.constraints) {
      if (constraint.type === "soft") {
        // Check if constraint is satisfied
        const satisfied = assignments.some((assignment) => this.evaluateConstraint(constraint, assignment) > 0)
        if (satisfied) {
          satisfaction += constraint.priority
        }
      }
    }

    return satisfaction
  }
}
