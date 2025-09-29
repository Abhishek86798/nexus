// Students CRUD API routes
// app/api/students/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'zod'

// Validation schema for students
const StudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  student_id: z.string().min(1, 'Student ID is required'),
  department: z.string().min(1, 'Department is required'),
  semester: z.number().int().min(1).max(8),
  academic_year: z.string().min(1, 'Academic year is required'),
  enrolled_courses: z.array(z.string()).optional()
})

// GET all students  
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const semester = searchParams.get('semester')
    const academicYear = searchParams.get('academic_year')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let queryText = `
      SELECT id, name, email, student_id, department, semester,
             academic_year, enrolled_courses, created_at, updated_at
      FROM students
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 1

    if (department) {
      queryText += ` AND department = $${paramCount}`
      params.push(department)
      paramCount++
    }

    if (semester) {
      queryText += ` AND semester = $${paramCount}`
      params.push(parseInt(semester))
      paramCount++
    }

    if (academicYear) {
      queryText += ` AND academic_year = $${paramCount}`
      params.push(academicYear)
      paramCount++
    }

    queryText += ` ORDER BY department, semester, name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
    params.push(limit, offset)

    const result = await query(queryText, params)

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      limit,
      offset
    })

  } catch (error) {
    console.error('Students GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch students',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = StudentSchema.parse(body)

    // Check if student ID or email already exists
    const existingStudent = await query(
      'SELECT id FROM students WHERE student_id = $1 OR email = $2',
      [validatedData.student_id, validatedData.email]
    )

    if (existingStudent.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Student ID or email already exists' },
        { status: 409 }
      )
    }

    const result = await query(
      `INSERT INTO students (
        name, email, student_id, department, semester, academic_year, enrolled_courses
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        validatedData.name,
        validatedData.email,
        validatedData.student_id,
        validatedData.department,
        validatedData.semester,
        validatedData.academic_year,
        JSON.stringify(validatedData.enrolled_courses || [])
      ]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Student created successfully'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }

    console.error('Students POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create student',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT bulk update students (for enrollment)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_ids, enrolled_courses } = body

    if (!Array.isArray(student_ids) || !Array.isArray(enrolled_courses)) {
      return NextResponse.json(
        { success: false, error: 'student_ids and enrolled_courses must be arrays' },
        { status: 400 }
      )
    }

    const result = await query(
      `UPDATE students 
       SET enrolled_courses = $1, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = ANY($2::text[])
       RETURNING *`,
      [JSON.stringify(enrolled_courses), student_ids]
    )

    return NextResponse.json({
      success: true,
      data: result.rows,
      message: `Updated ${result.rows.length} students`
    })

  } catch (error) {
    console.error('Students PUT error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update students',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}