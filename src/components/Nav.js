import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../fonts/Montserrat.ttf';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#341A00] text-white p-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="container mx-auto flex justify-between items-center"> 
        <Link to="/" className="md:block">
          <img src="https://www.goldenrams.com/cms/lib/PA01000390/Centricity/Template/GlobalAssets/images///Logos/H-Gold-2.png" alt="Highlands Logo" className="h-12" />
        </Link>
        <nav className={`md:flex md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 md:opacity-100 md:max-h-full'}`}>
          <Link to="/" className="block md:inline-block hover:text-[#C7AC59] py-2 md:py-0">Home</Link>
          <Link to="/about" className="block md:inline-block hover:text-[#C7AC59] py-2 md:py-0">About</Link>
          <Link to="/postings" className="block md:inline-block hover:text-[#C7AC59] py-2 md:py-0">Student Jobs</Link>
          <Link to="/auth" className="block md:inline-block hover:text-[#C7AC59] py-2 md:py-0">Login</Link>
          <Link to="/about" className="block md:inline-block hover:text-[#C7AC59] py-2 md:py-0">Contact</Link>
        </nav>
        <button className="md:hidden transition-transform duration-300 ease-in-out" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} className="transform rotate-90" /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Nav;
