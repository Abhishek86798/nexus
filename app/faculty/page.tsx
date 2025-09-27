import { ProtectedRoute } from "@/components/auth/protected-route"
import { FacultyDashboard } from "@/components/faculty/faculty-dashboard"

export default function FacultyPage() {
  return (
    <ProtectedRoute requiredRole="faculty">
      <FacultyDashboard />
    </ProtectedRoute>
  )
}
