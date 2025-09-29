



























































































































































'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, Building, FileSpreadsheet, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { getStats } from "@/data/sampleData"
import LoadingModal from "@/components/loading-modal"

export default function HomePage() {
  const stats = getStats()
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Timetable Management System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive timetable management with course scheduling, faculty allocation, and room booking.
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{stats.totalCourses}</p>
              <p className="text-sm text-gray-600">Active courses</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-green-600" />
                Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.totalTeachers}</p>
              <p className="text-sm text-gray-600">Faculty members</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5 text-purple-600" />
                Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">{stats.totalRooms}</p>
              <p className="text-sm text-gray-600">Available rooms</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileSpreadsheet className="h-5 w-5 text-orange-600" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">{stats.totalStudents}</p>
              <p className="text-sm text-gray-600">Enrolled students</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action */}
        <div className="text-center mb-12">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
            <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Generate</h2>
            <p className="text-gray-600 mb-6">
              Generate optimized timetables using your current data configuration.
            </p>
            <Button 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsGenerating(true)}
            >
              Generate Timetable
            </Button>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle>Manage Teachers</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Add, edit, and manage faculty information</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/teachers">Manage Teachers</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle>Manage Courses</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Configure courses and subject details</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/courses">Manage Courses</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle>Manage Rooms</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Set up classrooms and lab spaces</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/rooms">Manage Rooms</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <FileSpreadsheet className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle>Student Data</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Upload student enrollment data</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/students">Upload Students</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <LoadingModal 
        isOpen={isGenerating}
        onComplete={() => {
          setIsGenerating(false)
          router.push('/timetable')
        }}
      />
    </div>
  )
}
