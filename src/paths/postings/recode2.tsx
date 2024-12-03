'use client'

import { useEffect, useState } from 'react'
import { MapPin, Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"

// Define TypeScript interface for Job data structure
type Job = {
  title: string;
  company: string;
  location: string;
  description: string;
  payrate: number;
  tags: string[];
  icon: string;
  requirements: string;
  questions: string[];
  id: number;
};

export default function JobPostings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    answers: [] as string[]
  });
  const jobsPerPage = 6;

  useEffect(() => {
    document.title = 'Available Jobs | HHS';
    fetchJobs();
  }, []);

  const tags = ["office", "retail", "customer-service", "food-service", "teamwork", "warehouse", "logistics", "sales", "part-time", "full-time"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearTags = () => {
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setApplicationData({
      name: '',
      email: '',
      phone: '',
      coverLetter: '',
      answers: new Array(job.questions.length).fill('')
    });
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) return;

    const token = await localStorage.getItem('token');
    try {
      const response = await fetch(`https://api.lesbians.monster/jobs/apply/${selectedJob.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          ...applicationData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Success handling
      setShowApplicationModal(false);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const fetchJobs = async () => {
    const token = await localStorage.getItem('token');
    try {
      const response = await fetch('https://api.lesbians.monster/jobs', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const jobs = await response.json();
      setJobListings(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobListings([]); // Set empty array on error
    }
  };

  const filteredJobs = jobListings.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedTags.length === 0 || selectedTags.every(tag => job.tags.includes(tag)))
  );

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            currentPage === i 
              ? 'bg-[#C7AC59] text-white'
              : 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200'
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex flex-col">
      <Nav />
      <main className="container mx-auto px-4 py-24 flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 dark:text-zinc-100 text-center mb-4">
          Available Jobs
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-center text-lg mb-8">
          Find and apply for exciting job opportunities
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input 
              type="text"
              placeholder="Search jobs..."
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7AC59] dark:text-zinc-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowTagsDropdown(!showTagsDropdown)}
              className="h-12 px-6 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
              <Filter className="mr-2 h-5 w-5" />
              <span>Filter</span>
              {selectedTags.length > 0 && (
                <span className="ml-2 bg-[#C7AC59] text-white rounded-full px-2 py-0.5 text-sm">
                  {selectedTags.length}
                </span>
              )}
            </button>

            {showTagsDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-10 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold dark:text-zinc-100">Filter by Tags</h3>
                  {selectedTags.length > 0 && (
                    <button 
                      onClick={clearTags}
                      className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors duration-200 dark:bg-zinc-700 rounded-full px-2 py-1"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-[#C7AC59] text-white'
                          : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedTags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-[#C7AC59] text-white rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-2 hover:text-zinc-200 hover:bg-white hover:text-zinc-800 rounded-full p-0.5 transition-colors duration-200 text-zinc-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-zinc-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="bg-gradient-to-r from-[#C7AC59] to-[#B69B48] p-6 text-white">
                <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.company} • {job.location}</span>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#C7AC59]">${job.payrate}/hr</span>
                  <button 
                    onClick={() => handleApply(job)}
                    className="px-4 py-2 bg-[#C7AC59] hover:bg-[#B69B48] text-white rounded-lg transition-colors duration-200"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showApplicationModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mt-4 sm:mt-24">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100 pr-4">
                  Apply for {selectedJob.title}
                </h2>
                <button 
                  onClick={() => setShowApplicationModal(false)}
                  className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 bg-transparent flex-shrink-0"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSubmitApplication(); }} className="space-y-4 sm:space-y-6">
                {selectedJob.questions.map((question, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {question}
                    </label>
                    <textarea
                      required
                      value={applicationData.answers[index]}
                      onChange={(e) => {
                        const newAnswers = [...applicationData.answers];
                        newAnswers[index] = e.target.value;
                        setApplicationData({...applicationData, answers: newAnswers});
                      }}
                      className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 min-h-[80px] sm:min-h-[100px]"
                    />
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="w-full sm:w-auto px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 order-2 sm:order-1 bg-white dark:bg-zinc-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-[#C7AC59] hover:bg-[#B69B48] text-white rounded-lg transition-colors duration-200 order-1 sm:order-2"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {filteredJobs.length > jobsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
              className="p-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              First
            </button>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {renderPageNumbers()}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => paginate(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg disabled:opacity-50"
            >
              Last
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        )}
      </main>
      <Footer string="blocky" />
    </div>
  )
}
