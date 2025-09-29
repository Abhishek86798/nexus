// Simple database connection test API
// app/api/users/route.ts

import { NextResponse } from 'next/server'
import pool from '../../../lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT NOW()')
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        message: 'Make sure PostgreSQL is running and the database "nexus" exists'
      },
      { status: 500 }
    )
  }
}

// Mark this route as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic'