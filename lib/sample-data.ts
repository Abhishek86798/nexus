// Sample data for demonstration and testing
import type { Program, Faculty, Classroom, TimeSlot, Student } from "./types"

export const samplePrograms: Program[] = [
  {
    id: 1,
    name: "Computer Science Fundamentals",
    code: "CS101",
    department: "Computer Science",
    semester: 1,
    credits: 4,
    needs_lab: false,
    course_type: "Major",
    max_students: 60,
    required_expertise_tags: ["Computer Science", "Programming"],
  },
  {
    id: 2,
    name: "Data Structures and Algorithms",
    code: "CS201",
    department: "Computer Science",
    semester: 3,
    credits: 4,
    needs_lab: true,
    course_type: "Major",
    max_students: 30,
    required_expertise_tags: ["Algorithms", "Programming"],
  },
  {
    id: 3,
    name: "Database Management Systems",
    code: "CS301",
    department: "Computer Science",
    semester: 5,
    credits: 3,
    needs_lab: true,
    course_type: "Major",
    max_students: 30,
    required_expertise_tags: ["Database Systems", "SQL"],
  },
  {
    id: 4,
    name: "Machine Learning Basics",
    code: "CS401",
    department: "Computer Science",
    semester: 7,
    credits: 4,
    needs_lab: true,
    course_type: "Elective",
    max_students: 25,
    required_expertise_tags: ["Machine Learning", "Python", "Statistics"],
  },
  {
    id: 5,
    name: "Software Engineering",
    code: "CS501",
    department: "Computer Science",
    semester: 8,
    credits: 3,
    needs_lab: false,
    course_type: "Major",
    max_students: 50,
    required_expertise_tags: ["Software Engineering", "Project Management"],
  },
  {
    id: 6,
    name: "Mathematics for CS",
    code: "MA101",
    department: "Mathematics",
    semester: 1,
    credits: 3,
    needs_lab: false,
    course_type: "Minor",
    max_students: 80,
    required_expertise_tags: ["Mathematics", "Discrete Mathematics"],
  },
]

export const sampleFaculty: Faculty[] = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@university.edu",
    department: "Computer Science",
    specialization: "Algorithms",
    expertise_tags: ["Algorithms", "Programming", "Computer Science", "Data Structures"],
    max_hours_per_week: 18,
    preferred_time_slots: ["1-09:00:00", "1-10:00:00", "1-11:15:00"],
    availability_mask: {
      "Monday": [1, 2, 3, 4],
      "Tuesday": [1, 2, 3],
      "Wednesday": [1, 2, 3, 4, 5],
      "Thursday": [2, 3, 4],
      "Friday": [1, 2, 3],
      "Saturday": [],
      "Sunday": []
    },
  },
  {
    id: 2,
    name: "Prof. Priya Patel",
    email: "priya.patel@university.edu",
    department: "Computer Science",
    specialization: "Database Systems",
    expertise_tags: ["Database Systems", "SQL", "Computer Science", "System Design"],
    max_hours_per_week: 20,
    preferred_time_slots: ["1-10:00:00", "1-11:15:00", "1-14:00:00"],
    availability_mask: {
      "Monday": [2, 3, 4, 5],
      "Tuesday": [1, 2, 3, 4, 5],
      "Wednesday": [2, 3, 5, 6],
      "Thursday": [1, 2, 3, 4, 5],
      "Friday": [2, 3, 4],
      "Saturday": [],
      "Sunday": []
    },
  },
  {
    id: 3,
    name: "Dr. Amit Kumar",
    email: "amit.kumar@university.edu",
    department: "Computer Science",
    specialization: "Machine Learning",
    expertise_tags: ["Machine Learning", "Python", "Statistics", "AI", "Data Science"],
    max_hours_per_week: 16,
    preferred_time_slots: ["1-14:00:00", "1-15:00:00"],
    availability_mask: {
      "Monday": [5, 6, 7],
      "Tuesday": [4, 5, 6, 7],
      "Wednesday": [5, 6],
      "Thursday": [5, 6, 7],
      "Friday": [4, 5, 6],
      "Saturday": [],
      "Sunday": []
    },
  },
  {
    id: 4,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    department: "Computer Science",
    specialization: "Software Engineering",
    expertise_tags: ["Software Engineering", "Project Management", "Agile", "Testing"],
    max_hours_per_week: 18,
    preferred_time_slots: ["1-09:00:00", "1-14:00:00", "1-15:00:00"],
    availability_mask: {
      "Monday": [1, 2, 5, 6],
      "Tuesday": [1, 2, 3, 5, 6],
      "Wednesday": [1, 2, 4, 5, 6],
      "Thursday": [1, 2, 5, 6, 7],
      "Friday": [1, 2, 5],
      "Saturday": [],
      "Sunday": []
    },
  },
  {
    id: 5,
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    department: "Mathematics",
    specialization: "Discrete Mathematics",
    expertise_tags: ["Mathematics", "Discrete Mathematics", "Logic", "Statistics"],
    max_hours_per_week: 20,
    preferred_time_slots: ["1-09:00:00", "1-10:00:00", "1-11:15:00"],
    availability_mask: {
      "Monday": [1, 2, 3, 4, 5],
      "Tuesday": [1, 2, 3, 4],
      "Wednesday": [1, 2, 3, 4, 5],
      "Thursday": [1, 2, 3, 4, 5],
      "Friday": [1, 2, 3, 4],
      "Saturday": [],
      "Sunday": []
    },
  },
]

