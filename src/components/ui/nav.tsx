// Import necessary dependencies
import { useState, useEffect } from 'react'
import { Sun, Moon, ChevronLeft, Home as HomeIcon, Briefcase as JobIcon, LogIn as AuthIcon, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom'
import t from '@/lib/translate'

export default function Nav() {
  // Initialize state variables
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === "dark")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en')
  const [languages, setTranslations] = useState({});
  const [isVisible, setIsVisible] = useState(true); // State to control visibility

  // Load translations for all supported languages on component mount
  useEffect(() => {
    const loadTranslations = async () => {
      const translations = {
        en: await t("English", "en"),
        es: await t("Spanish", "es"),
        de: await t("German", "de"),
        fr: await t("French", "fr"),
        it: await t("Italian", "it"),
        zh: await t("Chinese", "zh"),
        ja: await t("Japanese", "ja"),
        ar: await t("Arabic", "ar"),
        sw: await t("Swahili", "sw"),
        hi: await t("Hindi", "hi"),
        pt: await t("Portuguese", "pt"),
        ru: await t("Russian", "ru"),
        ko: await t("Korean", "ko"),
        tr: await t("Turkish", "tr"),
        nl: await t("Dutch", "nl"),
        pl: await t("Polish", "pl"),
        vi: await t("Vietnamese", "vi"),
        th: await t("Thai", "th"),
        id: await t("Indonesian", "id"),
        el: await t("Greek", "el"),
      };
      setTranslations(translations);
    };

    loadTranslations();
  }, []);

  // Update theme in localStorage and DOM when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // Update language preference in localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  // Handle language change and reload page to apply translations
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    window.location.reload();
  }
// Handle scroll event to hide/show the navigation
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY <= 100 && window.innerWidth < 768) { // Show when at the top
            setIsVisible(true); // Within top area
          } else if (window.scrollY > 100 && window.innerWidth < 768) { // Hide when scrolled down
            setIsVisible(false); // Not within top area
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    // Main navigation header with dark glass effect
    <header className={`bg-[rgba(0,0,0,0.4)] backdrop-blur-md fixed w-full z-50 transition-colors duration-300 shadow-lg drop-shadow-[0_5px_12px_rgba(0,0,0,0.4)] ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site title */}
          <div className="flex items-center cursor-pointer" onClick={() => window.location.href = '/'}>
            <img
              src="https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Template/GlobalAssets/images///Logos/H-Gold-2.png"
              alt="Highlands School District Logo"
              className="h-10 w-10 mr-2 md:h-14 md:w-14 md:mr-3"
            />
            <span className="text-lg md:text-xl font-semibold text-white dark:text-[#C7AC59]" data-notranslate>Highlands SD</span>
          </div>
          {/* Desktop navigation menu */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              {[
                { name: 'Home', icon: <HomeIcon className="h-6 w-6" />, path: "/" },
                { name: 'Jobs', icon: <JobIcon className="h-6 w-6" />, path: "/postings" },
                { name: localStorage.getItem('token') ? 'Dashboard' : 'Login', icon: <AuthIcon className="h-6 w-6" />, path: localStorage.getItem('token') ? "/dash" : "/auth" }
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    onClick={() => window.location.href = item.path}
                    className="flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium text-white dark:text-[#C7AC59] hover:text-[#A08339] dark:hover:text-[#C7AC59] transition-colors duration-300"
                  >
                    {item.icon}
                    <span className="mt-1 text-xs">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Right side controls (mobile menu, theme toggle, language selector) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile menu toggle button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden bg-transparent inline-flex items-center justify-center p-2 rounded-md text-white dark:text-[#C7AC59] hover:text-[#A08339] dark:hover:text-[#C7AC59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#341A00] focus:ring-[#C7AC59] transition-colors duration-300"
            >
              <ChevronLeft className={`h-6 w-6 ${isMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {/* Theme toggle button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="bg-white dark:bg-white p-2 rounded-full text-[#341A00] dark:text-[#341A00] hover:text-[#A08339] dark:hover:text-[#C7AC59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#341A00] focus:ring-[#C7AC59] transition-colors duration-300"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {/* Language selector dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-lg bg-[#C7AC59] hover:bg-[#341A00] cursor-pointer p-2">
                <Globe className="h-5 w-5 text-white" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(languages).map(([key, value]) => (
                  <DropdownMenuItem data-notranslate key={key} onClick={() => handleLanguageChange(key)}>
                    {value as string}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Mobile navigation menu with animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0, y: -20 }} // Slide up effect
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[rgba(0,0,0,0.4)] text-white w-full absolute left-0 drop-shadow-[0_5px_12px_rgba(0,0,0,0.8)]"
          >
            <ul className="flex flex-col space-y-4 p-4">
              {[
                { name: 'Home', icon: <HomeIcon className="h-6 w-6" />, path: "/" },
                { name: 'Jobs', icon: <JobIcon className="h-6 w-6" />, path: "/postings" },
                { name: 'Login', icon: <AuthIcon className="h-6 w-6" />, path: "/auth" }
              ].map((item, index) => (
                <motion.li key={item.name} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ delay: index * 0.1 }}>
                  <Link
                    to={item.path}
                    className="flex items-center block px-3 py-2 text-white rounded-md text-sm font-medium hover:text-[#A08339] dark:hover:text-[#C7AC59] transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}