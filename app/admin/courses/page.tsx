"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Upload } from "lucide-react"
import { samplePrograms } from "@/lib/sample-data"
import { GenericExcelImport } from "@/components/generic-excel-import"
import { coursesImportConfig } from "@/lib/excel-import-configs"
import type { Program } from "@/lib/types"

interface CourseFormData {
  name: string
  code: string
  credits: string
  department: string
  semester: string
  enrollmentCapacity: string
}

interface CourseFormProps {
  formData: CourseFormData
  setFormData: (data: CourseFormData) => void
  onSubmit: (e: React.FormEvent) => void
  isEditing: boolean
}

function CourseForm({ formData, setFormData, onSubmit, isEditing }: CourseFormProps) {
  const handleChange = (field: keyof CourseFormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Course Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter course name"
            required
          />
        </div>
        <div>
          <Label htmlFor="code">Course Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            placeholder="Enter course code"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            value={formData.credits}
            onChange={(e) => handleChange("credits", e.target.value)}
            placeholder="Enter credits"
            min="1"
            max="6"
            required
          />
        </div>
        <div>
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            type="number"
            value={formData.semester}
            onChange={(e) => handleChange("semester", e.target.value)}
            placeholder="Enter semester"
            min="1"
            max="8"
            required
          />
        </div>
        <div>
          <Label htmlFor="enrollmentCapacity">Enrollment Capacity</Label>
          <Input
            id="enrollmentCapacity"
            type="number"
            value={formData.enrollmentCapacity}
            onChange={(e) => handleChange("enrollmentCapacity", e.target.value)}
            placeholder="Max students"
            min="1"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => handleChange("department", e.target.value)}
          placeholder="Enter department"
          required
        />
      </div>
      <Button type="submit" className={`w-full ${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}>
        {isEditing ? "Update Course" : "Add Course"}
      </Button>
    </form>
  )
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Program[]>(samplePrograms)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Program | null>(null)

  const [formData, setFormData] = useState<CourseFormData>({
    name: "",
    code: "",
    credits: "3",
    department: "",
    semester: "1",
    enrollmentCapacity: "50",
  })

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const courseData: Program = {
      id: editingCourse ? editingCourse.id : Date.now(),
      name: formData.name,
      code: formData.code,
      credits: parseInt(formData.credits),
      department: formData.department,
      semester: parseInt(formData.semester),
      max_students: parseInt(formData.enrollmentCapacity),
      needs_lab: false,
      course_type: "Major",
      required_expertise_tags: [],
    }

    if (editingCourse) {
      setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? courseData : c)))
      setEditingCourse(null)
    } else {
      setCourses((prev) => [...prev, courseData])
      setIsAddDialogOpen(false)
    }

    // Reset form
    setFormData({
      name: "",
      code: "",
      credits: "3",
      department: "",
      semester: "1",
      enrollmentCapacity: "50",
    })
  }

  const handleEdit = (course: Program) => {
    setEditingCourse(course)
    setFormData({
      name: course.name,
      code: course.code,
      credits: course.credits.toString(),
      department: course.department,
      semester: course.semester.toString(),
      enrollmentCapacity: course.max_students.toString(),
    })
  }

  const handleDelete = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  const handleImportSuccess = (importedData: any[]) => {
    const newCourses: Program[] = importedData.map((data, index) => ({
      id: Date.now() + index,
      name: data.name,
      code: data.code,
      credits: parseInt(data.credits) || 3,
      department: data.department,
      semester: parseInt(data.semester) || 1,
      max_students: parseInt(data.enrollmentCapacity) || 50,
      needs_lab: false,
      course_type: "Major",
      required_expertise_tags: [],
    }))
    
    setCourses(prev => [...prev, ...newCourses])
    setIsImportDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
          <p className="mt-2 text-gray-600">Manage academic courses and curricula</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <Upload className="h-4 w-4 mr-2" />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Courses from Excel</DialogTitle>
                <DialogDescription>Upload an Excel file to import course data</DialogDescription>
              </DialogHeader>
              <GenericExcelImport
                config={coursesImportConfig}
                onDataImported={handleImportSuccess}
                onImportSuccess={handleImportSuccess}
                onCancel={() => setIsImportDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>Create a new academic course</DialogDescription>
              </DialogHeader>
              <CourseForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={false} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-gray-500">Total Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{new Set(courses.map((c) => c.department)).size}</div>
            <p className="text-xs text-gray-500">Departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Courses</CardTitle>
          <CardDescription>All available courses and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.code}</Badge>
                  </TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{course.credits}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Sem {course.semester}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.max_students}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingCourse && (
        <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>Update course information</DialogDescription>
            </DialogHeader>
            <CourseForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={true} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}