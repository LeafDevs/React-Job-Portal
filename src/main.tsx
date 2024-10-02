import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './paths/homepage/App.tsx'
import Auth from './paths/auth/Auth.tsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import JobPostings from './paths/postings/postings.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <NextUIProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth" element={<Auth />} />
          <Route path='/postings' element={<JobPostings />}/>
        </Routes>
      </NextUIProvider>
    </Router>
  </StrictMode>,
)
