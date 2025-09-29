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
import { sampleTeachers } from "@/lib/sample-data"
import { GenericExcelImport } from "@/components/generic-excel-import"
import { teachersImportConfig } from "@/lib/excel-import-configs"
import type { Teacher } from "@/lib/types"

interface TeacherFormData {
  name: string
  email: string
  department: string
  subjects: string
  maxHoursPerDay: string
  preferredTimeSlots: string
}

interface TeacherFormProps {
  formData: TeacherFormData
  setFormData: (data: TeacherFormData) => void
  onSubmit: (e: React.FormEvent) => void
  isEditing: boolean
}

function TeacherForm({ formData, setFormData, onSubmit, isEditing }: TeacherFormProps) {
  const handleChange = (field: keyof TeacherFormData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter teacher name"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <Label htmlFor="maxHoursPerDay">Max Hours Per Day</Label>
          <Input
            id="maxHoursPerDay"
            type="number"
            value={formData.maxHoursPerDay}
            onChange={(e) => handleChange("maxHoursPerDay", e.target.value)}
            placeholder="Enter max hours per day"
            min="1"
            max="12"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="subjects">Subjects</Label>
        <Input
          id="subjects"
          value={formData.subjects}
          onChange={(e) => handleChange("subjects", e.target.value)}
          placeholder="Enter subjects (comma-separated)"
          required
        />
      </div>
      <div>
        <Label htmlFor="preferredTimeSlots">Preferred Time Slots</Label>
        <Input
          id="preferredTimeSlots"
          value={formData.preferredTimeSlots}
          onChange={(e) => handleChange("preferredTimeSlots", e.target.value)}
          placeholder="Enter preferred time slots (comma-separated)"
        />
      </div>
      <Button type="submit" className={`w-full ${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}>
        {isEditing ? "Update Teacher" : "Add Teacher"}
      </Button>
    </form>
  )
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(sampleTeachers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const [formData, setFormData] = useState<TeacherFormData>({
    name: "",
    email: "",
    department: "",
    subjects: "",
    maxHoursPerDay: "6",
    preferredTimeSlots: "",
  })

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const teacherData: Teacher = {
      id: editingTeacher ? editingTeacher.id : Date.now(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      subjects: formData.subjects.split(",").map(s => s.trim()),
      maxHoursPerDay: parseInt(formData.maxHoursPerDay),
      preferredTimeSlots: formData.preferredTimeSlots ? formData.preferredTimeSlots.split(",").map(s => s.trim()) : [],
    }

    if (editingTeacher) {
      setTeachers((prev) => prev.map((t) => (t.id === editingTeacher.id ? teacherData : t)))
      setEditingTeacher(null)
    } else {
      setTeachers((prev) => [...prev, teacherData])
      setIsAddDialogOpen(false)
    }

    // Reset form
    setFormData({
      name: "",
      email: "",
      department: "",
      subjects: "",
      maxHoursPerDay: "6",
      preferredTimeSlots: "",
    })
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      subjects: teacher.subjects.join(", "),
      maxHoursPerDay: teacher.maxHoursPerDay.toString(),
      preferredTimeSlots: teacher.preferredTimeSlots.join(", "),
    })
  }

  const handleDelete = (id: number) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id))
  }

  const handleImportSuccess = (importedData: any[]) => {
    const newTeachers: Teacher[] = importedData.map((data, index) => ({
      id: Date.now() + index,
      name: data.name,
      email: data.email,
      department: data.department,
      subjects: typeof data.subjects === 'string' ? data.subjects.split(',').map((s: string) => s.trim()) : data.subjects || [],
      maxHoursPerDay: parseInt(data.maxHoursPerDay) || 6,
      preferredTimeSlots: typeof data.preferredTimeSlots === 'string' ? data.preferredTimeSlots.split(',').map((s: string) => s.trim()) : data.preferredTimeSlots || [],
    }))
    
    setTeachers(prev => [...prev, ...newTeachers])
    setIsImportDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers Management</h1>
          <p className="mt-2 text-gray-600">Manage teaching faculty and their schedules</p>
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
                <DialogTitle>Import Teachers from Excel</DialogTitle>
                <DialogDescription>Upload an Excel file to import teacher data</DialogDescription>
              </DialogHeader>
              <GenericExcelImport
                config={teachersImportConfig}
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
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>Create a new teacher profile</DialogDescription>
              </DialogHeader>
              <TeacherForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={false} />
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
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-gray-500">Total Teachers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{new Set(teachers.map((t) => t.department)).size}</div>
            <p className="text-xs text-gray-500">Departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teaching Faculty</CardTitle>
          <CardDescription>All registered teachers and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Max Hours/Day</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{teacher.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.slice(0, 2).map((subject: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {teacher.subjects.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{teacher.subjects.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{teacher.maxHoursPerDay}h</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(teacher)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(teacher.id)}
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
      {editingTeacher && (
        <Dialog open={!!editingTeacher} onOpenChange={() => setEditingTeacher(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
              <DialogDescription>Update teacher information</DialogDescription>
            </DialogHeader>
            <TeacherForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={true} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}