const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test students query
    console.log('\nFetching students...');
    const students = await prisma.students.findMany();
    console.log('Students found:', students.length);
    console.log(students);
    
    // Test other tables
    console.log('\nFetching teachers...');
    const teachers = await prisma.teachers.findMany();
    console.log('Teachers found:', teachers.length);
    
    console.log('\nFetching courses...');
    const courses = await prisma.courses.findMany();
    console.log('Courses found:', courses.length);
    
    console.log('\nFetching rooms...');
    const rooms = await prisma.rooms.findMany();
    console.log('Rooms found:', rooms.length);
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();