'use client'

// Import UI components from local component library
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MapPin, AlertCircle, TagIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import * as icons from 'lucide-react'
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
  icon: keyof typeof icons;
  requirements: string;
  questions: string[];
  id: number;
};

export default function JobPostings() {
  // State management for search, filtering, pagination and job data
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [appPage, setAppPage] = useState(1);
  const jobsPerPage = 8; // Number of jobs to display per page

  // Set page title on component mount
  useEffect(() => {
    document.title = 'Available Jobs| HHS';
  }, []);

  // Validate user authentication on component mount
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      // Redirect to auth page if no token exists
      if (!token) {
        window.location.href = '/auth';
        return;
      }

      try {
        // Verify token validity with API
        const response = await fetch('http://localhost:3000/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Handle invalid token
        if (!response.ok) {
          localStorage.removeItem('token');
          window.location.href = '/auth';
          return;
        }

        // Fetch jobs if token is valid
        fetchJobs();
      } catch (error) {
        console.error('Error validating token:', error);
        localStorage.removeItem('token');
        window.location.href = '/auth';
      }
    };

    validateToken();
  }, []);

  // Fetch job listings from API
  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:3000/jobs', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.error('Response not OK:', response.status, response.statusText);
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        console.log('Received raw job data:', data);
        
        // Format job data and ensure proper data types
        const formattedJobs: Job[] = data.map((job: any) => ({
          ...job,
          payrate: parseFloat(job.payrate),
          tags: Array.isArray(job.tags) ? job.tags : [],
        }));
        
        console.log('Formatted jobs:', formattedJobs);
        setJobListings(formattedJobs);
        if (formattedJobs.length > 0) {
          console.log('Setting current job to:', formattedJobs[0]);
          setCurrentJob(formattedJobs[0]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    } else {
      console.warn('No token found in localStorage');
      window.location.href = '/auth';
    }
  };

  // Filter jobs based on search term and selected tags
  const filteredJobs = jobListings.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.payrate.toString().includes(searchTerm)) &&
    (selectedTags.length === 0 || selectedTags.some(tag => job.tags.includes(tag)))
  );

  // Available job tags for filtering
  const tags = ["Office", "Retail", "Customer Service", "Food Service", "Teamwork", "Warehouse", "Logistics", "Sales", "Part Time", "Full Time"]

  // Toggle tag selection for filtering
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Handle job application submission
  const handleSubmit = async () => {
    if (!currentJob) return;
    
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3000/jobs/apply/${currentJob.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          answers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Reset application state after successful submission
      setIsDialogOpen(false);
      setAnswers([]);
      setAppPage(1);
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  // Open application dialog and initialize answers array
  const openDialog = (job: Job) => {
    setCurrentJob(job);
    setAnswers(Array(job.questions.length).fill(''));
    setIsDialogOpen(true);
  };

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Update current page number
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Render component UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex flex-col">
      <Nav />
      <main className="container mx-auto px-6 py-24 flex-grow">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 dark:text-white text-center mb-4">
            Available Jobs
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 text-center text-lg">
            Find and apply for job opportunities
          </p>
        </div>

        {/* Search and filter section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input 
              type="text"
              placeholder="Search jobs..."
              className="w-full h-12 pl-12 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-12 px-6 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-xl">
                <TagIcon className="mr-2 h-5 w-5" />
                <span>Filter Tags</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Job Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {tags.map(tag => (
                <DropdownMenuCheckboxItem 
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Job listings grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <Card key={job.id} className="bg-white dark:bg-zinc-800 border-0 shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden">
                <CardHeader className="bg-[#C7AC59] text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold mb-2">{job.title}</CardTitle>
                      <div className="flex items-center text-zinc-100">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.company} • {job.location}</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">${job.payrate}/hr</div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <p className="text-zinc-600 dark:text-zinc-300 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                    <h4 className="font-medium text-zinc-800 dark:text-white mb-2">Requirements:</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{job.requirements}</p>
                  </div>
                </CardContent>

                <CardFooter className="p-6 bg-zinc-50 dark:bg-zinc-900">
                  <Button 
                    onClick={() => openDialog(job)}
                    className="w-full bg-[#C7AC59] hover:bg-[#B69B48] text-white"
                  >
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-zinc-500 dark:text-zinc-400">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-xl font-medium">No jobs found</p>
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {filteredJobs.length > jobsPerPage && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-zinc-800 dark:text-white">
              Page {currentPage} of {Math.ceil(filteredJobs.length / jobsPerPage)}
            </span>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
              className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Job application dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white dark:bg-zinc-800">
            <DialogHeader>
              <DialogTitle>Apply for {currentJob?.title}</DialogTitle>
              <DialogDescription>
                Please answer the following questions to complete your application
              </DialogDescription>
            </DialogHeader>

            {currentJob?.questions.slice((appPage - 1) * 2, appPage * 2).map((question, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">{question}</label>
                <Input
                  value={answers[(appPage - 1) * 2 + index] || ''}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[(appPage - 1) * 2 + index] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  className="w-full"
                />
              </div>
            ))}

            <DialogFooter className="flex justify-between">
              <Button
                onClick={() => setAppPage(appPage - 1)}
                disabled={appPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              
              {appPage * 2 >= (currentJob?.questions.length || 0) ? (
                <Button onClick={handleSubmit} className="bg-[#C7AC59] hover:bg-[#B69B48] text-white">
                  Submit Application
                </Button>
              ) : (
                <Button
                  onClick={() => setAppPage(appPage + 1)}
                  className="bg-[#C7AC59] hover:bg-[#B69B48] text-white"
                >
                  Next
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer string="blocky" />
    </div>
  )
}