// Google OR-Tools inspired CP-SAT Solver
// Enhanced constraint programming solver following OR-Tools patterns
// lib/timetable-engine/ortools-cp-sat-solver.ts

import type { TimeSlotAssignment, Constraint, OptimizationResult, ConflictInfo } from "./types"
import type { Program, Faculty, Classroom, TimeSlot, Student } from "../types"

// OR-Tools inspired constraint types
enum ConstraintType {
  ALL_DIFFERENT = 'ALL_DIFFERENT',
  EXACTLY_ONE = 'EXACTLY_ONE',
  AT_MOST_ONE = 'AT_MOST_ONE',
  IMPLIES = 'IMPLIES',
  LINEAR = 'LINEAR'
}

interface CPVariable {
  id: string
  domain: number[]
  assigned_value?: number
  is_fixed: boolean
}

interface CPConstraint {
  id: string
  type: ConstraintType
  variables: string[]
  coefficients?: number[]
  bounds?: { min: number; max: number }
  description: string
}

interface CPModel {
  variables: Map<string, CPVariable>
  constraints: CPConstraint[]
  objective_variables: string[]
  objective_coefficients: number[]
  is_maximization: boolean
}

export class ORToolsCPSATSolver {
  private model: CPModel
  private programs: Program[]
  private faculty: Faculty[]
  private classrooms: Classroom[]
  private timeSlots: TimeSlot[]
  private students: Student[]
  
  // OR-Tools style solver parameters
  private maxSolveTimeSeconds: number = 30
  private numSearchWorkers: number = 1
  private randomSeed: number = 42
  private logSearchProgress: boolean = true

  constructor(
    programs: Program[],
    faculty: Faculty[],
    classrooms: Classroom[],
    timeSlots: TimeSlot[],
    students: Student[] = []
  ) {
    this.programs = programs
    this.faculty = faculty
    this.classrooms = classrooms
    this.timeSlots = timeSlots
    this.students = students
    
    this.model = {
      variables: new Map(),
      constraints: [],
      objective_variables: [],
      objective_coefficients: [],
      is_maximization: true
    }
    
    this.buildModel()
  }

  // OR-Tools style model building
  private buildModel(): void {
    console.log('[OR-Tools CP-SAT] Building constraint programming model...')
    
    this.createDecisionVariables()
    this.addConstraints()
    this.setObjective()
    
    console.log(`[OR-Tools CP-SAT] Model built: ${this.model.variables.size} variables, ${this.model.constraints.length} constraints`)
  }

  private createDecisionVariables(): void {
    // Create binary variables: x[p,f,r,t] = 1 if program p is assigned to faculty f in room r at time t
    for (const program of this.programs) {
      for (const faculty of this.faculty) {
        for (const classroom of this.classrooms) {
          for (const timeSlot of this.timeSlots) {
            const varId = `x_${program.id}_${faculty.id}_${classroom.id}_${timeSlot.id}`
            
            this.model.variables.set(varId, {
              id: varId,
              domain: [0, 1], // Binary variable
              is_fixed: false
            })
          }
        }
      }
    }
  }

  private addConstraints(): void {
    this.addProgramAssignmentConstraints()
    this.addFacultyConflictConstraints()
    this.addClassroomConflictConstraints()
    this.addCapacityConstraints()
    this.addExpertiseConstraints()
    this.addAvailabilityConstraints()
  }

  // Each program must be assigned exactly once
  private addProgramAssignmentConstraints(): void {
    for (const program of this.programs) {
      const variables: string[] = []
      
      for (const faculty of this.faculty) {
        for (const classroom of this.classrooms) {
          for (const timeSlot of this.timeSlots) {
            variables.push(`x_${program.id}_${faculty.id}_${classroom.id}_${timeSlot.id}`)
          }
        }
      }
      
      this.model.constraints.push({
        id: `program_assignment_${program.id}`,
        type: ConstraintType.EXACTLY_ONE,
        variables,
        description: `Program ${program.name} must be assigned exactly once`
      })
    }
  }

