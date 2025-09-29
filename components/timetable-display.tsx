"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  BookOpen,
  Building,
  AlertTriangle,
  Settings,
  Download,
  Filter,
  Eye,
  Edit,
  X
} from "lucide-react"
import type { TimeSlotAssignment, OptimizationResult } from "@/lib/timetable-engine/types"
import type { Program, Faculty, Classroom, TimeSlot, DisruptionAlert, AlternativeSlot } from "@/lib/types"
import { samplePrograms, sampleFaculty, sampleClassrooms, sampleTimeSlots } from "@/lib/sample-data"

interface TimetableDisplayProps {
  result?: OptimizationResult
  onClassClick?: (assignment: TimeSlotAssignment) => void
}

interface ClassCellProps {
  assignment: TimeSlotAssignment | null
  onClick?: () => void
  isDisrupted?: boolean
}

function ClassCell({ assignment, onClick, isDisrupted }: ClassCellProps) {
  if (!assignment) {
    return (
      <div className="h-20 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
        Free
      </div>
    )
  }

  const program = samplePrograms.find(p => p.id === assignment.program_id)
  const faculty = sampleFaculty.find(f => f.id === assignment.faculty_id)
  const classroom = sampleClassrooms.find(c => c.id === assignment.classroom_id)

  const getTypeColor = (courseType: string | undefined) => {
    switch (courseType) {
      case "Major": return "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700"
      case "Minor": return "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
      case "Elective": return "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700"
      case "Skill-Based": return "bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700"
      default: return "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
    }
  }

  return (
    <div 
      className={`
        h-20 p-2 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md
        ${getTypeColor(program?.course_type)}
        ${isDisrupted ? "ring-2 ring-red-500 animate-pulse" : ""}
      `}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="font-semibold text-sm truncate" title={program?.name}>
            {program?.code}
          </div>
          <div className="text-xs text-muted-foreground truncate" title={faculty?.name}>
            {faculty?.name?.split(' ')[0]} {faculty?.name?.split(' ')[1]?.[0]}.
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground truncate" title={classroom?.name}>
            {classroom?.name}
          </div>
          {program?.needs_lab && (
            <Badge variant="secondary" className="text-xs px-1 py-0">Lab</Badge>
          )}
          {isDisrupted && (
            <AlertTriangle className="h-3 w-3 text-red-500" />
          )}
        </div>
      </div>
    </div>
  )
}

