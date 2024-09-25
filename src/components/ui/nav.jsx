import React, { useState, useEffect } from 'react';
import { Home, Briefcase, Info, LogIn, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { href: "/", icon: <Home className="mr-2" />, text: "Home" },
    { href: "/postings", icon: <Briefcase className="mr-2" />, text: "Jobs Portal" },
    { href: "/about", icon: <Info className="mr-2" />, text: "About" },
    { href: "/auth", icon: <LogIn className="mr-2" />, text: "Login" },
  ];

  return (
    <header className={`w-full py-2 bg-[#341A00] text-[#C7AC59] text-center shadow-lg flex flex-col items-center ${isMobile ? 'px-4' : ''}`}>
      <div className={`flex items-center ${isMobile ? 'w-full justify-between' : ''}`}>
        <img src="https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Template/GlobalAssets/images///Logos/H-Gold-2.png" alt="Highlands School District Logo" className="w-20 h-20 mr-4" />
        <h1 className="text-3xl font-bold">Highlands School District</h1>
        {isMobile && (
          <button onClick={toggleNav} className="text-[#C7AC59] hover:text-white">
            {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        )}
      </div>
      {isMobile ? (
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col items-start w-full mt-2"
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="hover:text-white flex items-center my-2 w-full"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.icon} {item.text}
                </motion.a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      ) : (
        <nav className="flex flex-wrap justify-center mt-2 space-x-4 md:space-x-24">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-white flex items-center">
              {item.icon} {item.text}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Nav;
