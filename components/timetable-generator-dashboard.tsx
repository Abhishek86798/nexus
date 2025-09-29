"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  Settings, 
  Users, 
  BookOpen, 
  Building, 
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Download,
  Eye
} from "lucide-react"
import type { GenerationConfig, OptimizationResult } from "@/lib/timetable-engine/types"
import { samplePrograms, sampleFaculty, sampleClassrooms, sampleTimeSlots, sampleStudents } from "@/lib/sample-data"

interface TimetableGeneratorProps {
  onTimetableGenerated?: (result: OptimizationResult) => void
}

export function TimetableGenerator({ onTimetableGenerated }: TimetableGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastResult, setLastResult] = useState<OptimizationResult | null>(null)
  const [config, setConfig] = useState<GenerationConfig>({
    academic_year: "2024-25",
    week_number: 1,
    optimization_strategy: "hybrid",
    max_iterations: 100,
    time_limit_seconds: 30,
    allow_conflicts: false,
  })
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  const generateTimetable = async () => {
    setIsGenerating(true)
    setProgress(0)
    setCurrentStep("Initializing...")

    try {
      // Simulate progress steps
      const steps = [
        { progress: 10, step: "Loading data..." },
        { progress: 25, step: "Parsing constraints..." },
        { progress: 40, step: "Building conflict graph..." },
        { progress: 60, step: "Running CP-SAT solver..." },
        { progress: 80, step: "Optimizing solution..." },
        { progress: 95, step: "Validating results..." },
        { progress: 100, step: "Complete!" },
      ]

      for (const { progress: p, step } of steps) {
        setProgress(p)
        setCurrentStep(step)
        await new Promise(resolve => setTimeout(resolve, p === 60 ? 2000 : 500)) // Longer delay for solver
      }

      const response = await fetch("/api/timetable/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      const data = await response.json()
      
      if (data.success) {
        setLastResult(data.data)
        onTimetableGenerated?.(data.data)
      } else {
        console.error("Generation failed:", data.error)
      }
    } catch (error) {
      console.error("Error generating timetable:", error)
    } finally {
      setIsGenerating(false)
      setProgress(0)
      setCurrentStep("")
    }
  }

  const dataStats = {
    programs: samplePrograms.length,
    faculty: sampleFaculty.length,
    students: sampleStudents.length,
    classrooms: sampleClassrooms.length,
    timeSlots: sampleTimeSlots.length,
  }

  const getTotalPossibleCombinations = () => {
    return dataStats.programs * dataStats.faculty * dataStats.classrooms * dataStats.timeSlots
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Timetable Generator 🚀</h1>
          <p className="text-muted-foreground mt-2">
            Generate conflict-free timetables using advanced constraint programming
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = "/admin/import-export"}>
            <Settings className="h-4 w-4 mr-2" />
            Data Management
          </Button>
          {lastResult && (
            <Button variant="outline" onClick={() => window.location.href = "/admin/timetables"}>
              <Eye className="h-4 w-4 mr-2" />
              View Timetable
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Summary Cards */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Data Summary
              </CardTitle>
              <CardDescription>
                Current dataset statistics for timetable generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{dataStats.programs}</div>
                  <div className="text-sm text-muted-foreground">Programs</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{dataStats.faculty}</div>
                  <div className="text-sm text-muted-foreground">Faculty</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{dataStats.students}</div>
                  <div className="text-sm text-muted-foreground">Students</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Building className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{dataStats.classrooms}</div>
                  <div className="text-sm text-muted-foreground">Classrooms</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold">{dataStats.timeSlots}</div>
                  <div className="text-sm text-muted-foreground">Time Slots</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Complexity Analysis</span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Total possible combinations: <strong>{getTotalPossibleCombinations().toLocaleString()}</strong>
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-500 mt-1">
                  Our CP-SAT solver will intelligently navigate this solution space to find the optimal conflict-free schedule.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Generation Configuration
              </CardTitle>
              <CardDescription>
                Customize the timetable generation parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="academic-year">Academic Year</Label>
                      <Select
                        value={config.academic_year}
                        onValueChange={(value) => setConfig({ ...config, academic_year: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-25">2024-25</SelectItem>
                          <SelectItem value="2025-26">2025-26</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="week-number">Week Number</Label>
                      <Select
                        value={config.week_number.toString()}
                        onValueChange={(value) => setConfig({ ...config, week_number: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 20 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Week {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="optimization-strategy">Optimization Strategy</Label>
                    <Select
                      value={config.optimization_strategy}
                      onValueChange={(value) => setConfig({ ...config, optimization_strategy: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greedy">
                          <div className="flex flex-col">
                            <span>Greedy (Fast)</span>
                            <span className="text-xs text-muted-foreground">Quick but may not be optimal</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="cp_sat">
                          <div className="flex flex-col">
                            <span>CP-SAT (Optimal)</span>
                            <span className="text-xs text-muted-foreground">Slower but guarantees optimal solution</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="hybrid">
                          <div className="flex flex-col">
                            <span>Hybrid (Recommended)</span>
                            <span className="text-xs text-muted-foreground">Best of both approaches</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ml_guided">
                          <div className="flex flex-col">
                            <span>ML-Guided (Beta)</span>
                            <span className="text-xs text-muted-foreground">Uses machine learning insights</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-iterations">Max Iterations</Label>
                      <Select
                        value={config.max_iterations.toString()}
                        onValueChange={(value) => setConfig({ ...config, max_iterations: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50 (Fast)</SelectItem>
                          <SelectItem value="100">100 (Balanced)</SelectItem>
                          <SelectItem value="200">200 (Thorough)</SelectItem>
                          <SelectItem value="500">500 (Comprehensive)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="time-limit">Time Limit (seconds)</Label>
                      <Select
                        value={config.time_limit_seconds.toString()}
                        onValueChange={(value) => setConfig({ ...config, time_limit_seconds: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15s (Quick)</SelectItem>
                          <SelectItem value="30">30s (Standard)</SelectItem>
                          <SelectItem value="60">60s (Extended)</SelectItem>
                          <SelectItem value="120">120s (Maximum)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allow-conflicts"
                      checked={config.allow_conflicts}
                      onCheckedChange={(checked) => setConfig({ ...config, allow_conflicts: checked })}
                    />
                    <Label htmlFor="allow-conflicts" className="text-sm">
                      Allow soft constraint violations (not recommended)
                    </Label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Generation Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Generate Timetable
              </CardTitle>
              <CardDescription>
                {isGenerating ? "Generating your optimal timetable..." : "Ready to generate a new timetable"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">{currentStep}</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <div className="text-xs text-muted-foreground text-center">
                    {progress}% Complete
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={generateTimetable} 
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Generate Timetable
                </Button>
              )}

              {lastResult && !isGenerating && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-medium">Last Generation Results</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={lastResult.success ? "default" : "destructive"}>
                        {lastResult.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Assignments:</span>
                      <span>{lastResult.assignments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conflicts:</span>
                      <span className={lastResult.conflicts.length > 0 ? "text-red-600" : "text-green-600"}>
                        {lastResult.conflicts.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Score:</span>
                      <span>{lastResult.optimization_score.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{(lastResult.generation_time / 1000).toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Strategy:</span>
                      <span className="capitalize">{lastResult.strategy_used}</span>
                    </div>
                  </div>
                  
                  {lastResult.conflicts.length > 0 && (
                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-950 rounded">
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Conflicts Detected:
                      </div>
                      <div className="text-xs text-red-500 dark:text-red-500 mt-1">
                        {lastResult.conflicts.slice(0, 3).map((conflict, index) => (
                          <div key={index}>• {conflict.description}</div>
                        ))}
                        {lastResult.conflicts.length > 3 && (
                          <div>... and {lastResult.conflicts.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.location.href = "/admin/timetables"}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Programs needing labs:</span>
                <span>{samplePrograms.filter(p => p.needs_lab).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Available lab rooms:</span>
                <span>{sampleClassrooms.filter(c => c.is_lab).length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total capacity:</span>
                <span>{sampleClassrooms.reduce((sum, c) => sum + c.capacity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Avg faculty hours:</span>
                <span>{(sampleFaculty.reduce((sum, f) => sum + f.max_hours_per_week, 0) / sampleFaculty.length).toFixed(1)}h</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}