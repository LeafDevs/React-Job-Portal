import React, { useState, useEffect } from 'react';
import jwtDecode from "jwt-decode";
import { Plus, X, Eye, BarChart2, Users, Briefcase, Clock, Edit2, FileText, Clipboard, ClipboardCheck, MoreHorizontal, User, UserCheck, UserPlus, UserX } from 'lucide-react';
import Nav from '../components/Nav';
import Overlay from '../components/Overlay';

const getTimestamp = () => {
  return new Date().toISOString();
};

const Dashboard = () => {
  const [postings, setPostings] = useState([]);
  const [newPosting, setNewPosting] = useState({
    title: '',
    company: '',
    description: '',
    tags: [],
    applications: [],
  });
  const [selectedPosting, setSelectedPosting] = useState(null);
  const [isCreatingPosting, setIsCreatingPosting] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/v1/prism/auth/data', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log(`[${getTimestamp()}] Fetching user data with token:`, token);
          console.log(`[${getTimestamp()}] Response:`, response);
          const data = await response.json();
          console.log(`[${getTimestamp()}] Data:`, data);
          setUserName(`${data.user.FirstName} ${data.user.LastName}`);
          setUserType(data.user.Type);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPosting((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim());
    setNewPosting((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPostings((prev) => [...prev, { ...newPosting, id: Date.now(), applications: [] }]);
    setNewPosting({ title: '', company: '', description: '', tags: [], applications: [] });
    setIsCreatingPosting(false);
  };

  const handleDelete = (id) => {
    setPostings((prev) => prev.filter((posting) => posting.id !== id));
  };

  const handleViewApplications = (posting) => {
    setSelectedPosting(posting);
  };

  const closeApplicationsModal = () => {
    setSelectedPosting(null);
  };

  const totalApplications = postings.reduce((sum, posting) => sum + posting.applications.length, 0);
  const averageApplicationsPerPosting = postings.length > 0 ? totalApplications / postings.length : 0;

  return (
    <>
      <Nav />
      <Overlay />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-[#341A00] mb-8">Dashboard</h1>
        <p className="text-xl text-[#341A00] mb-8">Welcome, {userName}</p>
        <p className="text-lg text-[#341A00] mb-8">User Type: {userType}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postings.map((posting) => (
            <div key={posting.id} className="bg-white p-6 rounded-lg shadow-lg border-2 border-[#C7AC59] relative">
              <h2 className="text-2xl font-bold text-[#341A00] mb-2">{posting.title}</h2>
              <p className="text-[#C7AC59] mb-4">{posting.company}</p>
              <p className="text-[#341A00] mb-4">{posting.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {posting.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-[#341A00] text-white rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[#341A00] font-semibold">
                  Applications: {posting.applications.length}
                </p>
                <div className="relative">
                  <button
                    onClick={() => handleViewApplications(posting)}
                    className="bg-[#C7AC59] text-[#341A00] px-4 py-2 rounded hover:bg-[#D9BD6A] transition-colors flex items-center"
                  >
                    <Eye size={20} className="mr-2" />
                    View Applications
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden">
                    <button className="block w-full px-4 py-2 text-[#341A00] hover:bg-[#D9BD6A] transition-colors">
                      Edit
                    </button>
                    <button className="block w-full px-4 py-2 text-[#341A00] hover:bg-[#D9BD6A] transition-colors">
                      Contact
                    </button>
                    <button
                      onClick={() => handleDelete(posting.id)}
                      className="block w-full px-4 py-2 text-[#341A00] hover:bg-[#D9BD6A] transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#341A00]">Job Postings</h2>
          <button
            onClick={() => setIsCreatingPosting(true)}
            className="bg-[#341A00] text-white px-4 py-2 rounded hover:bg-[#4A2500] transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Create New Posting
          </button>
        </div>
        {isCreatingPosting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
              <h2 className="text-2xl font-semibold text-[#341A00] mb-4">Create New Posting</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-[#341A00] mb-2">Job Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newPosting.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border-2 border-[#C7AC59] rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="company" className="block text-[#341A00] mb-2">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={newPosting.company}
                    onChange={handleInputChange}
                    className="w-full p-2 border-2 border-[#C7AC59] rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-[#341A00] mb-2">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newPosting.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border-2 border-[#C7AC59] rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="tags" className="block text-[#341A00] mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={newPosting.tags.join(', ')}
                    onChange={handleTagChange}
                    className="w-full p-2 border-2 border-[#C7AC59] rounded"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCreatingPosting(false)}
                    className="mr-4 px-4 py-2 text-[#341A00] hover:text-[#4A2500]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#341A00] text-white px-4 py-2 rounded hover:bg-[#4A2500] transition-colors"
                  >
                    Create Posting
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {selectedPosting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#341A00] mb-4">
                Applications for {selectedPosting.title}
              </h2>
              {selectedPosting.applications.length === 0 ? (
                <p>No applications yet.</p>
              ) : (
                <ul>
                  {selectedPosting.applications.map((application, index) => (
                    <li key={index} className="mb-4 p-4 border-2 border-[#C7AC59] rounded">
                      <p><strong>Name:</strong> {application.name}</p>
                      <p><strong>Email:</strong> {application.email}</p>
                      <p><strong>Resume:</strong> <a href={application.resume} className="text-blue-500 underline">View Resume</a></p>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={closeApplicationsModal}
                className="mt-4 bg-[#341A00] text-white px-4 py-2 rounded hover:bg-[#4A2500] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
