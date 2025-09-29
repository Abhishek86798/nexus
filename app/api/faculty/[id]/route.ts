// Individual Faculty operations
// app/api/faculty/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { z } from 'zod'

const FacultyUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  department: z.string().min(1).optional(),
  specialization: z.string().optional(),
  expertise_tags: z.array(z.string()).optional(),
  max_hours_per_week: z.number().min(1).max(60).optional(),
  availability_mask: z.string().optional(),
  preferred_slots: z.array(z.string()).optional()
})

// GET single faculty by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const facultyId = parseInt(params.id)
    
    if (isNaN(facultyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid faculty ID' },
        { status: 400 }
      )
    }

    const result = await query(
      'SELECT * FROM faculty WHERE id = $1',
      [facultyId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Faculty not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })

  } catch (error) {
    console.error('Faculty GET by ID error:', error)
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

// PUT update faculty by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const facultyId = parseInt(params.id)
    
    if (isNaN(facultyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid faculty ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = FacultyUpdateSchema.parse(body)

    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'expertise_tags' || key === 'preferred_slots') {
          updates.push(`${key} = $${paramCount}`)
          values.push(JSON.stringify(value))
        } else {
          updates.push(`${key} = $${paramCount}`)
          values.push(value)
        }
        paramCount++
      }
    })

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(facultyId)

    const queryText = `
      UPDATE faculty 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `

    const result = await query(queryText, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Faculty not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Faculty updated successfully'
    })

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

    console.error('Faculty PUT error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update faculty',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE faculty by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const facultyId = parseInt(params.id)
    
    if (isNaN(facultyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid faculty ID' },
        { status: 400 }
      )
    }

    // Check if faculty has any assignments
    const assignmentCheck = await query(
      'SELECT COUNT(*) as count FROM timetable_assignments WHERE faculty_id = $1',
      [facultyId]
    )

    if (parseInt(assignmentCheck.rows[0].count) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete faculty with existing timetable assignments'
        },
        { status: 409 }
      )
    }

    const result = await query(
      'DELETE FROM faculty WHERE id = $1 RETURNING *',
      [facultyId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Faculty not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Faculty deleted successfully'
    })

  } catch (error) {
    console.error('Faculty DELETE error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete faculty',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}