export function TimetableDisplay({ result, onClassClick }: TimetableDisplayProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<TimeSlotAssignment | null>(null)
  const [viewMode, setViewMode] = useState<"week" | "day">("week")
  const [selectedDay, setSelectedDay] = useState(1)
  const [disruptedClasses, setDisruptedClasses] = useState<Set<string>>(new Set())
  const [showDisruptionModal, setShowDisruptionModal] = useState(false)
  const [currentDisruption, setCurrentDisruption] = useState<DisruptionAlert | null>(null)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeSlots = sampleTimeSlots.slice(0, 7) // Show first 7 time slots

  // Create grid data structure
  const createGrid = () => {
    const grid: { [day: number]: { [timeSlot: number]: TimeSlotAssignment | null } } = {}
    
    // Initialize empty grid
    for (let day = 1; day <= 7; day++) {
      grid[day] = {}
      for (const slot of timeSlots) {
        grid[day][slot.id] = null
      }
    }

    // Fill with assignments
    if (result?.assignments) {
      for (const assignment of result.assignments) {
        if (grid[assignment.day_of_week]) {
          grid[assignment.day_of_week][assignment.time_slot_id] = assignment
        }
      }
    }

    return grid
  }

  const grid = createGrid()

  const handleClassClick = (assignment: TimeSlotAssignment) => {
    setSelectedAssignment(assignment)
    onClassClick?.(assignment)
  }

  const handleDisruptionClick = (assignment: TimeSlotAssignment, type: "teacher_absent" | "room_unavailable") => {
    const program = samplePrograms.find(p => p.id === assignment.program_id)
    const faculty = sampleFaculty.find(f => f.id === assignment.faculty_id)
    const classroom = sampleClassrooms.find(c => c.id === assignment.classroom_id)

    // Mock suggested alternatives
    const alternatives: AlternativeSlot[] = [
      {
        time_slot_id: assignment.time_slot_id + 1,
        classroom_id: assignment.classroom_id,
        day: "Tuesday",
        time: "4:00-5:00 PM",
        room_name: classroom?.name || "Room TBD",
        confidence: 85,
        reason: "Same room available at later time"
      },
      {
        time_slot_id: assignment.time_slot_id,
        classroom_id: assignment.classroom_id + 1,
        day: "Friday",
        time: "11:15-12:15 PM",
        room_name: "Room A102",
        confidence: 78,
        reason: "Alternative room with similar capacity"
      }
    ]

    const disruption: DisruptionAlert = {
      id: Date.now(),
      class_id: assignment.program_id,
      type,
      timestamp: new Date().toISOString(),
      suggested_alternatives: alternatives,
      status: "pending"
    }

    setCurrentDisruption(disruption)
    setShowDisruptionModal(true)
    
    // Add visual indicator
    const classKey = `${assignment.program_id}-${assignment.time_slot_id}-${assignment.day_of_week}`
    setDisruptedClasses(prev => new Set([...prev, classKey]))
  }

  const resolveDisruption = (alternative: AlternativeSlot) => {
    setShowDisruptionModal(false)
    setCurrentDisruption(null)
    // In real implementation, this would update the timetable
    console.log("Resolved disruption with alternative:", alternative)
  }

  const isClassDisrupted = (assignment: TimeSlotAssignment) => {
    const classKey = `${assignment.program_id}-${assignment.time_slot_id}-${assignment.day_of_week}`
    return disruptedClasses.has(classKey)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Timetable View</h1>
          <p className="text-muted-foreground mt-2">
            {result ? `Generated ${result.assignments.length} class assignments` : "No timetable data available"}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
            </SelectContent>
          </Select>
          {viewMode === "day" && (
            <Select value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {days.map((day, index) => (
                  <SelectItem key={index + 1} value={(index + 1).toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {result && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{result.assignments.length}</div>
                  <p className="text-xs text-muted-foreground">Total Classes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`h-4 w-4 ${result.conflicts.length > 0 ? "text-red-500" : "text-green-500"}`} />
                <div>
                  <div className="text-2xl font-bold">{result.conflicts.length}</div>
                  <p className="text-xs text-muted-foreground">Conflicts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{result.optimization_score.toFixed(0)}%</div>
                  <p className="text-xs text-muted-foreground">Optimization</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">{(result.generation_time / 1000).toFixed(1)}s</div>
                  <p className="text-xs text-muted-foreground">Generation Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Weekly Schedule</span>
            <div className="flex gap-2">
              <Badge variant="outline">Major</Badge>
              <Badge variant="outline" className="bg-green-100">Minor</Badge>
              <Badge variant="outline" className="bg-purple-100">Elective</Badge>
              <Badge variant="outline" className="bg-orange-100">Skill-Based</Badge>
            </div>
          </CardTitle>
          <CardDescription>
            Click on any class to view details or simulate disruptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "week" ? (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-2 min-w-max">
                {/* Header row */}
                <div className="font-semibold p-2">Time</div>
                {days.slice(0, 7).map((day, index) => (
                  <div key={day} className="font-semibold p-2 text-center">
                    {day}
                  </div>
                ))}

                {/* Time slot rows */}
                {timeSlots.map((slot) => (
                  <div key={slot.id} className="contents">
                    <div className="font-medium p-2 text-sm text-muted-foreground">
                      {slot.slot_name}
                      <br />
                      <span className="text-xs">
                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                      </span>
                    </div>
                    {days.slice(0, 7).map((_, dayIndex) => {
                      const dayNumber = dayIndex + 1
                      const assignment = grid[dayNumber]?.[slot.id]
                      return (
                        <ClassCell
                          key={`${dayNumber}-${slot.id}`}
                          assignment={assignment}
                          onClick={() => assignment && handleClassClick(assignment)}
                          isDisrupted={assignment ? isClassDisrupted(assignment) : false}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Day view implementation would go here
            <div className="text-center py-8 text-muted-foreground">
              Day view coming soon...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Class Details Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Class Details
            </DialogTitle>
            <DialogDescription>
              View and manage class information
            </DialogDescription>
          </DialogHeader>
          
          {selectedAssignment && (
            <div className="space-y-6">
              {/* Class Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Course Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(() => {
                      const program = samplePrograms.find(p => p.id === selectedAssignment.program_id)
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="font-medium">Course:</span>
                            <span>{program?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Code:</span>
                            <span>{program?.code}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Credits:</span>
                            <span>{program?.credits}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Type:</span>
                            <Badge variant="secondary">{program?.course_type}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Lab Required:</span>
                            <Badge variant={program?.needs_lab ? "default" : "secondary"}>
                              {program?.needs_lab ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Faculty & Venue
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {(() => {
                      const faculty = sampleFaculty.find(f => f.id === selectedAssignment.faculty_id)
                      const classroom = sampleClassrooms.find(c => c.id === selectedAssignment.classroom_id)
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="font-medium">Instructor:</span>
                            <span>{faculty?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Department:</span>
                            <span>{faculty?.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Room:</span>
                            <span>{classroom?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Capacity:</span>
                            <span>{classroom?.capacity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Building:</span>
                            <span>{classroom?.building || "N/A"}</span>
                          </div>
                        </>
                      )
                    })()}
                  </CardContent>
                </Card>
              </div>

              {/* Time Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Schedule Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="font-medium">Day</div>
                      <div className="text-lg">{days[selectedAssignment.day_of_week - 1]}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Time</div>
                      <div className="text-lg">
                        {selectedAssignment.start_time.slice(0, 5)} - {selectedAssignment.end_time.slice(0, 5)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Duration</div>
                      <div className="text-lg">1 Hour</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disruption Simulation */}
              <Card className="border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <AlertTriangle className="h-4 w-4" />
                    Disruption Simulation
                  </CardTitle>
                  <CardDescription>
                    Test the AI rescheduling system by simulating disruptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisruptionClick(selectedAssignment, "teacher_absent")}
                    >
                      Teacher Absent
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisruptionClick(selectedAssignment, "room_unavailable")}
                    >
                      Room Unavailable
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Disruption Alert Dialog */}
      <Dialog open={showDisruptionModal} onOpenChange={setShowDisruptionModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Disruption Alert
            </DialogTitle>
            <DialogDescription>
              AI has detected a scheduling conflict and suggests alternatives
            </DialogDescription>
          </DialogHeader>
          
          {currentDisruption && (
            <div className="space-y-6">
              {/* Disruption Info */}
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  {currentDisruption.type === "teacher_absent" ? "Faculty Unavailable" : "Room Unavailable"}
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {currentDisruption.type === "teacher_absent" 
                    ? "The assigned faculty member is not available for this class."
                    : "The assigned classroom is not available for this class."
                  }
                </p>
              </div>

              {/* AI Suggestions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  🤖 AI Suggests the following alternatives:
                </h3>
                <div className="space-y-3">
                  {currentDisruption.suggested_alternatives.map((alternative, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-accent">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {alternative.day} at {alternative.time}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {alternative.room_name} • {alternative.reason}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">
                              {alternative.confidence}% confidence
                            </Badge>
                            <br />
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => resolveDisruption(alternative)}
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDisruptionModal(false)}>
                  Cancel
                </Button>
                <Button variant="outline">
                  Find More Options
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}