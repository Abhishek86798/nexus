import { TimetableGenerator } from "@/components/timetable-generator-dashboard"
import { AIAssistant } from "@/components/ai-assistant"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <TimetableGenerator />
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <AIAssistant />
        </div>
      </div>
    </div>
  )
}
