-- AI Timetable Generation System Database Schema
-- Create tables for NEP 2020 aligned timetable system

-- Programs/Courses table
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL,
    credits INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty/Teachers table
CREATE TABLE IF NOT EXISTS faculty (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    max_hours_per_week INTEGER DEFAULT 20,
    preferred_time_slots TEXT, -- JSON array of preferred slots
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    program_id INTEGER REFERENCES programs(id),
    semester INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classrooms/Labs table
CREATE TABLE IF NOT EXISTS classrooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'classroom', 'lab', 'auditorium'
    capacity INTEGER NOT NULL,
    equipment TEXT, -- JSON array of available equipment
    building VARCHAR(50),
    floor INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time slots table
CREATE TABLE IF NOT EXISTS time_slots (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_name VARCHAR(50) NOT NULL -- e.g., "Morning 1", "Afternoon 2"
);

-- Timetable entries
CREATE TABLE IF NOT EXISTS timetable_entries (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id),
    faculty_id INTEGER REFERENCES faculty(id),
    classroom_id INTEGER REFERENCES classrooms(id),
    time_slot_id INTEGER REFERENCES time_slots(id),
    week_number INTEGER DEFAULT 1,
    academic_year VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'rescheduled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Preferences table for natural language constraints
CREATE TABLE IF NOT EXISTS preferences (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(20) NOT NULL, -- 'faculty', 'program', 'classroom'
    entity_id INTEGER NOT NULL,
    preference_text TEXT NOT NULL,
    constraint_type VARCHAR(50) NOT NULL, -- 'time_preference', 'room_preference', etc.
    priority INTEGER DEFAULT 5, -- 1-10 scale
    is_hard_constraint BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Disruption events for real-time rescheduling
CREATE TABLE IF NOT EXISTS disruption_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- 'faculty_absence', 'room_unavailable', etc.
    affected_entity_type VARCHAR(20) NOT NULL,
    affected_entity_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'resolved'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_timetable_program ON timetable_entries(program_id);
CREATE INDEX IF NOT EXISTS idx_timetable_faculty ON timetable_entries(faculty_id);
CREATE INDEX IF NOT EXISTS idx_timetable_classroom ON timetable_entries(classroom_id);
CREATE INDEX IF NOT EXISTS idx_timetable_timeslot ON timetable_entries(time_slot_id);
CREATE INDEX IF NOT EXISTS idx_preferences_entity ON preferences(entity_type, entity_id);
