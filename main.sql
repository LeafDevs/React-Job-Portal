-- Create the database
CREATE DATABASE IF NOT EXISTS highlands;

-- Use the newly created database
USE highlands;

-- Create users table
CREATE TABLE users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type ENUM('student', 'admin', 'employer') NOT NULL
);

-- Create jobs table
CREATE TABLE jobs (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    employerID INT,
    description TEXT,
    icon TEXT,
    requirements TEXT,
    tags JSON,
    location VARCHAR(255),
    payPerHour DECIMAL(10, 2),
    title VARCHAR(255),
    questions JSON,
    FOREIGN KEY (employerID) REFERENCES users(ID)
);

-- Create applications table
CREATE TABLE applications (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    applicantID INT,
    jobID INT,
    questions JSON,
    FOREIGN KEY (applicantID) REFERENCES users(ID),
    FOREIGN KEY (jobID) REFERENCES jobs(ID)
);

-- Insert example users
INSERT INTO users (email, password, type) VALUES
('student@lesbians.monster', 'hashedpassword123', 'student'),
('admin@lesbians.monster', 'hashedpassword456', 'admin'),
('employer@lesbians.monster', 'hashedpassword789', 'employer');

-- Insert example jobs
INSERT INTO jobs (employerID, description, icon, requirements, tags, location, payPerHour, title, questions) VALUES
(3, 'Help needed at local cafe', 'coffee', 'No experience necessary', '["Food Service", "Customer Service"]', 'Downtown', 12.50, 'Cafe Assistant', '["Are you available on weekends?", "Do you have any food handling experience?"]'),
(3, 'Summer gardening position', 'plant', 'Must be able to lift 25lbs', '["Outdoor", "Physical Labor"]', 'Various locations', 15.00, 'Garden Helper', '["Do you have any allergies to plants?", "Are you comfortable working in hot weather?"]');

-- Insert example applications
INSERT INTO applications (applicantID, jobID, questions) VALUES
(1, 1, '{"Are you available on weekends?": "Yes", "Do you have any food handling experience?": "No, but I''m willing to learn"}'),
(1, 2, '{"Do you have any allergies to plants?": "No", "Are you comfortable working in hot weather?": "Yes"}');

