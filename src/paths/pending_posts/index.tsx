'use client'

// Import UI components and icons
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MapPin, AlertCircle, TagIcon, Search, ChevronLeft, ChevronRight, X, Check, HelpCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import * as icons from 'lucide-react'
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

// Define Job type interface
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
  // State management for search, filtering, and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [answers,setAnswers] = useState<string[]>([]);
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const jobsPerPage = 8;

  // Fetch job listings from the API
  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    console.log('Fetching jobs with token:', token);
    if (token) {
      try {
        console.log('Making request to fetch inactive jobs...');
        const response = await fetch('http://localhost:3000/jobs/fetch_inactive', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // Handle error responses
        if (!response.ok) {
          setError(data.error || 'Failed to fetch jobs');
          setJobListings([]);
          return;
        }

        // Validate data format
        if (!Array.isArray(data)) {
          setError('Invalid data format received from server');
          setJobListings([]);
          return;
        }
        
        // Format job data and update state
        const formattedJobs: Job[] = data.map((job: any) => ({
          ...job,
          payrate: parseFloat(job.payrate),
          tags: Array.isArray(job.tags) ? job.tags : [],
        }));
        
        console.log('Formatted jobs:', formattedJobs);
        setJobListings(formattedJobs);
        setError(null);
        
        if (formattedJobs.length > 0) {
          console.log('Setting current job to:', formattedJobs[0]);
          setCurrentJob(formattedJobs[0]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to fetch jobs. Please try again later.');
        setJobListings([]);
      }
    } else {
      console.warn('No token found in localStorage');
      setError('Please log in to view job listings');
    }
  };

  // Check user authentication and admin status on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = "/auth";
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data');
        }

        // Redirect non-admin users
        if (data.type !== 'admin') {
          window.location.href = "/dash";
          return;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        window.location.href = "/dash";
      }
    };

    fetchUserData();
    fetchJobs();
  }, []);

  // Filter jobs based on search term and selected tags
  const filteredJobs = jobListings.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.payrate.toString().includes(searchTerm)) &&
    (selectedTags.length === 0 || selectedTags.some(tag => job.tags.includes(tag)))
  );

  // Debug logging for job listings
  jobListings.forEach(job => {
    console.log(`Job Title: ${job.title}, Tags: ${job.tags.join(', ')}`);
    console.log(job)
  });

  // Available job tags for filtering
  const tags = ["Office", "Retail", "Customer Service", "Food Service", "Teamwork", "Warehouse", "Logistics", "Sales", "Part Time", "Full Time"]

  // Toggle tag selection for filtering
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Handle accepting or declining job posts
  const handleAccept = async (boolean: Boolean, accepted_job: Number) => {
    try {
      const response = await fetch("http://localhost:3000/accept_post", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          id: accepted_job,
          accepted: boolean,
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update job status');
      }

      await fetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update job status');
    }
  };

  // Open dialog to view job questions
  const openDialog = (job: Job) => {
    setCurrentJob(job);
    setAnswers(Array(job.questions.length).fill(''));
    answers;
    setIsDialogOpen(true);
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Set page title
  useEffect(() => {
    document.title = 'Pending Job Posts | HHS';
  }, []);

  // Render component UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 flex flex-col">
      <Nav />
      <main className="container mx-auto px-6 py-24 flex-grow">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-800 dark:text-white text-center mb-4">
            Pending Job Posts
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 text-center text-lg">
            Review and manage incoming job postings
          </p>
        </div>

        {/* Error message display */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input 
              type="text"
              placeholder="Search postings..."
              className="w-full h-12 pl-12 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
          
          {/* Tag filter dropdown */}
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

                <CardFooter className="p-6 bg-zinc-50 dark:bg-zinc-900 flex gap-4">
                  <Button 
                    onClick={() => handleAccept(true, job.id)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" /> Accept
                  </Button>
                  <Button 
                    onClick={() => handleAccept(false, job.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="mr-2 h-4 w-4" /> Decline
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-transparent"
                    onClick={() => openDialog(job)}
                  >
                    <HelpCircle className="h-5 w-5 text-[#C7AC59]" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-zinc-500 dark:text-zinc-400">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-xl font-medium">No pending posts found</p>
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
      </main>
      <Footer string="blocky" />

      {/* Job questions dialog */}
      {currentJob && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Questions for {currentJob.title}</DialogTitle>
              <DialogDescription>
                {currentJob.questions.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {currentJob.questions.map((question, index) => (
                      <li key={index} className="mb-2">{question}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No questions available for this job.</p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}