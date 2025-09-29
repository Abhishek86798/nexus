"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Calendar, Save, Upload, Download } from "lucide-react"
import type { Program, Faculty, Student, Classroom } from "@/lib/types"

interface DataManagementProps {
  onDataUpdate?: (data: {
    programs: Program[]
    faculty: Faculty[]
    students: Student[]
    classrooms: Classroom[]
  }) => void
}

export function DataManagement({ onDataUpdate }: DataManagementProps) {
  const [activeTab, setActiveTab] = useState<"programs" | "faculty" | "students" | "classrooms">("programs")
  const [programs, setPrograms] = useState<Program[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [classrooms, setClassrooms] = useState<Classroom[]>([])

  // Program form state
  const [newProgram, setNewProgram] = useState<Partial<Program>>({
    name: "",
    code: "",
    department: "",
    semester: 1,
    credits: 3,
    needs_lab: false,
    course_type: "Major",
    max_students: 50,
    required_expertise_tags: [],
  })

  // Faculty form state
  const [newFaculty, setNewFaculty] = useState<Partial<Faculty>>({
    name: "",
    email: "",
    department: "",
    specialization: "",
    expertise_tags: [],
    max_hours_per_week: 18,
    availability_mask: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
  })

  // Student form state
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    email: "",
    student_id: "",
    program_id: 1,
    semester: 1,
    enrolled_courses: [],
  })

  // Classroom form state
  const [newClassroom, setNewClassroom] = useState<Partial<Classroom>>({
    name: "",
    type: "classroom",
    capacity: 50,
    is_lab: false,
    equipment: [],
    building: "",
    floor: 1,
  })

  const [newTag, setNewTag] = useState("")
  const [newEquipment, setNewEquipment] = useState("")

  const addProgram = () => {
    if (newProgram.name && newProgram.code) {
      const program: Program = {
        id: Date.now(),
        name: newProgram.name,
        code: newProgram.code,
        department: newProgram.department || "",
        semester: newProgram.semester || 1,
        credits: newProgram.credits || 3,
        needs_lab: newProgram.needs_lab || false,
        course_type: newProgram.course_type || "Major",
        max_students: newProgram.max_students || 50,
        required_expertise_tags: newProgram.required_expertise_tags || [],
      }
      setPrograms([...programs, program])
      setNewProgram({
        name: "",
        code: "",
        department: "",
        semester: 1,
        credits: 3,
        needs_lab: false,
        course_type: "Major",
        max_students: 50,
        required_expertise_tags: [],
      })
    }
  }

  const addFaculty = () => {
    if (newFaculty.name && newFaculty.email) {
      const facultyMember: Faculty = {
        id: Date.now(),
        name: newFaculty.name,
        email: newFaculty.email,
        department: newFaculty.department || "",
        specialization: newFaculty.specialization,
        expertise_tags: newFaculty.expertise_tags || [],
        max_hours_per_week: newFaculty.max_hours_per_week || 18,
        availability_mask: newFaculty.availability_mask || {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        },
        preferred_time_slots: [],
      }
      setFaculty([...faculty, facultyMember])
      setNewFaculty({
        name: "",
        email: "",
        department: "",
        specialization: "",
        expertise_tags: [],
        max_hours_per_week: 18,
        availability_mask: {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        },
      })
    }
  }

  const addStudent = () => {
    if (newStudent.name && newStudent.email && newStudent.student_id) {
      const student: Student = {
        id: Date.now(),
        name: newStudent.name,
        email: newStudent.email,
        student_id: newStudent.student_id,
        program_id: newStudent.program_id || 1,
        semester: newStudent.semester || 1,
        enrolled_courses: newStudent.enrolled_courses || [],
      }
      setStudents([...students, student])
      setNewStudent({
        name: "",
        email: "",
        student_id: "",
        program_id: 1,
        semester: 1,
        enrolled_courses: [],
      })
    }
  }

  const addClassroom = () => {
    if (newClassroom.name) {
      const classroom: Classroom = {
        id: Date.now(),
        name: newClassroom.name,
        type: newClassroom.type || "classroom",
        capacity: newClassroom.capacity || 50,
        is_lab: newClassroom.is_lab || false,
        equipment: newClassroom.equipment || [],
        building: newClassroom.building,
        floor: newClassroom.floor,
      }
      setClassrooms([...classrooms, classroom])
      setNewClassroom({
        name: "",
        type: "classroom",
        capacity: 50,
        is_lab: false,
        equipment: [],
        building: "",
        floor: 1,
      })
    }
  }

  const addTag = (type: "program" | "faculty") => {
    if (newTag.trim()) {
      if (type === "program") {
        setNewProgram({
          ...newProgram,
          required_expertise_tags: [...(newProgram.required_expertise_tags || []), newTag.trim()],
        })
      } else if (type === "faculty") {
        setNewFaculty({
          ...newFaculty,
          expertise_tags: [...(newFaculty.expertise_tags || []), newTag.trim()],
        })
      }
      setNewTag("")
    }
  }

  const removeTag = (tag: string, type: "program" | "faculty") => {
    if (type === "program") {
      setNewProgram({
        ...newProgram,
        required_expertise_tags: (newProgram.required_expertise_tags || []).filter((t) => t !== tag),
      })
    } else if (type === "faculty") {
      setNewFaculty({
        ...newFaculty,
        expertise_tags: (newFaculty.expertise_tags || []).filter((t) => t !== tag),
      })
    }
  }

  const addEquipment = () => {
    if (newEquipment.trim()) {
      setNewClassroom({
        ...newClassroom,
        equipment: [...(newClassroom.equipment || []), newEquipment.trim()],
      })
      setNewEquipment("")
    }
  }

  const removeEquipment = (equipment: string) => {
    setNewClassroom({
      ...newClassroom,
      equipment: (newClassroom.equipment || []).filter((e) => e !== equipment),
    })
  }

  const toggleAvailability = (day: string, slot: number) => {
    const currentMask = newFaculty.availability_mask || {}
    const daySlots = currentMask[day] || []
    const updatedSlots = daySlots.includes(slot)
      ? daySlots.filter((s) => s !== slot)
      : [...daySlots, slot].sort((a, b) => a - b)

    setNewFaculty({
      ...newFaculty,
      availability_mask: {
        ...currentMask,
        [day]: updatedSlots,
      },
    })
  }

  const exportData = () => {
    const data = { programs, faculty, students, classrooms }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "timetable-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.programs) setPrograms(data.programs)
          if (data.faculty) setFaculty(data.faculty)
          if (data.students) setStudents(data.students)
          if (data.classrooms) setClassrooms(data.classrooms)
        } catch (error) {
          console.error("Error importing data:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  const saveData = () => {
    const data = { programs, faculty, students, classrooms }
    onDataUpdate?.(data)
  }

  const timeSlots = [
    { id: 1, name: "9:00-10:00 AM" },
    { id: 2, name: "10:00-11:00 AM" },
    { id: 3, name: "11:15-12:15 PM" },
    { id: 4, name: "12:15-1:15 PM" },
    { id: 5, name: "2:00-3:00 PM" },
    { id: 6, name: "3:00-4:00 PM" },
    { id: 7, name: "4:15-5:15 PM" },
  ]

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Data Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("file-import")?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <input
            id="file-import"
            type="file"
            accept=".json"
            onChange={importData}
            className="hidden"
          />
          <Button onClick={saveData}>
            <Save className="h-4 w-4 mr-2" />
            Save Data
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { key: "programs", label: "Programs", count: programs.length },
          { key: "faculty", label: "Faculty", count: faculty.length },
          { key: "students", label: "Students", count: students.length },
          { key: "classrooms", label: "Classrooms", count: classrooms.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 p-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Programs Tab */}
      {activeTab === "programs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Program</CardTitle>
              <CardDescription>Create a new course program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program-name">Program Name</Label>
                  <Input
                    id="program-name"
                    value={newProgram.name}
                    onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                    placeholder="e.g., Computer Science Fundamentals"
                  />
                </div>
                <div>
                  <Label htmlFor="program-code">Course Code</Label>
                  <Input
                    id="program-code"
                    value={newProgram.code}
                    onChange={(e) => setNewProgram({ ...newProgram, code: e.target.value })}
                    placeholder="e.g., CS101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program-department">Department</Label>
                  <Input
                    id="program-department"
                    value={newProgram.department}
                    onChange={(e) => setNewProgram({ ...newProgram, department: e.target.value })}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div>
                  <Label htmlFor="program-semester">Semester</Label>
                  <Input
                    id="program-semester"
                    type="number"
                    min="1"
                    max="8"
                    value={newProgram.semester}
                    onChange={(e) => setNewProgram({ ...newProgram, semester: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="program-credits">Credits</Label>
                  <Input
                    id="program-credits"
                    type="number"
                    min="1"
                    max="6"
                    value={newProgram.credits}
                    onChange={(e) => setNewProgram({ ...newProgram, credits: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="program-max-students">Max Students</Label>
                  <Input
                    id="program-max-students"
                    type="number"
                    min="1"
                    value={newProgram.max_students}
                    onChange={(e) => setNewProgram({ ...newProgram, max_students: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="program-type">Course Type</Label>
                  <Select
                    value={newProgram.course_type}
                    onValueChange={(value) => setNewProgram({ ...newProgram, course_type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Major">Major</SelectItem>
                      <SelectItem value="Minor">Minor</SelectItem>
                      <SelectItem value="Skill-Based">Skill-Based</SelectItem>
                      <SelectItem value="Elective">Elective</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="needs-lab"
                  checked={newProgram.needs_lab}
                  onCheckedChange={(checked) => setNewProgram({ ...newProgram, needs_lab: checked })}
                />
                <Label htmlFor="needs-lab">Requires Lab</Label>
              </div>

              <div>
                <Label>Required Expertise Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newProgram.required_expertise_tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag, "program")} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add expertise tag"
                    onKeyPress={(e) => e.key === "Enter" && addTag("program")}
                  />
                  <Button size="sm" onClick={() => addTag("program")}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={addProgram} className="w-full">
                Add Program
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Programs List ({programs.length})</CardTitle>
              <CardDescription>Manage existing programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {programs.map((program) => (
                  <div key={program.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{program.name}</h4>
                      <Badge variant={program.needs_lab ? "default" : "secondary"}>
                        {program.course_type}
                        {program.needs_lab && " + Lab"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {program.code} • {program.department} • Semester {program.semester} • {program.credits} Credits
                    </p>
                    <p className="text-sm text-muted-foreground">Max Students: {program.max_students}</p>
                    {program.required_expertise_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {program.required_expertise_tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {programs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No programs added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Faculty Tab */}
      {activeTab === "faculty" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Faculty</CardTitle>
              <CardDescription>Add faculty member with availability schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="faculty-name">Name</Label>
                  <Input
                    id="faculty-name"
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                    placeholder="e.g., Dr. John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="faculty-email">Email</Label>
                  <Input
                    id="faculty-email"
                    type="email"
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    placeholder="john.smith@university.edu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="faculty-department">Department</Label>
                  <Input
                    id="faculty-department"
                    value={newFaculty.department}
                    onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div>
                  <Label htmlFor="faculty-specialization">Specialization</Label>
                  <Input
                    id="faculty-specialization"
                    value={newFaculty.specialization}
                    onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
                    placeholder="e.g., Machine Learning"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="faculty-hours">Max Hours per Week</Label>
                <Input
                  id="faculty-hours"
                  type="number"
                  min="1"
                  max="40"
                  value={newFaculty.max_hours_per_week}
                  onChange={(e) => setNewFaculty({ ...newFaculty, max_hours_per_week: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <Label>Expertise Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newFaculty.expertise_tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag, "faculty")} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add expertise tag"
                    onKeyPress={(e) => e.key === "Enter" && addTag("faculty")}
                  />
                  <Button size="sm" onClick={() => addTag("faculty")}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Weekly Availability
                </Label>
                <div className="mt-3 space-y-3">
                  {days.map((day) => (
                    <div key={day} className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">{day}</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <label key={slot.id} className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                              checked={(newFaculty.availability_mask?.[day] || []).includes(slot.id)}
                              onCheckedChange={() => toggleAvailability(day, slot.id)}
                            />
                            <span className="text-xs">{slot.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={addFaculty} className="w-full">
                Add Faculty
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Faculty List ({faculty.length})</CardTitle>
              <CardDescription>Manage existing faculty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {faculty.map((facultyMember) => (
                  <div key={facultyMember.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{facultyMember.name}</h4>
                      <Badge>{facultyMember.max_hours_per_week}h/week</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {facultyMember.email} • {facultyMember.department}
                    </p>
                    {facultyMember.specialization && (
                      <p className="text-sm text-muted-foreground">Specialization: {facultyMember.specialization}</p>
                    )}
                    {facultyMember.expertise_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {facultyMember.expertise_tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {faculty.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No faculty added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
              <CardDescription>Add student with course enrollments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student-name">Name</Label>
                  <Input
                    id="student-name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input
                    id="student-id"
                    value={newStudent.student_id}
                    onChange={(e) => setNewStudent({ ...newStudent, student_id: e.target.value })}
                    placeholder="e.g., CS2021001"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="student-email">Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="john.doe@student.university.edu"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student-program">Program ID</Label>
                  <Input
                    id="student-program"
                    type="number"
                    value={newStudent.program_id}
                    onChange={(e) => setNewStudent({ ...newStudent, program_id: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="student-semester">Semester</Label>
                  <Input
                    id="student-semester"
                    type="number"
                    min="1"
                    max="8"
                    value={newStudent.semester}
                    onChange={(e) => setNewStudent({ ...newStudent, semester: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="enrolled-courses">Enrolled Course IDs (comma-separated)</Label>
                <Input
                  id="enrolled-courses"
                  value={(newStudent.enrolled_courses || []).join(", ")}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      enrolled_courses: e.target.value
                        .split(",")
                        .map((id) => parseInt(id.trim()))
                        .filter((id) => !isNaN(id)),
                    })
                  }
                  placeholder="e.g., 1, 2, 3"
                />
              </div>

              <Button onClick={addStudent} className="w-full">
                Add Student
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Students List ({students.length})</CardTitle>
              <CardDescription>Manage existing students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {students.map((student) => (
                  <div key={student.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{student.name}</h4>
                      <Badge>Semester {student.semester}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {student.student_id} • {student.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Enrolled in: {student.enrolled_courses.join(", ") || "No courses"}
                    </p>
                  </div>
                ))}
                {students.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No students added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Classrooms Tab */}
      {activeTab === "classrooms" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Classroom</CardTitle>
              <CardDescription>Add classroom with equipment and specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="classroom-name">Room Name</Label>
                  <Input
                    id="classroom-name"
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                    placeholder="e.g., Room A101"
                  />
                </div>
                <div>
                  <Label htmlFor="classroom-type">Room Type</Label>
                  <Select
                    value={newClassroom.type}
                    onValueChange={(value) => setNewClassroom({ ...newClassroom, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classroom">Classroom</SelectItem>
                      <SelectItem value="lab">Lab</SelectItem>
                      <SelectItem value="auditorium">Auditorium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="classroom-capacity">Capacity</Label>
                  <Input
                    id="classroom-capacity"
                    type="number"
                    min="1"
                    value={newClassroom.capacity}
                    onChange={(e) => setNewClassroom({ ...newClassroom, capacity: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="classroom-building">Building</Label>
                  <Input
                    id="classroom-building"
                    value={newClassroom.building}
                    onChange={(e) => setNewClassroom({ ...newClassroom, building: e.target.value })}
                    placeholder="e.g., Block A"
                  />
                </div>
                <div>
                  <Label htmlFor="classroom-floor">Floor</Label>
                  <Input
                    id="classroom-floor"
                    type="number"
                    value={newClassroom.floor}
                    onChange={(e) => setNewClassroom({ ...newClassroom, floor: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is-lab"
                  checked={newClassroom.is_lab}
                  onCheckedChange={(checked) => setNewClassroom({ ...newClassroom, is_lab: checked })}
                />
                <Label htmlFor="is-lab">Is Laboratory</Label>
              </div>

              <div>
                <Label>Equipment</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(newClassroom.equipment || []).map((equipment) => (
                    <Badge key={equipment} variant="secondary" className="flex items-center gap-1">
                      {equipment}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeEquipment(equipment)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="Add equipment"
                    onKeyPress={(e) => e.key === "Enter" && addEquipment()}
                  />
                  <Button size="sm" onClick={addEquipment}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button onClick={addClassroom} className="w-full">
                Add Classroom
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classrooms List ({classrooms.length})</CardTitle>
              <CardDescription>Manage existing classrooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {classrooms.map((classroom) => (
                  <div key={classroom.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{classroom.name}</h4>
                      <div className="flex gap-2">
                        <Badge variant={classroom.is_lab ? "default" : "secondary"}>
                          {classroom.type}
                          {classroom.is_lab && " (Lab)"}
                        </Badge>
                        <Badge variant="outline">Cap: {classroom.capacity}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {classroom.building && `${classroom.building}, `}Floor {classroom.floor}
                    </p>
                    {classroom.equipment && classroom.equipment.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {classroom.equipment.map((equipment) => (
                          <Badge key={equipment} variant="outline" className="text-xs">
                            {equipment}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {classrooms.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No classrooms added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}