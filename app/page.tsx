import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, BookOpen, BarChart3, Settings, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Timetable Generation System</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Intelligent scheduling solution aligned with NEP 2020 guidelines. Automate timetable generation with
            AI-powered optimization and real-time rescheduling.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Smart Scheduling
              </CardTitle>
              <CardDescription>AI-powered timetable generation with constraint optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Generate optimal timetables considering faculty preferences, room availability, and NEP 2020 guidelines.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                Real-time Rescheduling
              </CardTitle>
              <CardDescription>Handle disruptions with instant schedule adjustments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Automatically reschedule classes when faculty are absent or rooms become unavailable.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Multi-role Access
              </CardTitle>
              <CardDescription>Separate dashboards for admins, faculty, and students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Role-based access control with tailored interfaces for different user types.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-600" />
                NEP 2020 Aligned
              </CardTitle>
              <CardDescription>Compliant with National Education Policy guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Built-in support for flexible curriculum, multidisciplinary approach, and outcome-based education.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-red-600" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>Comprehensive insights and utilization metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track faculty workload, classroom utilization, and schedule efficiency with detailed analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Natural Language Preferences
              </CardTitle>
              <CardDescription>Express constraints in plain English</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Input preferences like "Prof. Sharma prefers mornings" and let AI handle the optimization.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get Started</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/demo">🚀 Live Demo</Link>
            </Button>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/faculty">Faculty Portal</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/student">Student View</Link>
            </Button>
          </div>
        </div>

        {/* Demo Data Notice */}
        <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">🎯 Interactive Demo Ready</h3>
          <p className="text-green-700 mb-3">
            Experience the complete AI Timetable Generation System with live data, interactive charts, and working
            features. Perfect for demonstrations and testing all functionalities.
          </p>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-green-600">
            <div>✅ Interactive timetable grid with 12+ sample classes</div>
            <div>✅ Real-time analytics with charts and metrics</div>
            <div>✅ Faculty & room management interfaces</div>
            <div>✅ Mock AI generation and rescheduling</div>
          </div>
        </div>
      </div>
    </div>
  )
}
