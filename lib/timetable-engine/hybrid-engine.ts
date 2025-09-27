// Main hybrid timetable generation engine

import { GreedySolver } from "./greedy-solver"
import { CPSATSolver } from "./cp-sat-solver"
import { ConstraintParser } from "./constraint-parser"
import type { GenerationConfig, OptimizationResult, Constraint } from "./types"
import type { Program, Faculty, Classroom, TimeSlot, Preference, Student } from "../types"

export class HybridTimetableEngine {
  private constraintParser: ConstraintParser

  constructor() {
    this.constraintParser = new ConstraintParser()
  }

  async generateTimetable(
    programs: Program[],
    faculty: Faculty[],
    classrooms: Classroom[],
    timeSlots: TimeSlot[],
    preferences: Preference[],
    config: GenerationConfig,
    students?: Student[],
  ): Promise<OptimizationResult> {
    // Parse natural language preferences into constraints
    const constraints = this.parsePreferences(preferences)

    let result: OptimizationResult

    switch (config.optimization_strategy) {
      case "greedy":
        result = await this.runGreedyOptimization(programs, faculty, classrooms, timeSlots, constraints, students)
        break

      case "cp_sat":
        result = await this.runCPSATOptimization(programs, faculty, classrooms, timeSlots, constraints, config, students)
        break

      case "ml_guided":
        result = await this.runMLGuidedOptimization(programs, faculty, classrooms, timeSlots, constraints, config, students)
        break

      case "hybrid":
      default:
        result = await this.runHybridOptimization(programs, faculty, classrooms, timeSlots, constraints, config, students)
        break
    }

    return result
  }

  private parsePreferences(preferences: Preference[]): Constraint[] {
    const constraints: Constraint[] = []

    for (const preference of preferences) {
      const parsedConstraints = this.constraintParser.parsePreference(preference.preference_text)

      for (const parsed of parsedConstraints) {
        constraints.push({
          id: `pref_${preference.id}_${constraints.length}`,
          type: parsed.is_hard_constraint ? "hard" : "soft",
          priority: parsed.priority,
          description: parsed.preference_text,
          entity_type: preference.entity_type as any,
          entity_id: preference.entity_id,
          constraint_data: parsed,
        })
      }
    }

    return constraints
  }

  private async runGreedyOptimization(
    programs: Program[],
    faculty: Faculty[],
    classrooms: Classroom[],
    timeSlots: TimeSlot[],
    constraints: Constraint[],
    students?: Student[],
  ): Promise<OptimizationResult> {
    const solver = new GreedySolver(programs, faculty, classrooms, timeSlots, constraints, students)
    return solver.solve()
  }

  private async runCPSATOptimization(
    programs: Program[],
    faculty: Faculty[],
    classrooms: Classroom[],
    timeSlots: TimeSlot[],
    constraints: Constraint[],
    config: GenerationConfig,
    students?: Student[],
  ): Promise<OptimizationResult> {
    const solver = new CPSATSolver(programs, faculty, classrooms, timeSlots, constraints, students)
    return solver.solve(config.time_limit_seconds)
  }

  private async runMLGuidedOptimization(
    programs: Program[],
    faculty: Faculty[],
    classrooms: Classroom[],
    timeSlots: TimeSlot[],
    constraints: Constraint[],
    config: GenerationConfig,
    students?: Student[],
  ): Promise<OptimizationResult> {
    // Placeholder for ML-guided optimization
    // In production, this would use machine learning models
    // to predict optimal assignments based on historical data

    console.log("[v0] ML-guided optimization not yet implemented, falling back to CP-SAT")
    return this.runCPSATOptimization(programs, faculty, classrooms, timeSlots, constraints, config, students)
  }

  private async runHybridOptimization(
    programs: Program[],
    faculty: Faculty[],
    classrooms: Classroom[],
    timeSlots: TimeSlot[],
    constraints: Constraint[],
    config: GenerationConfig,
    students?: Student[],
  ): Promise<OptimizationResult> {
    console.log("[v0] Starting hybrid optimization with greedy initialization")

    // Step 1: Greedy initialization
    const greedyResult = await this.runGreedyOptimization(programs, faculty, classrooms, timeSlots, constraints, students)

    console.log("[v0] Greedy initialization complete, score:", greedyResult.optimization_score)

    // Step 2: If greedy solution has conflicts or low score, try CP-SAT
    if (greedyResult.conflicts.length > 0 || greedyResult.optimization_score < 70) {
      console.log("[v0] Greedy solution suboptimal, running CP-SAT refinement")

      const cpsatResult = await this.runCPSATOptimization(programs, faculty, classrooms, timeSlots, constraints, config, students)

      // Return better result
      if (cpsatResult.optimization_score > greedyResult.optimization_score) {
        console.log("[v0] CP-SAT produced better solution, score:", cpsatResult.optimization_score)
        return {
          ...cpsatResult,
          strategy_used: "hybrid_cp_sat",
        }
      }
    }

    console.log("[v0] Using greedy solution as final result")
    return {
      ...greedyResult,
      strategy_used: "hybrid_greedy",
    }
  }
}