export const sampleClassrooms: Classroom[] = [
  {
    id: 1,
    name: "Room A101",
    type: "classroom",
    capacity: 60,
    is_lab: false,
    equipment: ["projector", "whiteboard", "audio_system"],
    building: "Academic Block A",
    floor: 1,
  },
  {
    id: 2,
    name: "Lab B201",
    type: "lab",
    capacity: 30,
    is_lab: true,
    equipment: ["computers", "projector", "network"],
    building: "Academic Block B",
    floor: 2,
  },
  {
    id: 3,
    name: "Auditorium D001",
    type: "auditorium",
    capacity: 200,
    is_lab: false,
    equipment: ["projector", "audio_system", "microphone", "stage_lights"],
    building: "Academic Block D",
    floor: 0,
  },
  {
    id: 4,
    name: "Room A102",
    type: "classroom",
    capacity: 50,
    is_lab: false,
    equipment: ["projector", "whiteboard"],
    building: "Academic Block A",
    floor: 1,
  },
  {
    id: 5,
    name: "Lab B202",
    type: "lab",
    capacity: 25,
    is_lab: true,
    equipment: ["computers", "projector", "network", "specialized_software"],
    building: "Academic Block B",
    floor: 2,
  },
  {
    id: 6,
    name: "Room C301",
    type: "classroom",
    capacity: 80,
    is_lab: false,
    equipment: ["projector", "whiteboard", "audio_system"],
    building: "Academic Block C",
    floor: 3,
  },
]

export const sampleStudents: Student[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@student.university.edu",
    student_id: "CS2021001",
    program_id: 1,
    semester: 1,
    enrolled_courses: [1, 6], // CS101, MA101
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@student.university.edu",
    student_id: "CS2021002",
    program_id: 1,
    semester: 3,
    enrolled_courses: [2, 6], // CS201, MA101
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@student.university.edu",
    student_id: "CS2019001",
    program_id: 1,
    semester: 5,
    enrolled_courses: [3, 4], // CS301, CS401
  },
  {
    id: 4,
    name: "Bob Wilson",
    email: "bob.wilson@student.university.edu",
    student_id: "CS2019002",
    program_id: 1,
    semester: 5,
    enrolled_courses: [3, 4], // CS301, CS401 (conflict with Alice)
  },
  {
    id: 5,
    name: "Carol Brown",
    email: "carol.brown@student.university.edu",
    student_id: "CS2018001",
    program_id: 1,
    semester: 8,
    enrolled_courses: [5], // CS501
  },
  {
    id: 6,
    name: "David Davis",
    email: "david.davis@student.university.edu",
    student_id: "CS2021003",
    program_id: 1,
    semester: 1,
    enrolled_courses: [1, 6], // CS101, MA101 (conflict with John)
  },
  {
    id: 7,
    name: "Eva Martinez",
    email: "eva.martinez@student.university.edu",
    student_id: "CS2020001",
    program_id: 1,
    semester: 3,
    enrolled_courses: [2], // CS201
  },
  {
    id: 8,
    name: "Frank Taylor",
    email: "frank.taylor@student.university.edu",
    student_id: "CS2019003",
    program_id: 1,
    semester: 7,
    enrolled_courses: [4, 5], // CS401, CS501 (potential conflict)
  },
]

export const sampleTimeSlots: TimeSlot[] = [
  { id: 1, day_of_week: 1, start_time: "09:00:00", end_time: "10:00:00", slot_name: "Morning 1" },
  { id: 2, day_of_week: 1, start_time: "10:00:00", end_time: "11:00:00", slot_name: "Morning 2" },
  { id: 3, day_of_week: 1, start_time: "11:15:00", end_time: "12:15:00", slot_name: "Morning 3" },
  { id: 4, day_of_week: 1, start_time: "12:15:00", end_time: "13:15:00", slot_name: "Morning 4" },
  { id: 5, day_of_week: 1, start_time: "14:00:00", end_time: "15:00:00", slot_name: "Afternoon 1" },
  { id: 6, day_of_week: 1, start_time: "15:00:00", end_time: "16:00:00", slot_name: "Afternoon 2" },
  { id: 7, day_of_week: 1, start_time: "16:15:00", end_time: "17:15:00", slot_name: "Afternoon 3" },
  // Add more time slots for other days...
]

// Utility functions for working with sample data
export const getDayName = (dayOfWeek: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[dayOfWeek] || "Unknown"
}

export const formatTimeSlot = (timeSlot: TimeSlot): string => {
  return `${getDayName(timeSlot.day_of_week)} ${timeSlot.slot_name} (${timeSlot.start_time.slice(0, 5)} - ${timeSlot.end_time.slice(0, 5)})`
}

export const getClassroomTypeIcon = (type: Classroom["type"]): string => {
  switch (type) {
    case "classroom":
      return "🏫"
    case "lab":
      return "🔬"
    case "auditorium":
      return "🎭"
    default:
      return "📍"
  }
}
