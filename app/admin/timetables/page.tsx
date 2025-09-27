"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, Download, RefreshCw, Eye } from "lucide-react"
import { samplePrograms, sampleFaculty, sampleClassrooms, getDayName } from "@/lib/sample-data"

// Mock timetable data
const mockTimetableEntries = [
  {
    id: 1,
    program: samplePrograms[0],
    faculty: sampleFaculty[0],
    classroom: sampleClassrooms[0],
    day_of_week: 1,
    start_time: "09:00",
    end_time: "10:00",
    slot_name: "Morning 1",
    status: "active",
  },
  {
    id: 2,
    program: samplePrograms[1],
    faculty: sampleFaculty[1],
    classroom: sampleClassrooms[1],
    day_of_week: 1,
    start_time: "10:00",
    end_time: "11:00",
    slot_name: "Morning 2",
    status: "active",
  },
  {
    id: 3,
    program: samplePrograms[2],
    faculty: sampleFaculty[2],
    classroom: sampleClassrooms[0],
    day_of_week: 2,
    start_time: "14:00",
    end_time: "15:00",
    slot_name: "Afternoon 1",
    status: "active",
  },
]

export default function TimetablesPage() {
  const [filters, setFilters] = useState({
    program_id: "all",
    faculty_id: "all",
    classroom_id: "all",
    day_of_week: "all",
  })

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const timeSlots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:15-12:15",
    "12:15-13:15",
    "14:00-15:00",
    "15:00-16:00",
    "16:15-17:15",
  ]

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  const handleGenerateTimetable = () => {
    // This would trigger the timetable generation algorithm
    console.log("Generating timetable...")
  }

  const handleExportPDF = () => {
    console.log("Exporting to PDF...")
  }

  const handleExportExcel = () => {
    console.log("Exporting to Excel...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable Management</h1>
          <p className="mt-2 text-gray-600">Generate, view, and manage academic timetables</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateTimetable} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter timetables by program, faculty, or classroom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="program-filter">Program</Label>
              <Select
                value={filters.program_id}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, program_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Programs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programs</SelectItem>
                  {samplePrograms.map((program) => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.code} - {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="faculty-filter">Faculty</Label>
              <Select
                value={filters.faculty_id}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, faculty_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculty</SelectItem>
                  {sampleFaculty.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id.toString()}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="classroom-filter">Classroom</Label>
              <Select
                value={filters.classroom_id}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, classroom_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Classrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classrooms</SelectItem>
                  {sampleClassrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id.toString()}>
                      {classroom.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="day-filter">Day</Label>
              <Select
                value={filters.day_of_week}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, day_of_week: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {days.map((day, index) => (
                    <SelectItem key={day} value={(index + 1).toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")}>
            Grid View
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}>
            List View
          </Button>
        </div>
      </div>

      {/* Timetable Grid View */}
      {viewMode === "grid" && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Timetable Grid</CardTitle>
            <CardDescription>Visual representation of the weekly schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 bg-gray-50 text-left font-semibold">Time</th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className="border border-gray-300 p-2 bg-gray-50 text-center font-semibold min-w-[200px]"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot}>
                      <td className="border border-gray-300 p-2 bg-gray-50 font-medium">{slot}</td>
                      {days.map((day, dayIndex) => {
                        const entry = mockTimetableEntries.find(
                          (e) => e.day_of_week === dayIndex + 1 && `${e.start_time}-${e.end_time}` === slot,
                        )
                        return (
                          <td key={`${day}-${slot}`} className="border border-gray-300 p-2 h-20 align-top">
                            {entry && (
                              <div className="bg-blue-100 border border-blue-300 rounded p-2 text-xs">
                                <div className="font-semibold text-blue-800">{entry.program.code}</div>
                                <div className="text-blue-600">{entry.faculty.name}</div>
                                <div className="text-blue-500">{entry.classroom.name}</div>
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timetable List View */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Timetable Entries</CardTitle>
            <CardDescription>Detailed list of all scheduled classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTimetableEntries.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{entry.program.code}</Badge>
                        <span className="font-semibold">{entry.program.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Faculty:</span> {entry.faculty.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Room:</span> {entry.classroom.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Time:</span> {getDayName(entry.day_of_week)} {entry.start_time}-
                        {entry.end_time}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={entry.status === "active" ? "default" : "secondary"}>{entry.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
