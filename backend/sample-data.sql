-- Sample Data for Testing
-- Password for all users: "password123"
-- Bcrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

USE course_selection_db;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE waitlist;
TRUNCATE TABLE timetable;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE sections;
TRUNCATE TABLE courses;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Users
INSERT INTO users (name, email, password, role, active) VALUES
('Admin User', 'admin@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', TRUE),
('Dr. John Smith', 'john.smith@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', TRUE),
('Dr. Sarah Johnson', 'sarah.johnson@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', TRUE),
('Dr. Michael Brown', 'michael.brown@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TEACHER', TRUE),
('Alice Williams', 'alice@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', TRUE),
('Bob Davis', 'bob@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', TRUE),
('Charlie Miller', 'charlie@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', TRUE),
('Diana Wilson', 'diana@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', TRUE);

-- Insert Courses
INSERT INTO courses (name, credits, teacher_id) VALUES
('Data Structures and Algorithms', 4, 2),
('Database Management Systems', 3, 2),
('Web Development', 3, 3),
('Machine Learning', 4, 3),
('Computer Networks', 3, 4),
('Operating Systems', 4, 4),
('Software Engineering', 3, 2),
('Artificial Intelligence', 4, 3);

-- Insert Sections (4 sections per course)
-- Course 1: Data Structures
INSERT INTO sections (course_id, section_name, capacity, enrolled) VALUES
(1, 'A', 50, 15),
(1, 'B', 50, 20),
(1, 'C', 50, 10),
(1, 'D', 50, 5);

-- Course 2: Database Management
INSERT INTO sections (course_id, section_name, capacity, enrolled) VALUES
(2, 'A', 50, 25),
(2, 'B', 50, 30),
(2, 'C', 50, 18),
(2, 'D', 50, 12);

-- Course 3: Web Development
INSERT INTO sections (course_id, section_name, capacity, enrolled) VALUES
(3, 'A', 50, 35),
(3, 'B', 50, 40),
(3, 'C', 50, 22),
(3, 'D', 50, 15);

-- Course 4: Machine Learning
INSERT INTO sections (course_id, section_name, capacity, enrolled) VALUES
(4, 'A', 50, 45),
(4, 'B', 50, 48),
(4, 'C', 50, 30),
(4, 'D', 50, 20);

-- Course 5: Computer Networks
INSERT INTO sections (course_id, section_name, capacity, enrolled) VALUES
(5, 'A', 50, 28),
(5, 'B', 50, 32),
(5, 'C', 50, 25),
(5, 'D', 50, 18);

-- Course 6: Operating Systems
INSERT INTO sections (course_id, section_name, capacity, enrolled) VALUES
(6, 'A', 50, 38),
(6, 'B', 50, 42),
(6, 'C', 50, 35),
(6, 'D', 50, 28);

-- Course 7: Software Engineering
INSERT INTO sections (course_id, section_name, capacity, enrolled) VALUES
(7, 'A', 50, 20),
(7, 'B', 50, 25),
(7, 'C', 50, 15),
(7, 'D', 50, 10);

-- Course 8: Artificial Intelligence
INSERT INTO sections (course_id, section_name, capacity, enrolled) VALUES
(8, 'A', 50, 40),
(8, 'B', 50, 45),
(8, 'C', 50, 35),
(8, 'D', 50, 30);

SELECT 'Sample data inserted successfully!' as Status;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Courses' FROM courses;
SELECT COUNT(*) as 'Total Sections' FROM sections;
