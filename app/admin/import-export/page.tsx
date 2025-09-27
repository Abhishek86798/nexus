"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, FileText, Users, BookOpen, Building, CheckCircle, AlertCircle } from "lucide-react"

export default function ImportExportPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")

  const handleFileUpload = async (file: File, type: string) => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus("idle")

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadStatus("success")
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleExport = (type: string, format: string) => {
    console.log(`Exporting ${type} as ${format}`)
    // This would trigger the actual export functionality
  }

  const exportOptions = [
    { type: "programs", label: "Programs", icon: BookOpen, count: 5 },
    { type: "faculty", label: "Faculty", icon: Users, count: 20 },
    { type: "students", label: "Students", icon: Users, count: 200 },
    { type: "classrooms", label: "Classrooms", icon: Building, count: 10 },
    { type: "timetables", label: "Timetables", icon: FileText, count: 1 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import & Export</h1>
        <p className="mt-2 text-gray-600">Import data from external sources or export current data</p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Files
                </CardTitle>
                <CardDescription>Import data from CSV or Excel files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="data-type">Data Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="programs">Programs</SelectItem>
                      <SelectItem value="classrooms">Classrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file-upload">Choose File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(file, "students")
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadStatus === "success" && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>File uploaded successfully! Data has been imported.</AlertDescription>
                  </Alert>
                )}

                {uploadStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Upload failed. Please check your file format and try again.</AlertDescription>
                  </Alert>
                )}

                <Button className="w-full" disabled={isUploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </CardContent>
            </Card>

            {/* Import Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Download Templates</CardTitle>
                <CardDescription>Get CSV templates for data import</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {exportOptions.slice(0, 4).map((option) => (
                  <div key={option.type} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <option.icon className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">{option.label} Template</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Import Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Import Guidelines</CardTitle>
              <CardDescription>Important information for successful data import</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">File Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use CSV or Excel format (.csv, .xlsx, .xls)</li>
                    <li>• First row should contain column headers</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• Ensure data is properly formatted</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Validation</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Email addresses must be unique</li>
                    <li>• Program codes must be unique</li>
                    <li>• Required fields cannot be empty</li>
                    <li>• Dates should be in YYYY-MM-DD format</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exportOptions.map((option) => (
              <Card key={option.type}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <option.icon className="h-5 w-5" />
                      {option.label}
                    </div>
                    <span className="text-sm font-normal text-gray-500">{option.count} records</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => handleExport(option.type, "csv")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => handleExport(option.type, "excel")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export as Excel
                  </Button>
                  {option.type === "timetables" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => handleExport(option.type, "pdf")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Customize your data export</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Semester</SelectItem>
                      <SelectItem value="last">Last Semester</SelectItem>
                      <SelectItem value="year">Academic Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format">Default Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="include">Include</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="all">All Records</SelectItem>
                      <SelectItem value="archived">Archived Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
