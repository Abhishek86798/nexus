-- Insert sample data for demonstration
-- Sample Programs (5 programs as requested)
INSERT INTO programs (name, code, department, semester, credits) VALUES
('Computer Science Fundamentals', 'CS101', 'Computer Science', 1, 4),
('Data Structures and Algorithms', 'CS201', 'Computer Science', 3, 4),
('Database Management Systems', 'CS301', 'Computer Science', 5, 3),
('Machine Learning Basics', 'CS401', 'Computer Science', 7, 4),
('Software Engineering', 'CS501', 'Computer Science', 8, 3);

-- Sample Faculty (20 teachers as requested)
INSERT INTO faculty (name, email, department, specialization, max_hours_per_week, preferred_time_slots) VALUES
('Dr. Rajesh Sharma', 'rajesh.sharma@university.edu', 'Computer Science', 'Algorithms', 18, '["Morning 1", "Morning 2", "Morning 3"]'),
('Prof. Priya Patel', 'priya.patel@university.edu', 'Computer Science', 'Database Systems', 20, '["Morning 2", "Morning 3", "Afternoon 1"]'),
('Dr. Amit Kumar', 'amit.kumar@university.edu', 'Computer Science', 'Machine Learning', 16, '["Afternoon 1", "Afternoon 2"]'),
('Prof. Sunita Singh', 'sunita.singh@university.edu', 'Computer Science', 'Software Engineering', 18, '["Morning 1", "Morning 4", "Afternoon 1"]'),
('Dr. Vikram Gupta', 'vikram.gupta@university.edu', 'Computer Science', 'Data Science', 20, '["Morning 2", "Morning 3", "Afternoon 2"]'),
('Prof. Meera Joshi', 'meera.joshi@university.edu', 'Mathematics', 'Statistics', 16, '["Morning 1", "Morning 2"]'),
('Dr. Ravi Verma', 'ravi.verma@university.edu', 'Physics', 'Quantum Computing', 18, '["Afternoon 1", "Afternoon 2", "Afternoon 3"]'),
('Prof. Kavita Reddy', 'kavita.reddy@university.edu', 'Computer Science', 'Networks', 20, '["Morning 3", "Morning 4", "Afternoon 1"]'),
('Dr. Suresh Nair', 'suresh.nair@university.edu', 'Computer Science', 'Security', 16, '["Morning 1", "Afternoon 2"]'),
('Prof. Anita Desai', 'anita.desai@university.edu', 'Computer Science', 'HCI', 18, '["Morning 2", "Afternoon 1", "Afternoon 2"]'),
('Dr. Manoj Tiwari', 'manoj.tiwari@university.edu', 'Computer Science', 'Compilers', 20, '["Morning 1", "Morning 3", "Afternoon 3"]'),
('Prof. Deepa Agarwal', 'deepa.agarwal@university.edu', 'Mathematics', 'Discrete Math', 16, '["Morning 2", "Morning 4"]'),
('Dr. Ashok Mehta', 'ashok.mehta@university.edu', 'Computer Science', 'Graphics', 18, '["Afternoon 1", "Afternoon 2"]'),
('Prof. Rekha Iyer', 'rekha.iyer@university.edu', 'Computer Science', 'AI', 20, '["Morning 1", "Morning 2", "Morning 3"]'),
('Dr. Sanjay Pandey', 'sanjay.pandey@university.edu', 'Computer Science', 'Systems', 16, '["Morning 4", "Afternoon 1"]'),
('Prof. Neha Chopra', 'neha.chopra@university.edu', 'Computer Science', 'Web Tech', 18, '["Morning 2", "Afternoon 2", "Afternoon 3"]'),
('Dr. Rahul Saxena', 'rahul.saxena@university.edu', 'Computer Science', 'Mobile Dev', 20, '["Morning 3", "Afternoon 1", "Afternoon 2"]'),
('Prof. Pooja Bansal', 'pooja.bansal@university.edu', 'Computer Science', 'Cloud Computing', 16, '["Morning 1", "Afternoon 3"]'),
('Dr. Kiran Rao', 'kiran.rao@university.edu', 'Computer Science', 'IoT', 18, '["Morning 4", "Afternoon 1", "Afternoon 2"]'),
('Prof. Ajay Mishra', 'ajay.mishra@university.edu', 'Computer Science', 'Blockchain', 20, '["Morning 2", "Morning 3", "Afternoon 3"]');

