import React from 'react';
import Nav from '../components/Nav';
import { Phone, Mail, Clock, MapPin, Book, Users, Award, Briefcase } from 'lucide-react';
import Overlay from '../components/Overlay';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <Overlay />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-[#C7AC59] mb-8">About Highlands High School</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#341A00] text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-[#C7AC59] mb-4">Our Mission</h2>
            <p className="mb-4">
              At Highlands High School, we are dedicated to empowering students with knowledge, skills, and opportunities that prepare them for success in college, career, and life.
            </p>
            <div className="flex items-center mb-4">
              <Book className="text-[#C7AC59] mr-2" size={24} />
              <span>Rigorous academic programs</span>
            </div>
            <div className="flex items-center mb-4">
              <Users className="text-[#C7AC59] mr-2" size={24} />
              <span>Supportive learning community</span>
            </div>
            <div className="flex items-center mb-4">
              <Award className="text-[#C7AC59] mr-2" size={24} />
              <span>Extracurricular excellence</span>
            </div>
          </div>
          <div className="bg-[#341A00] text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-[#C7AC59] mb-4">Student Job Portal</h2>
            <p className="mb-4">
              Our Student Job Portal connects Highlands students with valuable work opportunities that complement their academic pursuits and prepare them for future careers.
            </p>
            <div className="flex items-center mb-4">
              <Briefcase className="text-[#C7AC59] mr-2" size={24} />
              <span>On-campus positions</span>
            </div>
            <div className="flex items-center mb-4">
              <Briefcase className="text-[#C7AC59] mr-2" size={24} />
              <span>Local internships</span>
            </div>
            <div className="flex items-center mb-4">
              <Briefcase className="text-[#C7AC59] mr-2" size={24} />
              <span>Part-time community jobs</span>
            </div>
          </div>
        </div>
        <div className="bg-[#341A00] text-white p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-2xl font-semibold text-[#C7AC59] mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <MapPin className="text-[#C7AC59] mr-2" size={24} />
              <span>1500 Pacific Avenue, Natrona Heights, PA 15065</span>
            </div>
            <div className="flex items-center">
              <Phone className="text-[#C7AC59] mr-2" size={24} />
              <span>(724)-226-2400</span>
            </div>
            <div className="flex items-center">
              <Mail className="text-[#C7AC59] mr-2" size={24} />
              <span>idontknowtheadminemail@goldenrams.org</span>
            </div>
            <div className="flex items-center">
              <Clock className="text-[#C7AC59] mr-2" size={24} />
              <span>Monday - Friday, 7:30 AM - 3:30 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
