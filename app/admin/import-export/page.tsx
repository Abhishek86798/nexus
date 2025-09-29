"use client"

import React, { useState } from 'react'
import { ExcelImport } from '@/components/excel-import'
import { DataManagement } from "@/components/data-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, BookOpen, GraduationCap, Download, FileSpreadsheet, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { downloadSampleExcelFile, downloadSampleCSVFile } from '@/lib/excel-template'

interface StudentEnrollment {
  studentId: string
  studentName: string
  email: string
  courseCode: string
  courseName: string
  semester: string
  program: string
  year: number
}

export default function ImportExportPage() {
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDataImported = async (data: StudentEnrollment[]) => {
    setIsProcessing(true)
    
    try {
      // Simulate API call to save enrollments
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setEnrollments(data)
      toast.success(`Successfully imported ${data.length} student enrollments`)
      
      // In a real app, you would send this data to your backend API
      console.log('Imported enrollments:', data)
      
    } catch (error) {
      toast.error('Failed to save enrollment data')
      console.error('Import error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadSampleCSV = () => {
    if (downloadSampleCSVFile()) {
      toast.success('Sample CSV file downloaded')
    } else {
      toast.error('Failed to download CSV file')
    }
  }

  const downloadSampleExcel = () => {
    if (downloadSampleExcelFile()) {
      toast.success('Sample Excel file downloaded')
    } else {
      toast.error('Failed to download Excel file')
    }
  }

  const getStats = () => {
    const uniqueStudents = new Set(enrollments.map(e => e.studentId)).size
    const uniqueCourses = new Set(enrollments.map(e => e.courseCode)).size
    const uniquePrograms = new Set(enrollments.map(e => e.program)).size
    
    return { uniqueStudents, uniqueCourses, uniquePrograms }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import & Export</h1>
          <p className="text-gray-600 mt-2">
            Manage student enrollment data with Excel/CSV file imports and exports
          </p>
        </div>

        {/* Excel Import Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExcelImport onDataImported={handleDataImported} />
          </div>
          
          <div className="space-y-4">
            {/* Sample File Download */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Sample File
                </CardTitle>
                <CardDescription>
                  Download a sample Excel file with the correct format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={downloadSampleExcel}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample Excel
                </Button>
                <Button 
                  variant="outline" 
                  onClick={downloadSampleCSV}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample CSV
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {enrollments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Import Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Students</span>
                    </div>
                    <Badge variant="secondary">{stats.uniqueStudents}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Courses</span>
                    </div>
                    <Badge variant="secondary">{stats.uniqueCourses}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Programs</span>
                    </div>
                    <Badge variant="secondary">{stats.uniquePrograms}</Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Enrollments</span>
                      <Badge>{enrollments.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Processing Alert */}
        {isProcessing && (
          <Alert>
            <FileSpreadsheet className="h-4 w-4" />
            <AlertDescription>
              Processing enrollment data... This may take a few moments.
            </AlertDescription>
          </Alert>
        )}

        {/* Imported Data Table */}
        {enrollments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Imported Enrollments</CardTitle>
              <CardDescription>
                Successfully imported {enrollments.length} student enrollment records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Year</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">
                          {enrollment.studentId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {enrollment.studentName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {enrollment.email}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{enrollment.courseCode}</div>
                            <div className="text-xs text-gray-500 truncate max-w-32">
                              {enrollment.courseName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {enrollment.program}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {enrollment.semester}
                        </TableCell>
                        <TableCell className="text-sm">
                          {enrollment.year}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Original Data Management Section */}
        <div className="mt-8">
          <DataManagement />
        </div>
      </div>
    </div>
  )
}
