import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, BookOpen, Building, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  // Mock data for dashboard stats
  const stats = [
    { name: "Total Programs", value: "5", icon: BookOpen, change: "+2", changeType: "positive" },
    { name: "Faculty Members", value: "20", icon: Users, change: "+3", changeType: "positive" },
    { name: "Students Enrolled", value: "200", icon: Users, change: "+15", changeType: "positive" },
    { name: "Classrooms", value: "10", icon: Building, change: "0", changeType: "neutral" },
  ]

  const recentActivities = [
    { action: "Timetable generated", entity: "CS101 - Computer Science Fundamentals", time: "2 hours ago" },
    { action: "Faculty added", entity: "Dr. Rajesh Sharma", time: "4 hours ago" },
    { action: "Room conflict resolved", entity: "Lab B201", time: "6 hours ago" },
    { action: "Student batch imported", entity: "50 new students", time: "1 day ago" },
  ]

  const alerts = [
    { type: "warning", message: "Lab B201 maintenance scheduled for Wednesday 2-4 PM" },
    { type: "info", message: "New semester timetable generation recommended" },
    { type: "error", message: "Room conflict detected in CS301 schedule" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your AI-powered timetable generation system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-gray-500"
                }`}
              >
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-20 flex-col">
              <Link href="/admin/timetables">
                <Calendar className="h-6 w-6 mb-2" />
                Generate Timetable
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/admin/faculty">
                <Users className="h-6 w-6 mb-2" />
                Manage Faculty
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/admin/import-export">
                <TrendingUp className="h-6 w-6 mb-2" />
                Import Data
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
              <Link href="/admin/analytics">
                <TrendingUp className="h-6 w-6 mb-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.entity}</p>
                  </div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    alert.type === "error"
                      ? "bg-red-50 border border-red-200"
                      : alert.type === "warning"
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <AlertCircle
                    className={`h-5 w-5 mt-0.5 ${
                      alert.type === "error"
                        ? "text-red-500"
                        : alert.type === "warning"
                          ? "text-yellow-500"
                          : "text-blue-500"
                    }`}
                  />
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
