export const teachers = [
  { id: 1, name: "Prof. Sharma", load: 12, department: "Mathematics", email: "sharma@university.edu" },
  { id: 2, name: "Dr. Patel", load: 18, department: "Physics", email: "patel@university.edu" },
  { id: 3, name: "Ms. Iyer", load: 20, department: "Computer Science", email: "iyer@university.edu" },
  { id: 4, name: "Prof. Kumar", load: 15, department: "Chemistry", email: "kumar@university.edu" },
  { id: 5, name: "Dr. Singh", load: 22, department: "Biology", email: "singh@university.edu" },
]

export const rooms = [
  { id: 1, name: "Room A", capacity: 40, utilization: 70, type: "Lecture Hall" },
  { id: 2, name: "Lab 1", capacity: 30, utilization: 90, type: "Computer Lab" },
  { id: 3, name: "Room B", capacity: 50, utilization: 60, type: "Lecture Hall" },
  { id: 4, name: "Lab 2", capacity: 25, utilization: 85, type: "Physics Lab" },
  { id: 5, name: "Auditorium", capacity: 200, utilization: 45, type: "Auditorium" },
]

export const timetable = [
  {
    day: "Monday",
    slot: "9:00-10:00",
    course: "Mathematics",
    teacher: "Prof. Sharma",
    room: "Room A",
    program: "B.Tech CSE",
  },
  { day: "Monday", slot: "10:00-11:00", course: "Physics", teacher: "Dr. Patel", room: "Lab 1", program: "B.Tech ECE" },
  {
    day: "Monday",
    slot: "11:00-12:00",
    course: "Data Structures",
    teacher: "Ms. Iyer",
    room: "Room B",
    program: "B.Tech CSE",
  },
  {
    day: "Tuesday",
    slot: "9:00-10:00",
    course: "Chemistry",
    teacher: "Prof. Kumar",
    room: "Lab 2",
    program: "B.Tech Chemical",
  },
  {
    day: "Tuesday",
    slot: "10:00-11:00",
    course: "Biology",
    teacher: "Dr. Singh",
    room: "Room A",
    program: "B.Sc Biology",
  },
  {
    day: "Tuesday",
    slot: "11:00-12:00",
    course: "Advanced Math",
    teacher: "Prof. Sharma",
    room: "Auditorium",
    program: "M.Tech",
  },
  {
    day: "Wednesday",
    slot: "9:00-10:00",
    course: "Quantum Physics",
    teacher: "Dr. Patel",
    room: "Room B",
    program: "M.Sc Physics",
  },
  {
    day: "Wednesday",
    slot: "10:00-11:00",
    course: "Algorithms",
    teacher: "Ms. Iyer",
    room: "Lab 1",
    program: "B.Tech CSE",
  },
  {
    day: "Thursday",
    slot: "9:00-10:00",
    course: "Organic Chemistry",
    teacher: "Prof. Kumar",
    room: "Lab 2",
    program: "B.Sc Chemistry",
  },
  {
    day: "Thursday",
    slot: "10:00-11:00",
    course: "Genetics",
    teacher: "Dr. Singh",
    room: "Room A",
    program: "B.Sc Biology",
  },
  {
    day: "Friday",
    slot: "9:00-10:00",
    course: "Machine Learning",
    teacher: "Ms. Iyer",
    room: "Lab 1",
    program: "M.Tech CSE",
  },
  {
    day: "Friday",
    slot: "10:00-11:00",
    course: "Statistical Mechanics",
    teacher: "Dr. Patel",
    room: "Room B",
    program: "M.Sc Physics",
  },
]

export const analyticsData = {
  teacherWorkload: teachers.map((t) => ({ name: t.name, load: t.load, maxLoad: 24 })),
  roomUtilization: rooms.map((r) => ({ name: r.name, utilization: r.utilization, capacity: r.capacity })),
  weeklySchedule: [
    { day: "Mon", classes: 8, conflicts: 0 },
    { day: "Tue", classes: 12, conflicts: 1 },
    { day: "Wed", classes: 10, conflicts: 0 },
    { day: "Thu", classes: 9, conflicts: 2 },
    { day: "Fri", classes: 7, conflicts: 0 },
  ],
}
