import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './paths/homepage/index.tsx'
import Auth from './paths/auth/index.tsx'
import './index.css'
import Dashboard from '@/paths/dashboard/index.tsx'
import JobPostings from './paths/postings/recode.tsx'
import Logout from '@/paths/logout/index.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<Auth />} />
        <Route path='/postings' element={<JobPostings />}/>
        <Route path='/dash' element={<Dashboard />}/>
        <Route path='/logout' element={<Logout />}/>
      </Routes>
  </Router>
)
