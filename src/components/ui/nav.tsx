import { useState, useEffect } from 'react'
import { Menu, Sun, Moon, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Nav() {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === "dark")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  return (
    <header className={`bg-[#F5F5F5] dark:bg-[#341A00] backdrop-blur-md fixed w-full z-50 transition-colors duration-300 shadow-lg drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)]`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img
              src="https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Template/GlobalAssets/images///Logos/H-Gold-2.png"
              alt="Highlands School District Logo"
              className="h-10 w-10 mr-3"
            />
            <span className="text-xl font-semibold text-[#341A00] dark:text-[#C7AC59]">Highlands SD</span>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <AnimatePresence>
                {isMenuOpen && ['Home', 'About', 'Academics', 'Athletics', 'Contact'].map((item, index) => (
                  <motion.li key={item} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ delay: index * 0.1 }}>
                    <a
                      href="#"
                      className="px-3 py-2 rounded-md text-sm font-medium text-[#341A00] dark:text-[#C7AC59] hover:text-[#A08339] dark:hover:text-[#C7AC59] transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-transparent inline-flex items-center justify-center p-2 rounded-md text-[#341A00] dark:text-[#C7AC59] hover:text-[#A08339] dark:hover:text-[#C7AC59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#341A00] focus:ring-[#C7AC59] transition-colors duration-300 hover:bg-transparent hover:scale-110"
            >
              <ChevronLeft className={`h-6 w-6 ${isMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden bg-[#F5F5F5] dark:bg-[#341A00] w-full absolute top-16 left-0 drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)]"
                >
                  <ul className="flex flex-col space-y-4 p-4">
                    {['Home', 'About', 'Academics', 'Athletics', 'Contact'].map((item, index) => (
                      <motion.li key={item} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ delay: index * 0.1 }}>
                        <a
                          href="#"
                          className="block px-3 py-2 rounded-md text-sm font-medium text-[#341A00] dark:text-[#C7AC59] hover:text-[#A08339] dark:hover:text-[#C7AC59] transition-colors duration-300"
                        >
                          {item}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-[#F5F5F5] dark:bg-[#341A00] p-2 rounded-full text-[#341A00] dark:text-[#C7AC59] hover:text-[#A08339] dark:hover:text-[#C7AC59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#341A00] focus:ring-[#C7AC59] transition-colors duration-300"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-[#341A00] dark:text-[#341A00] bg-[#C7AC59] dark:bg-[#C7AC59] hover:text-[#C7AC59] hover:bg-[#341A00] dark:hover:bg-[#341A00] dark:hover:text-[#C7AC59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C7AC59] transition-colors duration-300"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}