  // Faculty cannot teach multiple classes at the same time
  private addFacultyConflictConstraints(): void {
    for (const faculty of this.faculty) {
      for (const timeSlot of this.timeSlots) {
        const variables: string[] = []
        
        for (const program of this.programs) {
          for (const classroom of this.classrooms) {
            variables.push(`x_${program.id}_${faculty.id}_${classroom.id}_${timeSlot.id}`)
          }
        }
        
        if (variables.length > 1) {
          this.model.constraints.push({
            id: `faculty_conflict_${faculty.id}_${timeSlot.id}`,
            type: ConstraintType.AT_MOST_ONE,
            variables,
            description: `Faculty ${faculty.name} can teach at most one class at slot ${timeSlot.slot_name}`
          })
        }
      }
    }
  }

  // Classroom cannot host multiple classes at the same time
  private addClassroomConflictConstraints(): void {
    for (const classroom of this.classrooms) {
      for (const timeSlot of this.timeSlots) {
        const variables: string[] = []
        
        for (const program of this.programs) {
          for (const faculty of this.faculty) {
            variables.push(`x_${program.id}_${faculty.id}_${classroom.id}_${timeSlot.id}`)
          }
        }
        
        if (variables.length > 1) {
          this.model.constraints.push({
            id: `classroom_conflict_${classroom.id}_${timeSlot.id}`,
            type: ConstraintType.AT_MOST_ONE,
            variables,
            description: `Classroom ${classroom.name} can host at most one class at slot ${timeSlot.slot_name}`
          })
        }
      }
    }
  }

  // Classroom capacity constraints
  private addCapacityConstraints(): void {
    for (const program of this.programs) {
      for (const classroom of this.classrooms) {
        if (program.max_students > classroom.capacity) {
          // Prevent assignment if capacity is insufficient
          for (const faculty of this.faculty) {
            for (const timeSlot of this.timeSlots) {
              const varId = `x_${program.id}_${faculty.id}_${classroom.id}_${timeSlot.id}`
              const variable = this.model.variables.get(varId)
              if (variable) {
                variable.domain = [0] // Force to 0
                variable.assigned_value = 0
                variable.is_fixed = true
              }
            }
          }
        }
      }
    }
  }

  // Faculty expertise constraints
  private addExpertiseConstraints(): void {
    for (const program of this.programs) {
      for (const faculty of this.faculty) {
        const hasRequiredExpertise = program.required_expertise_tags?.every(tag => 
          faculty.expertise_tags?.includes(tag)
        ) ?? true
        
        if (!hasRequiredExpertise) {
          // Prevent assignment if faculty lacks required expertise
          for (const classroom of this.classrooms) {
            for (const timeSlot of this.timeSlots) {
              const varId = `x_${program.id}_${faculty.id}_${classroom.id}_${timeSlot.id}`
              const variable = this.model.variables.get(varId)
              if (variable) {
                variable.domain = [0] // Force to 0
                variable.assigned_value = 0
                variable.is_fixed = true
              }
            }
          }
        }
      }
    }
  }

