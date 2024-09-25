import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './App'
import Auth from './paths/Auth'
import Postings from './paths/Postings'
import './index.css'

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container missing in index.html');
}

createRoot(container).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/postings" element={<Postings />} />
      </Routes>
    </Router>
  </StrictMode>,
)
