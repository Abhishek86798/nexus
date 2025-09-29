// Database health and statistics API endpoint
// GET /api/database/status

import { NextRequest, NextResponse } from 'next/server'
import { checkDatabaseHealth, getDatabaseStats } from '@/lib/database/service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('stats') === 'true'

    // Check database health
    const health = await checkDatabaseHealth()
    
    const response: any = {
      timestamp: new Date().toISOString(),
      health,
    }

    // Include database statistics if requested
    if (includeStats && (health.status === 'healthy' || health.status === 'unavailable')) {
      try {
        response.statistics = await getDatabaseStats()
      } catch (error) {
        response.statistics = { error: 'Failed to fetch statistics' }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Database status API error:', error)
    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        health: {
          status: 'unhealthy',
          message: `API error: ${error}`,
        },
      },
      { status: 500 }
    )
  }
}

// Mark this route as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic'