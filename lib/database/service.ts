// Database service for AI Timetable Generation System
// Provides centralized database access using Prisma

import { PrismaClient } from '@prisma/client'

// Global PrismaClient instance to prevent multiple connections
declare global {
  var __prisma: PrismaClient | undefined
}

// Create PrismaClient instance with error handling
let prisma: PrismaClient

try {
  prisma = global.__prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })

  // Store instance globally in development to prevent hot reload issues
  if (process.env.NODE_ENV !== 'production') {
    global.__prisma = prisma
  }
} catch (error) {
  console.warn('Failed to initialize Prisma client:', error)
  // Create a mock client for build time
  prisma = {} as PrismaClient
}

export { prisma }

// Database utility functions

/**
 * Initialize database with sample data
 */
export async function initializeDatabase() {
  try {
    // Check if data already exists
    const programCount = await prisma.program.count()
    if (programCount > 0) {
      console.log('Database already initialized')
      return
    }

    console.log('Initializing database with sample data...')

    // Create time slots
    const timeSlots = []
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const times = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:15', end: '12:15' },
      { start: '12:15', end: '13:15' },
      { start: '14:15', end: '15:15' },
    ]

    let slotIndex = 0
    for (const day of days) {
      for (const time of times) {
        timeSlots.push({
          day,
          start_time: time.start,
          end_time: time.end,
          slot_index: slotIndex++,
        })
      }
    }

    await prisma.timeSlot.createMany({ data: timeSlots })

    // Create sample programs
    const programs = [
      {
        name: 'Data Structures and Algorithms',
        code: 'CSE301',
        department: 'Computer Science',
        semester: 3,
        credits: 4,
        duration_minutes: 60,
        needs_lab: false,
        course_type: 'core',
        required_expertise_tags: ['algorithms', 'programming', 'data_structures'],
        max_students: 60,
      },
      {
        name: 'Database Management Systems Lab',
        code: 'CSE302L',
        department: 'Computer Science',
        semester: 3,
        credits: 2,
        duration_minutes: 120,
        needs_lab: true,
        course_type: 'practical',
        required_expertise_tags: ['database', 'sql', 'lab_supervision'],
        max_students: 30,
      },
      {
        name: 'Machine Learning',
        code: 'CSE401',
        department: 'Computer Science',
        semester: 4,
        credits: 3,
        duration_minutes: 60,
        needs_lab: false,
        course_type: 'elective',
        required_expertise_tags: ['machine_learning', 'python', 'statistics'],
        max_students: 40,
      },
    ]

    await prisma.program.createMany({ data: programs })

    // Create sample faculty
    const faculty = [
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@university.edu',
        department: 'Computer Science',
        specialization: 'Algorithms and Data Structures',
        expertise_tags: ['algorithms', 'programming', 'data_structures', 'competitive_programming'],
        max_hours_per_week: 20,
        availability_mask: '1111111111111111111111111111111111111', // Available all slots
      },
      {
        name: 'Prof. Rajesh Kumar',
        email: 'rajesh.kumar@university.edu',
        department: 'Computer Science',
        specialization: 'Database Systems',
        expertise_tags: ['database', 'sql', 'lab_supervision', 'data_mining'],
        max_hours_per_week: 18,
        availability_mask: '1111111111111111111111111111111111111',
      },
      {
        name: 'Dr. Anita Patel',
        email: 'anita.patel@university.edu',
        department: 'Computer Science',
        specialization: 'Machine Learning and AI',
        expertise_tags: ['machine_learning', 'python', 'statistics', 'neural_networks'],
        max_hours_per_week: 22,
        availability_mask: '1111111111111111111111111111111111111',
      },
    ]

    await prisma.faculty.createMany({ data: faculty })

    // Create sample classrooms
    const classrooms = [
      {
        name: 'Room 301',
        building: 'Engineering Block A',
        capacity: 60,
        is_lab: false,
        equipment: ['projector', 'whiteboard', 'ac', 'microphone'],
      },
      {
        name: 'Computer Lab 1',
        building: 'Engineering Block B',
        capacity: 30,
        is_lab: true,
        lab_type: 'computer',
        equipment: ['computers', 'projector', 'server', 'networking'],
      },
      {
        name: 'Room 205',
        building: 'Engineering Block A',
        capacity: 40,
        is_lab: false,
        equipment: ['projector', 'whiteboard', 'ac'],
      },
    ]

    await prisma.classroom.createMany({ data: classrooms })

    // Create sample students
    const students = []
    for (let i = 1; i <= 50; i++) {
      students.push({
        name: `Student ${i}`,
        email: `student${i}@university.edu`,
        student_id: `CSE2024${String(i).padStart(3, '0')}`,
        department: 'Computer Science',
        semester: 3,
        academic_year: '2024-25',
        enrolled_courses: [], // Will be populated with program IDs
      })
    }

    await prisma.student.createMany({ data: students })

    console.log('Database initialization completed successfully!')
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

/**
 * Clean shutdown - disconnect from database
 */
export async function disconnectDatabase() {
  await prisma.$disconnect()
}

/**
 * Health check - verify database connection
 */
export async function checkDatabaseHealth() {
  try {
    // Check if Prisma client is properly initialized
    if (!prisma || !prisma.$queryRaw) {
      return { status: 'unavailable', message: 'Database client not initialized (build time)' }
    }
    
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', message: 'Database connection successful' }
  } catch (error) {
    return { status: 'unhealthy', message: `Database connection failed: ${error}` }
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  try {
    // Check if Prisma client is properly initialized
    if (!prisma || !prisma.program) {
      return {
        programs: 0,
        faculty: 0,
        students: 0,
        classrooms: 0,
        assignments: 0,
        lastUpdated: new Date().toISOString(),
        note: 'Database unavailable during build time'
      }
    }
    
    const [programs, faculty, students, classrooms, assignments] = await Promise.all([
      prisma.program.count(),
      prisma.faculty.count(),
      prisma.student.count(),
      prisma.classroom.count(),
      prisma.timetableAssignment.count(),
    ])

    return {
      programs,
      faculty,
      students,
      classrooms,
      assignments,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Failed to get database stats:', error)
    throw error
  }
}