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
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { samplePrograms } from "@/lib/sample-data"
import type { Program } from "@/lib/types"

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>(samplePrograms)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    semester: "",
    credits: "",
  })

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const programData = {
      ...formData,
      semester: Number.parseInt(formData.semester),
      credits: Number.parseInt(formData.credits),
    }

    if (editingProgram) {
      // Update existing program
      setPrograms((prev) => prev.map((p) => (p.id === editingProgram.id ? { ...p, ...programData } : p)))
      setEditingProgram(null)
    } else {
      // Add new program
      const newProgram: Program = {
        id: Math.max(...programs.map((p) => p.id)) + 1,
        ...programData,
        created_at: new Date().toISOString(),
      }
      setPrograms((prev) => [...prev, newProgram])
      setIsAddDialogOpen(false)
    }

    // Reset form
    setFormData({
      name: "",
      code: "",
      department: "",
      semester: "",
      credits: "",
    })
  }

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
    setFormData({
      name: program.name,
      code: program.code,
      department: program.department,
      semester: program.semester.toString(),
      credits: program.credits.toString(),
    })
  }

  const handleDelete = (id: number) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programs Management</h1>
          <p className="mt-2 text-gray-600">Manage academic programs and courses</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Program</DialogTitle>
              <DialogDescription>Create a new academic program or course</DialogDescription>
            </DialogHeader>
            <ProgramForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isEditing={false} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{programs.length}</div>
            <p className="text-xs text-gray-500">Total Programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{new Set(programs.map((p) => p.department)).size}</div>
            <p className="text-xs text-gray-500">Departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Programs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Programs List</CardTitle>
          <CardDescription>All academic programs and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>
                    <Badge variant="outline">{program.code}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>{program.department}</TableCell>
                  <TableCell>{program.semester}</TableCell>
                  <TableCell>{program.credits}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(program)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Program</DialogTitle>
                            <DialogDescription>Update program information</DialogDescription>
                          </DialogHeader>
                          <ProgramForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            isEditing={true}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(program.id)}
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
    </div>
  )
}

function ProgramForm({
  formData,
  setFormData,
  onSubmit,
  isEditing,
}: {
  formData: any
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  isEditing: boolean
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Program Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Computer Science Fundamentals"
          required
        />
      </div>
      <div>
        <Label htmlFor="code">Program Code</Label>
        <Input
          id="code"
          value={formData.code}
          onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
          placeholder="e.g., CS101"
          required
        />
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
          placeholder="e.g., Computer Science"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            type="number"
            value={formData.semester}
            onChange={(e) => setFormData((prev) => ({ ...prev, semester: e.target.value }))}
            placeholder="1-8"
            min="1"
            max="8"
            required
          />
        </div>
        <div>
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData((prev) => ({ ...prev, credits: e.target.value }))}
            placeholder="1-6"
            min="1"
            max="6"
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        {isEditing ? "Update Program" : "Add Program"}
      </Button>
    </form>
  )
}
