// Database seeding script for AI Timetable Generation System
// Run with: npm run db:seed

import { initializeDatabase, disconnectDatabase } from './service'

async function main() {
  console.log('🌱 Starting database seeding...')
  
  try {
    await initializeDatabase()
    console.log('✅ Database seeding completed successfully!')
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  } finally {
    await disconnectDatabase()
  }
}

// Run the seeding process
main()
  .catch((error) => {
    console.error('Fatal error during seeding:', error)
    process.exit(1)
  })