  // Faculty availability constraints
  private addAvailabilityConstraints(): void {
    for (const faculty of this.faculty) {
      if (faculty.availability_mask && typeof faculty.availability_mask === 'string') {
        for (let slotIndex = 0; slotIndex < (faculty.availability_mask as string).length; slotIndex++) {
          if (faculty.availability_mask[slotIndex] === '0') {
            // Faculty not available at this slot
            const timeSlot = this.timeSlots.find(ts => ts.day_of_week === Math.floor(slotIndex / 5) + 1)
            if (timeSlot) {
              for (const program of this.programs) {
                for (const classroom of this.classrooms) {
                  const varId = `x_${program.id}_${faculty.id}_${classroom.id}_${timeSlot.id}`
                  const variable = this.model.variables.get(varId)
                  if (variable) {
                    variable.domain = [0] // Force to 0
                    variable.assigned_value = 0
                    variable.is_fixed = true
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // Set optimization objective (maximize assigned classes, minimize conflicts)
  private setObjective(): void {
    const objectiveVars: string[] = []
    const objectiveCoeffs: number[] = []
    
    for (const [varId, variable] of this.model.variables) {
      if (!variable.is_fixed) {
        objectiveVars.push(varId)
        objectiveCoeffs.push(1) // Each assignment contributes 1 to objective
      }
    }
    
    this.model.objective_variables = objectiveVars
    this.model.objective_coefficients = objectiveCoeffs
    this.model.is_maximization = true
  }

  // OR-Tools style solver
  async solve(): Promise<OptimizationResult> {
    console.log('[OR-Tools CP-SAT] Starting constraint programming solver...')
    const startTime = Date.now()
    
    try {
      // Use backtracking search with constraint propagation
      const solution = await this.backtrackingSearch()
      
      const endTime = Date.now()
      const solvingTime = endTime - startTime
      
      if (solution.success) {
        console.log(`[OR-Tools CP-SAT] Solution found in ${solvingTime}ms`)
        console.log(`[OR-Tools CP-SAT] Assignments: ${solution.assignments.length}`)
        console.log(`[OR-Tools CP-SAT] Conflicts: ${solution.conflicts.length}`)
        
        return {
          success: true,
          assignments: solution.assignments,
          conflicts: solution.conflicts,
          optimization_score: this.calculateObjectiveValue(solution.assignments),
          strategy_used: 'or_tools_cp_sat',
          generation_time: solvingTime,
          iterations: solution.iterations
        }
      } else {
        console.log(`[OR-Tools CP-SAT] No solution found in ${solvingTime}ms`)
        return {
          success: false,
          assignments: [],
          conflicts: solution.conflicts,
          optimization_score: 0,
          strategy_used: 'or_tools_cp_sat',
          generation_time: solvingTime,
          iterations: solution.iterations
        }
      }
    } catch (error) {
      console.error('[OR-Tools CP-SAT] Solver error:', error)
      return {
        success: false,
        assignments: [],
        conflicts: [{ 
          type: 'faculty_conflict', 
          severity: 'critical',
          description: `Solver error: ${error}`,
          affected_entities: []
        }],
        optimization_score: 0,
        strategy_used: 'or_tools_cp_sat',
        generation_time: Date.now() - startTime,
        iterations: 0
      }
    }
  }

  // Backtracking search with constraint propagation
  private async backtrackingSearch(): Promise<{
    success: boolean
    assignments: TimeSlotAssignment[]
    conflicts: ConflictInfo[]
    iterations: number
  }> {
    const assignments: TimeSlotAssignment[] = []
    const conflicts: ConflictInfo[] = []
    let iterations = 0
    const maxIterations = 10000
    
    // Get unassigned programs ordered by difficulty (most constrained first)
    const unassignedPrograms = [...this.programs].sort((a, b) => {
      const aOptions = this.getValidAssignmentOptions(a.id)
      const bOptions = this.getValidAssignmentOptions(b.id)
      return aOptions.length - bOptions.length
    })
    
    const search = (programIndex: number): boolean => {
      iterations++
      
      if (iterations > maxIterations) {
        console.log('[OR-Tools CP-SAT] Max iterations reached')
        return false
      }
      
      if (programIndex >= unassignedPrograms.length) {
        return true // All programs assigned successfully
      }
      
      const program = unassignedPrograms[programIndex]
      const validOptions = this.getValidAssignmentOptions(program.id, assignments)
      
      if (validOptions.length === 0) {
        conflicts.push({
          type: 'time_conflict',
          severity: 'critical',
          description: `No valid assignment found for program ${program.name}`,
          affected_entities: [program.id]
        })
        return false
      }
      
      // Try each valid assignment option
      for (const option of validOptions) {
        const assignment: TimeSlotAssignment = {
          program_id: program.id,
          faculty_id: option.faculty_id,
          classroom_id: option.classroom_id,
          time_slot_id: option.time_slot_id,
          day_of_week: option.day_of_week,
          start_time: this.timeSlots.find(ts => ts.id === option.time_slot_id)?.start_time || '',
          end_time: this.timeSlots.find(ts => ts.id === option.time_slot_id)?.end_time || ''
        }
        
        assignments.push(assignment)
        
        // Check if this assignment creates conflicts
        const newConflicts = this.validateAssignment(assignment, assignments)
        if (newConflicts.length === 0) {
          // No conflicts, continue with next program
          if (search(programIndex + 1)) {
            return true
          }
        }
        
        // Backtrack: remove assignment and try next option
        assignments.pop()
      }
      
      return false
    }
    
    const success = search(0)
    
    return {
      success,
      assignments,
      conflicts,
      iterations
    }
  }

  private getValidAssignmentOptions(
    programId: number,
    currentAssignments: TimeSlotAssignment[] = []
  ): Array<{
    faculty_id: number
    classroom_id: number
    time_slot_id: number
    day_of_week: number
  }> {
    const options: Array<{
      faculty_id: number
      classroom_id: number
      time_slot_id: number
      day_of_week: number
    }> = []
    
    const program = this.programs.find(p => p.id === programId)
    if (!program) return options
    
    for (const faculty of this.faculty) {
      for (const classroom of this.classrooms) {
        for (const timeSlot of this.timeSlots) {
          const varId = `x_${programId}_${faculty.id}_${classroom.id}_${timeSlot.id}`
          const variable = this.model.variables.get(varId)
          
          if (variable && !variable.is_fixed && variable.domain.includes(1)) {
            // Check if this assignment conflicts with current assignments
            const testAssignment: TimeSlotAssignment = {
              program_id: programId,
              faculty_id: faculty.id,
              classroom_id: classroom.id,
              time_slot_id: timeSlot.id,
              day_of_week: timeSlot.day_of_week,
              start_time: timeSlot.start_time,
              end_time: timeSlot.end_time
            }
            
            const conflicts = this.validateAssignment(testAssignment, currentAssignments)
            if (conflicts.length === 0) {
              options.push({
                faculty_id: faculty.id,
                classroom_id: classroom.id,
                time_slot_id: timeSlot.id,
                day_of_week: testAssignment.day_of_week
              })
            }
          }
        }
      }
    }
    
    return options
  }

  private validateAssignment(
    assignment: TimeSlotAssignment,
    currentAssignments: TimeSlotAssignment[]
  ): ConflictInfo[] {
    const conflicts: ConflictInfo[] = []
    
    for (const existing of currentAssignments) {
      if (existing.time_slot_id === assignment.time_slot_id) {
        if (existing.faculty_id === assignment.faculty_id) {
          conflicts.push({
            type: 'faculty_conflict',
            severity: 'critical',
            description: `Faculty conflict at time slot ${assignment.time_slot_id}`,
            affected_entities: [assignment.faculty_id]
          })
        }
        
        if (existing.classroom_id === assignment.classroom_id) {
          conflicts.push({
            type: 'room_conflict',
            severity: 'critical',
            description: `Classroom conflict at time slot ${assignment.time_slot_id}`,
            affected_entities: [assignment.classroom_id]
          })
        }
      }
    }
    
    return conflicts
  }

  private calculateObjectiveValue(assignments: TimeSlotAssignment[]): number {
    // Higher score for more assignments
    return assignments.length * 100
  }

  // OR-Tools style parameter setting
  setMaxSolveTime(seconds: number): void {
    this.maxSolveTimeSeconds = seconds
  }

  setNumSearchWorkers(workers: number): void {
    this.numSearchWorkers = workers
  }

  setRandomSeed(seed: number): void {
    this.randomSeed = seed
  }

  enableLogging(enable: boolean): void {
    this.logSearchProgress = enable
  }
}