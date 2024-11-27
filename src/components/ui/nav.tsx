// Import necessary dependencies
import { useState, useEffect } from 'react'
import { Sun, Moon, Home as HomeIcon, Briefcase as JobIcon, LogIn as AuthIcon, Globe, Users, Library, Settings2, LogOut } from 'lucide-react'
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
import { EnvelopeOpenIcon } from '@radix-ui/react-icons'

interface User {
  name: string;
  email: string;
  profile_info: {
    profile_picture: string;
  };
}

export default function Nav() {
  // Initialize state variables
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === "dark")
  const [isMenuOpen, setIsMenuOpen] = useState(() => localStorage.getItem('isMenuOpen') === "true" || false)
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en')
  const [languages, setTranslations] = useState({});
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Load user data if logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token && window.location.pathname !== "/" && window.location.pathname !== "/auth") window.location.href = "/auth";
    if (token) {
      console.log('Fetching user data with token:', token);
      fetch('https://api.lesbians.monster/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Received user data:', data);
        if (data.code === 200) {
          console.log('Successfully set user data');
          setUser(data);
        } else if(data.code === 401 && data.error === "No user found") {
          console.log('No user found, redirecting to auth');
          localStorage.removeItem('token');
          window.location.href = "/auth";
        } else {
          console.log('Unexpected response code:', data.code);
        }
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack
        });
      });
    } else {
      console.log('No token found in localStorage');
    }
  }, []);

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

  useEffect(() => {
    localStorage.setItem('isMenuOpen', isMenuOpen.toString());
  }, [isMenuOpen]);

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
          if (window.scrollY <= 100 && window.innerWidth < 768) {
            setIsVisible(true);
          } else if (window.scrollY > 100 && window.innerWidth < 768) {
            setIsVisible(false);
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
    <header className={`bg-[rgba(0,0,0,0.6)] backdrop-blur-md fixed w-full z-[100] transition-all duration-300 shadow-lg ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site title */}
          <Link to="/" className="flex items-center z-[200]">
            <img
              src="https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Template/GlobalAssets/images///Logos/H-Gold-2.png"
              alt="Highlands School District Logo"
              className="h-10 w-10 mr-2 md:h-14 md:w-14 md:mr-3"
            />
            <span className="text-lg md:text-xl font-semibold text-white dark:text-[#C7AC59]" data-notranslate>Highlands SD</span>
          </Link>

          {/* Right side controls (hamburger menu, theme toggle, language selector) */}
          <div className="flex items-center space-x-2 md:space-x-4 transition-all duration-300 z-[200]">
            {/* Theme toggle button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="bg-white dark:bg-white p-2 rounded-full text-[#341A00] dark:text-[#341A00] hover:text-[#A08339] dark:hover:text-[#C7AC59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#341A00] focus:ring-[#C7AC59] transition-colors duration-300 z-[200]"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Language selector dropdown */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-lg bg-[#C7AC59] hover:bg-[#341A00] cursor-pointer p-2 transition-colors duration-300 z-[200]">
                  <Globe className="h-5 w-5 text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="absolute right-0 mt-2 max-h-[60vh] overflow-y-auto">
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

            {/* Hamburger menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              className="bg-transparent inline-flex items-center justify-center p-2 rounded-md text-white dark:text-[#C7AC59] hover:text-[#A08339] dark:hover:text-[#C7AC59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#341A00] focus:ring-[#C7AC59] transition-colors duration-300 relative z-[110]"
            >
              <svg 
                className={`h-5 w-5 transition-transform duration-200 ${isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`h-5 w-5 transition-transform duration-200 absolute top-2 left-2 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar navigation menu with animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[101] bg-black/20" 
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-screen w-full md:w-80 bg-zinc-900/95 backdrop-blur-sm shadow-xl overflow-y-auto flex flex-col pt-16"
              onClick={e => e.stopPropagation()}
            >
              {/* Navigation Header */}
              <div className="p-6 border-b border-zinc-700">
                <h2 className="text-xl font-semibold text-[#C7AC59]">Navigation</h2>
              </div>

              {/* Navigation Links */}
              <div className="flex-grow p-6">
                <ul className="space-y-6">
                  {[
                    { name: 'Home', icon: <HomeIcon className="h-5 w-5" />, path: "/" },
                    { name: 'Jobs', icon: <JobIcon className="h-5 w-5" />, path: "/postings" },
                    { name: 'Employers', icon: <Users className="h-5 w-5" />, path: "/employers" },
                    { name: 'Resources', icon: <Library className="h-5 w-5" />, path: "/training" },
                    ...(localStorage.getItem('token') ? [
                      { name: 'Messages', icon: <EnvelopeOpenIcon className="h-5 w-5" />, path: "/messages" },
                      { name: 'Settings', icon: <Settings2 className="h-5 w-5" />, path: "/settings" }
                    ] : []),
                    { 
                      name: localStorage.getItem('token') ? 'Dashboard' : 'Login', 
                      icon: <AuthIcon className="h-5 w-5" />, 
                      path: localStorage.getItem('token') ? "/dash" : "/auth" 
                    }
                  ].map((item) => (
                    <motion.li
                      key={item.name}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center space-x-4 text-zinc-100 hover:text-[#C7AC59] transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-[#C7AC59]">{item.icon}</span>
                        <span className="text-base font-medium">{item.name}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* User Profile Section */}
              {user ? (
                <div className="p-6 border-t border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <img 
                        src={user.profile_info?.profile_picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[#C7AC59] font-medium truncate">{user.name}</p>
                        <p className="text-zinc-400 text-sm truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/';
                      }}
                      className="text-zinc-400 hover:text-[#C7AC59] transition-colors duration-200 bg-transparent flex-shrink-0 ml-2"
                    >
                      <LogOut className="h-5 w-5 rotate-180" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 border-t border-zinc-700 flex items-center justify-between">
                  <p className="text-[#C7AC59] font-medium">Login</p>
                  <Link to="/auth">
                    <AuthIcon className="h-5 w-5 text-[#C7AC59] hover:text-zinc-100 transition-colors duration-200 bg-transparent" />
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}