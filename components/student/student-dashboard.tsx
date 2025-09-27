"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Clock, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function StudentDashboard() {
  const { user, logout } = useAuth()

  const todayClasses = [
    {
      time: "09:00 AM",
      subject: "CS101 - Computer Science Fundamentals",
      faculty: "Dr. Rajesh Sharma",
      room: "Room A101",
    },
    { time: "11:15 AM", subject: "CS201 - Data Structures", faculty: "Prof. Priya Patel", room: "Lab B201" },
    { time: "02:00 PM", subject: "CS301 - Database Systems", faculty: "Dr. Amit Kumar", room: "Room C301" },
  ]

  const semesterStats = {
    totalCourses: 5,
    creditsEnrolled: 18,
    attendanceRate: 92,
    currentSemester: 3,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">ID: {user?.student_id}</Badge>
              <Badge variant="outline">Semester {semesterStats.currentSemester}</Badge>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{semesterStats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">this semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{semesterStats.creditsEnrolled}</div>
              <p className="text-xs text-muted-foreground">credit hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{semesterStats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">overall rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{semesterStats.currentSemester}</div>
              <p className="text-xs text-muted-foreground">of 8 semesters</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Classes</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayClasses.map((class_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-green-900">{class_.time}</div>
                      <div className="text-sm text-green-700">{class_.subject}</div>
                      <div className="text-xs text-green-600">
                        {class_.faculty} • {class_.room}
                      </div>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access your academic information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Timetable
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Course Information
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Attendance Record
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Enrollment */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Current Enrollments</CardTitle>
            <CardDescription>Courses you are enrolled in this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { code: "CS101", name: "Computer Science Fundamentals", credits: 4, faculty: "Dr. Rajesh Sharma" },
                { code: "CS201", name: "Data Structures and Algorithms", credits: 4, faculty: "Prof. Priya Patel" },
                { code: "CS301", name: "Database Management Systems", credits: 3, faculty: "Dr. Amit Kumar" },
                { code: "CS401", name: "Machine Learning Basics", credits: 4, faculty: "Prof. Sunita Singh" },
                { code: "CS501", name: "Software Engineering", credits: 3, faculty: "Dr. Vikram Gupta" },
              ].map((course) => (
                <div key={course.code} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{course.code}</Badge>
                    <span className="text-sm text-gray-500">{course.credits} credits</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{course.name}</h4>
                  <p className="text-xs text-gray-600">{course.faculty}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
