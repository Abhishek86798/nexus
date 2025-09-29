// Faculty CRUD API routes
// app/api/faculty/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'zod'

// Validation schema for faculty
const FacultySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  department: z.string().min(1, 'Department is required'),
  specialization: z.string().optional(),
  expertise_tags: z.array(z.string()).optional(),
  max_hours_per_week: z.number().min(1).max(60).default(20),
  availability_mask: z.string().optional(),
  preferred_slots: z.array(z.string()).optional()
})

// GET all faculty
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let queryText = `
      SELECT id, name, email, department, specialization, 
             expertise_tags, max_hours_per_week, availability_mask, 
             preferred_slots, created_at, updated_at
      FROM faculty
    `
    const params: any[] = []

    if (department) {
      queryText += ' WHERE department = $1'
      params.push(department)
    }

    queryText += ` ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
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
    console.error('Faculty GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch faculty',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST new faculty
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = FacultySchema.parse(body)

    const result = await query(
      `INSERT INTO faculty (
        name, email, department, specialization, 
        expertise_tags, max_hours_per_week, availability_mask, preferred_slots
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        validatedData.name,
        validatedData.email,
        validatedData.department,
        validatedData.specialization || null,
        JSON.stringify(validatedData.expertise_tags || []),
        validatedData.max_hours_per_week,
        validatedData.availability_mask || '1111111111111111111111111111111111111',
        JSON.stringify(validatedData.preferred_slots || [])
      ]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Faculty created successfully'
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

    console.error('Faculty POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create faculty',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}