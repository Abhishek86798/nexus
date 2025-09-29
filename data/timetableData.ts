export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  displayTime: string;
}

export interface TimetableEntry {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  roomId: string;
  roomNumber: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlotId: string;
  courseType: 'major' | 'minor' | 'lab' | 'elective';
  enrolledCount: number;
  maxCapacity: number;
}

export interface AISuggestion {
  id: string;
  type: 'swap' | 'reschedule' | 'optimize' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  courses?: string[];
}

export interface MetricData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

// Time slots for the timetable
export const timeSlots: TimeSlot[] = [
  { id: '1', startTime: '08:00', endTime: '09:00', displayTime: '08:00 - 09:00' },
  { id: '2', startTime: '09:00', endTime: '10:00', displayTime: '09:00 - 10:00' },
  { id: '3', startTime: '10:00', endTime: '11:00', displayTime: '10:00 - 11:00' },
  { id: '4', startTime: '11:00', endTime: '12:00', displayTime: '11:00 - 12:00' },
  { id: '5', startTime: '12:00', endTime: '13:00', displayTime: '12:00 - 13:00' },
  { id: '6', startTime: '13:00', endTime: '14:00', displayTime: '13:00 - 14:00' },
  { id: '7', startTime: '14:00', endTime: '15:00', displayTime: '14:00 - 15:00' },
  { id: '8', startTime: '15:00', endTime: '16:00', displayTime: '15:00 - 16:00' },
  { id: '9', startTime: '16:00', endTime: '17:00', displayTime: '16:00 - 17:00' },
];

export const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Sample timetable entries
export const sampleTimetable: TimetableEntry[] = [
  // Monday
  {
    id: 'mon-1',
    courseId: '1',
    courseCode: 'CS201',
    courseName: 'Data Structures and Algorithms',
    teacherId: '1',
    teacherName: 'Dr. Sarah Johnson',
    roomId: '1',
    roomNumber: 'A101',
    day: 'Monday',
    timeSlotId: '2',
    courseType: 'major',
    enrolledCount: 45,
    maxCapacity: 60
  },
  {
    id: 'mon-2',
    courseId: '3',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    teacherId: '3',
    teacherName: 'Dr. Emily Rodriguez',
    roomId: '2',
    roomNumber: 'A102',
    day: 'Monday',
    timeSlotId: '3',
    courseType: 'major',
    enrolledCount: 38,
    maxCapacity: 50
  },
  {
    id: 'mon-3',
    courseCode: 'CS201L',
    courseId: '1',
    courseName: 'Data Structures Lab',
    teacherId: '1',
    teacherName: 'Dr. Sarah Johnson',
    roomId: '3',
    roomNumber: 'B201',
    day: 'Monday',
    timeSlotId: '6',
    courseType: 'lab',
    enrolledCount: 25,
    maxCapacity: 30
  },
  
  // Tuesday
  {
    id: 'tue-1',
    courseId: '2',
    courseCode: 'CS301',
    courseName: 'Database Management Systems',
    teacherId: '2',
    teacherName: 'Prof. Michael Chen',
    roomId: '7',
    roomNumber: 'B101',
    day: 'Tuesday',
    timeSlotId: '2',
    courseType: 'major',
    enrolledCount: 52,
    maxCapacity: 80
  },
  {
    id: 'tue-2',
    courseId: '4',
    courseCode: 'PHY101',
    courseName: 'Physics I',
    teacherId: '4',
    teacherName: 'Prof. David Kim',
    roomId: '1',
    roomNumber: 'A101',
    day: 'Tuesday',
    timeSlotId: '4',
    courseType: 'major',
    enrolledCount: 35,
    maxCapacity: 60
  },
  {
    id: 'tue-3',
    courseId: '5',
    courseCode: 'CS401',
    courseName: 'Machine Learning',
    teacherId: '5',
    teacherName: 'Dr. Lisa Wang',
    roomId: '4',
    roomNumber: 'B202',
    day: 'Tuesday',
    timeSlotId: '7',
    courseType: 'elective',
    enrolledCount: 20,
    maxCapacity: 25
  },

  // Wednesday
  {
    id: 'wed-1',
    courseId: '6',
    courseCode: 'CS302',
    courseName: 'Software Engineering',
    teacherId: '1',
    teacherName: 'Dr. Sarah Johnson',
    roomId: '2',
    roomNumber: 'A102',
    day: 'Wednesday',
    timeSlotId: '2',
    courseType: 'major',
    enrolledCount: 42,
    maxCapacity: 50
  },
  {
    id: 'wed-2',
    courseId: '7',
    courseCode: 'MATH201',
    courseName: 'Linear Algebra',
    teacherId: '3',
    teacherName: 'Dr. Emily Rodriguez',
    roomId: '1',
    roomNumber: 'A101',
    day: 'Wednesday',
    timeSlotId: '4',
    courseType: 'major',
    enrolledCount: 40,
    maxCapacity: 60
  },
  {
    id: 'wed-3',
    courseCode: 'PHY101L',
    courseId: '4',
    courseName: 'Physics Lab',
    teacherId: '4',
    teacherName: 'Prof. David Kim',
    roomId: '4',
    roomNumber: 'B202',
    day: 'Wednesday',
    timeSlotId: '6',
    courseType: 'lab',
    enrolledCount: 18,
    maxCapacity: 25
  },

  // Thursday
  {
    id: 'thu-1',
    courseId: '2',
    courseCode: 'CS301',
    courseName: 'Database Management Systems',
    teacherId: '2',
    teacherName: 'Prof. Michael Chen',
    roomId: '7',
    roomNumber: 'B101',
    day: 'Thursday',
    timeSlotId: '3',
    courseType: 'major',
    enrolledCount: 52,
    maxCapacity: 80
  },
  {
    id: 'thu-2',
    courseId: '3',
    courseCode: 'MATH101',
    courseName: 'Calculus I',
    teacherId: '3',
    teacherName: 'Dr. Emily Rodriguez',
    roomId: '2',
    roomNumber: 'A102',
    day: 'Thursday',
    timeSlotId: '5',
    courseType: 'major',
    enrolledCount: 38,
    maxCapacity: 50
  },
  {
    id: 'thu-3',
    courseCode: 'CS301L',
    courseId: '2',
    courseName: 'Database Lab',
    teacherId: '2',
    teacherName: 'Prof. Michael Chen',
    roomId: '3',
    roomNumber: 'B201',
    day: 'Thursday',
    timeSlotId: '7',
    courseType: 'lab',
    enrolledCount: 30,
    maxCapacity: 30
  },

  // Friday
  {
    id: 'fri-1',
    courseId: '1',
    courseCode: 'CS201',
    courseName: 'Data Structures and Algorithms',
    teacherId: '1',
    teacherName: 'Dr. Sarah Johnson',
    roomId: '1',
    roomNumber: 'A101',
    day: 'Friday',
    timeSlotId: '2',
    courseType: 'major',
    enrolledCount: 45,
    maxCapacity: 60
  },
  {
    id: 'fri-2',
    courseId: '5',
    courseCode: 'CS401',
    courseName: 'Machine Learning',
    teacherId: '5',
    teacherName: 'Dr. Lisa Wang',
    roomId: '6',
    roomNumber: 'A201',
    day: 'Friday',
    timeSlotId: '4',
    courseType: 'elective',
    enrolledCount: 20,
    maxCapacity: 25
  },
  {
    id: 'fri-3',
    courseId: '6',
    courseCode: 'CS302',
    courseName: 'Software Engineering',
    teacherId: '1',
    teacherName: 'Dr. Sarah Johnson',
    roomId: '2',
    roomNumber: 'A102',
    day: 'Friday',
    timeSlotId: '6',
    courseType: 'major',
    enrolledCount: 42,
    maxCapacity: 50
  }
];

