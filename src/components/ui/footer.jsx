import React from 'react';

const Footer = ({ className }) => {
  return (
    <footer className={`w-full py-4 bg-[#341A00] text-[#C7AC59] text-center fixed bottom-0 ${className}`}>
      <p className="m-0">&copy; 2024 Highlands High School. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

