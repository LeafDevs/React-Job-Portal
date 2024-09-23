import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-[#341A00] flex items-center justify-between p-4 mb-4" style={{ fontFamily: 'Raleway', fontWeight: '700' }}>
      <div className="flex items-center">
        <img 
          src="https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Template/GlobalAssets/images///Logos/H-Gold-2.png" 
          alt="Logo" 
          className="h-12"
        />
        <span className="text-white ml-2 text-lg">Highlands School District</span>
      </div>
      <button className="text-white md:hidden" onClick={toggleMenu}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      <nav className={`flex-col md:flex-row md:flex space-x-4 ${isOpen ? 'flex' : 'hidden'} md:flex`}>
        <a href="/" className="text-white hover:text-[#C7AC59] font-bold">Home</a>
        <a href="/about" className="text-white hover:text-[#C7AC59] font-bold">About</a>
        <a href="/postings" className="text-white hover:text-[#C7AC59] font-bold">Jobs Portal</a>
        <a href="/auth" className="text-white hover:text-[#C7AC59] font-bold">Login</a>
      </nav>
    </header>
  );
};

export default Nav;


