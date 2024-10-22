'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Briefcase, MapPin, DollarSign, AlertCircle, TagIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import * as icons from 'lucide-react'
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"
import { Separator } from '@/components/ui/separator';

type Job = {
  title: string;
  company: string;
  location: string;
  description: string;
  payrate: number;
  tags: string[]; // Ensure tags is always an array
  icon: keyof typeof icons;
  requirements: string;
  questions: string[];
};

export default function JobPostings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  useEffect(() => {
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
            throw new Error('Failed to fetch jobs');
          }
          const data = await response.json();
          // Ensure that each job has a tags array
          const formattedJobs: Job[] = data.map((job: any) => ({
            ...job,
            tags: Array.isArray(job.tags) ? job.tags : [], // Default to empty array if not an array
          }));
          setJobListings(formattedJobs);
          if (formattedJobs.length > 0) {
            setCurrentJob(formattedJobs[0]);
          }
        } catch (error) {
          console.error('Error fetching jobs:', error);
        }
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobListings.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.payrate.toString().includes(searchTerm)) &&
    (selectedTags.length === 0 || selectedTags.some(tag => job.tags.includes(tag)))
  );

  const tags = Array.from(new Set(jobListings.flatMap(job => job.tags)));

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const resetTags = () => {
    setSelectedTags([]);
  };

  const handleSubmit = () => {
    console.log("Answers:", answers);
    setIsDialogOpen(false);
  };

  const openDialog = (job: Job) => {
    setCurrentJob(job);
    setAnswers(Array(job.questions.length).fill(''));
    setIsDialogOpen(true);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const Icon = ({ name, ...props }: { name: keyof typeof icons } & React.ComponentProps<'svg'>) => {
    const IconComponent = icons[name];
    return IconComponent ? <IconComponent {...props} /> : null;
  };

  return (
    <div className="min-h-screen bg-[url('@/assets/bg-white-4.png')] dark:bg-[url('@/assets/bg.png')] bg-no-repeat bg-cover text-zinc-950 dark:text-white">
      <Nav/>
      <main className="container mx-auto px-4 py-8">
        <div className="relative mb-12 text-center mt-24 max-w-lg mx-auto">
          <div className="bg-[#C7AC59] p-3 rounded-xl">
            <h1 className="text-5xl font-bold text-white">Available Jobs</h1>
          </div>
          <Separator className="w-3/4 mx-auto bg-[#A08339] h-0.5" />
          <p className="text-xl text-zinc-700 dark:text-zinc-300"><strong>Find your next career opportunity</strong></p>
        </div>
        
        <div className="mb-8 flex items-center space-x-4">
          <div className="relative flex-grow">
            <Input 
              type="text" 
              placeholder="Search for jobs..." 
              className="pl-10 pr-4 py-2 w-full rounded-lg border-1.5 border-[#C7AC59] bg-[#F5F5F5] dark:bg-zinc-800 text-black dark:text-white focus:ring-2 focus:ring-[#C7AC59] transition-all duration-300"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400" size={20} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-lg p-2 w-10 h-10 flex items-center justify-center border-1.5 border-[#C7AC59] bg-[#F5F5F5] dark:bg-zinc-800 text-zinc-950 dark:text-white hover:bg-[#C7AC59] hover:text-white transition-all duration-300">
                <TagIcon className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetTags} className="text-red-500 dark:text-red-400">Reset Tags</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map((job, index) => (
            <Card key={index} className="border-1.5 border-[#C7AC59] bg-[#F5F5F5] text-black dark:text-white dark:bg-zinc-800 flex flex-col drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-[#341A00] dark:text-white flex items-center space-x-2">
                  <Icon name={job.icon} className="w-6 h-6 text-[#C7AC59]" />
                  <span>{job.title}</span>
                </CardTitle>
                <p className="text-[#5A3000] dark:text-zinc-300 flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>{job.company} - {job.location}</span>
                </p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-[#341A00] dark:text-zinc-300 mb-4">{job.description}</p>
                <div className="flex items-center space-x-2 text-[#341A00] dark:text-zinc-300">
                  <DollarSign size={16} className="text-[#C7AC59]" />
                  <span>Pay Rate: ${job.payrate}/hr</span>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold flex items-center space-x-2 text-[#341A00] dark:text-[#C7AC59]">
                    <AlertCircle size={16} className="text-red-500" />
                    <span>Requirements</span>
                  </h4>
                  <p className="text-sm mt-1 text-[#341A00] dark:text-zinc-300">{job.requirements}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-[#C7AC59] bg-opacity-20 text-[#341A00] dark:text-[#C7AC59] text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => openDialog(job)} className="w-full bg-[#C7AC59] hover:bg-[#B69B48] text-white transition-colors duration-300">
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {filteredJobs.length > jobsPerPage && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <Button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              variant="outline"
              className="border-[#C7AC59] text-[#C7AC59] hover:bg-[#C7AC59] hover:text-white w-12 h-12 flex items-center justify-center"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <span className="text-[#341A00] dark:text-white text-lg">{currentPage} of {Math.ceil(filteredJobs.length / jobsPerPage)}</span>
            <Button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}
              variant="outline"
              className="border-[#C7AC59] text-[#C7AC59] hover:bg-[#C7AC59] hover:text-white w-12 h-12 flex items-center justify-center"
            >
              <ChevronRight className="h-10 w-10" />
            </Button>
          </div>
        )}
      </main>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#F5F5F5] dark:bg-zinc-800 border-[#C7AC59]">
          <DialogHeader>
            <DialogTitle className="text-[#341A00] dark:text-white">{currentJob?.title}</DialogTitle>
            <DialogDescription className="text-[#5A3000] dark:text-zinc-300">
              Please answer the following questions:
            </DialogDescription>
          </DialogHeader>
          {currentJob?.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4">
              <label className="block text-sm font-medium mb-1 text-[#341A00] dark:text-white">{question}</label>
              <Input 
                value={answers[qIndex] || ''} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const newAnswers = [...answers];
                  newAnswers[qIndex] = e.target.value;
                  setAnswers(newAnswers);
                }} 
                className="w-full bg-white dark:bg-zinc-700 text-[#341A00] dark:text-white border-[#C7AC59]"
              />
            </div>
          ))}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[#C7AC59] text-[#C7AC59] hover:bg-[#C7AC59] hover:text-white">Cancel</Button>
            <Button onClick={handleSubmit} className="bg-[#C7AC59] hover:bg-[#B69B48] text-white">Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer string={"blocky"}/>
    </div>
  )
}