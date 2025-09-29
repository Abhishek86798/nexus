// Enhanced Constraint Programming SAT solver following workflow specifications
// Implements hard constraints as specified in the prototype design workflow

import type { TimeSlotAssignment, Constraint, OptimizationResult, ConflictInfo } from "./types"
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

interface FeasibleSolution {
  success: boolean
  assignments: TimeSlotAssignment[]
  conflicts: ConflictInfo[]
  iterations: number
}

export class EnhancedCPSATSolver {
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

    console.log(`[Enhanced CP-SAT] Starting solver with ${this.programs.length} programs, ${this.faculty.length} faculty, ${this.classrooms.length} classrooms`)

    // Step 1: Apply hard constraints to find feasible solution
    const feasibleSolution = this.findFeasibleSolution()

    if (!feasibleSolution.success) {
      return {
        success: false,
        assignments: [],
        conflicts: feasibleSolution.conflicts,
        optimization_score: 0,
        generation_time: Date.now() - startTime,
        strategy_used: "enhanced_cp_sat",
        iterations: feasibleSolution.iterations,
      }
    }

    // Step 2: Validate the solution
    const conflicts = this.validateAssignments(feasibleSolution.assignments)
    const optimizationScore = this.calculateOptimizationScore(feasibleSolution.assignments, conflicts)

    console.log(`[Enhanced CP-SAT] Solution found with ${feasibleSolution.assignments.length} assignments, ${conflicts.length} conflicts`)

