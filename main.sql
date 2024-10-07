-- users table
CREATE TABLE users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('student', 'employer', 'admin') NOT NULL,
    applications JSON DEFAULT '[]',
    uniqueID VARCHAR(255) NOT NULL,
    PRIMARY KEY (uniqueID)
);

CREATE TABLE applications (
    uniqueID VARCHAR(255) NOT NULL,
    jobID VARCHAR(255) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    questions_answers JSON DEFAULT '{}',
    PRIMARY KEY (uniqueID, jobID)
);

CREATE TABLE jobs (
    jobID VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    salary VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type ENUM('full-time', 'part-time', 'remote', 'internship') NOT NULL,
    posted_by VARCHAR(255) NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    questions JSON DEFAULT '[]',
    PRIMARY KEY (jobID)
);

INSERT INTO users (email, password, type, applications, uniqueID) VALUES
('student1@example.com', 'password123', 'student', '[]', 'uniqueID1'),
('student2@example.com', 'password123', 'student', '[]', 'uniqueID2'),
('employer1@example.com', 'password123', 'employer', '[]', 'uniqueID3'),
('admin1@example.com', 'password123', 'admin', '[]', 'uniqueID4'),
('student3@example.com', 'password123', 'student', '[]', 'uniqueID5'),
('employer2@example.com', 'password123', 'employer', '[]', 'uniqueID6'),
('admin2@example.com', 'password123', 'admin', '[]', 'uniqueID7'),
('student4@example.com', 'password123', 'student', '[]', 'uniqueID8'),
('employer3@example.com', 'password123', 'employer', '[]', 'uniqueID9'),
('student5@example.com', 'password123', 'student', '[]', 'uniqueID10');


INSERT INTO applications (uniqueID, jobID, status, date, questions_answers) VALUES
('uniqueID1', 'jobID1', 'pending', CURRENT_TIMESTAMP, '{}'),
('uniqueID2', 'jobID2', 'accepted', CURRENT_TIMESTAMP, '{}'),
('uniqueID3', 'jobID3', 'rejected', CURRENT_TIMESTAMP, '{}'),
('uniqueID4', 'jobID4', 'pending', CURRENT_TIMESTAMP, '{}'),
('uniqueID5', 'jobID5', 'accepted', CURRENT_TIMESTAMP, '{}'),
('uniqueID6', 'jobID6', 'rejected', CURRENT_TIMESTAMP, '{}'),
('uniqueID7', 'jobID7', 'pending', CURRENT_TIMESTAMP, '{}'),
('uniqueID8', 'jobID8', 'accepted', CURRENT_TIMESTAMP, '{}'),
('uniqueID9', 'jobID9', 'pending', CURRENT_TIMESTAMP, '{}'),
('uniqueID10', 'jobID10', 'rejected', CURRENT_TIMESTAMP, '{}');

INSERT INTO jobs (jobID, title, description, requirements, salary, location, type, posted_by) VALUES
('jobID1', 'Software Engineer', 'Develop and maintain software applications.', 'Bachelor\'s degree in Computer Science.', '$80,000', 'New York, NY', 'full-time', 'employer1@example.com'),
('jobID2', 'Data Analyst', 'Analyze data to help make business decisions.', 'Experience with SQL and data visualization tools.', '$70,000', 'San Francisco, CA', 'full-time', 'employer2@example.com'),
('jobID3', 'Graphic Designer', 'Create visual concepts to communicate ideas.', 'Proficiency in Adobe Creative Suite.', '$60,000', 'Remote', 'full-time', 'employer3@example.com'),
('jobID4', 'Project Manager', 'Oversee projects from inception to completion.', 'Strong leadership and communication skills.', '$90,000', 'Chicago, IL', 'full-time', 'employer1@example.com'),
('jobID5', 'Web Developer', 'Build and maintain websites.', 'Experience with HTML, CSS, and JavaScript.', '$75,000', 'Austin, TX', 'full-time', 'employer2@example.com'),
('jobID6', 'Marketing Specialist', 'Develop marketing strategies to promote products.', 'Experience in digital marketing.', '$65,000', 'Los Angeles, CA', 'full-time', 'employer3@example.com'),
('jobID7', 'Sales Associate', 'Assist customers and drive sales.', 'Strong interpersonal skills.', '$50,000', 'Miami, FL', 'part-time', 'employer1@example.com'),
('jobID8', 'Content Writer', 'Create engaging content for various platforms.', 'Excellent writing and editing skills.', '$55,000', 'Remote', 'full-time', 'employer2@example.com'),
('jobID9', 'UX/UI Designer', 'Design user-friendly interfaces for applications.', 'Experience with user research and design tools.', '$70,000', 'Seattle, WA', 'full-time', 'employer3@example.com'),
('jobID10', 'Intern', 'Assist with various tasks in the department.', 'Currently enrolled in a related degree program.', '$15/hour', 'Boston, MA', 'internship', 'employer1@example.com');


