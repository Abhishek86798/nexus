// Programs CRUD API routes
// app/api/programs/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'zod'

// Validation schema for programs
const ProgramSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  department: z.string().min(1, 'Department is required'),
  semester: z.number().int().min(1).max(8),
  credits: z.number().int().min(1).max(10),
  duration_minutes: z.number().int().min(30).max(180).default(60),
  needs_lab: z.boolean().default(false),
  course_type: z.enum(['core', 'elective', 'practical']).default('core'),
  required_expertise_tags: z.array(z.string()).optional(),
  max_students: z.number().int().min(1).max(200).default(60)
})

// GET all programs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const semester = searchParams.get('semester')
    const courseType = searchParams.get('course_type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let queryText = `
      SELECT id, name, code, department, semester, credits, 
             duration_minutes, needs_lab, course_type, 
             required_expertise_tags, max_students, created_at, updated_at
      FROM programs
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

    if (courseType) {
      queryText += ` AND course_type = $${paramCount}`
      params.push(courseType)
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
    console.error('Programs GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch programs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST new program
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = ProgramSchema.parse(body)

    // Check if code already exists
    const existingProgram = await query(
      'SELECT id FROM programs WHERE code = $1',
      [validatedData.code]
    )

    if (existingProgram.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Program code already exists' },
        { status: 409 }
      )
    }

    const result = await query(
      `INSERT INTO programs (
        name, code, department, semester, credits, duration_minutes,
        needs_lab, course_type, required_expertise_tags, max_students
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
      [
        validatedData.name,
        validatedData.code,
        validatedData.department,
        validatedData.semester,
        validatedData.credits,
        validatedData.duration_minutes,
        validatedData.needs_lab,
        validatedData.course_type,
        JSON.stringify(validatedData.required_expertise_tags || []),
        validatedData.max_students
      ]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Program created successfully'
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

    console.error('Programs POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create program',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}