    return {
      success: conflicts.length === 0,
      assignments: feasibleSolution.assignments,
      conflicts,
      optimization_score: optimizationScore,
      generation_time: Date.now() - startTime,
      strategy_used: "enhanced_cp_sat",
      iterations: feasibleSolution.iterations,
    }
  }

  /**
   * Build conflict graph from student enrollments
   * Two programs conflict if they share at least one student
   */
  private buildConflictGraph(): ConflictGraph {
    const graph: ConflictGraph = {}
    
    // Initialize graph
    for (const program of this.programs) {
      graph[program.id] = new Set<number>()
    }

    // Add conflicts based on student enrollments
    for (const student of this.students) {
      const enrolledCourses = student.enrolled_courses
      
      // Create conflicts between all pairs of enrolled courses
      for (let i = 0; i < enrolledCourses.length; i++) {
        for (let j = i + 1; j < enrolledCourses.length; j++) {
          const course1 = enrolledCourses[i]
          const course2 = enrolledCourses[j]
          
          if (graph[course1]) graph[course1].add(course2)
          if (graph[course2]) graph[course2].add(course1)
        }
      }
    }

    console.log(`[Enhanced CP-SAT] Built conflict graph with ${Object.keys(graph).length} programs`)
    return graph
  }

  /**
   * Create decision variables for all possible (course, teacher, room, day, timeslot) combinations
   */
  private createDecisionVariables(): DecisionVariable[] {
    const variables: DecisionVariable[] = []

    for (const program of this.programs) {
      for (const faculty of this.faculty) {
        // Check if faculty has required expertise
        if (!this.facultyCanTeachCourse(faculty, program)) {
          continue
        }

        for (const classroom of this.classrooms) {
          // Check lab requirements
          if (program.needs_lab && !classroom.is_lab) {
            continue
          }

          for (const timeSlot of this.timeSlots) {
            // Check faculty availability
            if (!this.facultyAvailableAtTime(faculty, timeSlot)) {
              continue
            }

            variables.push({
              program_id: program.id,
              faculty_id: faculty.id,
              classroom_id: classroom.id,
              time_slot_id: timeSlot.id,
              day_of_week: timeSlot.day_of_week,
              is_assigned: false,
              variable_id: `${program.id}_${faculty.id}_${classroom.id}_${timeSlot.id}`,
            })
          }
        }
      }
    }

    console.log(`[Enhanced CP-SAT] Created ${variables.length} decision variables`)
    return variables
  }

  /**
   * Find a feasible solution that satisfies all hard constraints
   */
  private findFeasibleSolution(): FeasibleSolution {
    const assignments: TimeSlotAssignment[] = []
    const conflicts: ConflictInfo[] = []
    let iterations = 0
    const maxIterations = 1000

    // Track assignments to enforce constraints
    const facultyAssignments: { [faculty_id: number]: { [time_slot_id: number]: boolean } } = {}
    const classroomAssignments: { [classroom_id: number]: { [time_slot_id: number]: boolean } } = {}
    const programAssignments: { [program_id: number]: boolean } = {}

    // Initialize tracking structures
    for (const faculty of this.faculty) {
      facultyAssignments[faculty.id] = {}
      for (const timeSlot of this.timeSlots) {
        facultyAssignments[faculty.id][timeSlot.id] = false
      }
    }

    for (const classroom of this.classrooms) {
      classroomAssignments[classroom.id] = {}
      for (const timeSlot of this.timeSlots) {
        classroomAssignments[classroom.id][timeSlot.id] = false
      }
    }

    // Try to assign each program exactly once
    for (const program of this.programs) {
      programAssignments[program.id] = false
      
      const validVariables = this.decisionVariables.filter(v => v.program_id === program.id)
      let assigned = false

      for (const variable of validVariables) {
        if (iterations++ > maxIterations) {
          conflicts.push({
            type: "time_conflict",
            severity: "critical",
            description: `Maximum iterations reached while assigning ${program.name}`,
            affected_entities: [program.id],
            suggested_resolution: "Reduce constraints or increase available time slots"
          })
          break
        }

        // Check hard constraints
        if (this.violatesHardConstraints(variable, facultyAssignments, classroomAssignments, assignments)) {
          continue
        }

        // Assign this variable
        assignments.push({
          program_id: variable.program_id,
          faculty_id: variable.faculty_id,
          classroom_id: variable.classroom_id,
          time_slot_id: variable.time_slot_id,
          day_of_week: variable.day_of_week,
          start_time: this.timeSlots.find(t => t.id === variable.time_slot_id)?.start_time || "",
          end_time: this.timeSlots.find(t => t.id === variable.time_slot_id)?.end_time || "",
        })

        // Update tracking
        facultyAssignments[variable.faculty_id][variable.time_slot_id] = true
        classroomAssignments[variable.classroom_id][variable.time_slot_id] = true
        programAssignments[variable.program_id] = true
        assigned = true
        break
      }

      if (!assigned) {
        conflicts.push({
          type: "time_conflict",
          severity: "critical",
          description: `Could not assign program ${program.name} - no valid time slots available`,
          affected_entities: [program.id],
          suggested_resolution: "Check faculty availability and room requirements"
        })
      }
    }

    // Check if all programs were assigned
    const unassignedPrograms = this.programs.filter(p => !programAssignments[p.id])
    if (unassignedPrograms.length > 0) {
      conflicts.push({
        type: "time_conflict",
        severity: "critical",
        description: `Failed to assign ${unassignedPrograms.length} programs: ${unassignedPrograms.map(p => p.name).join(', ')}`,
        affected_entities: unassignedPrograms.map(p => p.id),
        suggested_resolution: "Add more time slots or reduce program requirements"
      })
    }

    return {
      success: conflicts.length === 0,
      assignments,
      conflicts,
      iterations,
    }
  }

  /**
   * Check if assigning this variable would violate hard constraints
   */
  private violatesHardConstraints(
    variable: DecisionVariable,
    facultyAssignments: { [faculty_id: number]: { [time_slot_id: number]: boolean } },
    classroomAssignments: { [classroom_id: number]: { [time_slot_id: number]: boolean } },
    currentAssignments: TimeSlotAssignment[]
  ): boolean {
    // Hard Constraint 1: No Teacher Clashes
    if (facultyAssignments[variable.faculty_id][variable.time_slot_id]) {
      return true
    }

    // Hard Constraint 2: No Room Clashes
    if (classroomAssignments[variable.classroom_id][variable.time_slot_id]) {
      return true
    }

    // Hard Constraint 3: No Student Group Clashes
    const conflictingPrograms = this.conflictGraph[variable.program_id] || new Set()
    for (const assignment of currentAssignments) {
      if (conflictingPrograms.has(assignment.program_id) && assignment.time_slot_id === variable.time_slot_id) {
        return true
      }
    }

    // Hard Constraint 4: Room Capacity
    const classroom = this.classrooms.find(c => c.id === variable.classroom_id)
    const program = this.programs.find(p => p.id === variable.program_id)
    if (classroom && program && program.max_students > classroom.capacity) {
      return true
    }

    return false
  }

  /**
   * Check if faculty can teach this course based on expertise
   */
  private facultyCanTeachCourse(faculty: Faculty, program: Program): boolean {
    if (program.required_expertise_tags.length === 0) {
      return true // No specific expertise required
    }

    return program.required_expertise_tags.some(tag => 
      faculty.expertise_tags.includes(tag)
    )
  }

  /**
   * Check if faculty is available at this time slot
   */
  private facultyAvailableAtTime(faculty: Faculty, timeSlot: TimeSlot): boolean {
    const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const dayName = dayNames[timeSlot.day_of_week]
    
    if (!dayName || !faculty.availability_mask[dayName]) {
      return false
    }

    return faculty.availability_mask[dayName].includes(timeSlot.id)
  }

  /**
   * Validate assignments for conflicts
   */
  private validateAssignments(assignments: TimeSlotAssignment[]): ConflictInfo[] {
    const conflicts: ConflictInfo[] = []

    // Group assignments by time slot
    const timeSlotGroups: { [time_slot_id: number]: TimeSlotAssignment[] } = {}
    for (const assignment of assignments) {
      if (!timeSlotGroups[assignment.time_slot_id]) {
        timeSlotGroups[assignment.time_slot_id] = []
      }
      timeSlotGroups[assignment.time_slot_id].push(assignment)
    }

    // Check each time slot for conflicts
    for (const [timeSlotId, slotAssignments] of Object.entries(timeSlotGroups)) {
      // Check faculty conflicts
      const facultyUsed = new Set<number>()
      const classroomsUsed = new Set<number>()

      for (const assignment of slotAssignments) {
        if (facultyUsed.has(assignment.faculty_id)) {
          const faculty = this.faculty.find(f => f.id === assignment.faculty_id)
          conflicts.push({
            type: "faculty_conflict",
            severity: "critical",
            description: `Faculty conflict: ${faculty?.name} assigned to multiple classes at time slot ${timeSlotId}`,
            affected_entities: [assignment.faculty_id],
            suggested_resolution: "Reschedule one of the conflicting classes"
          })
        }
        facultyUsed.add(assignment.faculty_id)

        if (classroomsUsed.has(assignment.classroom_id)) {
          const classroom = this.classrooms.find(c => c.id === assignment.classroom_id)
          conflicts.push({
            type: "room_conflict",
            severity: "critical",
            description: `Classroom conflict: ${classroom?.name} assigned to multiple classes at time slot ${timeSlotId}`,
            affected_entities: [assignment.classroom_id],
            suggested_resolution: "Assign one class to a different room"
          })
        }
        classroomsUsed.add(assignment.classroom_id)
      }

      // Check student conflicts
      for (let i = 0; i < slotAssignments.length; i++) {
        for (let j = i + 1; j < slotAssignments.length; j++) {
          const assignment1 = slotAssignments[i]
          const assignment2 = slotAssignments[j]
          
          if (this.conflictGraph[assignment1.program_id]?.has(assignment2.program_id)) {
            const program1 = this.programs.find(p => p.id === assignment1.program_id)
            const program2 = this.programs.find(p => p.id === assignment2.program_id)
            conflicts.push({
              type: "time_conflict",
              severity: "critical",
              description: `Student conflict: ${program1?.name} and ${program2?.name} have shared students but are scheduled at the same time`,
              affected_entities: [assignment1.program_id, assignment2.program_id],
              suggested_resolution: "Reschedule one of the conflicting programs"
            })
          }
        }
      }
    }

    return conflicts
  }

  /**
   * Calculate optimization score based on assignments and conflicts
   */
  private calculateOptimizationScore(assignments: TimeSlotAssignment[], conflicts: ConflictInfo[]): number {
    if (conflicts.length > 0) {
      return 0 // No score if there are conflicts
    }

    let score = 100 // Start with perfect score

    // Deduct points for suboptimal assignments
    for (const assignment of assignments) {
      const faculty = this.faculty.find(f => f.id === assignment.faculty_id)
      const timeSlot = this.timeSlots.find(t => t.id === assignment.time_slot_id)
      
      // Check if this is a preferred time slot for the faculty
      if (faculty && timeSlot && faculty.preferred_time_slots) {
        const isPreferred = faculty.preferred_time_slots.includes(`${timeSlot.day_of_week}-${timeSlot.start_time}`)
        if (!isPreferred) {
          score -= 5 // Deduct points for non-preferred slots
        }
      }
    }

    return Math.max(0, score)
  }
}