// AI Suggestions
export const aiSuggestions: AISuggestion[] = [
  {
    id: 'sug-1',
    type: 'swap',
    title: 'Optimize Student Movement',
    description: 'Swap CS101 with MA204 to reduce student travel between buildings by 40%',
    impact: 'high',
    courses: ['CS201', 'MATH101']
  },
  {
    id: 'sug-2',
    type: 'optimize',
    title: 'Room Utilization Alert',
    description: 'Room B101 is underutilized. Consider moving smaller classes here.',
    impact: 'medium'
  },
  {
    id: 'sug-3',
    type: 'reschedule',
    title: 'Teacher Workload Balance',
    description: 'Dr. Sarah Johnson has 4 consecutive hours on Monday. Suggest redistributing.',
    impact: 'medium',
    courses: ['CS201', 'CS302']
  },
  {
    id: 'sug-4',
    type: 'alert',
    title: 'Conflict Detection',
    description: 'Lab B202 is scheduled for both Physics and CS courses simultaneously.',
    impact: 'high'
  }
];

// Metrics data for charts
export const teacherSatisfactionData: MetricData[] = [
  { name: 'Very Satisfied', value: 45, color: '#22C55E' },
  { name: 'Satisfied', value: 35, color: '#84CC16' },
  { name: 'Neutral', value: 15, color: '#FFA500' },
  { name: 'Dissatisfied', value: 5, color: '#EF4444' }
];

export const roomUtilizationData: MetricData[] = [
  { name: 'Mon', value: 85, color: '#3B82F6' },
  { name: 'Tue', value: 92, color: '#3B82F6' },
  { name: 'Wed', value: 78, color: '#3B82F6' },
  { name: 'Thu', value: 88, color: '#3B82F6' },
  { name: 'Fri', value: 65, color: '#3B82F6' }
];

export const studentCompactnessData: MetricData[] = [
  { name: 'Compact', value: 70, color: '#10B981' },
  { name: 'Moderate', value: 25, color: '#F59E0B' },
  { name: 'Scattered', value: 5, color: '#EF4444' }
];

// Helper functions
export const getCourseTypeColor = (type: TimetableEntry['courseType']) => {
  switch (type) {
    case 'major': return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'minor': return 'bg-green-100 border-green-300 text-green-800';
    case 'lab': return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'elective': return 'bg-purple-100 border-purple-300 text-purple-800';
    default: return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

export const getTimetableEntry = (day: string, timeSlotId: string): TimetableEntry | null => {
  return sampleTimetable.find(entry => 
    entry.day === day && entry.timeSlotId === timeSlotId
  ) || null;
};