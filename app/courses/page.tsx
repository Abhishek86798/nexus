'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit2, Trash2, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { sampleCourses, sampleTeachers, Course } from "@/data/sampleData";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    department: '',
    semester: 1,
    teacherId: '',
    hoursPerWeek: 3,
    requiresLab: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCourse: Course = {
      id: editingCourse ? editingCourse.id : Date.now().toString(),
      name: formData.name,
      code: formData.code,
      credits: formData.credits,
      department: formData.department,
      semester: formData.semester,
      teacherId: formData.teacherId,
      hoursPerWeek: formData.hoursPerWeek,
      requiresLab: formData.requiresLab
    };

    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? newCourse : c));
    } else {
      setCourses([...courses, newCourse]);
    }

    resetForm();
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      code: course.code,
      credits: course.credits,
      department: course.department,
      semester: course.semester,
      teacherId: course.teacherId,
      hoursPerWeek: course.hoursPerWeek,
      requiresLab: course.requiresLab
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      credits: 3,
      department: '',
      semester: 1,
      teacherId: '',
      hoursPerWeek: 3,
      requiresLab: false
    });
    setEditingCourse(null);
    setIsFormOpen(false);
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = sampleTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unassigned';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-green-600" />
              Courses Management
            </h1>
            <p className="text-gray-600">Manage course information and curriculum details</p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Form Card */}
          {isFormOpen && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Course Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Data Structures and Algorithms"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Course Code</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        placeholder="CS201"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="credits">Credits</Label>
                      <Select 
                        value={formData.credits.toString()} 
                        onValueChange={(value) => setFormData({...formData, credits: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Credit</SelectItem>
                          <SelectItem value="2">2 Credits</SelectItem>
                          <SelectItem value="3">3 Credits</SelectItem>
                          <SelectItem value="4">4 Credits</SelectItem>
                          <SelectItem value="5">5 Credits</SelectItem>
                          <SelectItem value="6">6 Credits</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select 
                        value={formData.department} 
                        onValueChange={(value) => setFormData({...formData, department: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <Select 
                        value={formData.semester.toString()} 
                        onValueChange={(value) => setFormData({...formData, semester: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 8}, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              Semester {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="teacher">Assigned Teacher</Label>
                      <Select 
                        value={formData.teacherId} 
                        onValueChange={(value) => setFormData({...formData, teacherId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {sampleTeachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name} - {teacher.department}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hoursPerWeek">Hours Per Week</Label>
                      <Select 
                        value={formData.hoursPerWeek.toString()} 
                        onValueChange={(value) => setFormData({...formData, hoursPerWeek: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="3">3 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="5">5 hours</SelectItem>
                          <SelectItem value="6">6 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requiresLab"
                        checked={formData.requiresLab}
                        onCheckedChange={(checked) => setFormData({...formData, requiresLab: checked as boolean})}
                      />
                      <Label htmlFor="requiresLab">Requires Laboratory</Label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      {editingCourse ? 'Update Course' : 'Add Course'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Courses Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Courses ({courses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Hours/Week</TableHead>
                      <TableHead>Lab Required</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.name}</div>
                            <div className="text-sm text-gray-600">{course.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.department}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {getTeacherName(course.teacherId)}
                        </TableCell>
                        <TableCell>{course.semester}</TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell>{course.hoursPerWeek}h</TableCell>
                        <TableCell>
                          {course.requiresLab ? (
                            <Badge className="bg-orange-100 text-orange-800">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(course)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}