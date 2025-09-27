// Sample data for demonstration and testing
import type { Program, Faculty, Classroom, TimeSlot } from "./types"

export const samplePrograms: Program[] = [
  {
    id: 1,
    name: "Computer Science Fundamentals",
    code: "CS101",
    department: "Computer Science",
    semester: 1,
    credits: 4,
    expected_enrollment: 55,
    needs_lab: false,
    course_type: "Major",
  },
  {
    id: 2,
    name: "Data Structures and Algorithms",
    code: "CS201",
    department: "Computer Science",
    semester: 3,
    credits: 4,
  },
  {
    id: 3,
    name: "Database Management Systems",
    code: "CS301",
    department: "Computer Science",
    semester: 5,
    credits: 3,
    expected_enrollment: 40,
    needs_lab: true,
    course_type: "Major",
  },
  {
    id: 4,
    name: "Machine Learning Basics",
    code: "CS401",
    department: "Computer Science",
    semester: 7,
    credits: 4,
    expected_enrollment: 35,
    needs_lab: true,
    course_type: "Minor",
  },
  {
    id: 5,
    name: "Software Engineering",
    code: "CS501",
    department: "Computer Science",
    semester: 8,
    credits: 3,
    expected_enrollment: 50,
    needs_lab: false,
    course_type: "Skill-Based",
  },
]

export const sampleFaculty: Faculty[] = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@university.edu",
    department: "Computer Science",
    specialization: "Algorithms",
    max_hours_per_week: 18,
    preferred_time_slots: ["Morning 1", "Morning 2", "Morning 3"],
    expertise_tags: ["Algorithms", "Discrete Math"],
    availability_mask: { Monday: [1, 2, 3, 4], Tuesday: [1, 2, 3], Wednesday: [1, 2, 3], Thursday: [1, 2, 3], Friday: [1, 2] },
  },
  {
    id: 2,
    name: "Prof. Priya Patel",
    email: "priya.patel@university.edu",
    department: "Computer Science",
    specialization: "Database Systems",
    max_hours_per_week: 20,
    preferred_time_slots: ["Morning 2", "Morning 3", "Afternoon 1"],
    expertise_tags: ["Databases", "SQL", "NoSQL"],
    availability_mask: { Monday: [2, 3, 5], Tuesday: [1, 2, 5], Wednesday: [1, 2], Thursday: [3, 5], Friday: [] },
  },
  {
    id: 3,
    name: "Dr. Amit Kumar",
    email: "amit.kumar@university.edu",
    department: "Computer Science",
    specialization: "Machine Learning",
    max_hours_per_week: 16,
    preferred_time_slots: ["Afternoon 1", "Afternoon 2"],
    expertise_tags: ["Machine Learning", "AI"],
    availability_mask: { Monday: [5, 6, 7], Tuesday: [5, 6], Wednesday: [5], Thursday: [6, 7], Friday: [5, 6] },
  },
  // Add more faculty members...
]

export const sampleClassrooms: Classroom[] = [
  {
    id: 1,
    name: "Room A101",
    type: "classroom",
    capacity: 60,
    equipment: ["projector", "whiteboard", "audio_system"],
    building: "Academic Block A",
    floor: 1,
    is_lab: false,
  },
  {
    id: 2,
    name: "Lab B201",
    type: "lab",
    capacity: 30,
    equipment: ["computers", "projector", "network"],
    building: "Academic Block B",
    floor: 2,
    is_lab: true,
  },
  {
    id: 3,
    name: "Auditorium D001",
    type: "auditorium",
    capacity: 200,
    equipment: ["projector", "audio_system", "microphone", "stage_lights"],
    building: "Academic Block D",
    floor: 0,
    is_lab: false,
  },
  // Add more classrooms...
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
