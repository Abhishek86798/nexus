import { ExcelImportConfig } from '@/components/generic-excel-import'

// Configuration for Teachers Excel Import
export const teachersImportConfig: ExcelImportConfig = {
  type: 'teachers',
  title: 'Import Teachers',
  description: 'Upload an Excel file containing teacher information',
  requiredColumns: ['name', 'email', 'department'],
  columnMapping: {
    id: ['id', 'teacher_id', 'teacherId'],
    name: ['name', 'teacher_name', 'teacherName', 'full_name', 'fullName'],
    email: ['email', 'email_address', 'emailAddress', 'mail'],
    department: ['department', 'dept', 'subject_area', 'subjectArea'],
    subjects: ['subjects', 'courses', 'specialization', 'expertise', 'teaches'],
    maxHoursPerDay: ['maxHoursPerDay', 'max_hours_per_day', 'hours_per_day', 'hoursPerDay', 'max_hours'],
    preferredTimeSlots: ['preferredTimeSlots', 'preferred_time_slots', 'time_slots', 'timeSlots', 'preferred_times']
  },
  sampleData: [
    {
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@university.edu',
      department: 'Computer Science',
      subjects: 'Data Structures, Algorithms, Programming',
      maxHoursPerDay: 6,
      preferredTimeSlots: '09:00-10:00, 10:00-11:00, 11:00-12:00'
    },
    {
      name: 'Prof. Priya Sharma',
      email: 'priya.sharma@university.edu',
      department: 'Mathematics',
      subjects: 'Calculus, Linear Algebra, Statistics',
      maxHoursPerDay: 5,
      preferredTimeSlots: '08:00-09:00, 09:00-10:00, 14:00-15:00'
    },
    {
      name: 'Dr. Ananya Singh',
      email: 'ananya.singh@university.edu',
      department: 'Computer Science',
      subjects: 'Machine Learning, AI, Data Science',
      maxHoursPerDay: 4,
      preferredTimeSlots: '13:00-14:00, 14:00-15:00, 15:00-16:00'
    }
  ]
}

// Configuration for Courses Excel Import
export const coursesImportConfig: ExcelImportConfig = {
  type: 'courses',
  title: 'Import Courses',
  description: 'Upload an Excel file containing course information',
  requiredColumns: ['name', 'code', 'department'],
  columnMapping: {
    id: ['id', 'course_id', 'courseId'],
    name: ['name', 'course_name', 'courseName', 'title', 'course_title'],
    code: ['code', 'course_code', 'courseCode', 'subject_code', 'subjectCode'],
    credits: ['credits', 'credit_hours', 'creditHours', 'hours', 'units'],
    department: ['department', 'dept', 'faculty', 'school'],
    semester: ['semester', 'sem', 'term', 'year'],
    teacherId: ['teacherId', 'teacher_id', 'instructor_id', 'instructorId', 'faculty_id'],
    enrollmentCapacity: ['enrollmentCapacity', 'enrollment_capacity', 'capacity', 'max_students', 'maxStudents']
  },
  sampleData: [
    {
      name: 'Data Structures and Algorithms',
      code: 'CS201',
      credits: 4,
      department: 'Computer Science',
      semester: 3,
      teacherId: '1',
      enrollmentCapacity: 60
    },
    {
      name: 'Database Management Systems',
      code: 'CS301',
      credits: 3,
      department: 'Computer Science',
      semester: 5,
      teacherId: '2',
      enrollmentCapacity: 50
    },
    {
      name: 'Calculus I',
      code: 'MATH101',
      credits: 4,
      department: 'Mathematics',
      semester: 1,
      teacherId: '3',
      enrollmentCapacity: 80
    }
  ]
}

// Configuration for Rooms Excel Import
export const roomsImportConfig: ExcelImportConfig = {
  type: 'rooms',
  title: 'Import Rooms',
  description: 'Upload an Excel file containing room information',
  requiredColumns: ['name', 'capacity'],
  columnMapping: {
    id: ['id', 'room_id', 'roomId'],
    name: ['name', 'room_name', 'roomName', 'room_number', 'roomNumber', 'number'],
    type: ['type', 'room_type', 'roomType', 'category'],
    capacity: ['capacity', 'max_capacity', 'maxCapacity', 'seats', 'max_students'],
    building: ['building', 'block', 'location', 'address'],
    floor: ['floor', 'level', 'storey'],
    features: ['features', 'equipment', 'amenities', 'facilities'],
    isAvailable: ['isAvailable', 'is_available', 'available', 'status', 'active']
  },
  sampleData: [
    {
      name: 'A101',
      type: 'Classroom',
      capacity: 60,
      building: 'Academic Block A',
      floor: 1,
      features: 'Projector, Whiteboard, AC, Sound System',
      isAvailable: true
    },
    {
      name: 'B201',
      type: 'Lab',
      capacity: 30,
      building: 'Academic Block B',
      floor: 2,
      features: 'Computers, Projector, Network',
      isAvailable: true
    },
    {
      name: 'C301',
      type: 'Auditorium',
      capacity: 200,
      building: 'Academic Block C',
      floor: 3,
      features: 'Stage, Sound System, Lighting, AC',
      isAvailable: true
    }
  ]
}