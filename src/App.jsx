import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Briefcase, Info, LogIn } from 'lucide-react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-white text-[#341A00] min-h-screen flex flex-col items-center justify-center">
      <header className="w-full py-4 bg-[#341A00] text-[#C7AC59] text-center shadow-lg">
        <nav className="flex justify-around">
          <a href="#home" className="hover:text-white flex items-center">
            <Home className="mr-2" /> Home
          </a>
          <a href="#jobs" className="hover:text-white flex items-center">
            <Briefcase className="mr-2" /> Jobs Portal
          </a>
          <a href="#about" className="hover:text-white flex items-center">
            <Info className="mr-2" /> About
          </a>
          <a href="#login" className="hover:text-white flex items-center">
            <LogIn className="mr-2" /> Login
          </a>
        </nav>
        <h1 className="text-4xl font-bold mt-4">High School Homepage</h1>
      </header>
      <main className="flex flex-col items-center mt-8">
        <h2 className="text-2xl mb-4">Welcome to Our High School</h2>
        <Card className="bg-[#341A00] text-[#C7AC59] p-4 rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle>Counter</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="bg-[#C7AC59] text-[#341A00] py-2 px-4 rounded-lg hover:bg-[#341A00] hover:text-[#C7AC59] transition-colors shadow-md"
              onClick={() => setCount((count) => count + 1)}
            >
              Count is {count}
            </Button>
            <p className="mt-4">
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>
          </CardContent>
        </Card>
        <p className="mt-8 text-center">
          Click on the logos to learn more
        </p>
      </main>
      <footer className="w-full py-4 bg-[#341A00] text-[#C7AC59] text-center mt-auto shadow-lg">
        <p>&copy; 2023 High School. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
