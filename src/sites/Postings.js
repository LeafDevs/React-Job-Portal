import React, { useState } from 'react';
import { Search, Tag, Filter, Menu, X } from 'lucide-react';
import Nav from '../components/Nav';
import Overlay from '../components/Overlay';

const jobPostings = [
  { id: 1, title: 'Cashier', company: 'FastFood Co.', tags: ['Fast Food'], description: 'Handle customer transactions and maintain a clean work area.' },
  { id: 2, title: 'Sales Associate', company: 'Retail Store', tags: ['Retail'], description: 'Assist customers, manage inventory, and maintain store appearance.' },
  { id: 3, title: 'Barista', company: 'Coffee Shop', tags: ['Fast Food', 'Retail'], description: 'Prepare and serve coffee drinks, handle cash register, and maintain cleanliness.' },
  { id: 4, title: 'Data Entry Clerk', company: 'Office Solutions Inc.', tags: ['Office', 'Tech'], description: 'Input and manage data in company databases with high accuracy.' },
  { id: 5, title: 'Warehouse Associate', company: 'Logistics Pro', tags: ['Warehouse', 'Physical Labor'], description: 'Handle inventory, pack orders, and maintain a clean warehouse environment.' },
  { id: 6, title: 'Customer Service Representative', company: 'TeleCare', tags: ['Customer Service', 'Office'], description: 'Answer customer inquiries and resolve issues via phone and email.' },
  { id: 7, title: 'Junior Web Developer', company: 'Tech Innovators', tags: ['Tech', 'Programming'], description: 'Assist in developing and maintaining web applications using modern technologies.' },
  { id: 8, title: 'Delivery Driver', company: 'Swift Deliveries', tags: ['Driving', 'Customer Service'], description: 'Deliver packages to customers in a timely and professional manner.' },
  { id: 9, title: 'Graphic Designer', company: 'Creative Minds Agency', tags: ['Design', 'Tech'], description: 'Create visually appealing designs for various marketing materials.' },
  { id: 10, title: 'Hotel Receptionist', company: 'Luxury Stays', tags: ['Hospitality', 'Customer Service'], description: 'Welcome guests, manage reservations, and ensure a pleasant stay for all visitors.' },
  { id: 11, title: 'Personal Trainer', company: 'FitLife Gym', tags: ['Fitness', 'Customer Service'], description: 'Guide clients through personalized workout routines and provide nutritional advice.' },
  { id: 12, title: 'Social Media Manager', company: 'Viral Marketing', tags: ['Marketing', 'Tech'], description: 'Manage social media accounts and create engaging content for various platforms.' },
  { id: 13, title: 'Landscaper', company: 'Green Thumb Gardens', tags: ['Outdoor', 'Physical Labor'], description: 'Maintain and improve outdoor spaces for residential and commercial clients.' },
  { id: 14, title: 'Tutor', company: 'BrainBoost Education', tags: ['Education', 'Flexible Hours'], description: 'Provide one-on-one or small group instruction in various academic subjects.' },
  { id: 15, title: 'Bank Teller', company: 'Community First Bank', tags: ['Finance', 'Customer Service'], description: 'Process customer transactions and provide information on banking services.' },
  { id: 16, title: 'Security Guard', company: 'SafeGuard Securities', tags: ['Security', 'Night Shift'], description: 'Monitor premises and ensure the safety of people and property.' },
  { id: 17, title: 'Line Cook', company: 'Gourmet Bites Restaurant', tags: ['Food Service', 'Fast-Paced'], description: 'Prepare ingredients and cook menu items in a busy kitchen environment.' },
  { id: 18, title: 'Photographer', company: 'Capture Moments Studio', tags: ['Creative', 'Flexible Hours'], description: 'Take and edit photos for various events and clients.' },
  { id: 19, title: 'Uber Driver', company: 'Uber', tags: ['Driving', 'Flexible Hours'], description: 'Transport passengers to their destinations safely and efficiently.' },
  { id: 20, title: 'Virtual Assistant', company: 'Remote Helpers', tags: ['Remote', 'Admin'], description: 'Provide administrative support to clients from a remote location.' },
  { id: 21, title: 'Dog Walker', company: 'Happy Tails Pet Services', tags: ['Animals', 'Outdoor'], description: 'Walk and care for dogs while their owners are away.' },
  { id: 22, title: 'Bookkeeper', company: 'Numbers & Beyond', tags: ['Finance', 'Office'], description: 'Maintain financial records and assist with accounting tasks for small businesses.' },
  { id: 23, title: 'Event Planner', company: 'Stellar Events', tags: ['Hospitality', 'Creative'], description: 'Organize and coordinate various events from conception to execution.' },
  { id: 24, title: 'IT Support Technician', company: 'TechFix Solutions', tags: ['Tech', 'Customer Service'], description: 'Provide technical support and troubleshoot computer issues for clients.' },
  { id: 25, title: 'Content Writer', company: 'WordCraft Media', tags: ['Writing', 'Remote'], description: 'Create engaging written content for websites, blogs, and marketing materials.' },
  { id: 26, title: 'Yoga Instructor', company: 'Zen Wellness Center', tags: ['Fitness', 'Flexible Hours'], description: 'Lead yoga classes for students of various skill levels.' },
  { id: 27, title: 'Electrician Apprentice', company: 'Bright Spark Electric', tags: ['Trade', 'Physical Labor'], description: 'Assist licensed electricians and learn the trade through hands-on experience.' },
  { id: 28, title: 'Museum Guide', company: 'City History Museum', tags: ['Education', 'Customer Service'], description: 'Lead tours and provide information about museum exhibits to visitors.' }
];

