// Authentication types and interfaces

export type UserRole = "admin" | "faculty" | "student"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department?: string
  student_id?: string
  faculty_id?: string
  created_at: string
  last_login?: string
  is_active: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  role?: UserRole
}

export interface SignupData {
  email: string
  password: string
  name: string
  role: UserRole
  department?: string
  student_id?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: UserRole) => boolean
  hasPermission: (permission: string) => boolean
}

// Role-based permissions
export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: "manage_users",
  MANAGE_PROGRAMS: "manage_programs",
  MANAGE_TIMETABLES: "manage_timetables",
  VIEW_ANALYTICS: "view_analytics",
  SYSTEM_SETTINGS: "system_settings",

  // Faculty permissions
  VIEW_OWN_SCHEDULE: "view_own_schedule",
  SET_PREFERENCES: "set_preferences",
  VIEW_STUDENTS: "view_students",
  REQUEST_CHANGES: "request_changes",

  // Student permissions
  VIEW_SCHEDULE: "view_schedule",
  VIEW_PROFILE: "view_profile",
} as const

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_PROGRAMS,
    PERMISSIONS.MANAGE_TIMETABLES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.VIEW_OWN_SCHEDULE,
    PERMISSIONS.SET_PREFERENCES,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.REQUEST_CHANGES,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.VIEW_PROFILE,
  ],
  faculty: [
    PERMISSIONS.VIEW_OWN_SCHEDULE,
    PERMISSIONS.SET_PREFERENCES,
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.REQUEST_CHANGES,
    PERMISSIONS.VIEW_PROFILE,
  ],
  student: [PERMISSIONS.VIEW_SCHEDULE, PERMISSIONS.VIEW_PROFILE],
}