-- Sample Classrooms (10 classrooms as requested)
INSERT INTO classrooms (name, type, capacity, equipment, building, floor) VALUES
('Room A101', 'classroom', 60, '["projector", "whiteboard", "audio_system"]', 'Academic Block A', 1),
('Room A102', 'classroom', 50, '["projector", "whiteboard"]', 'Academic Block A', 1),
('Lab B201', 'lab', 30, '["computers", "projector", "network"]', 'Academic Block B', 2),
('Lab B202', 'lab', 25, '["computers", "projector", "network", "servers"]', 'Academic Block B', 2),
('Room C301', 'classroom', 80, '["projector", "whiteboard", "audio_system", "microphone"]', 'Academic Block C', 3),
('Auditorium D001', 'auditorium', 200, '["projector", "audio_system", "microphone", "stage_lights"]', 'Academic Block D', 0),
('Room A201', 'classroom', 45, '["projector", "whiteboard"]', 'Academic Block A', 2),
('Lab C101', 'lab', 35, '["computers", "projector", "network", "3d_printers"]', 'Academic Block C', 1),
('Room B301', 'classroom', 55, '["projector", "whiteboard", "audio_system"]', 'Academic Block B', 3),
('Seminar Hall E201', 'classroom', 40, '["projector", "whiteboard", "video_conferencing"]', 'Academic Block E', 2);

-- Sample Students (200 students distributed across programs)
INSERT INTO students (name, email, student_id, program_id, semester) 
SELECT 
    'Student ' || generate_series,
    'student' || generate_series || '@university.edu',
    'STU' || LPAD(generate_series::text, 4, '0'),
    ((generate_series - 1) % 5) + 1, -- Distribute across 5 programs
    CASE 
        WHEN ((generate_series - 1) % 5) + 1 = 1 THEN 1
        WHEN ((generate_series - 1) % 5) + 1 = 2 THEN 3
        WHEN ((generate_series - 1) % 5) + 1 = 3 THEN 5
        WHEN ((generate_series - 1) % 5) + 1 = 4 THEN 7
        ELSE 8
    END
FROM generate_series(1, 200);

-- Sample Preferences with natural language inputs
INSERT INTO preferences (entity_type, entity_id, preference_text, constraint_type, priority, is_hard_constraint) VALUES
('faculty', 1, 'Prof. Sharma prefers morning slots', 'time_preference', 8, FALSE),
('faculty', 2, 'Prof. Patel needs lab access for database courses', 'room_preference', 9, TRUE),
('faculty', 3, 'Dr. Kumar prefers afternoon sessions for ML classes', 'time_preference', 7, FALSE),
('faculty', 4, 'Prof. Singh cannot teach on Friday afternoons', 'time_preference', 10, TRUE),
('faculty', 5, 'Dr. Gupta prefers rooms with projectors', 'room_preference', 6, FALSE),
('program', 1, 'CS101 should be scheduled in morning hours', 'time_preference', 7, FALSE),
('program', 2, 'Data Structures needs computer lab', 'room_preference', 9, TRUE),
('program', 3, 'Database course requires lab with servers', 'room_preference', 10, TRUE),
('classroom', 3, 'Lab B201 maintenance on Wednesdays 2-4 PM', 'availability', 10, TRUE),
('classroom', 6, 'Auditorium available only for large classes', 'capacity_constraint', 8, FALSE);