const Postings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags] = useState(['Fast Food', 'Retail', 'Office', 'Tech', 'Warehouse', 'Physical Labor', 'Customer Service', 'Programming', 'Driving', 'Design', 'Hospitality', 'Fitness', 'Marketing', 'Outdoor', 'Education', 'Flexible Hours', 'Finance', 'Security', 'Night Shift', 'Food Service', 'Fast-Paced', 'Creative', 'Remote', 'Admin', 'Animals', 'Writing', 'Trade']);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);

  const filteredPostings = jobPostings.filter(posting =>
    (posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     posting.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
     posting.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
     posting.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedTags.length === 0 || selectedTags.some(tag => posting.tags.includes(tag)))
  );

  const handleApply = (postingId) => {
    // Implement the apply functionality here
    console.log(`Applied to posting with ID: ${postingId}`);
  };

  const toggleTagMenu = () => {
    setIsTagMenuOpen(!isTagMenuOpen);
  };

  return (
    <>
      <Nav />
      <Overlay />
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold text-[#C7AC59] mb-8">Job Postings</h1>
        
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs, companies, tags, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pr-12 text-[#341A00] border-2 border-[#C7AC59] rounded-lg focus:outline-none focus:border-[#341A00] transition-colors"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#C7AC59]" />
          </div>
        </div>

        <div className="mb-6 relative">
          <button
            onClick={toggleTagMenu}
            className="flex items-center bg-[#C7AC59] text-[#341A00] px-4 py-2 rounded-lg hover:bg-[#341A00] hover:text-white transition-colors"
          >
            <Filter size={20} className="mr-2" />
            Filter by Tags
          </button>

          <div className={`absolute left-0 mt-2 w-64 bg-white border-2 border-[#C7AC59] rounded-lg shadow-lg transition-all duration-300 ease-in-out ${isTagMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-[#341A00] mb-2">Select Tags</h2>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(prev => 
                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                    )}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag)
                        ? 'bg-[#341A00] text-white'
                        : 'bg-[#C7AC59] text-[#341A00]'
                    } transition-colors`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPostings.map(posting => (
            <div key={posting.id} className="bg-white p-6 rounded-lg shadow-lg border-2 border-[#C7AC59]">
              <h2 className="text-2xl font-bold text-[#341A00] mb-2">{posting.title}</h2>
              <p className="text-[#C7AC59] mb-4">{posting.company}</p>
              <p className="text-[#341A00] mb-4">{posting.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {posting.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#341A00] text-white rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleApply(posting.id)}
                className="w-full bg-[#C7AC59] text-[#341A00] font-semibold py-2 px-4 rounded hover:bg-[#341A00] hover:text-white transition-colors"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Postings;
