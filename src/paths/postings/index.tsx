import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"
import React, { SetStateAction, useEffect, useState } from 'react'
import { CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import * as icons from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports'

type Job = {
    title: string;
    company: string;
    location: string;
    description: string;
    payrate: number;
    tags: string[];
    icon: keyof typeof dynamicIconImports;
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
  const [jobsPerPage, setJobsPerPage] = useState(6);

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
          setJobListings(data);
          if (data.length > 0) {
            setCurrentJob(data[0]);
          }
        } catch (error) {
          console.error('Error fetching jobs:', error);
        }
      }
    };

    fetchJobs();
  }, []);

  interface IconProps extends Omit<LucideProps, 'ref'> {
    name: keyof typeof dynamicIconImports;
  }

  const Icon = ({ name, ...props }: IconProps) => {
    const IconComponent = icons[name as keyof typeof icons];
    return IconComponent ? <IconComponent {...props} /> : null;
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-[url('@/assets/bg-white-4.png')] text-zinc-950 dark:bg-[url('@/assets/bg.png')] dark:text-white bg-no-repeat bg-cover">
      <Nav />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 mt-24">
          <h1 className="text-5xl font-bold mb-6 text-center text-zinc-950 dark:text-white">Jobs Portal</h1>
          <div className="mb-6 flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 rounded-lg p-2 w-10 h-10 flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-105">
                  <icons.TagIcon className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tags.map(tag => (
                  <DropdownMenuCheckboxItem 
                    key={tag} 
                    checked={selectedTags.includes(tag)} 
                    onClick={() => toggleTag(tag)}
                  >
                    <icons.TagIcon className="mr-2" />
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetTags} className="bg-red-500 text-white">Reset Tags</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="mx-1" />
            <Input 
              type="text" 
              placeholder="Search for jobs..." 
              className="flex-grow bg-[#f5f5f5] dark:bg-zinc-800 focus:drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] transition-drop-shadow duration-300"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.length > 0 ? (
              currentJobs.map((job, index) => (
                <Card key={index} className="border-1.5 border-[#C7AC59] bg-[#F5F5F5] text-black dark:text-white dark:bg-zinc-800 flex flex-col drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
                  <CardHeader>
                    <CardTitle className="text-[#341A00] dark:text-white flex items-center">
                      {job.icon ? <Icon name={job.icon} className="mr-2" /> : <icons.Briefcase className="mr-2"/>}
                      {job.title}
                    </CardTitle>
                    <p className="text-[#5A3000] dark:text-white flex items-center">
                      <icons.MapPin className="mr-2" />
                      {job.company} - {job.location}
                    </p>
                    <CardDescription className="flex items-center">
                      <icons.DollarSign className="mr-2" />
                      Pay Rate: ${job.payrate}/hr
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-[#341A00] dark:text-white">{job.description}</p>
                    <div className="mt-4 flex items-center">
                      <icons.AlertCircle className="mr-2 text-red-500 text-2xl" />
                      <p className="text-[#341A00] dark:text-[#C7Ac59] font-semibold text-2xl">Requirements</p>
                    </div>
                    <ul className="list-disc list-inside mt-2 text-[#341A00] dark:text-white">
                      {job.requirements}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-center mb-4">
                    <Button variant="secondary" onClick={() => openDialog(job)} className="bg-zinc-300 dark:bg-zinc-900 text-black dark:text-white">Apply</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-400">No job postings found.</p>
            )}
          </div>
          <div className="mt-4 flex justify-center">
            {Array(Math.ceil(filteredJobs.length / jobsPerPage)).fill(0).map((_, i) => (
              <Button key={i} onClick={() => paginate(i + 1)} className={`mx-1 ${currentPage === i + 1 ? 'bg-zinc-300 dark:bg-zinc-900 text-black dark:text-white' : 'bg-zinc-400 dark:bg-zinc-700 text-black dark:text-white'}`}>{i + 1}</Button>
            ))}
          </div>
        </div>
      </main>
      <Footer string={"blocky"}  />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">{currentJob?.title}</DialogTitle>
            <DialogDescription className="text-gray-700 dark:text-gray-300">
              Please answer the following questions:
            </DialogDescription>
          </DialogHeader>
          {currentJob?.questions.map((question, qIndex) => (
            <Input 
              key={qIndex}
              placeholder={question} 
              value={answers[qIndex] || ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newAnswers = [...answers];
                newAnswers[qIndex] = e.target.value;
                setAnswers(newAnswers);
              }} 
              className="mb-4 bg-gray-100 dark:bg-zinc-700 text-black dark:text-white"
            />
          ))}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)} className="bg-zinc-300 dark:bg-zinc-600 text-black dark:text-white">Close</Button>
            <Button className="bg-zinc-400 dark:bg-zinc-700 text-black dark:text-white" variant="secondary" onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
