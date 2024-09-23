import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import { Book, Users, Home, Calendar, Activity } from 'lucide-react';

const images = [
  'https://via.placeholder.com/800x400?text=Image+1',
  'https://via.placeholder.com/800x400?text=Image+2',
  'https://via.placeholder.com/800x400?text=Image+3'
];

const ImageScroller = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[600px] overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
};

const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Nav />
      <main className="container mx-auto mt-8 px-4">
        <ImageScroller />
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#C7AC59]">Welcome to Highlands High School</h1>
          <p className="text-[#341A00] text-xl mt-4">Empowering students, Shaping futures</p>
        </section>
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg text-center shadow-md">
            <Home className="mx-auto mb-4 text-[#C7AC59]" size={48} />
            <h3 className="text-2xl font-semibold mb-2 text-[#341A00]">Our School</h3>
            <p className="text-gray-700">Explore our modern classrooms and facilities</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-md">
            <Book className="mx-auto mb-4 text-[#C7AC59]" size={48} />
            <h3 className="text-2xl font-semibold mb-2 text-[#341A00]">Academics</h3>
            <p className="text-gray-700">Learn about our diverse course offerings</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-md">
            <Users className="mx-auto mb-4 text-[#C7AC59]" size={48} />
            <h3 className="text-2xl font-semibold mb-2 text-[#341A00]">Student Life</h3>
            <p className="text-gray-700">Discover our clubs and extracurricular activities</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-md">
            <Activity className="mx-auto mb-4 text-[#C7AC59]" size={48} />
            <h3 className="text-2xl font-semibold mb-2 text-[#341A00]">Events</h3>
            <p className="text-gray-700">Stay updated with our latest events</p>
          </div>
        </section>
        <section className="bg-[#341A00] text-white p-8 rounded-lg mb-12 shadow-md">
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <Calendar className="mr-4" size={24} />
              <span>Parent-Teacher Conferences - May 15, 2023</span>
            </li>
            <li className="flex items-center">
              <Calendar className="mr-4" size={24} />
              <span>Spring Sports Pep Rally - June 1, 2023</span>
            </li>
            <li className="flex items-center">
              <Calendar className="mr-4" size={24} />
              <span>Freshman Orientation - August 25, 2023</span>
            </li>
          </ul>
        </section>
        <section className="bg-white p-8 rounded-lg mb-12 shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-[#341A00]">About Highlands High School</h2>
          <p className="text-gray-700 mb-4">
            Highlands High School is committed to providing a supportive and challenging learning environment for our students. Our dedicated faculty and staff work tirelessly to ensure each student reaches their full potential.
          </p>
          <p className="text-gray-700">
            With a focus on academic excellence, character development, and community involvement, we prepare our students for success in college and beyond. Join us in our mission to inspire, educate, and empower the leaders of tomorrow.
          </p>
        </section>
      </main>
      <footer className="bg-[#341A00] text-white py-4 mt-12 shadow-md">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Highlands High School. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;