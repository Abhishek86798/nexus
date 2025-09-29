export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  maxHoursPerDay: number;
  preferredTimeSlots?: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  semester: number;
  teacherId: string;
  hoursPerWeek: number;
  requiresLab: boolean;
}

export interface Room {
  id: string;
  number: string;
  type: 'classroom' | 'laboratory' | 'auditorium' | 'seminar';
  capacity: number;
  building: string;
  floor: number;
  features: string[];
  isAvailable: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  semester: number;
  department: string;
  enrolledCourses: string[];
}

export const sampleTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    department: 'Computer Science',
    subjects: ['Data Structures', 'Algorithms', 'Software Engineering'],
    maxHoursPerDay: 6,
    preferredTimeSlots: ['09:00-10:00', '10:00-11:00', '11:00-12:00']
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu',
    department: 'Computer Science',
    subjects: ['Database Systems', 'Web Development', 'System Design'],
    maxHoursPerDay: 5,
    preferredTimeSlots: ['10:00-11:00', '11:00-12:00', '14:00-15:00']
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu',
    department: 'Mathematics',
    subjects: ['Calculus', 'Linear Algebra', 'Statistics'],
    maxHoursPerDay: 6,
    preferredTimeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00']
  },
  {
    id: '4',
    name: 'Prof. David Kim',
    email: 'david.kim@university.edu',
    department: 'Physics',
    subjects: ['Physics I', 'Physics II', 'Quantum Mechanics'],
    maxHoursPerDay: 5,
    preferredTimeSlots: ['11:00-12:00', '14:00-15:00', '15:00-16:00']
  },
  {
    id: '5',
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@university.edu',
    department: 'Computer Science',
    subjects: ['Machine Learning', 'AI', 'Data Science'],
    maxHoursPerDay: 4,
    preferredTimeSlots: ['13:00-14:00', '14:00-15:00', '15:00-16:00']
  }
];

export const sampleCourses: Course[] = [
  {
    id: '1',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    credits: 4,
    department: 'Computer Science',
    semester: 3,
    teacherId: '1',
    hoursPerWeek: 4,
    requiresLab: true
  },
  {
    id: '2',
    name: 'Database Management Systems',
    code: 'CS301',
    credits: 3,
    department: 'Computer Science',
    semester: 5,
    teacherId: '2',
    hoursPerWeek: 3,
    requiresLab: true
  },
  {
    id: '3',
    name: 'Calculus I',
    code: 'MATH101',
    credits: 4,
    department: 'Mathematics',
    semester: 1,
    teacherId: '3',
    hoursPerWeek: 4,
    requiresLab: false
  },
  {
    id: '4',
    name: 'Physics I',
    code: 'PHY101',
    credits: 3,
    department: 'Physics',
    semester: 1,
    teacherId: '4',
    hoursPerWeek: 3,
    requiresLab: true
  },
  {
    id: '5',
    name: 'Machine Learning',
    code: 'CS401',
    credits: 3,
    department: 'Computer Science',
    semester: 7,
    teacherId: '5',
    hoursPerWeek: 3,
    requiresLab: true
  },
  {
    id: '6',
    name: 'Software Engineering',
    code: 'CS302',
    credits: 3,
    department: 'Computer Science',
    semester: 5,
    teacherId: '1',
    hoursPerWeek: 3,
    requiresLab: false
  },
  {
    id: '7',
    name: 'Linear Algebra',
    code: 'MATH201',
    credits: 3,
    department: 'Mathematics',
    semester: 3,
    teacherId: '3',
    hoursPerWeek: 3,
    requiresLab: false
  }
];

export const sampleRooms: Room[] = [
  {
    id: '1',
    number: 'A101',
    type: 'classroom',
    capacity: 60,
    building: 'Academic Block A',
    floor: 1,
    features: ['Projector', 'Whiteboard', 'AC'],
    isAvailable: true
  },
  {
    id: '2',
    number: 'A102',
    type: 'classroom',
    capacity: 50,
    building: 'Academic Block A',
    floor: 1,
    features: ['Projector', 'Whiteboard'],
    isAvailable: true
  },
  {
    id: '3',
    number: 'B201',
    type: 'laboratory',
    capacity: 30,
    building: 'Academic Block B',
    floor: 2,
    features: ['Computers', 'Projector', 'AC'],
    isAvailable: true
  },
  {
    id: '4',
    number: 'B202',
    type: 'laboratory',
    capacity: 25,
    building: 'Academic Block B',
    floor: 2,
    features: ['Computers', 'Projector', 'Whiteboard'],
    isAvailable: true
  },
  {
    id: '5',
    number: 'C301',
    type: 'auditorium',
    capacity: 200,
    building: 'Academic Block C',
    floor: 3,
    features: ['Stage', 'Audio System', 'Projector', 'AC'],
    isAvailable: true
  },
  {
    id: '6',
    number: 'A201',
    type: 'seminar',
    capacity: 25,
    building: 'Academic Block A',
    floor: 2,
    features: ['Round Table', 'Projector', 'Whiteboard'],
    isAvailable: true
  },
  {
    id: '7',
    number: 'B101',
    type: 'classroom',
    capacity: 80,
    building: 'Academic Block B',
    floor: 1,
    features: ['Projector', 'Whiteboard', 'AC', 'Sound System'],
    isAvailable: true
  }
];

export const sampleStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@student.university.edu',
    rollNumber: 'CS2021001',
    semester: 3,
    department: 'Computer Science',
    enrolledCourses: ['1', '3'] // Data Structures, Calculus I
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@student.university.edu',
    rollNumber: 'CS2021002',
    semester: 5,
    department: 'Computer Science',
    enrolledCourses: ['2', '6'] // Database Systems, Software Engineering
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@student.university.edu',
    rollNumber: 'CS2019001',
    semester: 7,
    department: 'Computer Science',
    enrolledCourses: ['5'] // Machine Learning
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob.wilson@student.university.edu',
    rollNumber: 'MATH2022001',
    semester: 3,
    department: 'Mathematics',
    enrolledCourses: ['3', '7'] // Calculus I, Linear Algebra
  },
  {
    id: '5',
    name: 'Emma Davis',
    email: 'emma.davis@student.university.edu',
    rollNumber: 'PHY2022001',
    semester: 1,
    department: 'Physics',
    enrolledCourses: ['3', '4'] // Calculus I, Physics I
  }
];

// Helper function to get statistics for dashboard
export const getStats = () => ({
  totalCourses: sampleCourses.length,
  totalTeachers: sampleTeachers.length,
  totalRooms: sampleRooms.length,
  totalStudents: sampleStudents.length,
  availableRooms: sampleRooms.filter(room => room.isAvailable).length,
  departmentCount: {
    'Computer Science': sampleCourses.filter(c => c.department === 'Computer Science').length,
    'Mathematics': sampleCourses.filter(c => c.department === 'Mathematics').length,
    'Physics': sampleCourses.filter(c => c.department === 'Physics').length
  }
});