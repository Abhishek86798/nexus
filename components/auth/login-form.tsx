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
      // Add admin role for backend compatibility
      await login({ ...formData, role: "admin" as UserRole })

      // Redirect to main dashboard
      const destination = redirectTo || "/"
      router.push(destination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Access your Nexus account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
        </CardContent>
      </Card>

      {/* Demo Credentials Box */}
      <Card className="w-full max-w-md mx-auto mt-4 border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-800 flex items-center">
            <LogIn className="h-4 w-4 mr-2" />
            Demo Credentials
          </CardTitle>
          <CardDescription className="text-blue-600">
            Use these credentials for evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="font-mono text-blue-700 select-all">admin123@gmail.com</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded border">
              <span className="font-medium text-gray-700">Password:</span>
              <span className="font-mono text-blue-700 select-all">admin123</span>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3 text-center">
            Click on the credentials to select and copy them
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
