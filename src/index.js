import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Postings from './sites/Postings';
import Auth from './sites/Auth';
import reportWebVitals from './reportWebVitals';
import Application from './sites/Application';
import About from './sites/About';
import Dashboard from './sites/Dashboard';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/postings" element={<Postings />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/application/:jobId" element={<Application />} />
        <Route path="/about" element={<About />} />
        <Route path="/dash" element={<Dashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
