// Mock authentication service for demonstration
// In production, replace with Firebase/Auth0 integration

import type { User, LoginCredentials, SignupData } from "./types"

// Mock user database
const MOCK_USERS: User[] = [
  {
    id: "admin_1",
    email: "admin123@gmail.com",
    name: "System Administrator",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
    is_active: true,
  },
  {
    id: "faculty_1",
    email: "rajesh.sharma@university.edu",
    name: "Dr. Rajesh Sharma",
    role: "faculty",
    department: "Computer Science",
    faculty_id: "1",
    created_at: "2024-01-01T00:00:00Z",
    is_active: true,
  },
  {
    id: "faculty_2",
    email: "priya.patel@university.edu",
    name: "Prof. Priya Patel",
    role: "faculty",
    department: "Computer Science",
    faculty_id: "2",
    created_at: "2024-01-01T00:00:00Z",
    is_active: true,
  },
  {
    id: "student_1",
    email: "student1@university.edu",
    name: "Arjun Kumar",
    role: "student",
    department: "Computer Science",
    student_id: "STU0001",
    created_at: "2024-01-01T00:00:00Z",
    is_active: true,
  },
]

export class MockAuthService {
  private static instance: MockAuthService
  private currentUser: User | null = null

  static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService()
    }
    return MockAuthService.instance
  }

  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Hardcoded admin validation as requested
    if (credentials.email === "admin123@gmail.com" && credentials.password === "admin123") {
      const adminUser = MOCK_USERS.find((u) => u.email === "admin123@gmail.com")
      if (adminUser) {
        adminUser.last_login = new Date().toISOString()
        this.currentUser = adminUser
        return adminUser
      }
    }

    // For other demo users, find by email
    const user = MOCK_USERS.find((u) => u.email === credentials.email)

    if (!user) {
      throw new Error("Invalid credentials")
    }

    if (!user.is_active) {
      throw new Error("Account is deactivated")
    }

    // For demo users (non-admin), accept demo123 password
    if (credentials.password !== "demo123") {
      throw new Error("Invalid credentials")
    }

    // Update last login
    user.last_login = new Date().toISOString()
    this.currentUser = user

    return user
  }

  async signup(data: SignupData): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === data.email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Create new user
    const newUser: User = {
      id: `${data.role}_${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      department: data.department,
      student_id: data.student_id,
      created_at: new Date().toISOString(),
      is_active: true,
    }

    // Add to mock database
    MOCK_USERS.push(newUser)
    this.currentUser = newUser

    return newUser
  }

  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    this.currentUser = null
  }

  async getCurrentUser(): Promise<User | null> {
    // Simulate checking stored session
    await new Promise((resolve) => setTimeout(resolve, 200))
    return this.currentUser
  }

  async refreshToken(): Promise<string> {
    // Simulate token refresh
    await new Promise((resolve) => setTimeout(resolve, 300))
    return "mock_jwt_token_" + Date.now()
  }

  // Utility methods for testing
  getAllUsers(): User[] {
    return MOCK_USERS
  }

  getUserByRole(role: string): User[] {
    return MOCK_USERS.filter((u) => u.role === role)
  }
}
