const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'prism'
});

const users = [];
const jobs = [];
const applications = [];



db.connect((err) => {
  if (err) {
    console.error(`[${getTimestamp()}] Error connecting to the database:`, err);
    return;
  }
  console.log(`[${getTimestamp()}] Connected to the MariaDB database.`);

  // Fetch users from the database
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(`[${getTimestamp()}] Error fetching users:`, err);
      return;
    }
    users.push(...results);
    console.log(`[${getTimestamp()}] Successfully fetched users`);
    console.log(users);
  });

  // Fetch jobs from the database
  db.query('SELECT * FROM jobs', (err, results) => {
    if (err) {
      console.error(`[${getTimestamp()}] Error fetching jobs:`, err);
      return;
    }
    jobs.push(...results);
    console.log(`[${getTimestamp()}] Successfully fetched jobs`);
    console.log(jobs);
  });

  // Fetch applications from the database
  db.query('SELECT * FROM applications', (err, results) => {
    if (err) {
      console.error(`[${getTimestamp()}] Error fetching applications:`, err);
      return;
    }
    applications.push(...results);
    console.log(`[${getTimestamp()}] Successfully fetched applications`);
    console.log(applications);
  });

  
});

// Function to get current timestamp
const getTimestamp = () => {
  return new Date().toISOString();
};

app.get('/api/v1/prism/applications/:jobId', (req, res) => {
  const { jobId } = req.params;
  console.log(`[${getTimestamp()}] GET request to '/api/v1/prism/applications/${jobId}'`);
  
  const jobApplications = applications.filter(app => app.job_id === parseInt(jobId));

  if (jobApplications.length === 0) {
    console.log(`[${getTimestamp()}] No applications found for job ID ${jobId}`);
    res.status(404).send('No applications found');
    return;
  }

  console.log(`[${getTimestamp()}] Successfully fetched applications for job ID ${jobId}`);
  res.json(jobApplications);
});


app.get('/api/v1/prism/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  console.log(`[${getTimestamp()}] GET request to '/api/v1/prism/jobs/${jobId}'`);

  const job = jobs.find(job => job.id === parseInt(jobId));

  if (!job) {
    console.log(`[${getTimestamp()}] Job not found for ID ${jobId}`);
    res.status(404).send('Job not found');
    return;
  }

  console.log(`[${getTimestamp()}] Successfully fetched job for ID ${jobId}`);
  res.json(job);
});



app.post('/api/v1/prism/applications/:jobId/', (req, res) => {
  const { jobId } = req.params;
  const { questions } = req.body;

  console.log(`[${getTimestamp()}] POST request to '/api/v1/prism/applications/${jobId}'`);
  console.log(`[${getTimestamp()}] Application data:`, { user_id: 1, questions });

  // Generate a unique ID for the new application
  const newApplicationId = applications.length + 1;

  // Create a new application object
  const newApplication = {
    id: newApplicationId,
    job_id: parseInt(jobId),
    user_id: 1,
    status: 'submitted',
    submitted_at: new Date(),
    questions: JSON.stringify(questions)
  };

  // Add the new application to the applications array
  applications.push(newApplication);

  // Save the new application to the database
  db.query('INSERT INTO applications SET ?', newApplication, (err, result) => {
    if (err) {
      console.error(`[${getTimestamp()}] Error saving application:`, err);
      res.status(500).json({ error: 'Failed to save application' });
      return;
    }

    console.log(`[${getTimestamp()}] Successfully saved application for job ID ${jobId}`);
    res.status(201).json({ message: 'Application submitted successfully', applicationId: newApplicationId });
  });
});

app.get('/api/v1/prism/applications/:jobId/:applicationId', (req, res) => {
  const { jobId, applicationId } = req.params;
  console.log(`[${getTimestamp()}] GET request to '/api/v1/prism/applications/${jobId}/${applicationId}'`);

  const application = applications.find(app => app.id === parseInt(applicationId) && app.job_id === parseInt(jobId));

  if (!application) {
    console.log(`[${getTimestamp()}] Application not found for job ID ${jobId} and application ID ${applicationId}`);
    res.status(404).send('Application not found');
    return;
  }

  console.log(`[${getTimestamp()}] Successfully fetched application for job ID ${jobId} and application ID ${applicationId}`);
  res.json(application);
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`[${getTimestamp()}] Server is running on port ${port}`);
});
