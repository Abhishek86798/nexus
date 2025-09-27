"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/auth/types"

interface LoginFormProps {
  defaultRole?: UserRole
  redirectTo?: string
}

export function LoginForm({ defaultRole, redirectTo }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: defaultRole || ("admin" as UserRole),
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(formData)

      // Redirect based on role
      const destination = redirectTo || getRoleBasedRedirect(formData.role)
      router.push(destination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBasedRedirect = (role: UserRole): string => {
    switch (role) {
      case "admin":
        return "/admin"
      case "faculty":
        return "/faculty"
      case "student":
        return "/student"
      default:
        return "/"
    }
  }

  // Demo credentials helper
  const fillDemoCredentials = (role: UserRole) => {
    const demoCredentials = {
      admin: { email: "admin@university.edu", password: "demo123" },
      faculty: { email: "rajesh.sharma@university.edu", password: "demo123" },
      student: { email: "student1@university.edu", password: "demo123" },
    }

    setFormData({
      ...formData,
      ...demoCredentials[role],
      role,
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>Access your AI Scheduler account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) => setFormData((prev) => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@university.edu"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials</h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("admin")}
              className="w-full text-left justify-start bg-transparent"
            >
              Admin: admin@university.edu
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("faculty")}
              className="w-full text-left justify-start bg-transparent"
            >
              Faculty: rajesh.sharma@university.edu
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fillDemoCredentials("student")}
              className="w-full text-left justify-start bg-transparent"
            >
              Student: student1@university.edu
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
