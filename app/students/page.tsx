'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileSpreadsheet, Upload, Download, ArrowLeft, CheckCircle, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { sampleStudents, Student } from "@/data/sampleData";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setUploadStatus('idle');
        setUploadMessage('');
      } else {
        setUploadStatus('error');
        setUploadMessage('Please select a CSV file');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file first');
      return;
    }

    setUploadStatus('uploading');
    toast.loading('Processing CSV file...', { id: 'upload' });
    
    // Simulate file upload and processing
    setTimeout(() => {
      try {
        // In a real app, you'd parse the CSV file here
        // For demo purposes, we'll just add a few mock students
        const newStudents: Student[] = [
          {
            id: Date.now().toString(),
            name: 'Uploaded Student 1',
            email: 'student1@demo.edu',
            rollNumber: 'DEMO001',
            semester: 3,
            department: 'Computer Science',
            enrolledCourses: ['1', '3']
          },
          {
            id: (Date.now() + 1).toString(),
            name: 'Uploaded Student 2',
            email: 'student2@demo.edu',
            rollNumber: 'DEMO002',
            semester: 5,
            department: 'Mathematics',
            enrolledCourses: ['3', '7']
          }
        ];

        setStudents([...students, ...newStudents]);
        setUploadStatus('success');
        setUploadMessage(`Successfully uploaded ${newStudents.length} students from ${selectedFile.name}`);
        setSelectedFile(null);
        
        // Show success toast
        toast.success(`Successfully imported ${newStudents.length} students!`, { 
          id: 'upload',
          description: `Added students from ${selectedFile.name}`
        });
        
        // Reset file input
        const fileInput = document.getElementById('csvFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } catch (error) {
        setUploadStatus('error');
        setUploadMessage('Error processing the CSV file. Please check the format.');
        toast.error('Failed to process CSV file', { 
          id: 'upload',
          description: 'Please check the file format and try again'
        });
      }
    }, 2000);
  };

  const downloadTemplate = () => {
    const csvContent = `name,email,rollNumber,semester,department,enrolledCourses
John Doe,john.doe@student.edu,CS2021001,3,Computer Science,"1,3"
Priya Sharma,priya.sharma@student.edu,CS2021002,5,Computer Science,"2,6"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Template downloaded successfully!', {
      description: 'Use this template to format your student data'
    });
  };

  const exportToPdf = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Generating PDF report...',
        success: () => {
          // In a real app, you'd generate and download a PDF
          return 'PDF report downloaded successfully!';
        },
        error: 'Failed to generate PDF report'
      }
    );
  };

  const exportToExcel = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Generating Excel file...',
        success: () => {
          // In a real app, you'd generate and download an Excel file
          const csvContent = students.map(student => 
            `${student.name},${student.email},${student.rollNumber},${student.semester},${student.department},"${student.enrolledCourses.join(';')}"`
          ).join('\n');
          
          const blob = new Blob([`name,email,rollNumber,semester,department,enrolledCourses\n${csvContent}`], 
            { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'students_export.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          return 'Excel export completed successfully!';
        },
        error: 'Failed to export to Excel'
      }
    );
  };

  const getCourseNames = (courseIds: string[]) => {
    // In a real app, you'd lookup course names by IDs
    return courseIds.map(id => `Course ${id}`).join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileSpreadsheet className="h-8 w-8 text-orange-600" />
              Students Management
            </h1>
            <p className="text-gray-600">Upload and manage student enrollment data</p>
          </div>
          <Button 
            onClick={downloadTemplate}
            variant="outline"
            className="bg-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        <div className="grid gap-8">
          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                CSV File Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Upload Instructions</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use the provided CSV template for proper formatting</li>
                  <li>• Include columns: name, email, rollNumber, semester, department, enrolledCourses</li>
                  <li>• Enrolled courses should be comma-separated course IDs</li>
                  <li>• Maximum file size: 10MB</li>
                </ul>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csvFile">Select CSV File</Label>
                  <div className="mt-2">
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}

                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadStatus === 'uploading'}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {uploadStatus === 'uploading' ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Students
                    </>
                  )}
                </Button>
              </div>

              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {uploadMessage}
                  </AlertDescription>
                </Alert>
              )}

              {uploadStatus === 'error' && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {uploadMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Enrolled Students ({students.length})</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={exportToPdf}
                    variant="outline"
                    size="sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button 
                    onClick={exportToExcel}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Enrolled Courses</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.rollNumber}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.department}</Badge>
                        </TableCell>
                        <TableCell>Semester {student.semester}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {student.enrolledCourses.slice(0, 2).map((courseId, index) => (
                              <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                                Course {courseId}
                              </Badge>
                            ))}
                            {student.enrolledCourses.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{student.enrolledCourses.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">{student.email}</TableCell>
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