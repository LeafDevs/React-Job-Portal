import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Briefcase, Info, LogIn, Book, Users, Calendar, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import Nav from '@/components/ui/nav'
import './App.css'
import Footer from '@/components/ui/footer'
import Raleway from './fonts/Raleway.ttf'
import { motion } from 'framer-motion'; // Importing the animation library

function App() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const images = [
    "https://images.pexels.com/photos/5920740/pexels-photo-5920740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/1557228/pexels-photo-1557228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/4865744/pexels-photo-4865744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/5531228/pexels-photo-5531228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/2518078/pexels-photo-2518078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 6000); // Total time for each image

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setIsPaused(false); // Reset pause when changing image
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsPaused(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setIsPaused(false);
  };

  return (
    <div className={`bg-[#f7efd7] text-[#341A00] min-h-screen flex flex-col items-center justify-center w-full`}>
      <Nav />
      <main className="flex flex-col items-center mt-8">
        <h2 className="text-2xl mb-4">Welcome to Highlands High School</h2>
        <Card className="bg-[#341A00] text-[#C7AC59] p-6 rounded-lg shadow-lg w-3/4 relative">
          <CardHeader> </CardHeader>
          <CardContent>
            <motion.img 
              key={currentImageIndex} // Key to trigger animation on image change
              src={images[currentImageIndex]} 
              alt={`School image ${currentImageIndex + 1}`} 
              className={`w-full h-[35rem] object-cover rounded-lg`} 
              initial={{ opacity: 0, scale: 0.95 }} // Initial state with scale
              animate={{ opacity: 1, scale: 1 }} // Animate to full opacity and scale
              exit={{ opacity: 0, scale: 1.05 }} // Exit state with scale
              transition={{ duration: 1.5 }} // Duration of the transition
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center z-10">
              <button onClick={prevImage} className="p-2 bg-[#C7AC59] text-[#341A00] rounded flex items-center">
                <ChevronLeft size={16} />
              </button>
              <button onClick={togglePause} className="mx-2 p-2 bg-[#C7AC59] text-[#341A00] rounded flex items-center">
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button onClick={nextImage} className="p-2 bg-[#C7AC59] text-[#341A00] rounded flex items-center">
                <ChevronRight size={16} />
              </button>
            </div>
          </CardContent>
        </Card>
        <p><br></br></p>
        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-[#C7AC59] text-white p-6 rounded-lg">
            <CardContent className="text-center">
              <Home className="mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Our School</h3>
              <p>Explore our modern classrooms and facilities</p>
            </CardContent>
          </Card>
          <Card className="bg-[#C7AC59] text-white p-6 rounded-lg">
            <CardContent className="text-center">
              <Book className="mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Academics</h3>
              <p>Learn about our diverse course offerings</p>
            </CardContent>
          </Card>
          <Card className="bg-[#C7AC59] text-white p-6 rounded-lg">
            <CardContent className="text-center">
              <Users className="mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Student Life</h3>
              <p>Discover our clubs and extracurricular activities</p>
            </CardContent>
          </Card>
        </section>

        <Card className="bg-[#341A00] text-white p-8 rounded-lg mb-8" style={{ height: '100%', minWidth: 'calc(100vw - 64px)' }}>
          <CardContent>
            <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <Calendar className="mr-4" size={24} />
                <span>Halloween Party - October 31, 2024</span>
              </li>
              <li className="flex items-center">
                <Calendar className="mr-4" size={24} />
                <span>Thanksgiving Break - November 25-29, 2024</span>
              </li>
              <li className="flex items-center">
                <Calendar className="mr-4" size={24} />
                <span>Christmas Party - December 20, 2024</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-[#C7AC59] text-white p-8 rounded-lg mb-12">
          <CardContent className="flex">
            <div className="w-1/2 pr-4">
              <h2 className="text-3xl font-bold mb-4">About Highlands High School</h2>
              <p className="mb-4">
                Highlands High School is committed to providing a supportive and challenging learning environment for our students. Our dedicated faculty and staff work tirelessly to ensure each student reaches their full potential.
              </p>
              <p>
                With a focus on academic excellence, character development, and community involvement, we prepare our students for success in college and beyond. Join us in our mission to inspire, educate, and empower the leaders of tomorrow.
              </p>
              <p className="mt-4">
                Founded in 1965, Highlands High School has a rich history of academic achievement and community engagement. Our state-of-the-art facilities and diverse extracurricular programs offer students numerous opportunities to explore their interests and develop their talents.
              </p>
            </div>
            <div className="w-1/2 pl-4">
              <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
              <p className="mb-2"><strong>Phone:</strong> (555) 123-4567</p>
              <p className="mb-2"><strong>Email:</strong> info@highlandshigh.edu</p>
              <p className="mb-2"><strong>Address:</strong> 1234 Highland Ave, Highland City, HC 12345</p>
              <p className="mb-4"><strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 4:00 PM</p>
              <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
              <ul className="list-disc list-inside">
                <li>School Calendar</li>
                <li>Student Handbook</li>
                <li>Parent Portal</li>
                <li>Athletics</li>
                <li>Alumni Association</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      <Footer />
      </main>

    </div>
  )
}

export default App
