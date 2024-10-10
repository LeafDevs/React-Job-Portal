import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Nav from "@/components/ui/nav"
import Footer from "@/components/ui/footer"
import { ForwardRefExoticComponent, RefAttributes, SetStateAction, useState } from 'react'
import { CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Briefcase, MapPin, DollarSign, TagIcon, ShoppingBasket, ForkKnife, Coffee, Home, Truck, LucideProps, AlertCircle } from 'lucide-react' // Importing icons from lucide-react
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu" // Importing dropdown components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog" // Importing dialog components

const jobListings = [
  {
    title: "Retail Cashier",
    company: "Martwell",
    location: "Natrona Heights, PA",
    description: "As a Retail Cashier at Martwell, you will provide excellent customer service while processing transactions and assisting customers with their purchases.",
    payrate: 14,
    tags: ["Retail", "Customer Service"],
    icon: ShoppingBasket, // Default icon
    requirements: "HS diploma, math skills, customer service exp.",
    questions: [
      "What experience do you have in customer service?",
      "How would you handle a difficult customer?",
      "What do you think is the most important quality for a cashier?"
    ]
  },
  {
    title: "Crew Member",
    company: "WcDonald's",
    location: "Natrona Heights, PA",
    description: "Join our vibrant team at McDonald's, where your positive attitude and enthusiasm will help create a welcoming environment for our customers. Be part of a fast-paced team that values service and smiles!",
    payrate: 13,
    tags: ["Food Service", "Teamwork"],
    icon: ForkKnife, // Default icon
    requirements: "16+, fast-paced work, good communication",
    questions: [
      "How do you prioritize tasks during busy hours?",
      "Can you describe a time when you worked as part of a team?"
    ]
  },
  {
    title: "Cafe Worker",
    company: "Harvest Glow Coffee & Treats",
    location: "Tarentum, PA",
    description: "Join our friendly team at Harvest Moon Coffee & Chocolates, where you'll serve delicious coffee and pastries while providing excellent customer service.",
    payrate: 15,
    tags: ["Food Service", "Customer Service"],
    icon: Coffee, // Default icon
    requirements: "Food service exp, coffee knowledge, early shifts",
    questions: [
      "What is your favorite coffee drink and why?",
      "How would you handle a customer complaint?",
      "What experience do you have with food preparation?"
    ]
  },
  {
    title: "Delivery Driver",
    company: "Pizza Shed",
    location: "Natrona Heights, PA",
    description: "As a Delivery Driver at Pizza Hut, you will be responsible for delivering pizzas and ensuring customer satisfaction.",
    payrate: 14,
    tags: ["Delivery", "Customer Service"],
    icon: Truck, // Icon for delivery
    requirements: "Valid driver's license, clean driving record",
    questions: [
      "How do you ensure timely deliveries?",
      "What would you do if you encountered a problem on your route?"
    ]
  },
  {
    title: "Sales Associate",
    company: "AimMart",
    location: "Natrona Heights, PA",
    description: "Join our team at Target as a Sales Associate, where you will assist customers and maintain store presentation.",
    payrate: 14,
    tags: ["Retail", "Sales"],
    icon: Briefcase, // Icon for sales
    requirements: "Retail exp, customer service skills, flexible",
    questions: [
      "How do you approach upselling products?",
      "What strategies do you use to maintain a clean and organized store?",
      "Can you give an example of a time you provided excellent customer service?"
    ]
  },
  {
    title: "Warehouse Worker",
    company: "Cascade",
    location: "Pittsburgh, PA",
    description: "As a Warehouse Worker at Amazon, you will be responsible for picking, packing, and shipping orders.",
    payrate: 15,
    tags: ["Warehouse", "Logistics"],
    icon: Home, // Icon for warehouse
    requirements: "Physical stamina, attention to detail",
    questions: [
      "What experience do you have in a warehouse environment?",
      "How do you ensure accuracy in your work?"
    ]
  },
];

// Define the Job type if not already defined
type Job = {
    title: string;
    company: string;
    location: string;
    description: string;
    payrate: number;
    tags: string[];
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    requirements: string;
    questions: string[];
};

export default function JobPostings() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Changed to an array for multiple tags
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for dialog visibility
  const [answers, setAnswers] = useState<string[]>([]); // State for answers to questions
  const [currentJob, setCurrentJob] = useState(jobListings[0]); // Set default currentJob to the first job in jobListings

  const filteredJobs = jobListings.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.payrate.toString().includes(searchTerm)) &&
    (selectedTags.length === 0 || selectedTags.some(tag => job.tags.includes(tag))) // Updated to check for multiple tags
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
    // Handle the submit logic here
    console.log("Answers:", answers);
    setIsDialogOpen(false); // Close the dialog after submission
  };

  const openDialog = (job: SetStateAction<{
      title: string; company: string; location: string; description: string; payrate: number; tags: string[]; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> // Default icon
      questions: string[]
    }>) => {
    setCurrentJob(job as Job);
    setAnswers(Array((job as Job).questions.length).fill('')); // Initialize answers array
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[url('@/assets/bg-white-4.png')] text-zinc-950 dark:bg-[url('@/assets/bg.png')] dark:text-white bg-no-repeat bg-cover">
      <Nav />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 mt-24">
          <h1 className="text-5xl font-bold mb-6 text-center">Jobs Portal</h1>
          <div className="mb-6 flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 rounded-lg p-2 w-10 h-10 flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-105">
                  <TagIcon className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tags.map(tag => (
                  <DropdownMenuCheckboxItem 
                    key={tag} 
                    checked={selectedTags.includes(tag)} 
                    onClick={() => toggleTag(tag)} // Updated to toggle multiple tags
                  >
                    <TagIcon className="mr-2" /> {/* Icon for each tag */}
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetTags} className="bg-red-500 text-white">Reset Tags</DropdownMenuItem> {/* Reset Tags Button inside dropdown */}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="mx-1" /> {/* Added margin between button and input */}
            <Input 
              type="text" 
              placeholder="Search for jobs..." 
              className="flex-grow bg-[#f5f5f5] dark:bg-zinc-800 focus:drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] transition-drop-shadow duration-300"
              value={searchTerm}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <Card key={index} className="border-1.5 border-[#C7AC59] bg-[#F5F5F5] text-black dark:text-white dark:bg-zinc-800 flex flex-col drop-shadow-[0_1px_5px_rgba(0,0,0,0.5)]">
                  <CardHeader>
                    <CardTitle className="text-[#341A00] dark:text-white flex items-center">
                      {job.icon ? <job.icon className="mr-2" /> : <Briefcase className="mr-2" />} {/* Job icon with default */}
                      {job.title}
                    </CardTitle>
                    <p className="text-[#5A3000] dark:text-white flex items-center">
                      <MapPin className="mr-2" /> {/* Location icon */}
                      {job.company} - {job.location}
                    </p>
                    <CardDescription className="flex items-center">
                      <DollarSign className="mr-2" /> {/* Pay rate icon */}
                      Pay Rate: ${job.payrate}/hr
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-[#341A00] dark:text-white">{job.description}</p>
                    <div className="mt-4 flex items-center">
                      <AlertCircle className="mr-2 text-red-500 text-2xl" /> {/* Exclamation point icon */}
                      <p className="text-[#341A00] font-semibold text-2xl">Requirements</p>
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
          {currentJob?.questions.map((question: string, qIndex: string | number) => ( // Changed String to string
            <Input 
              key={qIndex}
              placeholder={question} 
              value={answers[Number(qIndex)] || ''} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newAnswers = [...answers];
                newAnswers[Number(qIndex)] = e.target.value;
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
