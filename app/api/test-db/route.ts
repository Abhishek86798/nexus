// PostgreSQL connection test API
// app/api/test-db/route.ts

import { NextResponse } from 'next/server'
import { checkConnection } from '@/lib/db'

export async function GET() {
  try {
    const connectionStatus = await checkConnection()
    
    if (connectionStatus.status === 'healthy') {
      return NextResponse.json({
        success: true,
        message: 'PostgreSQL connection successful',
        data: connectionStatus,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'PostgreSQL connection failed',
        error: connectionStatus.error,
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

// Mark this route as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic'