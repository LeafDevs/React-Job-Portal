import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './paths/homepage/index.tsx'
import Auth from './paths/auth/recode.tsx'
import './index.css'
import Dashboard from '@/paths/dashboard/index.tsx'
import JobPostings from './paths/postings/recode2.tsx'
import Logout from '@/paths/logout/index.tsx'
import Posts from '@/paths/pending_posts/index.tsx'

import Apps from '@/paths/applications/index.tsx'
import AdminAccounts from './paths/accounts/index.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth" element={<Auth />} />
        <Route path='/postings' element={<JobPostings />}/>
        <Route path='/dash' element={<Dashboard />}/>
        <Route path='/logout' element={<Logout />}/>
        <Route path='/admin/posts' element={<Posts />}/>
        <Route path='/employer/applications' element={<Apps />}/>
        <Route path='/admin/accounts' element={<AdminAccounts />}/>
      </Routes>
  </Router>
)
