import * as XLSX from 'xlsx'

export interface StudentEnrollmentTemplate {
  'Student ID': string
  'Student Name': string
  'Email': string
  'Course Code': string
  'Course Name': string
  'Semester': string
  'Program': string
  'Year': number
}

export const sampleEnrollmentData: StudentEnrollmentTemplate[] = [
  {
    'Student ID': 'STU001',
    'Student Name': 'Arjun Kumar',
    'Email': 'arjun.kumar@university.edu',
    'Course Code': 'CS101',
    'Course Name': 'Introduction to Computer Science',
    'Semester': 'Fall 2024',
    'Program': 'Computer Science',
    'Year': 2024
  },
  {
    'Student ID': 'STU002',
    'Student Name': 'Priya Sharma',
    'Email': 'priya.sharma@university.edu',
    'Course Code': 'CS101',
    'Course Name': 'Introduction to Computer Science',
    'Semester': 'Fall 2024',
    'Program': 'Computer Science',
    'Year': 2024
  },
  {
    'Student ID': 'STU003',
    'Student Name': 'Rohit Patel',
    'Email': 'rohit.patel@university.edu',
    'Course Code': 'MATH201',
    'Course Name': 'Calculus II',
    'Semester': 'Fall 2024',
    'Program': 'Mathematics',
    'Year': 2024
  },
  {
    'Student ID': 'STU004',
    'Student Name': 'Ananya Singh',
    'Email': 'ananya.singh@university.edu',
    'Course Code': 'ENG101',
    'Course Name': 'English Literature',
    'Semester': 'Fall 2024',
    'Program': 'English',
    'Year': 2024
  },
  {
    'Student ID': 'STU005',
    'Student Name': 'Vikram Gupta',
    'Email': 'vikram.gupta@university.edu',
    'Course Code': 'CS201',
    'Course Name': 'Data Structures',
    'Semester': 'Fall 2024',
    'Program': 'Computer Science',
    'Year': 2024
  },
  {
    'Student ID': 'STU006',
    'Student Name': 'Kavya Reddy',
    'Email': 'kavya.reddy@university.edu',
    'Course Code': 'PHYS101',
    'Course Name': 'Introduction to Physics',
    'Semester': 'Fall 2024',
    'Program': 'Physics',
    'Year': 2024
  },
  {
    'Student ID': 'STU007',
    'Student Name': 'Aditya Joshi',
    'Email': 'aditya.joshi@university.edu',
    'Course Code': 'CHEM101',
    'Course Name': 'General Chemistry',
    'Semester': 'Fall 2024',
    'Program': 'Chemistry',
    'Year': 2024
  },
  {
    'Student ID': 'STU008',
    'Student Name': 'Shreya Agarwal',
    'Email': 'shreya.agarwal@university.edu',
    'Course Code': 'BIO101',
    'Course Name': 'Introduction to Biology',
    'Semester': 'Fall 2024',
    'Program': 'Biology',
    'Year': 2024
  }
]

export function downloadSampleExcelFile() {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(sampleEnrollmentData)
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Student Enrollments')
    
    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })
    
    // Create blob and download
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sample_student_enrollments.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error creating Excel file:', error)
    return false
  }
}

export function downloadSampleCSVFile() {
  try {
    // Convert to CSV format
    const headers = Object.keys(sampleEnrollmentData[0])
    const csvContent = [
      headers.join(','),
      ...sampleEnrollmentData.map(row =>
        headers.map(header => `"${row[header as keyof StudentEnrollmentTemplate]}"`).join(',')
      )
    ].join('\n')
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sample_student_enrollments.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error creating CSV file:', error)
    return false
  }
}