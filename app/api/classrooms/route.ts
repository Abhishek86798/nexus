// Classrooms CRUD API routes  
// app/api/classrooms/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'zod'

// Validation schema for classrooms
const ClassroomSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  building: z.string().min(1, 'Building is required'),
  capacity: z.number().int().min(1).max(500),
  is_lab: z.boolean().default(false),
  lab_type: z.string().optional(),
  equipment: z.array(z.string()).optional(),
  availability_mask: z.string().optional()
})

// GET all classrooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const building = searchParams.get('building')
    const isLab = searchParams.get('is_lab')
    const minCapacity = searchParams.get('min_capacity')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let queryText = `
      SELECT id, name, building, capacity, is_lab, lab_type,
             equipment, availability_mask, created_at, updated_at
      FROM classrooms
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 1

    if (building) {
      queryText += ` AND building = $${paramCount}`
      params.push(building)
      paramCount++
    }

    if (isLab !== null) {
      queryText += ` AND is_lab = $${paramCount}`
      params.push(isLab === 'true')
      paramCount++
    }

    if (minCapacity) {
      queryText += ` AND capacity >= $${paramCount}`
      params.push(parseInt(minCapacity))
      paramCount++
    }

    queryText += ` ORDER BY building, name ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`
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
    console.error('Classrooms GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch classrooms',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST new classroom
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = ClassroomSchema.parse(body)

    // Check if classroom name already exists in the same building
    const existingClassroom = await query(
      'SELECT id FROM classrooms WHERE name = $1 AND building = $2',
      [validatedData.name, validatedData.building]
    )

    if (existingClassroom.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Classroom already exists in this building' },
        { status: 409 }
      )
    }

    const result = await query(
      `INSERT INTO classrooms (
        name, building, capacity, is_lab, lab_type, equipment, availability_mask
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [
        validatedData.name,
        validatedData.building,
        validatedData.capacity,
        validatedData.is_lab,
        validatedData.lab_type || null,
        JSON.stringify(validatedData.equipment || []),
        validatedData.availability_mask || '1111111111111111111111111111111111111'
      ]
    )

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Classroom created successfully'
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

    console.error('Classrooms POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create classroom',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}