"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { teachers, rooms, timetable, analyticsData } from "@/lib/demo-data"
import {
  Calendar,
  Users,
  MapPin,
  BarChart3,
  Download,
  RefreshCw,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { DemoNav } from "@/components/demo-nav"

const pipelineSteps = [
  { id: 1, title: "Inputs Loaded", description: "Electives, Teachers, Rooms", duration: 0.8 },
  { id: 2, title: "Conflict Graph Built", description: "Analyzing constraints", duration: 1.2 },
  { id: 3, title: "Greedy Init Baseline", description: "Creating initial schedule", duration: 0.6 },
  { id: 4, title: "CP-SAT Solver", description: "Constraint validation", duration: 1.5 },
  { id: 5, title: "Neural-Guided Optimization", description: "AI enhancement", duration: 2.0 },
  { id: 6, title: "Agent Negotiation", description: "Multi-agent coordination", duration: 1.0 },
  { id: 7, title: "Final Validation", description: "Quality assurance", duration: 0.5 },
]

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("timetable")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [generationComplete, setGenerationComplete] = useState(false)

  const handleExport = () => {
    alert("✅ Timetable exported as PDF successfully! (Demo)")
  }

  const handleReschedule = () => {
    alert("🔄 AI Reschedule triggered! Analyzing conflicts and optimizing... (Demo)")
  }

  const handleGenerateNew = async () => {
    setIsGenerating(true)
    setCurrentStep(0)
    setCompletedSteps([])
    setProgress(0)
    setGenerationComplete(false)

    for (let i = 0; i < pipelineSteps.length; i++) {
      setCurrentStep(i + 1)

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, pipelineSteps[i].duration * 1000))

      setCompletedSteps((prev) => [...prev, i + 1])
      setProgress(((i + 1) / pipelineSteps.length) * 100)
    }

    setIsGenerating(false)
    setGenerationComplete(true)

    // Show completion message
    setTimeout(() => {
      alert(
        "🎉 Optimized Timetable Generated Successfully!\n\nConflicts: 0\nOptimization Score: 98.5%\nGeneration Time: 7.6s",
      )
    }, 500)
  }

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DemoNav />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Scheduler Demo</h1>
                <p className="text-sm text-gray-500">NEP 2020 Compliant Timetable System</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleGenerateNew}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isGenerating ? "Generating..." : "Generate New"}
              </Button>
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(isGenerating || generationComplete) && (
          <Card className="mb-8 border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-3 h-3 text-white" />
                </div>
                <span>AI Timetable Generation Pipeline</span>
              </CardTitle>
              <CardDescription>
                {isGenerating ? "Processing step-by-step optimization..." : "Generation completed successfully!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Pipeline Steps */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {pipelineSteps.map((step) => {
                  const isCompleted = completedSteps.includes(step.id)
                  const isCurrent = currentStep === step.id && isGenerating
                  const isPending = step.id > currentStep

                  return (
                    <Card
                      key={step.id}
                      className={`transition-all duration-300 ${
                        isCurrent
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : isCompleted
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : isCurrent ? (
                              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-sm font-medium ${
                                isCompleted ? "text-green-900" : isCurrent ? "text-blue-900" : "text-gray-700"
                              }`}
                            >
                              {step.title}
                            </h4>
                            <p
                              className={`text-xs mt-1 ${
                                isCompleted ? "text-green-600" : isCurrent ? "text-blue-600" : "text-gray-500"
                              }`}
                            >
                              {step.description}
                            </p>
                            {isCompleted && (
                              <p className="text-xs text-green-600 mt-1">Completed in {step.duration}s</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Completion Message */}
              {generationComplete && (
                <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Optimized Timetable Generated Successfully!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Conflicts: 0 • Optimization Score: 98.5% • Total Time: 7.6s
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{timetable.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Faculty</p>
                  <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conflicts</p>
                  <p className={`text-2xl font-bold ${generationComplete ? "text-green-600" : "text-red-600"}`}>
                    {generationComplete ? "0" : "3"}
                  </p>
                </div>
                <AlertTriangle className={`w-8 h-8 ${generationComplete ? "text-green-600" : "text-red-600"}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timetable">Timetable Grid</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          <TabsContent value="timetable" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Weekly Timetable</span>
                  {generationComplete && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">Optimized</Badge>
                  )}
                </CardTitle>
                <CardDescription>Current schedule with AI-optimized allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timetable.map((item, index) => (
                    <Card
                      key={index}
                      className={`border-l-4 ${generationComplete ? "border-l-green-500 bg-green-50/30" : "border-l-blue-500"} transition-all duration-500`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline">{item.day}</Badge>
                          <Badge variant="secondary">{item.slot}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{item.course}</h3>
                        <p className="text-sm text-gray-600 mb-1">👨‍🏫 {item.teacher}</p>
                        <p className="text-sm text-gray-600 mb-1">🏛️ {item.room}</p>
                        <p className="text-sm text-blue-600 font-medium">{item.program}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button onClick={handleReschedule} className="bg-orange-600 hover:bg-orange-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reschedule Conflicts
                  </Button>
                  <Button variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Simulate Disruption
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Workload</CardTitle>
                  <CardDescription>Teaching hours per faculty member</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.teacherWorkload}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="load" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Room Utilization</CardTitle>
                  <CardDescription>Percentage utilization by room</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.roomUtilization}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, utilization }) => `${name}: ${utilization}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="utilization"
                      >
                        {analyticsData.roomUtilization.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Schedule Overview</CardTitle>
                  <CardDescription>Classes and conflicts by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.weeklySchedule}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="classes" fill="#10b981" name="Classes" />
                      <Bar dataKey="conflicts" fill="#ef4444" name="Conflicts" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Management</CardTitle>
                  <CardDescription>Manage teaching staff and workloads</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teachers.map((teacher) => (
                      <div key={teacher.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-sm text-gray-600">{teacher.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{teacher.load}h/week</p>
                          <Badge variant={teacher.load > 20 ? "destructive" : "secondary"}>
                            {teacher.load > 20 ? "Overloaded" : "Normal"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Room Management</CardTitle>
                  <CardDescription>Monitor room capacity and utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rooms.map((room) => (
                      <div key={room.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{room.name}</p>
                          <p className="text-sm text-gray-600">
                            {room.type} • {room.capacity} seats
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{room.utilization}%</p>
                          <Badge variant={room.utilization > 80 ? "destructive" : "secondary"}>
                            {room.utilization > 80 ? "High Usage" : "Available"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={handleGenerateNew} disabled={isGenerating} className="h-20 flex-col">
                    {isGenerating ? (
                      <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-6 h-6 mb-2" />
                    )}
                    Generate Timetable
                  </Button>
                  <Button onClick={handleReschedule} variant="outline" className="h-20 flex-col bg-transparent">
                    <Clock className="w-6 h-6 mb-2" />
                    Reschedule
                  </Button>
                  <Button onClick={handleExport} variant="outline" className="h-20 flex-col bg-transparent">
                    <Download className="w-6 h-6 mb-2" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col bg-transparent"
                    onClick={() => alert("🔍 Conflict analysis started! (Demo)")}
                  >
                    <BarChart3 className="w-6 h-6 mb-2" />
                    Analyze Conflicts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
