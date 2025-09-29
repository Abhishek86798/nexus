"use client"

import React, { useState, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Upload, FileSpreadsheet, Check, X, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

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

interface ExcelImportProps {
  onDataImported?: (data: StudentEnrollment[]) => void
  className?: string
}

export function ExcelImport({ onDataImported, className }: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<StudentEnrollment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [previewMode, setPreviewMode] = useState(false)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setData([])
      setPreviewMode(false)
    }
  }, [])

  const parseExcelFile = useCallback(async (file: File): Promise<StudentEnrollment[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // Get the first worksheet
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]
          
          if (jsonData.length < 2) {
            throw new Error('Excel file must contain at least a header row and one data row')
          }
          
          // Parse headers (first row)
          const headers = jsonData[0].map(h => h?.toString().toLowerCase().trim())
          
          // Validate required columns
          const requiredColumns = ['studentid', 'studentname', 'email', 'coursecode', 'coursename', 'semester', 'program', 'year']
          const missingColumns = requiredColumns.filter(col => 
            !headers.some(header => header.includes(col) || col.includes(header))
          )
          
          if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}. Expected columns: Student ID, Student Name, Email, Course Code, Course Name, Semester, Program, Year`)
          }
          
          // Map column indices
          const getColumnIndex = (searchTerms: string[]) => {
            return headers.findIndex(header => 
              searchTerms.some(term => header.includes(term) || term.includes(header))
            )
          }
          
          const indices = {
            studentId: getColumnIndex(['studentid', 'student_id', 'id']),
            studentName: getColumnIndex(['studentname', 'student_name', 'name']),
            email: getColumnIndex(['email', 'mail']),
            courseCode: getColumnIndex(['coursecode', 'course_code', 'code']),
            courseName: getColumnIndex(['coursename', 'course_name', 'course']),
            semester: getColumnIndex(['semester', 'sem']),
            program: getColumnIndex(['program', 'programme', 'degree']),
            year: getColumnIndex(['year', 'academic_year'])
          }
          
          // Parse data rows
          const enrollments: StudentEnrollment[] = []
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i]
            
            // Skip empty rows
            if (!row || row.every(cell => !cell)) continue
            
            try {
              const enrollment: StudentEnrollment = {
                studentId: row[indices.studentId]?.toString().trim() || '',
                studentName: row[indices.studentName]?.toString().trim() || '',
                email: row[indices.email]?.toString().trim() || '',
                courseCode: row[indices.courseCode]?.toString().trim() || '',
                courseName: row[indices.courseName]?.toString().trim() || '',
                semester: row[indices.semester]?.toString().trim() || '',
                program: row[indices.program]?.toString().trim() || '',
                year: parseInt(row[indices.year]?.toString()) || new Date().getFullYear()
              }
              
              // Validate required fields
              if (!enrollment.studentId || !enrollment.studentName || !enrollment.email || !enrollment.courseCode) {
                console.warn(`Skipping row ${i + 1}: Missing required data`)
                continue
              }
              
              enrollments.push(enrollment)
            } catch (rowError) {
              console.warn(`Error parsing row ${i + 1}:`, rowError)
            }
          }
          
          if (enrollments.length === 0) {
            throw new Error('No valid enrollment data found in the Excel file')
          }
          
          resolve(enrollments)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }, [])

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const enrollments = await parseExcelFile(file)
      setData(enrollments)
      setPreviewMode(true)
      toast.success(`Successfully parsed ${enrollments.length} student enrollments`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse Excel file'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [file, parseExcelFile])

  const handleConfirmImport = useCallback(() => {
    if (data.length > 0) {
      onDataImported?.(data)
      toast.success(`Imported ${data.length} student enrollments successfully`)
      
      // Reset state
      setFile(null)
      setData([])
      setPreviewMode(false)
      setError('')
      
      // Reset file input
      const fileInput = document.getElementById('excel-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    }
  }, [data, onDataImported])

  const handleCancel = useCallback(() => {
    setPreviewMode(false)
    setData([])
    setError('')
  }, [])

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Student Enrollments
          </CardTitle>
          <CardDescription>
            Upload an Excel file (.xlsx, .xls) containing student enrollment data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!previewMode ? (
            <>
              <div>
                <Label htmlFor="excel-file">Select Excel File</Label>
                <Input
                  id="excel-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
              </div>
              
              {file && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">{file.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Expected Excel Format:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Required columns:</strong> Student ID, Student Name, Email, Course Code, Course Name, Semester, Program, Year</p>
                  <p><strong>Example:</strong> STU001, John Doe, john@email.com, CS101, Computer Science, Fall 2024, Computer Science, 2024</p>
                </div>
              </div>
              
              <Button 
                onClick={handleUpload} 
                disabled={!file || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-pulse" />
                    Parsing Excel File...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload and Parse
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Preview Imported Data</h3>
                  <p className="text-sm text-gray-600">
                    Found {data.length} student enrollment{data.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmImport}>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Import
                  </Button>
                </div>
              </div>
              
              <div className="max-h-96 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Semester</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.slice(0, 10).map((enrollment, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">{enrollment.studentId}</TableCell>
                        <TableCell>{enrollment.studentName}</TableCell>
                        <TableCell className="text-sm">{enrollment.email}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{enrollment.courseCode}</div>
                            <div className="text-xs text-gray-500">{enrollment.courseName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{enrollment.program}</TableCell>
                        <TableCell>{enrollment.semester}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {data.length > 10 && (
                  <div className="p-2 text-center text-sm text-gray-500 border-t">
                    Showing first 10 of {data.length} enrollments
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}