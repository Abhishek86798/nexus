"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, CheckCircle, AlertCircle } from "lucide-react"
import type { OptimizationResult } from "@/lib/timetable-engine/types"

export function TimetableGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [config, setConfig] = useState({
    optimization_strategy: "hybrid",
    time_limit_seconds: 30,
    academic_year: "2024-25",
    allow_conflicts: false,
  })

  const handleGenerate = async () => {
    setIsGenerating(true)
    setProgress(0)
    setResult(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      const response = await fetch("/api/timetable/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
        setProgress(100)
      } else {
        throw new Error(data.error || "Generation failed")
      }
    } catch (error) {
      console.error("Generation error:", error)
      setResult({
        success: false,
        assignments: [],
        conflicts: [
          { type: "time_conflict", severity: "critical", description: "Generation failed", affected_entities: [] },
        ],
        optimization_score: 0,
        generation_time: 0,
        strategy_used: "none",
        iterations: 0,
      })
      setProgress(100)
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Configuration</CardTitle>
          <CardDescription>Configure the timetable generation parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="strategy">Optimization Strategy</Label>
              <Select
                value={config.optimization_strategy}
                onValueChange={(value) => setConfig((prev) => ({ ...prev, optimization_strategy: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greedy">Greedy Algorithm</SelectItem>
                  <SelectItem value="cp_sat">CP-SAT Solver</SelectItem>
                  <SelectItem value="ml_guided">ML-Guided (Beta)</SelectItem>
                  <SelectItem value="hybrid">Hybrid Approach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time-limit">Time Limit (seconds)</Label>
              <Input
                id="time-limit"
                type="number"
                value={config.time_limit_seconds}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, time_limit_seconds: Number.parseInt(e.target.value) }))
                }
                min="10"
                max="300"
              />
            </div>

            <div>
              <Label htmlFor="academic-year">Academic Year</Label>
              <Input
                id="academic-year"
                value={config.academic_year}
                onChange={(e) => setConfig((prev) => ({ ...prev, academic_year: e.target.value }))}
                placeholder="2024-25"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allow-conflicts"
                checked={config.allow_conflicts}
                onChange={(e) => setConfig((prev) => ({ ...prev, allow_conflicts: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="allow-conflicts">Allow minor conflicts</Label>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-700">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Generate Timetable
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generating timetable...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              Generation Results
            </CardTitle>
            <CardDescription>
              Strategy: {result.strategy_used} | Time: {result.generation_time}ms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Alert */}
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertDescription>
                {result.success
                  ? `Successfully generated timetable with ${result.assignments.length} assignments`
                  : `Generation failed with ${result.conflicts.length} conflicts`}
              </AlertDescription>
            </Alert>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{result.assignments.length}</div>
                <div className="text-sm text-blue-600">Assignments</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{result.optimization_score}</div>
                <div className="text-sm text-green-600">Score</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{result.conflicts.length}</div>
                <div className="text-sm text-orange-600">Conflicts</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{result.generation_time}ms</div>
                <div className="text-sm text-purple-600">Time</div>
              </div>
            </div>

            {/* Conflicts */}
            {result.conflicts.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Conflicts Detected</h4>
                <div className="space-y-2">
                  {result.conflicts.map((conflict, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
                      <Badge variant="destructive" className="text-xs">
                        {conflict.severity}
                      </Badge>
                      <span className="text-sm text-red-700">{conflict.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Assignments */}
            {result.assignments.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Sample Assignments</h4>
                <div className="space-y-2">
                  {result.assignments.slice(0, 3).map((assignment, index) => (
                    <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                      Program {assignment.program_id} → Faculty {assignment.faculty_id} → Room {assignment.classroom_id}
                      <Badge variant="outline" className="ml-2">
                        {assignment.start_time}-{assignment.end_time}
                      </Badge>
                    </div>
                  ))}
                  {result.assignments.length > 3 && (
                    <div className="text-sm text-gray-500">
                      ... and {result.assignments.length - 3} more assignments
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
