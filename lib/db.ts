// PostgreSQL connection utility
// lib/db.ts

import { Pool } from 'pg'

let pool: Pool | null = null

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        // Additional configuration for production
        max: 20, // Maximum number of connections in pool
        idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
        connectionTimeoutMillis: 2000, // Timeout if connection takes longer than 2 seconds
      })

      // Test the connection on startup
      pool.on('connect', () => {
        console.log('Connected to PostgreSQL database')
      })

      pool.on('error', (err) => {
        console.error('PostgreSQL connection error:', err)
      })
    } catch (error) {
      console.warn('Failed to create database pool:', error)
      pool = null
    }
  }
  return pool
}

export default getPool()

// Helper function to execute queries with error handling
export async function query(text: string, params?: any[]) {
  const currentPool = getPool()
  if (!currentPool) {
    throw new Error('Database pool not available')
  }
  
  const client = await currentPool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Helper function to get database health status
export async function checkConnection() {
  try {
    const currentPool = getPool()
    if (!currentPool) {
      return {
        status: 'unavailable',
        error: 'Database connection not available during build time',
      }
    }
    
    const result = await query('SELECT NOW() as current_time, version() as postgresql_version')
    return {
      status: 'healthy',
      timestamp: result.rows[0].current_time,
      version: result.rows[0].postgresql_version,
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}